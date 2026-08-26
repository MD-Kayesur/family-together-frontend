"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { Clock, ShieldCheck, User, Calendar, FileText, Sparkles, Filter } from "lucide-react";
import { useGetActivityLogsQuery } from "@/redux/api/familyApi";

export default function ActivityLogPage() {
  const { data: activityLogs = [], isLoading } = useGetActivityLogsQuery();

  return (
    <SanctuaryDashboardWrapper
      title="Sanctuary Activity Log"
      subtitle="Complete audit trail and historical record of actions taken across your family sanctuary."
    >
      <div className="space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Real-Time Event Stream</h3>
              <p className="text-xs text-slate-500">
                Tracking member updates, invitations, relationship connections, and memory posts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{activityLogs.length} Events Logged</span>
            </span>
          </div>
        </div>

        {/* Activity List Container */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-extrabold text-sm text-slate-900">Historical Activity Timeline</h4>
            <span className="text-xs text-slate-400 font-medium">Sorted by newest first</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
              Loading activity history...
            </div>
          ) : activityLogs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <Clock className="h-10 w-10 text-slate-300 mx-auto" />
              <h5 className="font-bold text-slate-700 text-sm">No activity recorded yet</h5>
              <p className="text-xs text-slate-400 max-w-xs">
                As family members add memories, events, or connections, events will automatically stream here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activityLogs.map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors flex items-start gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {log.title || "Sanctuary Event"}
                      </h5>
                      <span className="text-[11px] font-bold text-slate-400 shrink-0">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Just now"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {log.description || "Activity recorded in family database sanctuary."}
                    </p>

                    {log.user && (
                      <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-indigo-600">
                        <User className="h-3 w-3" />
                        <span>Action by: {log.user}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
