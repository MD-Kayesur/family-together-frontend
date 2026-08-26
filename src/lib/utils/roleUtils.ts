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
 * - OWNER, MEMBER, VIEWER, USER, NULL -> /owner-dashboard (Family Sanctuary Dashboard)
 */
export function getDashboardRouteByRole(role?: string | null): string {
  if (!role) return "/owner-dashboard";

  const normalizedRole = role.toUpperCase().trim();
  switch (normalizedRole) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin-dashboard";
    case "OWNER":
    case "MEMBER":
    case "VIEWER":
    case "USER":
    case "NULL":
    default:
      return "/owner-dashboard";
  }
}

/**
 * Returns a human-friendly display label for the dashboard button based on the user's role.
 */
export function getDashboardLabelByRole(role?: string | null): string {
  if (!role) return "Owner Dashboard";

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
      return "Owner Dashboard";
  }
}
