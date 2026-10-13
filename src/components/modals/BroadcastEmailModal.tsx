"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  X,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Info,
  Shield,
  MessageSquare,
} from "lucide-react";
import {
  useBroadcastAnnouncementMutation,
  useGetBroadcastRecipientsPreviewQuery,
} from "@/redux/api/familyApi";
import { useAppSelector } from "@/redux/store";

interface BroadcastEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BroadcastEmailModal({
  isOpen,
  onClose,
  onSuccess,
}: BroadcastEmailModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("ALL");
  const [priority, setPriority] = useState<"NORMAL" | "HIGH">("NORMAL");
  const [statusFeedback, setStatusFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { data: previewData, isLoading: isLoadingRecipients } =
    useGetBroadcastRecipientsPreviewQuery(undefined, { skip: !isOpen });

  const [broadcastMutation, { isLoading: isBroadcasting }] =
    useBroadcastAnnouncementMutation();

  if (!isOpen) return null;

  const totalRecipients = previewData?.totalCount ?? 0;
  const recipientsList = previewData?.recipients ?? [];
  const senderEmail = user?.email || "owner@familyroots.io";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    try {
      setStatusFeedback(null);
      const res = await broadcastMutation({
        subject: subject.trim(),
        message: message.trim(),
        targetRole,
        priority,
      }).unwrap();

      setStatusFeedback({
        type: "success",
        text: res.message || "Announcement broadcasted successfully!",
      });

      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
        setSubject("");
        setMessage("");
        setStatusFeedback(null);
      }, 2000);
    } catch (err: any) {
      setStatusFeedback({
        type: "error",
        text:
          err?.data?.message ||
          "Failed to broadcast announcement. Please verify your internet and email settings.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-950/70 border border-indigo-800/60 text-indigo-400 font-bold flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Broadcast Email to Family</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Owner Panel
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Dispatches directly to member Gmail inboxes • Direct replies land in your Gmail
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-xs overflow-y-auto flex-1 pr-3"
        >
          {/* Recipient Counter Info Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-300 font-semibold">
              <Users className="h-4 w-4 text-indigo-400" />
              <span>Target Family Inboxes:</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 font-extrabold text-xs">
              {isLoadingRecipients ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                  <span>Scanning...</span>
                </span>
              ) : (
                `${totalRecipients} Active Members`
              )}
            </span>
          </div>

          {/* Target Role & Priority Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Recipient Filter
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Living Family Members</option>
                <option value="ADMIN">Sanctuary Admins Only</option>
                <option value="MEMBER">Active Members Only</option>
                <option value="VIEWER">Viewers Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Email Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "NORMAL" | "HIGH")}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="NORMAL">Normal Announcement</option>
                <option value="HIGH">High Priority / Urgent</option>
              </select>
            </div>
          </div>

          {/* Email Subject */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Email Subject <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Family Gala 2026 - Date & Venue Finalized"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Message */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Announcement Message Body <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={5}
              required
              placeholder="Type your announcement to all family members here. This will be formatted into a beautiful sanctuary-branded email..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Two-Way Reply Notice Callout Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 flex items-start gap-3">
            <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-slate-200 font-bold text-xs">
                Two-Way Direct Reply Enabled
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                When family members click <strong>&quot;Reply&quot;</strong> in their Gmail or email app, their response will be addressed directly to your personal email:{" "}
                <span className="text-indigo-300 font-mono font-semibold">
                  {senderEmail}
                </span>
                .
              </p>
            </div>
          </div>

          {/* Feedback Alerts */}
          {statusFeedback && (
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
                statusFeedback.type === "success"
                  ? "bg-emerald-950/70 border border-emerald-800 text-emerald-300"
                  : "bg-rose-950/70 border border-rose-800 text-rose-300"
              }`}
            >
              {statusFeedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              )}
              <span className="leading-snug">{statusFeedback.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isBroadcasting}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isBroadcasting || !subject.trim() || !message.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isBroadcasting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Dispatching to Inboxes...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Broadcast Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
