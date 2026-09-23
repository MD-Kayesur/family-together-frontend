"use client";

import React, { useState } from "react";
import {
  useGetInvitationsQuery,
  useUpdateInvitationStatusMutation,
  useAddInvitationMutation,
} from "@/redux/api/familyApi";
import { Mail, Plus, Check, X, Clock, UserPlus, Loader2, Search } from "lucide-react";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

export default function InvitationsTab() {
  const {
    searchTerm,
    debouncedSearch,
    page,
    limit,
    setLimit,
    setSearchTerm,
    setPage,
    clearSearch,
  } = usePaginationSearch({ defaultLimit: 8, searchParamKey: "search" });

  const { data: invitations = [], isLoading, refetch } = useGetInvitationsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [updateInvitationStatus] = useUpdateInvitationStatusMutation();
  const [addInvitation] = useAddInvitationMutation();

  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [note, setNote] = useState("");

  const paginationMeta = (invitations as any)?.meta;

  const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      await updateInvitationStatus({ id, status: action }).unwrap();
      refetch();
    } catch (err) {
      alert("Failed to update invitation status");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await addInvitation({ name, email, role, note }).unwrap();
      refetch();
      setName("");
      setEmail("");
      setNote("");
      setIsSending(false);
    } catch (err) {
      alert("Failed to send invitation");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-400" />
            <span className="font-bold text-xs text-white">
              {invitations.filter((i) => i.status === "PENDING").length} Pending Access Requests
            </span>
          </div>

          {/* Search Input with Live Route Sync */}
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invitees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSending(!isSending)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>{isSending ? "Close Form" : "Send New Invitation"}</span>
        </button>
      </div>

      {isSending && (
        <form
          onSubmit={handleSend}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 max-w-lg"
        >
          <h3 className="font-bold text-sm text-white">Send Family Join Invitation</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Zain Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="e.g. zain@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Role Assignment</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              >
                <option value="MEMBER" className="bg-slate-950 text-white">Member (Standard Access)</option>
                <option value="VIEWER" className="bg-slate-950 text-white">Viewer (Read-only)</option>
                <option value="ADMIN" className="bg-slate-950 text-white">Admin (Co-administrator)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Note / Verification Details</label>
              <input
                type="text"
                placeholder="e.g. Cousin from Canada"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-all"
          >
            Send Invite
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          <span>Loading invitations from database...</span>
        </div>
      ) : invitations.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <Mail className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="font-bold text-base text-white">No invitations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm ? `No invitations match "${searchTerm}".` : "Send an email invitation to invite a family member to your sanctuary."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-extrabold text-base flex items-center justify-center">
                  {inv.name ? inv.name.charAt(0) : "I"}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-white text-sm">{inv.name}</h4>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-2 py-0.5 rounded-full">
                      Requested: {inv.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{inv.email}</p>
                  {inv.note && <p className="text-xs text-slate-300 italic font-normal">{inv.note}</p>}
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
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-rose-800/60 text-rose-400 hover:bg-rose-950/40 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    inv.status === "APPROVED"
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                      : "bg-rose-950/60 text-rose-300 border border-rose-800/60"
                  }`}
                >
                  {inv.status}
                </span>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total > 0 && (
            <PaginationControls
              meta={paginationMeta}
              currentPage={page}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={setLimit}
              isLoading={isLoading}
              itemLabel="invitations"
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  );
}
