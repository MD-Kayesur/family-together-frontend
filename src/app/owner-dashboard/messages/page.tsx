"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import MessagesTab from "@/components/dashboard/tabs/MessagesTab";

export default function OwnerMessagesPage() {
  return (
    <SanctuaryDashboardWrapper
      title="Family Messages"
      subtitle="Sanctuary announcements, broadcast channels, and direct family communications"
    >
      <MessagesTab role="OWNER" />
    </SanctuaryDashboardWrapper>
  );
}
