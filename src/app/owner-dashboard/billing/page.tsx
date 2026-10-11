"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import BillingTab from "@/components/dashboard/tabs/BillingTab";

export default function BillingPage() {
  return (
    <SanctuaryDashboardWrapper>
      <BillingTab />
    </SanctuaryDashboardWrapper>
  );
}
