"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetMembersQuery } from "@/redux/api/familyApi";
import { TreePine, Plus, ZoomIn, ZoomOut, RotateCcw, Loader2 } from "lucide-react";
import AddMemberModal from "@/components/modals/AddMemberModal";

export default function FamilyTreePage() {
  const { data: members = [], isLoading } = useGetMembersQuery();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  return (
    <SanctuaryDashboardWrapper
      title="Family Tree Visualizer"
      subtitle="Interactive generational lineage tree canvas connected live to your PostgreSQL sanctuary records."
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <ZoomIn className="h-4 w-4" />
              <span>Zoom In</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <ZoomOut className="h-4 w-4" />
              <span>Zoom Out</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset ({zoomLevel}%)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Relative</span>
          </button>
        </div>

        {/* Dynamic Tree Canvas */}
        <div className="relative w-full min-h-[520px] rounded-3xl bg-gradient-to-br from-indigo-50/50 via-slate-50 to-emerald-50/50 border border-slate-200/90 shadow-inner flex items-center justify-center overflow-hidden p-8">
          {isLoading ? (
            <div className="flex items-center gap-3 text-indigo-600 font-semibold text-sm">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Rendering tree nodes from PostgreSQL...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center space-y-3">
              <TreePine className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">Tree canvas empty</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Add your first relative to populate your family lineage graph.
              </p>
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                + Add Relative
              </button>
            </div>
          ) : (
            <div
              className="relative z-10 flex flex-wrap gap-8 items-center justify-center max-w-4xl transition-transform duration-300 p-4"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {members.map((m, idx) => (
                <div
                  key={m.id}
                  className={`w-36 bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-md transition-all hover:scale-105 ${
                    idx === 0 ? "border-2 border-indigo-600 shadow-indigo-600/15" : "border border-slate-200"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-full font-bold text-lg flex items-center justify-center mb-1 shadow-sm ${
                      m.gender === "FEMALE"
                        ? "bg-rose-100 text-rose-700"
                        : m.gender === "MALE"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {m.gender === "FEMALE" ? "👩" : m.gender === "MALE" ? "👨" : "👤"}
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 truncate w-full">
                    {m.firstName} {m.lastName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">
                    {m.bio || m.gender || "Family Member"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}

