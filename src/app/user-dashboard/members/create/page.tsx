"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectToTabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", "members");
    params.set("action", "create");
    router.replace(`/user-dashboard?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="p-12 text-center text-slate-400 text-sm">
      Loading relative create form...
    </div>
  );
}

export default function UserCreateMemberPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <RedirectToTabContent />
    </Suspense>
  );
}
