"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Loader2,
  Eye,
  X,
  MessageSquare,
  Shield,
  ArrowRight,
} from "lucide-react";
import {
  useGetBroadcastHistoryQuery,
  useDeleteBroadcastHistoryItemMutation,
  AnnouncementRecord,
} from "@/redux/api/familyApi";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

interface BroadcastHistoryCardProps {
  onOpenNewBroadcast: () => void;
}

export default function BroadcastHistoryCard({
  onOpenNewBroadcast,
}: BroadcastHistoryCardProps) {
  const {
    searchTerm,
    debouncedSearch,
    page,
    limit,
    setLimit,
    setSearchTerm,
    setPage,
  } = usePaginationSearch({
    defaultLimit: 10,
    searchParamKey: "broadcast_search",
    pageParamKey: "broadcast_page",
    limitParamKey: "broadcast_limit",
  });
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementRecord | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: historyData,
    isLoading,
    refetch,
  } = useGetBroadcastHistoryQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [deleteBroadcastItem, { isLoading: isDeleting }] =
    useDeleteBroadcastHistoryItemMutation();

  const announcements: AnnouncementRecord[] = Array.isArray(historyData)
    ? historyData
    : (historyData as any)?.data || [];

  const paginationMeta = (historyData as any)?.meta;
  const totalCount = paginationMeta?.total ?? announcements.length;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this announcement record from history?")) {
      return;
    }
    try {
      await deleteBroadcastItem(id).unwrap();
      if (selectedAnnouncement?.id === id) {
        setSelectedAnnouncement(null);
      }
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to remove history record.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center font-bold">
              <Mail className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <span>Broadcast Email History</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                Owner Archives
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Log of announcements dispatched to all family members • Replies routed to your Gmail
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <button
            type="button"
            onClick={onOpenNewBroadcast}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 shrink-0 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send New Broadcast</span>
          </button>
        </div>
      </div>

      {/* History List Content */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          <span>Loading broadcast history from database...</span>
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 flex items-center justify-center mx-auto">
            <Mail className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-sm text-white">No broadcast emails sent yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Dispatch announcements directly to all family members&apos; Gmail inboxes with one click. Replies will automatically land in your personal Gmail.
          </p>
          <button
            type="button"
            onClick={onOpenNewBroadcast}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Your First Announcement</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {announcements.map((item) => {
            const isExpanded = expandedId === item.id;
            const formattedDate = new Date(item.createdAt).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800/90 bg-slate-950/70 hover:border-slate-700 transition-all overflow-hidden"
              >
                {/* Collapsible Row Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="space-y-1 overflow-hidden flex-1 mr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-white truncate">
                        {item.subject}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Delivered to {item.successfulSent} Inboxes</span>
                      </span>
                      {item.failedCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/70 text-rose-400 border border-rose-800/60">
                          <AlertCircle className="h-3 w-3" />
                          <span>{item.failedCount} Failed</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {item.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formattedDate}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={isDeleting}
                      title="Delete from history"
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 space-y-3 bg-slate-900/40 text-xs animate-in fade-in duration-150">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">
                        Full Broadcast Content:
                      </span>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 font-normal leading-relaxed whitespace-pre-wrap font-sans">
                        {item.message}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>
                          Sender: <strong className="text-white">{item.senderName}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Replies direct to:{" "}
                          <strong className="text-indigo-300 font-mono">
                            {item.replyToEmail}
                          </strong>
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        ID: {item.id.slice(0, 12)}...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {paginationMeta && paginationMeta.total > 0 && (
          <PaginationControls
            meta={paginationMeta}
            currentPage={page}
            onPageChange={setPage}
            limit={limit}
            onLimitChange={setLimit}
            isLoading={isLoading}
            itemLabel="announcements"
            className="mt-4"
          />
        )}
      </div>
      )}
    </div>
  );
}
