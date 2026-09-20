"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";

export default function DocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=documents");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <DocumentsTab />
    </SanctuaryDashboardWrapper>
  );
}
