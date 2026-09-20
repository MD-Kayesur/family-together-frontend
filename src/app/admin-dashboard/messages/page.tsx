"use client";

import React from "react";
import MessagesTab from "@/components/dashboard/tabs/MessagesTab";

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sanctuary Messages & Communications
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Monitor and engage in sanctuary-wide communications, channels, and direct messages.
        </p>
      </div>

      <MessagesTab role="ADMIN" />
    </div>
  );
}
