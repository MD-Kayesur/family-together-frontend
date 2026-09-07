"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Server,
  Database,
  Save,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Smartphone,
  KeyRound,
  X,
  Copy,
  Check,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  // 2FA Admin State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [twoFAMethod, setTwoFAMethod] = useState("TOTP");
  const [isSetup2FAModalOpen, setIsSetup2FAModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [verificationError, setVerificationError] = useState("");
  const [isCopiedBackup, setIsCopiedBackup] = useState(false);

  const secretKey = "ADM-JBSWY3DPEHPK3PXP";
  const backupCodes = [
    "ADM-8X99-4F11",
    "ADM-2Y39-P220",
    "ADM-7K41-M880",
    "ADM-9W03-R550",
  ];

  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");

    if (verificationCode.trim() !== "849201" && verificationCode.trim().length !== 6) {
      setVerificationError("Invalid 6-digit code. Please check your authenticator app.");
      return;
    }

    setSetupStep(2);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setIsCopiedBackup(true);
    setTimeout(() => setIsCopiedBackup(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 font-normal">
          Configure security policies, database connections, and system-wide options.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>System configuration updated successfully!</span>
        </div>
      )}

      <div className="space-y-6 max-w-3xl">
        {/* Security & Token Expiry */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span>Security & Token Expiry</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Access Token TTL (minutes)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Refresh Token TTL (days)</label>
              <input
                type="number"
                defaultValue={7}
                className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Admin 2FA Security Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Admin Two-Factor Authentication (2FA)</span>
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              2FA Mandatory for Admins
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred 2FA Method</label>
              <select
                value={twoFAMethod}
                onChange={(e) => setTwoFAMethod(e.target.value)}
                className="w-full max-w-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TOTP">Authenticator App (Google / 1Password / Authy)</option>
                <option value="SECURITY_KEY">FIDO2 / Hardware WebAuthn Key</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">Active 2FA Device</p>
                <p className="text-slate-500 text-[11px]">Primary TOTP Authenticator Key configured</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSetupStep(1);
                  setIsSetup2FAModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Reconfigure 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Database & Cache */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <span>Database & Cache</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Database Pool Max Connections</label>
              <input
                type="number"
                defaultValue={20}
                className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Redis Cache TTL (seconds)</label>
              <input
                type="number"
                defaultValue={3600}
                className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Server & Network */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Server className="h-5 w-5 text-amber-600" />
            <span>Server & Network</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="maintenance"
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="maintenance" className="font-semibold text-slate-700">
                Enable Maintenance Mode (Read-Only)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rateLimit"
                defaultChecked
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="rateLimit" className="font-semibold text-slate-700">
                Enable Global API Rate Limiting (100 req/min)
              </label>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>Save System Settings</span>
        </button>
      </div>

      {/* 2FA Admin Setup Modal */}
      {isSetup2FAModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <span>{setupStep === 1 ? "Admin 2FA Configuration" : "Admin Recovery Codes"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSetup2FAModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {setupStep === 1 ? (
              <form onSubmit={handleVerify2FACode} className="space-y-5 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Scan this QR code with Google Authenticator or enter the secret key manually:
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-3">
                  <div className="h-32 w-32 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-inner">
                    <QrCode className="h-24 w-24 text-slate-900" />
                  </div>
                  <div className="text-center font-mono font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs">
                    {secretKey}
                  </div>
                </div>

                {verificationError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                    {verificationError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Enter 6-Digit Code from App</label>
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
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer"
                  >
                    Confirm & Activate
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Admin 2FA Active!</span>
                </div>

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
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCopiedBackup ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopiedBackup ? "Codes Copied!" : "Copy Codes"}</span>
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
    </div>
  );
}
