"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  GitCommit,
  TrendingUp,
  Activity,
  MoreVertical,
  Key,
  RefreshCw,
  AlertTriangle,
  Server,
  Database,
  SearchCheck,
  CheckCircle2,
  Lock,
  Plus
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const [privilegedAdmins] = useState([
    {
      id: "adm_1",
      initials: "SJ",
      name: "Sarah Jenkins",
      role: "Super Admin",
      roleBadge: "bg-indigo-100 text-indigo-800 border-indigo-200",
      lastActive: "2 mins ago",
    },
    {
      id: "adm_2",
      initials: "MR",
      name: "Mike Ross",
      role: "Moderator",
      roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
      lastActive: "1 hr ago",
    },
  ]);

  return (
    <div className="space-y-8 antialiased text-slate-800">
      {/* Page Title & Telemetry Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Overview
        </h1>
        <p className="text-sm font-normal text-slate-500">
          Comprehensive telemetry and control surface.
        </p>
      </div>

      {/* Top 3 Metric & Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Telemetry Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-lg text-slate-900">System Health</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs font-medium border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Primary Database</span>
              <span className="font-bold text-emerald-600">99.99% Uptime</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Auth Services</span>
              <span className="font-bold text-emerald-600">12ms Latency</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Storage Nodes</span>
              <span className="font-bold text-amber-600">82% Capacity</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Search Indexer</span>
              <span className="font-bold text-emerald-600">Synced</span>
            </div>
          </div>
        </div>

        {/* Global Users Metric Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5%</span>
            </span>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">1.2M</div>
            <div className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mt-1">
              GLOBAL USERS
            </div>
          </div>
        </div>

        {/* Families Created Metric Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GitCommit className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2%</span>
            </span>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">450K</div>
            <div className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mt-1">
              FAMILIES CREATED
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Privileged Access Management + Security Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Privileged Access Management Card (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-xl text-slate-900">Privileged Access Management</h2>
            </div>
            <Link
              href="/admin-dashboard/users"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {privilegedAdmins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {adm.initials}
                      </div>
                      <span>{adm.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${adm.roleBadge}`}>
                        {adm.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium">{adm.lastActive}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors cursor-pointer"
                        aria-label="More options"
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

        {/* Security Audit Feed Card (1 Column, Red Accent) */}
        <div className="p-6 rounded-2xl bg-rose-50/30 border border-rose-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-bold text-xl text-slate-900">Security Audit Feed</h2>
          </div>

          <div className="space-y-4">
            {/* Red Alert Item */}
            <div className="p-4 rounded-xl bg-white border-l-4 border-l-rose-500 border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-600">
                <Key className="h-4 w-4" />
                <span>Multiple Failed Logins</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                IP: 192.168.1.144 attempted to access root admin.
              </p>
              <span className="text-[10px] text-slate-400 font-medium block">10 mins ago</span>
            </div>

            {/* Amber Alert Item */}
            <div className="p-4 rounded-xl bg-white border-l-4 border-l-amber-500 border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-600">
                <RefreshCw className="h-4 w-4" />
                <span>Policy Alteration Detected</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                User role permissions modified by Admin [ID:4492].
              </p>
              <span className="text-[10px] text-slate-400 font-medium block">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
