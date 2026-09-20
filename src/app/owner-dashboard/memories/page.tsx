"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import MemoriesTab from "@/components/dashboard/tabs/MemoriesTab";

export default function MemoriesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=memories");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <MemoriesTab />
    </SanctuaryDashboardWrapper>
  );
}
