"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  Users,
  ShieldCheck,
  Sparkles,
  Info,
  Reply,
  ArrowRight,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import {
  useGetBroadcastHistoryQuery,
  useGetBroadcastRecipientsPreviewQuery,
} from "@/redux/api/familyApi";
import BroadcastHistoryCard from "@/components/dashboard/BroadcastHistoryCard";
import BroadcastEmailModal from "@/components/modals/BroadcastEmailModal";

export default function BroadcastsTab() {
  const { user } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: historyData } = useGetBroadcastHistoryQuery({});
  const { data: recipientsData } = useGetBroadcastRecipientsPreviewQuery();

  const totalBroadcasts = Array.isArray(historyData)
    ? historyData.length
    : (historyData as any)?.meta?.total ?? 0;

  const totalRecipients = recipientsData?.recipients?.length ?? 0;

  return (
    <div className="space-y-6 w-full max-w-full pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Family Email Broadcasts
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              Owner Command Center
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Dispatch announcements to all family members with direct Gmail reply routing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.02] self-start sm:self-auto"
        >
          <Send className="h-4 w-4" />
          <span>New Email Broadcast</span>
        </button>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Broadcasts Sent</div>
            <div className="text-xl font-extrabold text-white">{totalBroadcasts} Archive(s)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Inboxes</div>
            <div className="text-xl font-extrabold text-white">{totalRecipients} Family Members</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400 flex items-center justify-center shrink-0">
            <Reply className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Direct Reply-To</div>
            <div className="text-sm font-bold text-purple-200 truncate max-w-[190px]">
              {user?.email || "Owner Gmail"}
            </div>
          </div>
        </div>
      </div>

      {/* Reply Routing Info Callout */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex items-start gap-3">
        <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <p className="font-semibold text-indigo-200">
            How Reply-To routing works:
          </p>
          <p className="text-slate-400 leading-relaxed">
            When you send a message, every family member receives an elegant, branded HTML email in their inbox. If any relative clicks &quot;Reply&quot; in Gmail, their message goes directly to your email address (<strong className="text-white">{user?.email || "your registered Gmail"}</strong>), keeping all conversations personal and organized without needing an intermediary server.
          </p>
        </div>
      </div>

      {/* Main Broadcast History Card */}
      <BroadcastHistoryCard onOpenNewBroadcast={() => setIsModalOpen(true)} />

      {/* Modal */}
      <BroadcastEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
