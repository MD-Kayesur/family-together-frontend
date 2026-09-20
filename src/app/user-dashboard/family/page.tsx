"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import FamilyTab from "@/components/dashboard/tabs/FamilyTab";

export default function UserFamilyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-dashboard?tab=family");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <FamilyTab />
    </SanctuaryDashboardWrapper>
  );
}
