export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "OWNER"
  | "MEMBER"
  | "VIEWER"
  | "USER"
  | "NULL"
  | (string & {});

/**
 * Returns the target dashboard URL route for a given user role.
 * - SUPER_ADMIN & ADMIN -> /admin-dashboard (System Control Center)
 * - OWNER -> /owner-dashboard (Owner Family Sanctuary & Administrative Dashboard)
 * - USER, MEMBER -> /user-dashboard (Family Member Sanctuary Dashboard)
 * - VIEWER -> / (Landing Page & Public Website Read-Only Access)
 */
export function getDashboardRouteByRole(role?: string | null): string {
  if (!role) return "/";

  const normalizedRole = role.toUpperCase().trim();
  switch (normalizedRole) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin-dashboard";
    case "OWNER":
      return "/owner-dashboard";
    case "USER":
    case "MEMBER":
      return "/user-dashboard";
    case "VIEWER":
    case "NULL":
    default:
      return "/";
  }
}

/**
 * Returns a human-friendly display label for the dashboard button based on the user's role.
 */
export function getDashboardLabelByRole(role?: string | null): string {
  if (!role) return "Visit Website";

  const normalizedRole = role.toUpperCase().trim();
  switch (normalizedRole) {
    case "SUPER_ADMIN":
      return "Super Admin Dashboard";
    case "ADMIN":
      return "Admin Dashboard";
    case "OWNER":
      return "Owner Dashboard";
    case "MEMBER":
      return "Member Dashboard";
    case "USER":
      return "User Dashboard";
    case "VIEWER":
    default:
      return "Visit Website";
  }
}

/**
 * Checks whether a given user role has permission to access a specific route pathname.
 * - /admin-dashboard/* requires ADMIN or SUPER_ADMIN
 * - /owner-dashboard/* requires OWNER, ADMIN, or SUPER_ADMIN (denies USER / MEMBER / VIEWER)
 * - /user-dashboard/* requires USER, MEMBER, OWNER, ADMIN, or SUPER_ADMIN (denies VIEWER)
 * - VIEWER role is strictly restricted to landing page (/) & public website routes
 */
export function canAccessRoute(pathname: string, role?: string | null): boolean {
  if (!role) return false;
  const normalizedRole = role.toUpperCase().trim();

  if (normalizedRole === "VIEWER") {
    if (
      pathname.startsWith("/admin-dashboard") ||
      pathname.startsWith("/owner-dashboard") ||
      pathname.startsWith("/user-dashboard")
    ) {
      return false;
    }
    return true;
  }

  if (pathname.startsWith("/admin-dashboard")) {
    return normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN";
  }

  if (pathname.startsWith("/owner-dashboard")) {
    return (
      normalizedRole === "OWNER" ||
      normalizedRole === "ADMIN" ||
      normalizedRole === "SUPER_ADMIN"
    );
  }

  if (pathname.startsWith("/user-dashboard")) {
    return (
      normalizedRole === "USER" ||
      normalizedRole === "MEMBER" ||
      normalizedRole === "OWNER" ||
      normalizedRole === "ADMIN" ||
      normalizedRole === "SUPER_ADMIN"
    );
  }

  return true;
}

