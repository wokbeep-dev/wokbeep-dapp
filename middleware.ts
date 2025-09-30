import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiting (use Redis/Upstash in production!)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const realIP = req.headers.get("x-real-ip")
  const cfConnectingIP = req.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return "Unknown"
}

function checkRateLimit(ip: string, limit = 100, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const key = `rate_limit:${ip}`

  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= limit) {
    return false
  }

  current.count++
  return true
}

export async function middleware(req: NextRequest) {
  const ip = getClientIP(req)
  const res = NextResponse.next()

  // Security headers
  res.headers.set("x-real-ip", ip)
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900",
        "x-real-ip": ip,
      },
    })
  }

  // Skip auth checks for static files and some routes
  const excludedPaths = ["/_next", "/favicon.ico", "/images", "/icons"]
  const isExcludedPath = excludedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  )

  if (isExcludedPath) {
    return res
  }

  // Create Supabase client & get session
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public routes (accessible without login)
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/verify-email",
    "/verify-success",
    "/forgot-password",
    "/terms",
    "/privacy",
    "/support",
  ]

  const isPublicRoute = publicRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route),
  )

  // Protect private routes
  if (!session && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Force email verification before accessing app
  if (
    session &&
    !session.user.email_confirmed_at &&
    !req.nextUrl.pathname.startsWith("/verify-email")
  ) {
    return NextResponse.redirect(new URL("/verify-email", req.url))
  }

  // Redirect verified users away from verify page
  if (
    session &&
    session.user.email_confirmed_at &&
    req.nextUrl.pathname.startsWith("/verify-email")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect authenticated users away from auth pages
  if (
    session &&
    session.user.email_confirmed_at &&
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
