"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { Plus, Move, Link2, Sparkles, Users, Layers, ShieldCheck, Heart } from "lucide-react";
import AddMemberModal from "@/components/modals/AddMemberModal";
import InteractiveFamilyTreeCanvas from "@/components/tree/InteractiveFamilyTreeCanvas";
import { useGetMembersQuery, useGetRelationshipsQuery } from "@/redux/api/familyApi";

export default function FamilyTreePage() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { data: members = [] } = useGetMembersQuery();
  const { data: relationships = [] } = useGetRelationshipsQuery();

  return (
    <SanctuaryDashboardWrapper
      title="Family Tree 2D Canvas Visualizer"
      subtitle="Interactive 2D canvas occupying the full screen view. Scroll down to explore relationship details and member directory."
    >
      <div className="space-y-10 pb-12">
        {/* Top Header Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Full Page Interactive Lineage Canvas</span>
            </h3>
            <p className="text-xs text-slate-500">
              Drag node cards freely across the screen grid. Scroll down to inspect connected family members.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Relative</span>
          </button>
        </div>

        {/* 1. Full Page Hero 2D Canvas Section */}
        <div className="w-full">
          <InteractiveFamilyTreeCanvas />
        </div>

        {/* 2. Scrollable Lower Section: Quick Stats & Instructions */}
        <div className="pt-6 border-t border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Sanctuary Lineage Overview</h3>
              <p className="text-xs text-slate-500">Summary statistics & guide for canvas node management.</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs">
              {members.length} Members • {relationships.length} Active Links
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Move className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">1. Drag & Position Nodes</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click and drag any relative node card with your mouse. Node positions auto-save to browser memory & database.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Link2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">2. Drag Handles to Connect</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag glowing indigo connector dots between relative nodes to draw live SVG relationship lines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">3. PostgreSQL Persistence</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                All created nodes and relationship links persist securely in your PostgreSQL database sanctuary.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Scrollable Lower Section: Relative Directory Cards */}
        {members.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Sanctuary Relatives Directory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3"
                >
                  <div
                    className={`h-10 w-10 rounded-full font-bold text-base flex items-center justify-center shrink-0 ${
                      m.gender === "FEMALE" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {m.gender === "FEMALE" ? "👩" : "👨"}
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {m.firstName} {m.lastName}
                    </h5>
                    <span className="text-[11px] text-slate-400 font-medium block truncate">
                      {m.bio || m.gender || "Relative Member"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}
