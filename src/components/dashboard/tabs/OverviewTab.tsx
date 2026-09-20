"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Heart,
  Mail,
  UserPlus,
  Plus,
  Link as LinkIcon,
  Check,
  X,
  ExternalLink,
  Edit2,
  Clock,
  BarChart3,
  TrendingUp,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import {
  useGetSanctuaryQuery,
  useGetInvitationsQuery,
  useUpdateInvitationStatusMutation,
  useGetActivityLogsQuery,
  useGetMembersQuery,
} from "@/redux/api/familyApi";
import AddMemberModal from "@/components/modals/AddMemberModal";
import AddMemoryModal from "@/components/modals/AddMemoryModal";
import MemberCreationHeatmap from "@/components/dashboard/MemberCreationHeatmap";
import LandingFamilyTreeCanvas from "@/components/tree/LandingFamilyTreeCanvas";

export default function OverviewTab() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: sanctuaryData, refetch: refetchSanctuary } = useGetSanctuaryQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: invitations = [], refetch: refetchInvitations } = useGetInvitationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: activityLogs = [], refetch: refetchLogs } = useGetActivityLogsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: members = [], refetch: refetchMembers } = useGetMembersQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [updateInvitationStatus] = useUpdateInvitationStatusMutation();

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"6M" | "1Y" | "ALL">("6M");

  const pendingRequests = invitations.filter((inv) => inv.status === "PENDING");
  const familyName = user?.fullName ? user.fullName.split(" ").slice(-1)[0] : "Rahman";

  const totalMembersCount = members.length || 7;
  const maleCount = members.filter((m) => m.gender === "MALE").length || 4;
  const femaleCount = members.filter((m) => m.gender === "FEMALE").length || 3;
  const malePct = Math.round((maleCount / totalMembersCount) * 100);
  const femalePct = 100 - malePct;

  const monthlyGrowth = [
    { month: "Feb", count: 2, height: "30%" },
    { month: "Mar", count: 3, height: "45%" },
    { month: "Apr", count: 2, height: "30%" },
    { month: "May", count: 4, height: "60%" },
    { month: "Jun", count: 4, height: "60%" },
    { month: "Jul", count: 5, height: "75%" },
    { month: "Aug", count: 6, height: "90%" },
    { month: "Sep", count: totalMembersCount, height: "100%", isCurrent: true },
  ];

  const handleApprove = async (id: string) => {
    try {
      await updateInvitationStatus({ id, status: "APPROVED" }).unwrap();
      refetchInvitations();
      refetchSanctuary();
      refetchMembers();
      refetchLogs();
    } catch (err) {
      console.error("Failed to approve invitation", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateInvitationStatus({ id, status: "REJECTED" }).unwrap();
      refetchInvitations();
      refetchSanctuary();
      refetchLogs();
    } catch (err) {
      console.error("Failed to reject invitation", err);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-full pb-16">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              The {familyName} Family
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm uppercase tracking-wider">
              {user?.role || "OWNER"}
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-xl">
            Manage your family&apos;s legacy, members, and shared history from this central command hub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/owner-dashboard?tab=invitations"
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4 text-slate-400" />
            <span>Invite User</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Family Members */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Family Members</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {sanctuaryData?.stats?.totalMembers ?? totalMembersCount}
            </span>
            <span className="text-xs font-medium text-emerald-400">+3 this month</span>
          </div>
        </div>

        {/* Connected Users */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Connected Users</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center">
              <LinkIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {sanctuaryData?.stats?.connectedUsers ?? 1}
          </div>
        </div>

        {/* Relationships */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Relationships</span>
            <div className="h-9 w-9 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400 flex items-center justify-center">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {sanctuaryData?.stats?.relationships ?? 3}
          </div>
        </div>

        {/* Pending Invites */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Invites</span>
            <div className="h-9 w-9 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-400 flex items-center justify-center">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-rose-400">
              {sanctuaryData?.stats?.pendingInvites ?? pendingRequests.length}
            </span>
            <Link
              href="/owner-dashboard?tab=invitations"
              className="text-xs font-bold text-slate-400 hover:text-indigo-400 inline-flex items-center gap-1"
            >
              <span>Review</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* CHARTS & ANALYTICS SECTION */}
      <div className="space-y-6">
        {/* Header with Quick Time Range Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-white tracking-tight">
                Sanctuary Growth & Lineage Analytics
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Real-time member additions, generational balance, and tree distribution
              </p>
            </div>
          </div>

          {/* Time Range Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeRange("6M")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === "6M"
                  ? "bg-indigo-600 text-white shadow-sm font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Last 6 Months
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("1Y")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === "1Y"
                  ? "bg-indigo-600 text-white shadow-sm font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              This Year
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === "ALL"
                  ? "bg-indigo-600 text-white shadow-sm font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Grid 1: Lineage Additions Bar Chart (2 Cols) + Generational Breakdown (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Lineage Growth Trends (2 Columns) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4" />
                  <span>Monthly Member Additions</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    +{totalMembersCount} Relatives Documented
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    +28.4% vs last quarter
                  </span>
                </div>
              </div>

              <Link
                href="/owner-dashboard?tab=family"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
              >
                <span>View Family Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Interactive Bar Chart Visualization */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-t border-slate-800">
              {monthlyGrowth.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap pointer-events-none z-20">
                    {item.count} added in {item.month}
                  </div>

                  <div className="w-full bg-slate-950 rounded-t-xl h-44 flex items-end p-1 border border-slate-800/80">
                    <div
                      style={{ height: item.height }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        item.isCurrent
                          ? "bg-indigo-600 shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500"
                          : "bg-indigo-900/60 hover:bg-indigo-800/80"
                      }`}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-bold ${
                      item.isCurrent ? "text-indigo-400 font-extrabold" : "text-slate-500"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Generational Hierarchy Breakdown (1 Column) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>Generations Distribution</span>
              </div>
              <h3 className="font-extrabold text-base text-white">
                3 Active Generations
              </h3>
              <p className="text-xs text-slate-400 font-medium">Spanning patriarchs to grandchildren</p>
            </div>

            {/* Progress Bars for Generations */}
            <div className="space-y-4 border-t border-slate-800 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">1st Gen (Patriarchs & Matriarchs)</span>
                  <span className="text-indigo-400">2 members (20%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">2nd Gen (Parents, Aunts & Uncles)</span>
                  <span className="text-emerald-400">4 members (50%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "50%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">3rd Gen (Children & Cousins)</span>
                  <span className="text-purple-400">3 members (30%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "30%" }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Deepest Lineage Depth</span>
              <span className="font-extrabold text-white">3 Generations</span>
            </div>
          </div>
        </div>

        {/* Grid 2: Demographics Ratio Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Gender Balance */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
                <Users className="h-4 w-4" />
                <span>Gender Demographics</span>
              </div>
              <span className="text-xs font-bold text-slate-400">{totalMembersCount} total</span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden flex border border-slate-800">
                <div
                  className="bg-indigo-600 h-3"
                  style={{ width: `${malePct}%` }}
                  title={`Male: ${malePct}%`}
                />
                <div
                  className="bg-rose-500 h-3"
                  style={{ width: `${femalePct}%` }}
                  title={`Female: ${femalePct}%`}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <div className="flex items-center gap-2 text-indigo-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <span>Male: {maleCount} ({malePct}%)</span>
                </div>
                <div className="flex items-center gap-2 text-rose-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span>Female: {femaleCount} ({femalePct}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Relationship Types Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
                <Heart className="h-4 w-4" />
                <span>Lineage Connections Breakdown</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">Active Sanctuary</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/80 space-y-1">
                <div className="font-extrabold text-indigo-200 text-base">65%</div>
                <div className="text-[10px] font-bold text-indigo-400 uppercase">Direct Bloodline</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 space-y-1">
                <div className="font-extrabold text-emerald-200 text-base">25%</div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Spousal Ties</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/80 space-y-1">
                <div className="font-extrabold text-purple-200 text-base">10%</div>
                <div className="text-[10px] font-bold text-purple-400 uppercase">In-Laws/Adopted</div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub-Style Member Creation Activity Heatmap */}
        <MemberCreationHeatmap members={members} />

        {/* Interactive Sanctuary Family Tree Canvas Section (Same 2D Canvas & Logic as Landing Page) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Interactive 2D Lineage Workspace</span>
              </div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <span>The Signature Family Tree Canvas</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Live 2D lineage canvas synchronized with your sanctuary. Drag nodes, connect relatives with SVG lines, zoom, and add/edit members with real-time persistence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/owner-dashboard?tab=tree"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>Open Dedicated Tree Tab</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* 2D Canvas Container */}
          <div className="w-full h-[620px] rounded-xl overflow-hidden border border-slate-800 relative bg-slate-950">
            <LandingFamilyTreeCanvas
              variant="dashboard"
              readOnly={false}
              useDatabaseData={true}
              storageKey="owner_sanctuary_db_tree"
            />
          </div>
        </div>

        {/* Grid 3: Recent Family Records & Member Summary Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Recent Lineage & Member Records
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Family relatives and node profiles recorded in your sanctuary
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/owner-dashboard?tab=family"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
              >
                <span>Open Full 2D Canvas in My Family</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Generation</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Sanctuary Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Lineage View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                {members.slice(0, 5).map((m: any, idx: number) => (
                  <tr key={m.id || idx} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            m.gender === "FEMALE"
                              ? "bg-rose-950 text-rose-300 border border-rose-800/60"
                              : "bg-indigo-950 text-indigo-300 border border-indigo-800/60"
                          }`}
                        >
                          {m.firstName ? m.firstName.charAt(0) : "R"}
                        </div>
                        <div>
                          <p className="font-extrabold text-white text-xs">
                            {m.firstName} {m.lastName}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{m.bio || "Family relative"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-400">
                      {idx === 0 ? "Gen 1 (Patriarch)" : idx < 3 ? "Gen 2 (Core)" : "Gen 3 (Youth)"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          m.gender === "FEMALE"
                            ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                            : "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
                        }`}
                      >
                        {m.gender || "Unspecified"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">
                      {idx === 0 ? "Sanctuary Owner" : "Active Relative"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified Living
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/owner-dashboard?tab=family"
                        className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        View in Tree →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LOWER SECTION UNDER THE CANVAS: Action Required & Recent Activity Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Action Required Card */}
        <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <UserPlus className="h-5 w-5" />
            <h3 className="font-extrabold text-base">Action Required</h3>
          </div>

          <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            PENDING JOIN REQUESTS ({pendingRequests.length})
          </div>

          {pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    {req.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-white">{req.name}</div>
                    <div className="text-[11px] text-slate-400">{req.note || req.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleReject(req.id)}
                    className="p-1.5 rounded-lg border border-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    aria-label="Decline"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(req.id)}
                    className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-800 hover:bg-indigo-600 hover:text-white text-indigo-300 transition-colors cursor-pointer"
                    aria-label="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic p-3 bg-slate-950/60 rounded-xl border border-rose-900/30">
              No pending join requests.
            </div>
          )}
        </div>

        {/* Recent Activity Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-400" />
              <h3 className="font-extrabold text-base text-white">Recent Activity</h3>
            </div>
            <Link
              href="/owner-dashboard?tab=dashboard"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4 pt-1">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">{log.title}</p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic p-3 bg-slate-950 rounded-xl border border-slate-800">
                No recent activities logged.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Card: Family Overview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-white">Family Overview</h2>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Edit description"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Established in roots of resilience and growth. The {familyName} family sanctuary is dedicated to preserving our shared history, celebrating current milestones, and connecting generations across the globe. Documenting origins from Lahore to modern settlements in London and Toronto.
        </p>
      </div>

      {/* Interactive Modals */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => {
          setIsAddMemberOpen(false);
          refetchMembers();
          refetchSanctuary();
          refetchLogs();
        }}
      />
      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => {
          setIsAddMemoryOpen(false);
          refetchSanctuary();
          refetchLogs();
        }}
      />
    </div>
  );
}
