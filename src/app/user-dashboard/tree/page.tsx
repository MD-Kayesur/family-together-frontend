"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import TreeTab from "@/components/dashboard/tabs/TreeTab";

export default function UserTreePage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    router.replace("/user-dashboard?tab=tree");
  }, [router]);

  return (
    <SanctuaryDashboardWrapper>
      <TreeTab role="MEMBER" currentUserId={user?.id} />
    </SanctuaryDashboardWrapper>
  );
}
