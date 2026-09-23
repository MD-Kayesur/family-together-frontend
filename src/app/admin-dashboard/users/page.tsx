"use client";

import React from "react";
import {
  useGetUsersListQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/api/adminApi";
import {
  Users,
  Search,
  CheckCircle2,
  Shield,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

export default function AdminUsersPage() {
  const {
    searchTerm,
    debouncedSearch,
    page,
    limit,
    setLimit,
    setSearchTerm,
    setPage,
    clearSearch,
  } = usePaginationSearch({ defaultLimit: 10, searchParamKey: "search" });

  const { data: usersList = [], isLoading, refetch } = useGetUsersListQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const paginationMeta = (usersList as any)?.meta;

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to remove user account ${email}?`)) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err) {
        alert("Failed to delete user account.");
      }
    }
  };

  const handleRoleToggle = async (id: string, currentRole: string) => {
    const nextRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";
    try {
      await updateUserRole({ id, role: nextRole }).unwrap();
      refetch();
    } catch (err) {
      alert("Failed to update user role.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-400 font-normal">
            Manage family network members, access roles, and account statuses live in PostgreSQL.
          </p>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
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
          Showing {usersList.length} of {paginationMeta?.total ?? usersList.length} total users
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          <span>Loading user accounts...</span>
        </div>
      ) : usersList.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <Users className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-white">No user accounts found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm ? `No users matching "${searchTerm}".` : "No registered user accounts found in the database."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-6">User</th>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Joined</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {(u.fullName || u.email || "U").charAt(0)}
                        </div>
                        <span>{u.fullName || "User"}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-medium">{u.email}</td>
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-400 text-[11px] font-semibold border border-purple-800 hover:bg-purple-900/60 cursor-pointer transition-colors"
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
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800"
                              : "bg-amber-950/60 text-amber-300 border border-amber-800"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{u.status || "ACTIVE"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.email)}
                            className="p-1.5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
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

          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total > 0 && (
            <PaginationControls
              meta={paginationMeta}
              currentPage={page}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={setLimit}
              isLoading={isLoading}
              itemLabel="users"
            />
          )}
        </div>
      )}
    </div>
  );
}
