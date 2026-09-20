"use client";

import React from "react";
import { useAppSelector } from "@/redux/store";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import MessagesTab from "@/components/dashboard/tabs/MessagesTab";

export default function UserMessagesPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <SanctuaryDashboardWrapper
      title="Family Messages"
      subtitle="Connect and chat in real-time with your sanctuary members and relatives"
    >
      <MessagesTab role="MEMBER" currentUserId={user?.id} />
    </SanctuaryDashboardWrapper>
  );
}
