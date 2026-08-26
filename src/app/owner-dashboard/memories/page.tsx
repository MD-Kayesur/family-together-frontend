"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetMemoriesQuery } from "@/redux/api/familyApi";
import { Image as ImageIcon, Plus, Heart, Sparkles, Loader2 } from "lucide-react";
import AddMemoryModal from "@/components/modals/AddMemoryModal";

export default function MemoriesPage() {
  const { data: memories = [], isLoading } = useGetMemoriesQuery();
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);

  return (
    <SanctuaryDashboardWrapper
      title="Family Memories Vault"
      subtitle="Shared media gallery, milestone stories, and photo archives stored in PostgreSQL."
    >
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-xs text-slate-800">
              {memories.length} Memories Archived
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddMemoryOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Memory</span>
          </button>
        </div>

        {/* Memories Grid */}
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <span>Loading family memories from database...</span>
          </div>
        ) : memories.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <ImageIcon className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No memories uploaded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Preserve your first family photo or story in your private sanctuary archive.
            </p>
            <button
              type="button"
              onClick={() => setIsAddMemoryOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
            >
              + Upload Memory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
              >
                <div className="h-44 rounded-2xl bg-gradient-to-tr from-purple-100 via-indigo-50 to-amber-50 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform">📸</span>
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
                    {mem.photoCount || 1} photos
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                    {mem.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {mem.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Shared by {mem.sharedBy || "Family Member"}</span>
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMemoryModal isOpen={isAddMemoryOpen} onClose={() => setIsAddMemoryOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}
