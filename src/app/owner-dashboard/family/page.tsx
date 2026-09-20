"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import FamilyTab from "@/components/dashboard/tabs/FamilyTab";

export default function FamilyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=family");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <FamilyTab />
    </SanctuaryDashboardWrapper>
  );
}
