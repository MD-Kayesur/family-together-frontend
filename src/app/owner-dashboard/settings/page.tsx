"use client";

import React, { useState, useEffect, useRef } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useAppSelector } from "@/redux/store";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/redux/api/authApi";
import {
  useGetSanctuaryQuery,
  useUpdateSanctuarySettingsMutation,
} from "@/redux/api/familyApi";
import {
  Settings,
  Shield,
  Bell,
  Lock,
  Save,
  Sparkles,
  Loader2,
  KeyRound,
  QrCode,
  Smartphone,
  CheckCircle2,
  X,
  Copy,
  Check,
  ShieldCheck,
  User,
  Mail,
  Phone,
  FileText,
  Camera,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Clock,
  IdCard,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "sanctuary" | "security">("profile");

  // --- Profile State ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // --- Password State ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // --- Sanctuary State ---
  const { data: sanctuaryData, isLoading: isSanctuaryLoading, refetch: refetchSanctuary } = useGetSanctuaryQuery();
  const [updateSanctuarySettings, { isLoading: isSavingSanctuary }] = useUpdateSanctuarySettingsMutation();
  const [sanctuaryName, setSanctuaryName] = useState("");
  const [sanctuaryDescription, setSanctuaryDescription] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sanctuarySuccess, setSanctuarySuccess] = useState("");

  // --- 2FA State & Modals ---
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState("TOTP");
  const [isSetup2FAModalOpen, setIsSetup2FAModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [verificationError, setVerificationError] = useState("");
  const [isCopiedBackup, setIsCopiedBackup] = useState(false);

  const secretKey = "JBSWY3DPEHPK3PXP";
  const backupCodes = [
    "A8X9-4F11",
    "B2Y3-9P22",
    "C7K4-1M88",
    "D9W0-3R55",
    "E4V5-7T99",
    "F1Q2-6Z44",
    "G3L8-0N11",
    "H5J9-2K33",
  ];

  // API Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Populate user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  // Populate sanctuary data
  useEffect(() => {
    if (sanctuaryData?.family) {
      setSanctuaryName(sanctuaryData.family.name || "The Rahman Family");
      setSanctuaryDescription(sanctuaryData.family.description || "");
    }
  }, [sanctuaryData]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setAvatarUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Update Submit
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
        avatarUrl: avatarUrl.trim() || undefined,
      }).unwrap();

      setProfileSuccess(res?.message || "Profile information updated successfully!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err: any) {
      setProfileError(
        err?.data?.message || err?.message || "Failed to update profile information."
      );
    }
  };

  // Handle Password Change Submit
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
        err?.data?.message || err?.message || "Failed to update password. Verify your current password."
      );
    }
  };

  // Handle Sanctuary Save
  const handleSaveSanctuary = async (e: React.FormEvent) => {
    e.preventDefault();
    setSanctuarySuccess("");
    try {
      await updateSanctuarySettings({ name: sanctuaryName, description: sanctuaryDescription }).unwrap();
      refetchSanctuary();
      setSanctuarySuccess("Sanctuary configuration saved successfully!");
      setTimeout(() => setSanctuarySuccess(""), 4000);
    } catch (err) {
      alert("Failed to update sanctuary settings.");
    }
  };

  // Handle 2FA Verification Code
  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");

    if (verificationCode.trim().length < 6) {
      setVerificationError("Please enter a valid 6-digit authentication code.");
      return;
    }

    setIs2FAEnabled(true);
    setSetupStep(2);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setIsCopiedBackup(true);
    setTimeout(() => setIsCopiedBackup(false), 2000);
  };

  const userRole = (user?.role || "OWNER").toUpperCase();
  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "September 2026";

  return (
    <SanctuaryDashboardWrapper
      title="Account & Sanctuary Settings"
      subtitle="Manage your personal profile, photo, login credentials, sanctuary rules, and two-factor security."
    >
      <div className="space-y-6 w-full max-w-full pb-16">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile & Account</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sanctuary")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "sanctuary"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Sanctuary & Family</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security & 2FA</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: PROFILE & ACCOUNT DETAILS                            */}
        {/* ============================================================ */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. CURRENT USER DETAILS HERO CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-3xl bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-indigo-600/30 overflow-hidden border-2 border-indigo-500/40 shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.fullName || "User Avatar"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{userInitial}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="Change Profile Photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">
                      {user?.fullName || "Family Member"}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-950/80 text-indigo-400 border border-indigo-800/80 uppercase tracking-wider">
                      {userRole}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{user?.status || "Active"}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{user?.email}</span>
                    </div>
                    {user?.phoneNumber && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>Member since {memberSince}</span>
                    </div>
                  </div>

                  {user?.bio && (
                    <p className="text-xs text-slate-300 font-normal italic pt-1 max-w-xl">
                      &ldquo;{user.bio}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-1 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Sanctuary Role
                </span>
                <span className="font-extrabold text-white">
                  {userRole === "OWNER"
                    ? "Sanctuary Guardian & Owner"
                    : userRole === "ADMIN"
                    ? "Sanctuary Administrator"
                    : "Sanctuary Family Member"}
                </span>
                <span className="text-[11px] text-slate-400">
                  Email Verified: <span className="text-emerald-400 font-bold">Yes</span>
                </span>
              </div>
            </div>

            {/* 2. UPDATE PROFILE DETAILS FORM */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-400" />
                    <span>Edit Profile Details</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update your profile photo, full name, contact phone number, and personal description.
                  </p>
                </div>
              </div>

              {profileSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6 text-xs">
                {/* Profile Photo Control */}
                <div>
                  <label className="block font-bold text-slate-200 mb-2">Profile Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-slate-500" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1 min-w-[240px]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors"
                        >
                          <Upload className="h-3.5 w-3.5 text-purple-400" />
                          <span>Upload From Device</span>
                        </button>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl("")}
                            className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 font-bold text-xs cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full max-w-md px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Md Kayesur Rahman"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Bio Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      Personal Description / Biography
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a brief personal bio or family role description..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{isUpdatingProfile ? "Saving Profile..." : "Save Profile Changes"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 3. CHANGE PASSWORD FORM */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-indigo-400" />
                    <span>Change Account Password</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-200 mb-1.5">
                    Current Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      New Password (min 8 chars) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      Confirm New Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    <span>{isChangingPassword ? "Updating..." : "Update Password"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: SANCTUARY & GENERAL SETTINGS                         */}
        {/* ============================================================ */}
        {activeTab === "sanctuary" && (
          <form onSubmit={handleSaveSanctuary} className="space-y-6 animate-fadeIn">
            {sanctuarySuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <Sparkles className="h-4 w-4" />
                <span>{sanctuarySuccess}</span>
              </div>
            )}

            {/* General Sanctuary Settings */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                <span>Sanctuary General Profile</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">Sanctuary Name</label>
                  <input
                    type="text"
                    value={sanctuaryName}
                    onChange={(e) => setSanctuaryName(e.target.value)}
                    className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Sanctuary Description & Mission</label>
                  <textarea
                    rows={3}
                    value={sanctuaryDescription}
                    onChange={(e) => setSanctuaryDescription(e.target.value)}
                    className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Privacy Level</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                  >
                    <option value="PRIVATE" className="bg-slate-950 text-white">Strictly Private (Invite Only)</option>
                    <option value="FAMILY" className="bg-slate-950 text-white">Extended Family Discoverable</option>
                    <option value="PUBLIC" className="bg-slate-950 text-white">Public Genealogical Search</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Controls */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-400" />
                <span>Notification Controls</span>
              </h3>

              <div className="flex items-center gap-3 text-xs">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-slate-700 bg-slate-950"
                />
                <label htmlFor="emailAlerts" className="font-bold text-slate-300">
                  Receive email notifications for pending join requests and new memory uploads
                </label>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSavingSanctuary}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isSavingSanctuary ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isSavingSanctuary ? "Saving..." : "Save Sanctuary Settings"}</span>
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SECURITY & TWO-FACTOR AUTHENTICATION (2FA)           */}
        {/* ============================================================ */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">
                      Two-Factor Authentication (2FA)
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Add an extra layer of protection using Google Authenticator, Authy, or SMS codes.
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border ${
                    is2FAEnabled
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/80"
                      : "bg-amber-950/60 text-amber-300 border-amber-800/80"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${is2FAEnabled ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <span>{is2FAEnabled ? "2FA Enabled" : "2FA Disabled"}</span>
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    Preferred 2FA Authentication Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                    <button
                      type="button"
                      onClick={() => setTwoFAMethod("TOTP")}
                      className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        twoFAMethod === "TOTP"
                          ? "border-indigo-500 bg-indigo-950/80 text-white font-bold shadow-sm"
                          : "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <QrCode className="h-5 w-5 text-indigo-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold">Authenticator App</div>
                        <div className="text-[10px] text-slate-400 font-normal">TOTP (Google/Authy)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTwoFAMethod("SMS")}
                      className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        twoFAMethod === "SMS"
                          ? "border-indigo-500 bg-indigo-950/80 text-white font-bold shadow-sm"
                          : "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <Smartphone className="h-5 w-5 text-purple-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold">SMS Code</div>
                        <div className="text-[10px] text-slate-400 font-normal">Text to Mobile</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTwoFAMethod("EMAIL")}
                      className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        twoFAMethod === "EMAIL"
                          ? "border-indigo-500 bg-indigo-950/80 text-white font-bold shadow-sm"
                          : "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <KeyRound className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold">Email Code</div>
                        <div className="text-[10px] text-slate-400 font-normal">Security Email</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {!is2FAEnabled ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSetupStep(1);
                        setVerificationCode("");
                        setVerificationError("");
                        setIsSetup2FAModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Setup & Enable 2FA</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSetupStep(2);
                          setIsSetup2FAModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <KeyRound className="h-4 w-4 text-indigo-400" />
                        <span>View Backup Codes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Are you sure you want to disable 2FA?")) {
                            setIs2FAEnabled(false);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>Disable 2FA</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2FA Setup Modal */}
      {isSetup2FAModalOpen && (
        <div className="fixed inset-0 top-16 md:left-64 bg-slate-950/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-purple-400" />
                <span>{setupStep === 1 ? "Setup Two-Factor Authentication" : "2FA Backup Recovery Codes"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSetup2FAModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {setupStep === 1 ? (
              <form onSubmit={handleVerify2FACode} className="space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed font-normal">
                  Scan the QR code below with your Google Authenticator or Authy app, then enter the 6-digit code to enable 2FA.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <div className="h-40 w-40 bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-inner">
                    <div className="w-full h-full border-4 border-slate-900 p-1 grid grid-cols-5 gap-1 bg-slate-900">
                      <div className="bg-white col-span-2 row-span-2" />
                      <div className="bg-white col-span-1" />
                      <div className="bg-white col-span-2 row-span-2" />
                      <div className="bg-white col-span-1" />
                      <div className="bg-white col-span-3" />
                      <div className="bg-white col-span-2 row-span-2" />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Secret Key</span>
                    <code className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 font-mono font-bold text-purple-300 text-xs">
                      {secretKey}
                    </code>
                  </div>
                </div>

                {verificationError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 font-semibold">
                    {verificationError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Enter 6-Digit Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 849201"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono font-bold text-center tracking-widest focus:ring-2 focus:ring-purple-500 focus:outline-none text-base"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSetup2FAModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify & Activate 2FA</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Two-Factor Authentication is Active & Secured!</span>
                </div>

                <p className="text-slate-300 leading-relaxed font-normal">
                  Save these single-use recovery codes in a safe place. You can use them to log in if you lose access to your authenticator device.
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950 text-white font-mono text-center font-bold text-xs border border-slate-800">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-purple-300">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {isCopiedBackup ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopiedBackup ? "Codes Copied!" : "Copy Backup Codes"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSetup2FAModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </SanctuaryDashboardWrapper>
  );
}
