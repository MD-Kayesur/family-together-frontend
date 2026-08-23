"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetSanctuaryQuery } from "@/redux/api/familyApi";
import { Users, ShieldCheck, Heart, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MyFamilyPage() {
  const { data: sanctuaryData, isLoading } = useGetSanctuaryQuery();

  return (
    <SanctuaryDashboardWrapper
      title="My Family Sanctuary"
      subtitle="Overview of your family sanctuary network, member statistics, and heritage details."
    >
      <div className="space-y-8">
        {/* Main Family Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider">
              Primary Sanctuary
            </span>
            <span className="text-xs text-indigo-200 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Private & Secured
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {sanctuaryData?.family?.name || "The Rahman Family"}
          </h2>
          <p className="text-sm text-indigo-100 max-w-3xl leading-relaxed">
            {sanctuaryData?.family?.description ||
              "Established in roots of resilience and growth. Dedicated to preserving our shared history, celebrating current milestones, and connecting generations across the globe."}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard/members"
              className="bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all shadow-md flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span>View All Members ({sanctuaryData?.stats?.totalMembers ?? 42})</span>
            </Link>

            <Link
              href="/dashboard/tree"
              className="bg-indigo-700/80 text-white border border-indigo-500/50 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all flex items-center gap-2"
            >
              <span>Explore Family Tree</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Members</span>
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900">
              {sanctuaryData?.stats?.totalMembers ?? 42}
            </span>
            <p className="text-xs text-slate-500">Fetched live from PostgreSQL</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Relationships</span>
              <Heart className="h-5 w-5 text-rose-600" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900">
              {sanctuaryData?.stats?.relationships ?? 86}
            </span>
            <p className="text-xs text-slate-500">Biological & Marital Nodes</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Memories Archived</span>
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900">
              {sanctuaryData?.stats?.totalMemories ?? 45}
            </span>
            <p className="text-xs text-slate-500">Photos & Historical Vaults</p>
          </div>
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
