"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import {
  useGetUsersListQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/api/adminApi";
import { useAppSelector } from "@/redux/store";
import {
  Users,
  Search,
  Plus,
  Shield,
  Trash2,
  Edit3,
  Loader2,
  CheckCircle2,
  UserPlus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function OwnerUsersPage() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { data: usersList = [], isLoading, refetch } = useGetUsersListQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New User Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("MEMBER");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!fullName.trim() || !email.trim()) {
      setFormError("Full name and email are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("Please enter a valid email address (e.g. user@example.com).");
      return;
    }

    try {
      await createUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim() || "SanctuaryPass123!",
        role,
      }).unwrap();

      refetch();
      setFormSuccess(`User account created successfully as ${role}!`);
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("MEMBER");

      setTimeout(() => {
        setIsAddUserOpen(false);
        setFormSuccess("");
      }, 1500);
    } catch (err: any) {
      setFormError(
        err?.data?.message || err?.message || "Failed to create user account."
      );
    }
  };

  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [roleUpdateMsg, setRoleUpdateMsg] = useState<string | null>(null);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingRoleId(id);
    setRoleUpdateMsg(null);
    try {
      await updateUserRole({ id, role: newRole.toUpperCase() }).unwrap();
      refetch();
      setRoleUpdateMsg(`Role updated to ${newRole.toUpperCase()} successfully!`);
      setTimeout(() => setRoleUpdateMsg(null), 3000);
    } catch (err: any) {
      alert("Failed to update user role: " + (err?.data?.message || err?.message || "Unknown error"));
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to permanently remove user account (${email})?`)) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err: any) {
        alert("Failed to remove user account: " + (err?.data?.message || err?.message || "Unknown error"));
      }
    }
  };

  const filteredUsers = usersList.filter((u) => {
    // Exclude current logged in owner's account from the management list
    if (currentUser && (u.id === currentUser.id || u.email === currentUser.email)) {
      return false;
    }

    const matchesSearch =
      (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "ALL" || (u.role || "").toUpperCase() === roleFilter.toUpperCase();

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (roleStr: string) => {
    switch ((roleStr || "").toUpperCase()) {
      case "SUPER_ADMIN":
        return "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "ADMIN":
        return "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "OWNER":
        return "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "MEMBER":
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "VIEWER":
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
      default:
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <SanctuaryDashboardWrapper
      title="User Accounts & Access Roles"
      subtitle="Manage family sanctuary accounts, assign user permissions, and grant admin roles live in PostgreSQL."
    >
      <div className="space-y-6">
        {/* Search, Filter & Create Action Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* Role Filter Selector */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL" className="bg-slate-950 text-white">All User Roles ({usersList.length})</option>
              <option value="ADMIN" className="bg-slate-950 text-white">ADMIN</option>
              <option value="OWNER" className="bg-slate-950 text-white">OWNER</option>
              <option value="MEMBER" className="bg-slate-950 text-white">MEMBER</option>
              <option value="VIEWER" className="bg-slate-950 text-white">VIEWER</option>
              <option value="USER" className="bg-slate-950 text-white">USER</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsAddUserOpen(true)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Add New User Account</span>
          </button>
        </div>

        {roleUpdateMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{roleUpdateMsg}</span>
          </div>
        )}

        {/* Users Table */}
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            <span>Loading user accounts from database...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3 shadow-sm">
            <Users className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-white">No users found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No matching user accounts found for your current search or filter query.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-6">User Account</th>
                    <th className="py-3.5 px-6">Current Role</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Role Assignment</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-indigo-950 text-indigo-300 font-extrabold flex items-center justify-center shrink-0 border border-indigo-800/60">
                            {(u.fullName || u.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">
                              {u.fullName || "Sanctuary User"}
                            </div>
                            <div className="text-slate-400 text-xs font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getRoleBadgeStyle(
                            u.role
                          )}`}
                        >
                          <Shield className="h-3 w-3" />
                          <span>{u.role || "USER"}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>{u.status || "ACTIVE"}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            value={(u.role || "MEMBER").toUpperCase()}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={updatingRoleId === u.id}
                            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="MEMBER" className="bg-slate-950 text-white">Member</option>
                            <option value="VIEWER" className="bg-slate-950 text-white">Viewer</option>
                            <option value="ADMIN" className="bg-slate-950 text-white">Admin</option>
                            <option value="OWNER" className="bg-slate-950 text-white">Owner</option>
                            <option value="USER" className="bg-slate-950 text-white">User</option>
                          </select>
                          {updatingRoleId === u.id && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors"
                          title="Remove user account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {isAddUserOpen && (
          <div className="fixed inset-0 top-16 md:left-64 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center font-bold">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Create User Account
                    </h3>
                    <p className="text-xs text-slate-400">
                      Add a new user with custom role permission.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Rahman"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. tariq@family.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Initial Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Default: SanctuaryPass123!"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Assign Role Level
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="MEMBER" className="bg-slate-950 text-white">Member (Standard Access)</option>
                    <option value="VIEWER" className="bg-slate-950 text-white">Viewer (Read-only Access)</option>
                    <option value="ADMIN" className="bg-slate-950 text-white">Admin (Administrative Access)</option>
                    <option value="OWNER" className="bg-slate-950 text-white">Owner (Full Owner Access)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Save Account</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SanctuaryDashboardWrapper>
  );
}
