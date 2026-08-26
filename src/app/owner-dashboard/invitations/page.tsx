"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import {
  useGetInvitationsQuery,
  useUpdateInvitationStatusMutation,
  useAddInvitationMutation,
} from "@/redux/api/familyApi";
import { Mail, Plus, Check, X, Clock, UserPlus, Loader2 } from "lucide-react";

export default function InvitationsPage() {
  const { data: invitations = [], isLoading } = useGetInvitationsQuery();
  const [updateInvitationStatus] = useUpdateInvitationStatusMutation();
  const [addInvitation] = useAddInvitationMutation();

  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [note, setNote] = useState("");

  const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      await updateInvitationStatus({ id, status: action }).unwrap();
    } catch (err) {
      alert("Failed to update invitation status");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await addInvitation({ name, email, role, note }).unwrap();
      setName("");
      setEmail("");
      setNote("");
      setIsSending(false);
    } catch (err) {
      alert("Failed to send invitation");
    }
  };

  return (
    <SanctuaryDashboardWrapper
      title="Sanctuary Join Invitations"
      subtitle="Review pending join requests or send invite links to new family members in PostgreSQL."
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
            onClick={() => setIsSending(!isSending)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isSending ? "Close Form" : "Send New Invitation"}</span>
          </button>
        </div>

        {isSending && (
          <form
            onSubmit={handleSend}
            className="p-6 rounded-2xl bg-white border border-indigo-200 shadow-md space-y-4 max-w-lg"
          >
            <h3 className="font-bold text-sm text-slate-900">Send Family Join Invitation</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zain Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. zain@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="MEMBER">Member (Standard Access)</option>
                  <option value="VIEWER">Viewer (Read-only)</option>
                  <option value="ADMIN">Admin (Co-administrator)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Note / Verification Details</label>
                <input
                  type="text"
                  placeholder="e.g. Cousin from Canada"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Send Invite
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm bg-white rounded-2xl border border-slate-200/80">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading invitations from database...</span>
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <Mail className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No invitations</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Send an email invitation to invite a family member to your sanctuary.
            </p>
          </div>
        ) : (
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
                    {inv.note && <p className="text-xs text-slate-600 italic font-normal">{inv.note}</p>}
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
        )}
      </div>
    </SanctuaryDashboardWrapper>
  );
}

