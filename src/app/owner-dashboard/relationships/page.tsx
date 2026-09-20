"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetRelationshipsQuery } from "@/redux/api/familyApi";
import { Heart, Plus, GitMerge, ShieldCheck, Loader2 } from "lucide-react";

export default function RelationshipsPage() {
  const { data: relationships = [], isLoading } = useGetRelationshipsQuery();

  return (
    <SanctuaryDashboardWrapper
      title="Family Relationships Matrix"
      subtitle="View biological and marital connection nodes mapped across generations live from PostgreSQL."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-400" />
            <span className="font-bold text-xs text-white">
              {relationships.length} Active Relationship Connections
            </span>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Map New Connection</span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            <span>Loading relationships matrix from database...</span>
          </div>
        ) : relationships.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <Heart className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-white">No relationships mapped</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Map family ties between parents, children, spouses, and siblings.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">From Relative</th>
                  <th className="px-6 py-3.5">Relationship Type</th>
                  <th className="px-6 py-3.5">To Relative</th>
                  <th className="px-6 py-3.5">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {relationships.map((rel) => (
                  <tr key={rel.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{rel.from || "Relative A"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-[11px]">
                        <GitMerge className="h-3.5 w-3.5" />
                        {rel.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{rel.to || "Relative B"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <ShieldCheck className="h-4 w-4" />
                        {rel.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SanctuaryDashboardWrapper>
  );
}

