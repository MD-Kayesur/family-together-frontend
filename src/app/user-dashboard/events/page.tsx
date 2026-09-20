"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import EventsTab from "@/components/dashboard/tabs/EventsTab";

export default function UserEventsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-dashboard?tab=events");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <EventsTab />
    </SanctuaryDashboardWrapper>
  );
}
