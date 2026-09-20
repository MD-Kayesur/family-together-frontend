"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=settings");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <SettingsTab />
    </SanctuaryDashboardWrapper>
  );
}
