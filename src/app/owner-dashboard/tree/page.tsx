"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import TreeTab from "@/components/dashboard/tabs/TreeTab";

export default function TreePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=tree");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <TreeTab />
    </SanctuaryDashboardWrapper>
  );
}
