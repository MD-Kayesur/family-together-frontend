"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";

export default function UserDocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-dashboard?tab=documents");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <DocumentsTab />
    </SanctuaryDashboardWrapper>
  );
}
