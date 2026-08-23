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
 * - SUPER_ADMIN & ADMIN -> /admin (System Control Center)
 * - OWNER, MEMBER, VIEWER, USER, NULL -> /dashboard (Family Sanctuary Dashboard)
 */
export function getDashboardRouteByRole(role?: string | null): string {
  if (!role) return "/dashboard";

  const normalizedRole = role.toUpperCase().trim();
  switch (normalizedRole) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin";
    case "OWNER":
    case "MEMBER":
    case "VIEWER":
    case "USER":
    case "NULL":
    default:
      return "/dashboard";
  }
}

/**
 * Returns a human-friendly display label for the dashboard button based on the user's role.
 */
export function getDashboardLabelByRole(role?: string | null): string {
  if (!role) return "Dashboard";

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
      return "User Dashboard";
    case "NULL":
    default:
      return "Dashboard";
  }
}
