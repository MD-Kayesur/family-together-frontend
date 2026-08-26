"use client";

import React from "react";
import { Network, TrendingUp, BarChart2, PieChart, Users } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Network Analytics</h1>
        <p className="text-sm text-slate-500 font-normal">
          Deep-dive insights into family relationship graph depth, node growth, and active networks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
            <span>Generational Tree Growth</span>
          </h2>
          <div className="h-52 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-semibold">
            Interactive Generational Growth Graph
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-emerald-600" />
            <span>Relationship Distribution</span>
          </h2>
          <div className="h-52 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-semibold">
            Parent / Child / Spouse / Sibling Ratio Chart
          </div>
        </div>
      </div>
    </div>
  );
}
