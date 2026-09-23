"use client";

import React from "react";
import { Activity, Clock, ShieldAlert, CheckCircle2, UserCheck, Key, Search, X, Loader2 } from "lucide-react";
import { useGetActivityLogsQuery } from "@/redux/api/familyApi";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

export default function AdminActivityPage() {
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

  const { data: logs = [], isLoading } = useGetActivityLogsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const paginationMeta = (logs as any)?.meta;

  const getActivityIconAndColor = (type: string) => {
    switch ((type || "").toUpperCase()) {
      case "MEMBER_ADDED":
      case "USER_JOINED":
        return {
          icon: UserCheck,
          color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
        };
      case "TREE_UPDATED":
      case "RELATIONSHIP_CREATED":
        return {
          icon: Activity,
          color: "text-indigo-400 bg-indigo-950/60 border-indigo-800/60",
        };
      case "AUTH":
      case "LOGIN":
        return {
          icon: Key,
          color: "text-amber-400 bg-amber-950/60 border-amber-800/60",
        };
      default:
        return {
          icon: CheckCircle2,
          color: "text-purple-400 bg-purple-950/60 border-purple-800/60",
        };
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Activity Monitor</h1>
        <p className="text-sm text-slate-400 font-normal">
          Real-time system events, audit logs, and security monitoring live in PostgreSQL.
        </p>
      </div>

      {/* Search & Action Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity by title or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500 font-medium"
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

        <div className="text-xs font-semibold text-slate-400">
          Showing {logs.length} of {paginationMeta?.total ?? logs.length} audit events
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <h2 className="font-bold text-base text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <span>Real-time System Audit Feed</span>
        </h2>

        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            <span>Loading audit logs from database...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            {searchTerm ? `No activity records match "${searchTerm}".` : "No recent activity recorded."}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {logs.map((act) => {
                const { icon: Icon, color } = getActivityIconAndColor(act.type);
                return (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{act.title || act.description}</div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Event Type: {act.type} {act.user ? `• User: ${act.user}` : ""}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {act.timestamp ? new Date(act.timestamp).toLocaleString() : "Recent"}
                    </span>
                  </div>
                );
              })}
            </div>

            {paginationMeta && paginationMeta.total > 0 && (
              <PaginationControls
                meta={paginationMeta}
                currentPage={page}
                onPageChange={setPage}
                limit={limit}
                onLimitChange={setLimit}
                isLoading={isLoading}
                itemLabel="events"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
