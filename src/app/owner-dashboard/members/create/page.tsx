"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectToOwnerTabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", "members");
    params.set("action", "create");
    router.replace(`/owner-dashboard?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="p-12 text-center text-slate-400 text-sm">
      Loading member create form...
    </div>
  );
}

export default function OwnerCreateMemberPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <RedirectToOwnerTabContent />
    </Suspense>
  );
}
