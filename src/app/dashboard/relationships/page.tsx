"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { Heart, Plus, GitMerge, ShieldCheck } from "lucide-react";

export default function RelationshipsPage() {
  const relationships = [
    { id: "1", from: "Omar Rahman", to: "Tariq Rahman", type: "Father ➔ Son", status: "VERIFIED" },
    { id: "2", from: "Fatima Rahman", to: "Tariq Rahman", type: "Mother ➔ Son", status: "VERIFIED" },
    { id: "3", from: "Tariq Rahman", to: "Aisha Rahman", type: "Brother ➔ Sister", status: "VERIFIED" },
    { id: "4", from: "Omar Rahman", to: "Farah N.", type: "Uncle ➔ Niece", status: "VERIFIED" },
  ];

  return (
    <SanctuaryDashboardWrapper
      title="Family Relationships Matrix"
      subtitle="View biological and marital connection nodes mapped across generations."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="font-bold text-xs text-slate-800">4 Active Relationship Connections</span>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Map New Connection</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">From Relative</th>
                <th className="px-6 py-3.5">Relationship Type</th>
                <th className="px-6 py-3.5">To Relative</th>
                <th className="px-6 py-3.5">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {relationships.map((rel) => (
                <tr key={rel.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{rel.from}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                      <GitMerge className="h-3.5 w-3.5" />
                      {rel.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{rel.to}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="h-4 w-4" />
                      {rel.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
