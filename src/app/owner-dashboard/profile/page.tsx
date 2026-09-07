"use client";

import React, { useState, useEffect } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useAppSelector } from "@/redux/store";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/redux/api/authApi";
import {
  UserCheck,
  Mail,
  Shield,
  KeyRound,
  Edit2,
  Check,
  AlertCircle,
  Loader2,
  User,
  Phone,
  FileText,
  Lock,
} from "lucide-react";

export default function UserProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  // Profile Status
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Status
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhoneNumber((user as any).phoneNumber || "");
      setBio((user as any).bio || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!fullName.trim() || !email.trim()) {
      setProfileError("Full Name and Email address are required.");
      return;
    }

    try {
      const res = await updateProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim() || undefined,
        bio: bio.trim() || undefined,
      }).unwrap();

      setProfileSuccess(res?.message || "Account information updated successfully!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err: any) {
      setProfileError(
        err?.data?.message || err?.message || "Failed to update profile information."
      );
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!oldPassword || !newPassword) {
      setPasswordError("Please fill out all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();

      setPasswordSuccess(res?.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (err: any) {
      setPasswordError(
        err?.data?.message || err?.message || "Failed to update password. Verify current password."
      );
    }
  };

  const roleLabel = (user?.role || "USER").toUpperCase();

  return (
    <SanctuaryDashboardWrapper
      title="User Account Profile"
      subtitle="Manage your personal account credentials, login email (Gmail), and security password."
    >
      <div className="space-y-8 max-w-4xl pb-12">
        {/* Header Profile Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-3xl bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user?.fullName}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                  {roleLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>Verified & Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Access Permission
            </span>
            <span className="text-xs font-bold text-slate-700">
              {roleLabel === "OWNER"
                ? "Full Sanctuary Administration"
                : "Family Member Sanctuary Explorer"}
            </span>
          </div>
        </div>

        {/* Section 1: Update Profile & Gmail Account Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                <span>Account & Personal Information</span>
              </h3>
              <p className="text-xs text-slate-500">
                Update your display name, login Gmail address, phone number, and biography.
              </p>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Login Email (Gmail) *
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 555-0192"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  About / Bio
                </label>
                <div className="relative">
                  <FileText className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio or note about yourself..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Save Account Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Change Password & Security */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-600" />
                <span>Change Password</span>
              </h3>
              <p className="text-xs text-slate-500">
                Update your login password to keep your family sanctuary account secure.
              </p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Current Password *
              </label>
              <div className="relative max-w-md">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  New Password * (Min 8 characters)
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new secure password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
