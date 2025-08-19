// Utility functions for middleware
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const realIP = req.headers.get("x-real-ip")
  const cfConnectingIP = req.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return "Unknown"
}

export function isBot(userAgent: string): boolean {
  const botPatterns = [
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
    /developers.google.com/i,
  ]

  return botPatterns.some((pattern) => pattern.test(userAgent))
}

export function shouldBypassAuth(pathname: string, userAgent: string): boolean {
  // Allow bots to access certain pages for SEO
  if (isBot(userAgent)) {
    const botAllowedPaths = ["/", "/login", "/signup", "/terms", "/privacy"]
    return botAllowedPaths.some((path) => pathname === path || pathname.startsWith(path))
  }

  return false
}
