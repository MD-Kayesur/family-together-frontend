import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Proxy (Convention for Next.js 16+)
 * Intercepts incoming requests before routes are rendered.
 * Automatically redirects authenticated users away from /signin, /signup, /login directly to their role-specific dashboard.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasToken = Boolean(request.cookies.get("access_token")?.value);
  const isAuth = hasToken || request.cookies.get("is_authenticated")?.value === "true";
  const userRole = request.cookies.get("user_role")?.value;

  // Resolve target dashboard route based on user role
  const getDashboardDestination = (role?: string): string => {
    const normalized = (role || "").toUpperCase().trim();
    switch (normalized) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "/admin-dashboard";
      case "OWNER":
        return "/owner-dashboard";
      case "USER":
      case "MEMBER":
        return "/user-dashboard";
      default:
        return "/user-dashboard";
    }
  };

  // If user is authenticated and attempts to access auth routes, redirect directly to dashboard
  if (isAuth && (pathname === "/signin" || pathname === "/signup" || pathname === "/login")) {
    const destination = getDashboardDestination(userRole);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/login"],
};
