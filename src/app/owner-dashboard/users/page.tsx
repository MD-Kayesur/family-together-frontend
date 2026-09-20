"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import UsersTab from "@/components/dashboard/tabs/UsersTab";

export default function OwnerUsersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=users");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <UsersTab />
    </SanctuaryDashboardWrapper>
  );
}
