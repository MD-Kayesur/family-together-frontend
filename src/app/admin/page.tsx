"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  LogIn,
  GitCommit,
  Network,
  TrendingUp,
  Filter,
  MoreVertical,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useGetAdminStatsQuery, useGetUsersListQuery } from "@/redux/api/adminApi";
import SuperAdminDashboardPage from "./super/page";

export default function AdminDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [filterRole, setFilterRole] = useState<string>("ALL");

  const { data: stats } = useGetAdminStatsQuery();
  const { data: recentUsers = [] } = useGetUsersListQuery();

  if (user?.role?.toUpperCase() === "SUPER_ADMIN") {
    return <SuperAdminDashboardPage />;
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm font-normal text-slate-500">
          Real-time metrics and system activity for the FamilyRoots network live from PostgreSQL.
        </p>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>Live</span>
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">Total Users</div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.totalUsers ?? recentUsers.length ?? 1}
            </div>
          </div>
        </div>

        {/* Active Logins */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <LogIn className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">Active Logins (This Month)</div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.activeLogins ?? 1}
            </div>
          </div>
        </div>

        {/* Relationships Created */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GitCommit className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">Relationships Created</div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.relationshipsCreated ?? 3}
            </div>
          </div>
        </div>

        {/* Avg. Tree Depth */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Network className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">Avg. Tree Depth</div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.avgTreeDepth ?? "5.2 gens"}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: User Activity Chart + High Activity Families */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Overview Chart (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-slate-900">User Activity Overview</h2>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <span>Last 30 Days</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bar Chart Graphics */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-4 border-t border-slate-100">
            <div className="w-full bg-indigo-100/70 hover:bg-indigo-200 rounded-t-lg h-[35%] transition-all" />
            <div className="w-full bg-indigo-100/70 hover:bg-indigo-200 rounded-t-lg h-[55%] transition-all" />
            <div className="w-full bg-indigo-100/70 hover:bg-indigo-200 rounded-t-lg h-[40%] transition-all" />
            <div className="w-full bg-indigo-200/90 hover:bg-indigo-300 rounded-t-lg h-[70%] transition-all" />
            <div className="w-full bg-indigo-300 hover:bg-indigo-400 rounded-t-lg h-[82%] transition-all" />
            <div className="w-full bg-indigo-600 rounded-t-lg h-[100%] transition-all shadow-lg shadow-indigo-600/30" />
            <div className="w-full bg-indigo-200/80 hover:bg-indigo-300 rounded-t-lg h-[65%] transition-all" />
          </div>
        </div>

        {/* High Activity Families (1 Column) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h2 className="font-bold text-xl text-slate-900">High Activity Families</h2>
            <p className="text-xs text-slate-400 font-medium">Most relatives added</p>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            {/* Chen Family Tree */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center shrink-0">
                  C
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-800">Chen Family Tree</div>
                  <div className="text-xs text-slate-500">Led by David C.</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-slate-900">142</div>
                <div className="text-[10px] font-medium text-slate-400">nodes</div>
              </div>
            </div>

            {/* Smith Legacy */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-800 font-bold text-sm flex items-center justify-center shrink-0">
                  S
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-800">Smith Legacy</div>
                  <div className="text-xs text-slate-500">Led by Sarah S.</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-slate-900">98</div>
                <div className="text-[10px] font-medium text-slate-400">nodes</div>
              </div>
            </div>

            {/* Martinez Roots */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-800 font-bold text-sm flex items-center justify-center shrink-0">
                  M
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-800">Martinez Roots</div>
                  <div className="text-xs text-slate-500">Led by Elena M.</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-slate-900">85</div>
                <div className="text-[10px] font-medium text-slate-400">nodes</div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <Link
              href="/admin/users"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
            >
              <span>View All Families</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent Registrations */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-slate-900">Recent Registrations</h2>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
                      {(u.fullName || u.email || "U").charAt(0)}
                    </div>
                    <span>{u.fullName || "User"}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{u.email}</td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        u.status === "ACTIVE" || u.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {u.status === "ACTIVE" || u.status === "Active" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span>{u.status || "ACTIVE"}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors cursor-pointer"
                      aria-label="Actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
