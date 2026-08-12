import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE_NAME = "athar_token";

// Helper to decode JWT payload safely in edge middleware without full crypto verification
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const payload = token ? decodeJwtPayload(token) : null;
  const isAuthenticated = Boolean(payload && payload.userId);
  const isAdmin = payload?.role === "ADMIN";

  // Protect Admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated || !isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Student/Member routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/session") ||
    pathname.startsWith("/leaderboard")
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect away from login if already authenticated
  if (pathname.startsWith("/login")) {
    if (isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/session/:path*", "/leaderboard/:path*", "/login"],
};
