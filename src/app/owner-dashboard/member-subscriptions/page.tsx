"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import MemberSubscriptionsTab from "@/components/dashboard/tabs/MemberSubscriptionsTab";

export default function MemberSubscriptionsPage() {
  return (
    <SanctuaryDashboardWrapper>
      <MemberSubscriptionsTab />
    </SanctuaryDashboardWrapper>
  );
}
