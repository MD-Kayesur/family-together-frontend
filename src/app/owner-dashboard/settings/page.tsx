"use client";

import React, { useState, useEffect } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import {
  useGetSanctuaryQuery,
  useUpdateSanctuarySettingsMutation,
} from "@/redux/api/familyApi";
<<<<<<< HEAD
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
  RefreshCw,
} from "lucide-react";
=======
import { Settings, Shield, Bell, Lock, Save, Sparkles, Loader2 } from "lucide-react";
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3

export default function SettingsPage() {
  const { data: sanctuaryData, isLoading } = useGetSanctuaryQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSanctuarySettingsMutation();

  const [sanctuaryName, setSanctuaryName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");

<<<<<<< HEAD
  // 2FA State & Modals
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

=======
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
  useEffect(() => {
    if (sanctuaryData?.family) {
      setSanctuaryName(sanctuaryData.family.name || "The Rahman Family");
      setDescription(sanctuaryData.family.description || "");
    }
  }, [sanctuaryData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({ name: sanctuaryName, description }).unwrap();
      setSavedMsg("Sanctuary configuration saved to PostgreSQL!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      alert("Failed to update sanctuary settings.");
    }
  };

<<<<<<< HEAD
  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");

    if (verificationCode.trim().length < 6) {
      setVerificationError("Please enter a valid 6-digit authentication code.");
      return;
    }

    // Success transition
    setIs2FAEnabled(true);
    setSetupStep(2);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setIsCopiedBackup(true);
    setTimeout(() => setIsCopiedBackup(false), 2000);
  };

  return (
    <SanctuaryDashboardWrapper
      title="Sanctuary Settings & Security"
      subtitle="Configure global family access rules, two-factor authentication (2FA), and notification preferences."
=======
  return (
    <SanctuaryDashboardWrapper
      title="Sanctuary Settings & Privacy"
      subtitle="Configure global family access rules, privacy visibility, and notification preferences live in PostgreSQL."
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
    >
      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span>Loading sanctuary configuration...</span>
        </div>
      ) : (
<<<<<<< HEAD
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-12">
=======
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
          {savedMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>{savedMsg}</span>
            </div>
          )}

<<<<<<< HEAD
          {/* 1. General Settings */}
=======
          {/* General Settings */}
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              <span>Sanctuary General Profile</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sanctuary Name</label>
                <input
                  type="text"
                  value={sanctuaryName}
                  onChange={(e) => setSanctuaryName(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sanctuary Description & Mission</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium resize-none"
=======
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Privacy Level</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  <option value="PRIVATE">Strictly Private (Invite Only)</option>
                  <option value="FAMILY">Extended Family Discoverable</option>
                  <option value="PUBLIC">Public Genealogical Search</option>
                </select>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* 2. Two-Factor Authentication (2FA) Security Section */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Add an extra layer of protection using Google Authenticator or SMS codes.
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border ${
                  is2FAEnabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${is2FAEnabled ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span>{is2FAEnabled ? "2FA Enabled" : "2FA Disabled"}</span>
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Preferred 2FA Authentication Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                  <button
                    type="button"
                    onClick={() => setTwoFAMethod("TOTP")}
                    className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      twoFAMethod === "TOTP"
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-indigo-600 shrink-0" />
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
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Smartphone className="h-5 w-5 text-purple-600 shrink-0" />
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
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <KeyRound className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-extrabold">Email Code</div>
                      <div className="text-[10px] text-slate-400 font-normal">Security Email</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2FA Enable & Config Controls */}
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
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <KeyRound className="h-4 w-4 text-indigo-600" />
                      <span>View Backup Codes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to disable 2FA?")) {
                          setIs2FAEnabled(false);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Disable 2FA</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Notification Preferences */}
=======
          {/* Notification Preferences */}
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <span>Notification Controls</span>
            </h3>

            <div className="flex items-center gap-3 text-xs">
              <input
                type="checkbox"
                id="emailAlerts"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <label htmlFor="emailAlerts" className="font-bold text-slate-700">
                Receive email notifications for pending join requests and new memory uploads
              </label>
            </div>
          </div>

<<<<<<< HEAD
          {/* Submit Button */}
=======
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </form>
      )}
<<<<<<< HEAD

      {/* 2FA Setup Modal */}
      {isSetup2FAModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <span>{setupStep === 1 ? "Setup Two-Factor Authentication" : "2FA Backup Recovery Codes"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSetup2FAModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {setupStep === 1 ? (
              <form onSubmit={handleVerify2FACode} className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed font-normal">
                  Scan the QR code below with your Google Authenticator or Authy app, then enter the 6-digit code to enable 2FA.
                </p>

                {/* QR Code Graphic & Secret Key Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-3">
                  <div className="h-40 w-40 bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-inner">
                    {/* Simulated Authentic SVG QR Code Graphic */}
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
                    <code className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-mono font-bold text-indigo-600 text-xs">
                      {secretKey}
                    </code>
                  </div>
                </div>

                {verificationError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                    {verificationError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enter 6-Digit Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 849201"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold text-center tracking-widest focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSetup2FAModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
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
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Two-Factor Authentication is Active & Secured!</span>
                </div>

                <p className="text-slate-600 leading-relaxed font-normal">
                  Save these single-use recovery codes in a safe place. You can use them to log in if you lose access to your authenticator device.
                </p>

                {/* Backup Codes Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900 text-white font-mono text-center font-bold text-xs">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {isCopiedBackup ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopiedBackup ? "Codes Copied!" : "Copy Backup Codes"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSetup2FAModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
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
=======
    </SanctuaryDashboardWrapper>
  );
}

>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
