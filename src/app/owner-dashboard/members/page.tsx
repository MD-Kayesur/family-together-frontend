"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import MembersTab from "@/components/dashboard/tabs/MembersTab";

export default function MembersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=members");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <MembersTab />
    </SanctuaryDashboardWrapper>
  );
}
