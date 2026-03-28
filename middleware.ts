import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Permite que a página embed e API og sejam exibidas em iframes (como no Canva)
  if (request.nextUrl.pathname.startsWith("/embed") || request.nextUrl.pathname.startsWith("/api/og")) {
    response.headers.set("Content-Security-Policy", "frame-ancestors *")
    response.headers.set("X-Frame-Options", "ALLOWALL")
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  }

  return response
}

export const config = {
  matcher: ["/embed/:path*", "/api/og/:path*"],
}
