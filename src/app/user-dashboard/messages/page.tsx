"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import MessagesTab from "@/components/dashboard/tabs/MessagesTab";

export default function UserMessagesPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    router.replace("/user-dashboard?tab=messages");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper
      title="Family Messages"
      subtitle="Connect and chat in real-time with your sanctuary members and relatives"
    >
      <MessagesTab role="MEMBER" currentUserId={user?.id} />
    </SanctuaryDashboardWrapper>
  );
}
