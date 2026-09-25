"use client";

import React, { useState } from "react";
import {
  useGetInvitationsQuery,
  useGetInvitationByIdQuery,
  useUpdateInvitationStatusMutation,
  useAddInvitationMutation,
  useDeleteInvitationMutation,
} from "@/redux/api/familyApi";
import {
  Mail,
  Plus,
  Check,
  X,
  Clock,
  UserPlus,
  Loader2,
  Search,
  Eye,
  Trash2,
  Copy,
  Shield,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

/**
 * Details modal displaying comprehensive invitation metadata fetched via GET /family/invitations/:id
 */
function InvitationDetailsModal({
  id,
  onClose,
  onAction,
  onDelete,
  isDeleting,
}: {
  id: string;
  onClose: () => void;
  onAction: (id: string, action: "APPROVED" | "REJECTED") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}) {
  const { data: inv, isLoading, isError } = useGetInvitationByIdQuery(id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-300 font-bold flex items-center justify-center text-base">
              {inv?.name ? inv.name.charAt(0).toUpperCase() : "I"}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Invitation Details</h3>
              <p className="text-xs text-slate-400">ID: {id.slice(0, 16)}...</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              <span>Fetching invitation details from API...</span>
            </div>
          ) : isError || !inv ? (
            <div className="py-8 text-center text-rose-400 space-y-2">
              <AlertTriangle className="h-8 w-8 mx-auto" />
              <p className="font-bold text-sm">Failed to load invitation details</p>
              <p className="text-slate-400 text-xs">The record might have been removed or revoked.</p>
            </div>
          ) : (
            <>
              {/* Status & Role Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Current Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === "APPROVED"
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                        : inv.status === "PENDING"
                        ? "bg-amber-950/60 text-amber-300 border border-amber-800/60"
                        : "bg-rose-950/60 text-rose-300 border border-rose-800/60"
                    }`}
                  >
                    {inv.status === "APPROVED" && <Check className="h-3.5 w-3.5" />}
                    {inv.status === "PENDING" && <Clock className="h-3.5 w-3.5" />}
                    {inv.status === "REJECTED" && <X className="h-3.5 w-3.5" />}
                    {inv.status}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Assigned Role</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
                    <Shield className="h-3.5 w-3.5" />
                    {inv.role}
                  </span>
                </div>
              </div>

              {/* Invitee Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-slate-400 text-[11px] font-medium block">Full Name</span>
                  <span className="text-white font-bold text-sm block mt-0.5">{inv.name}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-slate-400 text-[11px] font-medium block">Email Address</span>
                    <span className="text-white font-bold text-xs block mt-0.5 truncate">{inv.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(inv.email, "email")}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedKey === "email" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Note / Verification Message */}
              {inv.note && (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
                  <span className="text-slate-400 text-[11px] font-medium block">Verification Note / Reason</span>
                  <p className="text-slate-200 text-xs italic leading-relaxed">{inv.note}</p>
                </div>
              )}

              {/* Metadata Details */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2 text-slate-400 text-[11px]">
                {inv.family?.name && (
                  <div className="flex items-center justify-between">
                    <span>Family Sanctuary</span>
                    <span className="text-slate-200 font-semibold">{inv.family.name}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-purple-400" />
                    <span>Created Date</span>
                  </span>
                  <span className="text-slate-200 font-medium">
                    {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : "Recent"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Invitation ID</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(inv.id, "id")}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-mono text-[10px] cursor-pointer"
                  >
                    <span>{inv.id}</span>
                    {copiedKey === "id" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        {inv && !isLoading && (
          <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(inv.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-800/60 hover:bg-rose-950/40 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isDeleting ? "Revoking..." : "Revoke / Delete"}</span>
            </button>

            {inv.status === "PENDING" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onAction(inv.id, "REJECTED")}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAction(inv.id, "APPROVED")}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve Access</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [deleteInvitation, { isLoading: isDeleting }] = useDeleteInvitationMutation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
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
    } catch (err: any) {
      alert(err?.data?.message || "Failed to update invitation status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently revoke and delete this invitation request?")) {
      return;
    }
    try {
      await deleteInvitation(id).unwrap();
      if (selectedId === id) setSelectedId(null);
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to delete invitation");
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
    } catch (err: any) {
      alert(err?.data?.message || "Failed to send invitation");
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
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
            >
              {/* Invitee Info Section */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 rounded-2xl bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-extrabold text-base flex items-center justify-center shrink-0">
                  {inv.name ? inv.name.charAt(0).toUpperCase() : "I"}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-white text-sm truncate">{inv.name}</h4>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-2 py-0.5 rounded-full">
                      Requested: {inv.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === "APPROVED"
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                          : inv.status === "PENDING"
                          ? "bg-amber-950/60 text-amber-300 border border-amber-800/60"
                          : "bg-rose-950/60 text-rose-300 border border-rose-800/60"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium truncate">{inv.email}</p>
                  {inv.note && <p className="text-xs text-slate-300 italic font-normal line-clamp-1">{inv.note}</p>}
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => setSelectedId(inv.id)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="View full invitation details"
                >
                  <Eye className="h-4 w-4 text-purple-400" />
                  <span className="hidden sm:inline">Details</span>
                </button>

                {/* Approve / Reject Buttons (if pending) */}
                {inv.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction(inv.id, "APPROVED")}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Approve invitation"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(inv.id, "REJECTED")}
                      className="px-3 sm:px-4 py-2 rounded-xl border border-rose-800/60 text-rose-400 hover:bg-rose-950/40 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Reject invitation"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {/* Revoke / Delete Button */}
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(inv.id)}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl border border-rose-900/40 text-rose-400 hover:bg-rose-950/50 hover:border-rose-700/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Revoke and delete invitation"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
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

      {/* Details Modal */}
      {selectedId && (
        <InvitationDetailsModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onAction={handleAction}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
