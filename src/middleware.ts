import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// List of public paths that don't require authentication
const publicPaths = ["/", "/about", "/contact", "/signin", "/signup"];

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has("session");

  // If user is logged in and tries to access auth pages
  if (hasSessionCookie && (pathname === "/signin" || pathname === "/signup")) {
    try {
      // Verify session
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/session`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      const data = await response.json();

      if (data.authenticated) {
        // If authenticated, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error verifying session:", error);
      // If there's an error, clear the session and redirect to signin
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // If user is not logged in and tries to access protected routes
  if (
    !hasSessionCookie &&
    !publicPaths.includes(pathname) &&
    !pathname.startsWith("/_next")
  ) {
    // Store the original URL to redirect back after login
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.set("redirectAfterLogin", pathname);
    return response;
  }

  // Only apply to API routes
  if (pathname.startsWith("/api")) {
    // Get the IP address
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
