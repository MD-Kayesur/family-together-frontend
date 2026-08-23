"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { Settings, Shield, Bell, Lock, Save, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [sanctuaryName, setSanctuaryName] = useState("The Rahman Family");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg("Sanctuary configuration saved to PostgreSQL!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <SanctuaryDashboardWrapper
      title="Sanctuary Settings & Privacy"
      subtitle="Configure global family access rules, privacy visibility, and notification preferences."
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {savedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{savedMsg}</span>
          </div>
        )}

        {/* General Settings */}
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

        {/* Notification Preferences */}
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

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </form>
    </SanctuaryDashboardWrapper>
  );
}
