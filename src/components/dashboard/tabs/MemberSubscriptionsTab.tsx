"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  HardDrive,
  Users,
  Search,
  CheckCircle2,
  Crown,
  Zap,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Sliders,
  UserCheck,
  Check,
  FileCode,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import {
  useGetMemberSubscriptionsQuery,
  useUpdateMemberSubscriptionMutation,
  MemberSubscriptionRecord,
} from "@/redux/api/billingApi";

export default function MemberSubscriptionsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<"ALL" | "PRO" | "FREE" | "UNLIMITED">("ALL");
  const [customModalMember, setCustomModalMember] = useState<MemberSubscriptionRecord | null>(null);
  const [customQuotaMb, setCustomQuotaMb] = useState<number>(5000);
  const [customCanAddMembers, setCustomCanAddMembers] = useState<boolean>(true);
  const [customNote, setCustomNote] = useState<string>("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetMemberSubscriptionsQuery();

  const [updateMemberSubscription, { isLoading: isUpdating }] = useUpdateMemberSubscriptionMutation();

  const members = response?.members || [];
  const totalCount = response?.totalMembers || members.length;
  const proCount = response?.proMembersCount || members.filter((m) => m.tier === "PRO").length;
  const unlimitedCount = response?.unlimitedMembersCount || members.filter((m) => m.tier === "UNLIMITED").length;
  const freeCount = totalCount - proCount - unlimitedCount;

  // Filter members by search and tier
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = filterTier === "ALL" || m.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const handleQuickTierChange = async (
    member: MemberSubscriptionRecord,
    tier: "FREE" | "PRO" | "UNLIMITED"
  ) => {
    try {
      setNotification(null);
      const res = await updateMemberSubscription({
        memberId: member.memberId,
        tier,
        storageLimitMb: tier === "PRO" ? 5000 : tier === "UNLIMITED" ? 50000 : 500,
        canAddMembers: tier === "PRO" || tier === "UNLIMITED",
        note: tier === "PRO" ? "Allocated Pro Seat with 5,000 MB Quota" : undefined,
      }).unwrap();

      setNotification({
        type: "success",
        text: res.message || `Updated ${member.name} to ${tier} tier!`,
      });
      refetch();
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err?.data?.message || err?.message || "Failed to update member subscription tier.",
      });
    }
  };

  const handleSaveCustomQuota = async () => {
    if (!customModalMember) return;
    try {
      setNotification(null);
      const res = await updateMemberSubscription({
        memberId: customModalMember.memberId,
        tier: customQuotaMb >= 5000 ? "PRO" : "FREE",
        storageLimitMb: customQuotaMb,
        canAddMembers: customCanAddMembers,
        note: customNote || "Custom Quota Configured by Owner",
      }).unwrap();

      setNotification({
        type: "success",
        text: res.message || `Custom quota saved for ${customModalMember.name}!`,
      });
      setCustomModalMember(null);
      refetch();
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err?.data?.message || err?.message || "Failed to save custom quota.",
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Owner Pro Seat &amp; Quota Delegation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Member Subscriptions &amp; Pro Access Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            As the Sanctuary Owner, you can grant any family relative a <strong>PRO</strong> status. Pro members receive <strong>5,000 MB storage quota</strong>, the ability to <strong>add more relatives</strong>, and unrestricted access across all platform features.
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PRO Seats</span>
            <span className="text-lg font-black text-indigo-400">{proCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unlimited</span>
            <span className="text-lg font-black text-purple-400">{unlimitedCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
            <span className="text-lg font-black text-white">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Pro Privileges Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3.5 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">5,000 MB Storage Vault</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              10x standard capacity. Pro members can upload high-resolution historical photos and documents.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3.5 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">Add More Members</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Unrestricted permissions to build out their branch of the family tree and link ancestors.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3.5 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 shrink-0">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">Full Platform Access</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Instant access to GEDCOM export/import, 300 DPI canvas posters, 4K galleries, and HD calls.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
              : "bg-rose-950/40 border-rose-800 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-3 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search relative by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
          {(["ALL", "PRO", "FREE", "UNLIMITED"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterTier === tier
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tier === "ALL" ? "All Members" : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Members Quota Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
          <span className="text-xs">Loading member subscriptions...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Users className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <h4 className="font-extrabold text-white text-sm">No family members match your filter</h4>
          <p className="text-xs text-slate-400">Try adjusting your search query or tier filter.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Relative Member</th>
                  <th className="py-3.5 px-4">Family Role</th>
                  <th className="py-3.5 px-4">Subscription Tier</th>
                  <th className="py-3.5 px-4">Storage Quota</th>
                  <th className="py-3.5 px-4">Add Relatives</th>
                  <th className="py-3.5 px-4 text-right">Owner Tier Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredMembers.map((m) => {
                  const isPro = m.tier === "PRO";
                  const isUnlimited = m.tier === "UNLIMITED";
                  const isOwner = m.familyRole === "OWNER";

                  return (
                    <tr key={m.memberId} className="hover:bg-slate-800/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-indigo-300 shrink-0 overflow-hidden">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                            ) : (
                              <span>{m.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-extrabold text-white text-xs block truncate">
                              {m.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate">
                              {m.email || "No direct account linked"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Family Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            m.familyRole === "OWNER"
                              ? "bg-purple-950/60 border-purple-800 text-purple-300"
                              : m.familyRole === "ADMIN"
                              ? "bg-indigo-950/60 border-indigo-800 text-indigo-300"
                              : "bg-slate-800/60 border-slate-700 text-slate-300"
                          }`}
                        >
                          {m.familyRole === "OWNER" && <Crown className="h-3 w-3" />}
                          <span>{m.familyRole}</span>
                        </span>
                      </td>

                      {/* Subscription Tier */}
                      <td className="py-3.5 px-4">
                        {isUnlimited ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-700 text-purple-200 font-extrabold text-[11px]">
                            <Crown className="h-3.5 w-3.5 text-purple-400" />
                            <span>UNLIMITED</span>
                          </span>
                        ) : isPro ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-linear-to-r from-indigo-900/80 to-purple-900/80 border border-indigo-500 text-white font-extrabold text-[11px] shadow-sm shadow-indigo-500/20">
                            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                            <span>PRO ACCESS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 font-bold text-[11px]">
                            <span>FREE TIER</span>
                          </span>
                        )}
                      </td>

                      {/* Storage Quota */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-extrabold text-white text-xs block">
                            {m.storageLimitMb >= 1000
                              ? `${(m.storageLimitMb / 1000).toFixed(0)} GB (${m.storageLimitMb.toLocaleString()} MB)`
                              : `${m.storageLimitMb} MB`}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isPro
                                  ? "bg-indigo-500"
                                  : isUnlimited
                                  ? "bg-purple-500"
                                  : "bg-slate-500"
                              }`}
                              style={{ width: `${Math.min(100, (m.storageUsedMb / m.storageLimitMb) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Add Relatives Permission */}
                      <td className="py-3.5 px-4">
                        {m.canAddMembers ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                            <Check className="h-3.5 w-3.5" />
                            <span>Allowed</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-semibold text-xs">Standard Only</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        {isOwner ? (
                          <span className="text-[11px] text-slate-500 font-medium">Sanctuary Owner</span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {isPro ? (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleQuickTierChange(m, "FREE")}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] cursor-pointer transition-colors disabled:opacity-50"
                                title="Downgrade to Standard Free limits (500 MB)"
                              >
                                Revert to Free
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleQuickTierChange(m, "PRO")}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] shadow-sm shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
                                title="Grant PRO status with 5,000 MB storage quota & full access"
                              >
                                <Sparkles className="h-3 w-3 text-amber-300" />
                                <span>Grant PRO (5,000 MB)</span>
                              </button>
                            )}

                            {/* Custom Quota Slider Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setCustomModalMember(m);
                                setCustomQuotaMb(m.storageLimitMb || 5000);
                                setCustomCanAddMembers(m.canAddMembers);
                                setCustomNote(m.note || "");
                              }}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                              title="Customize specific quota limit"
                            >
                              <Sliders className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Quota Adjustment Modal */}
      {customModalMember && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <h3 className="font-extrabold text-white text-sm sm:text-base">Custom Member Quota &amp; Access</h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomModalMember(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Adjust Storage Quota for {customModalMember.name}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={customQuotaMb}
                    onChange={(e) => setCustomQuotaMb(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-white text-xs w-20 text-right shrink-0">
                    {customQuotaMb.toLocaleString()} MB
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>500 MB (Free)</span>
                  <span className="font-bold text-indigo-400">5,000 MB (Standard Pro)</span>
                  <span>20,000 MB</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customCanAddMembers}
                    onChange={(e) => setCustomCanAddMembers(e.target.checked)}
                    className="rounded accent-indigo-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white">Allow Member to Add More Relatives</span>
                </label>
                <p className="text-[10px] text-slate-400 pl-6">
                  When enabled, this member can create new relative nodes on the family tree canvas.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Reason / Role Note (Optional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Branch Family Historian, Senior Archivist"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCustomModalMember(null)}
                className="px-4 py-2 rounded-xl text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSaveCustomQuota}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Save Quota &amp; Access</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
