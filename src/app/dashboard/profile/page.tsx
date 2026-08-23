"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useAppSelector } from "@/redux/store";
import { UserCheck, Mail, Shield, Calendar, Edit2 } from "lucide-react";

export default function UserProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <SanctuaryDashboardWrapper
      title="User Account Profile"
      subtitle="View your active user profile credentials, role permissions, and session security."
    >
      <div className="space-y-6 max-w-3xl">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-6">
          <div className="h-20 w-20 rounded-3xl bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
            {user?.fullName?.charAt(0) || "U"}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {user?.fullName}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                {user?.role || "OWNER"}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600 font-bold">Authenticated with JWT Cookies</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Role & Permissions Overview</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            As an <strong className="text-indigo-600">{user?.role || "OWNER"}</strong>, you have full write and administrative control over the sanctuary family tree, member management, invitation approvals, and legacy documents.
          </p>
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
