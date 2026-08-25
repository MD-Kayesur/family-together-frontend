"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { Plus } from "lucide-react";
import AddMemberModal from "@/components/modals/AddMemberModal";
import InteractiveFamilyTreeCanvas from "@/components/tree/InteractiveFamilyTreeCanvas";

export default function FamilyTreePage() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  return (
    <SanctuaryDashboardWrapper
      title="Family Tree 2D Canvas Visualizer"
      subtitle="Drag relative node cards to position them freely. Toggle link mode to connect family lines manually with persistence."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-slate-900 text-sm">Interactive Lineage Canvas</h3>
            <p className="text-xs text-slate-500">
              Drag nodes with mouse pointer, click &quot;Connect Links&quot; to link relatives, and layout will auto-save.
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

        {/* 2D Drag & Connect Canvas */}
        <InteractiveFamilyTreeCanvas />
      </div>

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}


