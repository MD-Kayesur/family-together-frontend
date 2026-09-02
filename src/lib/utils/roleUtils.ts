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
 * - USER, MEMBER, VIEWER -> /user-dashboard (Family Member Sanctuary Dashboard)
 */
export function getDashboardRouteByRole(role?: string | null): string {
  if (!role) return "/user-dashboard";

  const normalizedRole = role.toUpperCase().trim();
  switch (normalizedRole) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin-dashboard";
    case "OWNER":
      return "/owner-dashboard";
    case "USER":
    case "MEMBER":
    case "VIEWER":
    case "NULL":
    default:
      return "/user-dashboard";
  }
}

/**
 * Returns a human-friendly display label for the dashboard button based on the user's role.
 */
export function getDashboardLabelByRole(role?: string | null): string {
  if (!role) return "User Dashboard";

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
    case "VIEWER":
      return "Viewer Dashboard";
    case "USER":
    default:
      return "User Dashboard";
  }
}
