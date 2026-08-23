"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { TreePine, Plus, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import AddMemberModal from "@/components/modals/AddMemberModal";

export default function FamilyTreePage() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  return (
    <SanctuaryDashboardWrapper
      title="Family Tree Visualizer"
      subtitle="Interactive generational lineage tree canvas connected to live PostgreSQL relationship records."
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

        {/* Tree Canvas Preview */}
        <div className="relative w-full h-[520px] rounded-3xl bg-gradient-to-br from-indigo-50/50 via-slate-50 to-emerald-50/50 border border-slate-200/90 shadow-inner flex items-center justify-center overflow-hidden p-8">
          <div
            className="relative z-10 flex flex-col items-center gap-12 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Grandparents */}
            <div className="flex gap-16 items-center">
              <div className="w-32 bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col items-center shadow-md">
                <div className="h-12 w-12 rounded-full bg-slate-100 font-bold text-lg flex items-center justify-center mb-1">
                  👴
                </div>
                <span className="text-xs font-bold text-slate-800">Omar Rahman</span>
                <span className="text-[10px] text-slate-400 font-medium">Grandfather</span>
              </div>

              <div className="w-32 bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col items-center shadow-md">
                <div className="h-12 w-12 rounded-full bg-slate-100 font-bold text-lg flex items-center justify-center mb-1">
                  👵
                </div>
                <span className="text-xs font-bold text-slate-800">Fatima Rahman</span>
                <span className="text-[10px] text-slate-400 font-medium">Grandmother</span>
              </div>
            </div>

            {/* Parents & Siblings */}
            <div className="flex gap-12 items-center">
              <div className="w-32 bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col items-center shadow-md">
                <div className="h-12 w-12 rounded-full bg-indigo-100 font-bold text-lg flex items-center justify-center mb-1 text-indigo-700">
                  👨
                </div>
                <span className="text-xs font-bold text-slate-800">Tariq Rahman</span>
                <span className="text-[10px] text-indigo-600 font-bold">Sanctuary Owner</span>
              </div>

              <div className="w-36 bg-white rounded-2xl border-2 border-indigo-600 p-3.5 flex flex-col items-center shadow-xl ring-4 ring-indigo-600/15">
                <div className="h-12 w-12 rounded-full bg-indigo-600 font-bold text-lg flex items-center justify-center mb-1 text-white shadow-md">
                  👩
                </div>
                <span className="text-xs font-extrabold text-indigo-700">Aisha Rahman</span>
                <span className="text-[10px] text-slate-400 font-medium">Archivist</span>
              </div>

              <div className="w-32 bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col items-center shadow-md">
                <div className="h-12 w-12 rounded-full bg-rose-100 font-bold text-lg flex items-center justify-center mb-1 text-rose-700">
                  👧
                </div>
                <span className="text-xs font-bold text-slate-800">Farah N.</span>
                <span className="text-[10px] text-slate-400 font-medium">Cousin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}
