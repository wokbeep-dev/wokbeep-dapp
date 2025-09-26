/**
 * Get the client IP address from request headers.
 * Falls back to "Unknown" if none is found.
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClientIP(req: Request): string {
  const headers = req.headers

  // Standard proxies & CDN headers
  const cfConnectingIP = headers.get("cf-connecting-ip") // Cloudflare
  const realIP = headers.get("x-real-ip") // Nginx / custom
  const forwardedFor = headers.get("x-forwarded-for") // Proxies

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwardedFor) return forwardedFor.split(",")[0].trim()

  return "Unknown"
}

/**
 * Detects if a request comes from a known bot or crawler.
 */
export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false

  const botPatterns: RegExp[] = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /rogerbot/i,
    /linkedinbot/i,
    /embedly/i,
    /quora link preview/i,
    /showyoubot/i,
    /outbrain/i,
    /pinterest/i,
    /developers\.google\.com/i,
  ]

  return botPatterns.some((pattern) => pattern.test(userAgent))
}

/**
 * Determines if auth checks should be bypassed for bots or public paths.
 */
export function shouldBypassAuth(pathname: string, userAgent: string | null): boolean {
  // Allow SEO bots access to key public routes
  if (isBot(userAgent)) {
    const botAllowedPaths: string[] = [
      "/", 
      "/login", 
      "/signup", 
      "/terms", 
      "/privacy"
    ]
    return botAllowedPaths.some(
      (path) => pathname === path || pathname.startsWith(path)
    )
  }

  return false
}
