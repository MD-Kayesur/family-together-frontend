"use client";

import React from "react";
import { Activity, Clock, ShieldAlert, CheckCircle2, UserCheck, Key } from "lucide-react";

export default function AdminActivityPage() {
  const activities = [
    {
      id: 1,
      type: "SIGN_IN",
      message: "Kayesur Rahman signed in from IP 192.168.1.1",
      timestamp: "2 mins ago",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: 2,
      type: "TREE_UPDATE",
      message: "David Chen added 3 new family relationship nodes to Chen Family Tree",
      timestamp: "15 mins ago",
      icon: Activity,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      id: 3,
      type: "TOKEN_ROTATE",
      message: "JWT Refresh token rotated for session sess_8942",
      timestamp: "1 hour ago",
      icon: Key,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: 4,
      type: "REGISTRATION",
      message: "New user account registered: sarah.smith@familyroots.io",
      timestamp: "3 hours ago",
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Activity Monitor</h1>
        <p className="text-sm text-slate-500 font-normal">
          Real-time system events, audit logs, and security monitoring.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <span>Real-time System Audit Feed</span>
        </h2>

        <div className="space-y-3">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${act.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">{act.message}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Event Type: {act.type}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">{act.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
