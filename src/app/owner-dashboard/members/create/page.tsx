"use client";

import React, { Suspense } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import CreateMemberForm from "@/components/dashboard/members/CreateMemberForm";

export default function OwnerCreateMemberPage() {
  return (
    <SanctuaryDashboardWrapper>
      <Suspense
        fallback={
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading member form...
          </div>
        }
      >
        <CreateMemberForm role="OWNER" />
      </Suspense>
    </SanctuaryDashboardWrapper>
  );
}
