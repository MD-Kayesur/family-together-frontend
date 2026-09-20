"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import MembersTab from "@/components/dashboard/tabs/MembersTab";

export default function UserMembersPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    router.replace("/user-dashboard?tab=members");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <MembersTab role="MEMBER" currentUserId={user?.id} />
    </SanctuaryDashboardWrapper>
  );
}
