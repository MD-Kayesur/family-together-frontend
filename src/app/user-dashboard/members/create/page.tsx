"use client";

import React, { Suspense } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import CreateMemberForm from "@/components/dashboard/members/CreateMemberForm";

export default function UserCreateMemberPage() {
  return (
    <SanctuaryDashboardWrapper>
      <Suspense
        fallback={
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading relative form...
          </div>
        }
      >
        <CreateMemberForm role="MEMBER" />
      </Suspense>
    </SanctuaryDashboardWrapper>
  );
}
