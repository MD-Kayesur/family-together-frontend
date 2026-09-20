"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import InvitationsTab from "@/components/dashboard/tabs/InvitationsTab";

export default function InvitationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner-dashboard?tab=invitations");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <InvitationsTab />
    </SanctuaryDashboardWrapper>
  );
}
