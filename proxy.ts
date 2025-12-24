import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next()

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Window", "60s")

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
