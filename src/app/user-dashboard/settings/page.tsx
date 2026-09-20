"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";

export default function UserSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-dashboard?tab=settings");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <SettingsTab />
    </SanctuaryDashboardWrapper>
  );
}
