"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Shield,
  Trash2,
  Edit3
} from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const usersList = [
    {
      id: "usr_1",
      name: "David Chen",
      email: "david.chen@familyroots.io",
      role: "Owner",
      status: "Active",
      relativesCount: 142,
      dateJoined: "Aug 22, 2026",
    },
    {
      id: "usr_2",
      name: "Sarah Smith",
      email: "sarah.smith@familyroots.io",
      role: "Admin",
      status: "Active",
      relativesCount: 98,
      dateJoined: "Aug 21, 2026",
    },
    {
      id: "usr_3",
      name: "Elena Martinez",
      email: "elena.martinez@familyroots.io",
      role: "Member",
      status: "Pending",
      relativesCount: 85,
      dateJoined: "Aug 20, 2026",
    },
    {
      id: "usr_4",
      name: "Kayesur Rahman",
      email: "kayesur.rahman@familyroots.io",
      role: "Owner",
      status: "Active",
      relativesCount: 24,
      dateJoined: "Aug 19, 2026",
    },
    {
      id: "usr_5",
      name: "Rafi Rahman",
      email: "rafi.rahman@familyroots.io",
      role: "Member",
      status: "Active",
      relativesCount: 12,
      dateJoined: "Aug 18, 2026",
    },
  ];

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 font-normal">
            Manage family network members, access roles, and account statuses.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filter Users</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Relatives</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joined</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                      <Shield className="h-3 w-3" />
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{u.relativesCount} nodes</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        u.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {u.status === "Active" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span>{u.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{u.dateJoined}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                        aria-label="Edit user"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        aria-label="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
