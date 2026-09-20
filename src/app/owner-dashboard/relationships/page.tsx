"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import RelationshipsTab from "@/components/dashboard/tabs/RelationshipsTab";

export default function RelationshipsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=relationships");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <RelationshipsTab />
    </SanctuaryDashboardWrapper>
  );
}
