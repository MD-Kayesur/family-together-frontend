"use client";

import React, { useState } from "react";
import {
  useGetUsersListQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/api/adminApi";
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
  Edit3,
  Loader2,
} from "lucide-react";

export default function AdminUsersPage() {
  const { data: usersList = [], isLoading } = useGetUsersListQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to remove user account ${email}?`)) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        alert("Failed to delete user account.");
      }
    }
  };

  const handleRoleToggle = async (id: string, currentRole: string) => {
    const nextRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";
    try {
      await updateUserRole({ id, role: nextRole }).unwrap();
    } catch (err) {
      alert("Failed to update user role.");
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
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
            Manage family network members, access roles, and account statuses live in PostgreSQL.
          </p>
        </div>
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

        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredUsers.length} total users
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span>Loading user accounts...</span>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Role</th>
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
                        {(u.fullName || u.email || "U").charAt(0)}
                      </div>
                      <span>{u.fullName || "User"}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{u.email}</td>
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100 hover:bg-indigo-100 cursor-pointer transition-colors"
                        title="Click to toggle role"
                      >
                        <Shield className="h-3 w-3" />
                        <span>{u.role}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          u.status === "ACTIVE" || u.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{u.status || "ACTIVE"}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id, u.email)}
                          className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete user account"
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
      )}
    </div>
  );
}

