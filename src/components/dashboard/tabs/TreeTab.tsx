"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Move, Link2, Sparkles, Users, Layers, ShieldCheck, Heart, TreePine } from "lucide-react";
import InteractiveFamilyTreeCanvas from "@/components/tree/InteractiveFamilyTreeCanvas";
import LandingFamilyTreeCanvas from "@/components/tree/LandingFamilyTreeCanvas";
import { useGetMembersQuery, useGetRelationshipsQuery } from "@/redux/api/familyApi";
import { useAppSelector } from "@/redux/store";

interface TreeTabProps {
  role?: string;
  currentUserId?: string;
}

export default function TreeTab({ role, currentUserId }: TreeTabProps) {
  const router = useRouter();
  const [canvasMode, setCanvasMode] = useState<"LANDING" | "DB">("LANDING");
  const { data: members = [], refetch: refetchMembers } = useGetMembersQuery();
  const { data: relationships = [], refetch: refetchRelationships } = useGetRelationshipsQuery();

  const { user } = useAppSelector((state) => state.auth);
  const activeUserId = currentUserId || user?.id;
  const activeUserEmail = user?.email;

  const currentMember = members.find(
    (m: any) =>
      (activeUserId && (m.userId === activeUserId || m.user?.id === activeUserId)) ||
      (activeUserEmail &&
        (m.email?.toLowerCase() === activeUserEmail.toLowerCase() ||
          m.user?.email?.toLowerCase() === activeUserEmail.toLowerCase()))
  );

  const handleAddRelative = () => {
    const targetBase =
      role === "MEMBER" ? "/user-dashboard" : "/owner-dashboard";
    const params = new URLSearchParams();
    params.set("tab", "tree");
    params.set("action", "create");
    if (currentMember?.id) {
      params.set("relativeTo", currentMember.id);
    }
    if (currentMember) {
      params.set(
        "relativeToName",
        `${currentMember.firstName} ${currentMember.lastName}`
      );
    }
    params.set("from", "tree");
    const qs = params.toString();
    router.push(`${targetBase}?${qs}`);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>
              {role === "MEMBER" ? "Your Personal Family Tree Canvas" : "Interactive Family Tree Lineage Canvas"}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {role === "MEMBER"
              ? "Explore your family lineage, ancestors, descendants, and relatives. Click and drag nodes freely."
              : "Drag node cards freely across the screen grid. Zoom, pan, and draw live relationship links."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Canvas Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setCanvasMode("LANDING")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                canvasMode === "LANDING"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Interactive 2D Canvas
            </button>
            <button
              type="button"
              onClick={() => setCanvasMode("DB")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                canvasMode === "DB"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Database Sync Canvas
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddRelative}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Relative</span>
          </button>
        </div>
      </div>

      {/* 1. Full Page Hero 2D Canvas Section */}
      <div className="w-full">
        {canvasMode === "LANDING" ? (
          <div className="w-full h-[480px] sm:h-[580px] lg:h-[720px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-950">
            <LandingFamilyTreeCanvas
              variant="fullscreen"
              readOnly={false}
              useDatabaseData={true}
              storageKey="owner_sanctuary_db_tree"
            />
          </div>
        ) : (
          <InteractiveFamilyTreeCanvas role={role} currentUserId={currentUserId} />
        )}
      </div>

      {/* 2. Scrollable Lower Section: Quick Stats & Instructions */}
      <div className="pt-6 border-t border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">Sanctuary Lineage Overview</h3>
            <p className="text-xs text-slate-400">Summary statistics & guide for canvas node management.</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 font-bold text-xs">
            {members.length} Members • {relationships.length} Active Links
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 flex items-center justify-center">
              <Move className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-white">1. Drag & Position Nodes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click and drag any relative node card with your mouse. Node positions auto-save to browser memory & database.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 flex items-center justify-center">
              <Link2 className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-white">2. Drag Handles to Connect</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag glowing indigo connector dots between relative nodes to draw live SVG relationship lines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-white">3. PostgreSQL Persistence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All created nodes and relationship links persist securely in your PostgreSQL database sanctuary.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Scrollable Lower Section: Relative Directory Cards */}
      {members.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-white text-base">Sanctuary Relatives Directory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-3"
              >
                <div
                  className={`h-10 w-10 rounded-full font-bold text-base flex items-center justify-center shrink-0 ${
                    m.gender === "FEMALE" ? "bg-rose-950/80 text-rose-300 border border-rose-800/60" : "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
                  }`}
                >
                  {m.gender === "FEMALE" ? "👩" : "👨"}
                </div>
                <div className="overflow-hidden">
                  <h5 className="font-bold text-xs text-white truncate">
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
  );
}
