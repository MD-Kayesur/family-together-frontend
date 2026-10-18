import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDashboardRouteByRole } from "@/lib/utils/roleUtils";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("is_authenticated")?.value === "true";
  const role = cookieStore.get("user_role")?.value;

  if (isAuth) {
    redirect(getDashboardRouteByRole(role));
  }

  redirect("/signin");
}
