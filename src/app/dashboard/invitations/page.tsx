"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { Mail, Plus, Check, X, Clock, UserPlus } from "lucide-react";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([
    { id: "1", name: "Zain Rahman", email: "zain@gmail.com", role: "MEMBER", status: "PENDING", note: "Claims to be cousin from Canada" },
    { id: "2", name: "Samiha Rahman", email: "samiha@gmail.com", role: "VIEWER", status: "PENDING", note: "Requested view access to family photos" },
  ]);

  const handleAction = (id: string, action: "APPROVED" | "REJECTED") => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: action } : inv))
    );
  };

  return (
    <SanctuaryDashboardWrapper
      title="Sanctuary Join Invitations"
      subtitle="Review pending join requests or send invite links to new family members."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-xs text-slate-800">
              {invitations.filter((i) => i.status === "PENDING").length} Pending Access Requests
            </span>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Send New Invitation</span>
          </button>
        </div>

        <div className="space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-base flex items-center justify-center">
                  {inv.name.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">{inv.name}</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Requested: {inv.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{inv.email}</p>
                  <p className="text-xs text-slate-600 italic font-normal">{inv.note}</p>
                </div>
              </div>

              {inv.status === "PENDING" ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleAction(inv.id, "APPROVED")}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve Access</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(inv.id, "REJECTED")}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    inv.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {inv.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
