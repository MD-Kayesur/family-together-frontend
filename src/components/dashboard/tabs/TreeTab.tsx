"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Move, Link2, Sparkles, Users, Layers, ShieldCheck, Heart, TreePine, Download, Upload, FileCode, Loader2, CheckCircle2 } from "lucide-react";
import InteractiveFamilyTreeCanvas from "@/components/tree/InteractiveFamilyTreeCanvas";
import LandingFamilyTreeCanvas from "@/components/tree/LandingFamilyTreeCanvas";
import {
  useGetMembersQuery,
  useGetRelationshipsQuery,
  useLazyExportGedcomQuery,
  useImportGedcomMutation,
} from "@/redux/api/familyApi";
import { useAppSelector } from "@/redux/store";

interface TreeTabProps {
  role?: string;
  currentUserId?: string;
}

export default function TreeTab({ role, currentUserId }: TreeTabProps) {
  const router = useRouter();
  const [canvasMode, setCanvasMode] = useState<"LANDING" | "DB">("LANDING");
  const { data: members = [], refetch: refetchMembers } = useGetMembersQuery({ paginate: false });
  const { data: relationships = [], refetch: refetchRelationships } = useGetRelationshipsQuery({ paginate: false });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [triggerExportGedcom, { isFetching: isExportingGedcom }] = useLazyExportGedcomQuery();
  const [importGedcomMutation, { isLoading: isImportingGedcom }] = useImportGedcomMutation();
  const [gedcomStatus, setGedcomStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleExportGedcom = async () => {
    try {
      setGedcomStatus(null);
      const res = await triggerExportGedcom({ userId: activeUserId }).unwrap();
      if (res?.gedcom) {
        const blob = new Blob([res.gedcom], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = res.filename || "family_tree.ged";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setGedcomStatus({
          type: "success",
          message: `GEDCOM 5.5.1 exported successfully (${res.totalPersons} relatives, ${res.totalRelationships} relationships)`,
        });
      }
    } catch (err: any) {
      console.error("GEDCOM Export error:", err);
      setGedcomStatus({ type: "error", message: err?.data?.message || "Failed to export GEDCOM" });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setGedcomStatus(null);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        if (!content) return;
        try {
          const res = await importGedcomMutation({
            gedcom: content,
            userId: activeUserId,
          }).unwrap();
          setGedcomStatus({
            type: "success",
            message: res.message || `Imported ${res.importedPersons} relatives and ${res.importedRelationships} relationships.`,
          });
          refetchMembers();
          refetchRelationships();
        } catch (apiErr: any) {
          setGedcomStatus({
            type: "error",
            message: apiErr?.data?.message || "Failed to parse and import GEDCOM data.",
          });
        }
      };
      reader.readAsText(file);
    } catch (err: any) {
      setGedcomStatus({ type: "error", message: err?.message || "Error reading file" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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

          {/* GEDCOM 5.5.1 Import / Export Tools */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".ged,.gedcom"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={isImportingGedcom}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
              title="Import lineage from standard GEDCOM 5.5.1 file"
            >
              {isImportingGedcom ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5 text-indigo-400" />
              )}
              <span>Import GEDCOM</span>
            </button>

            <button
              type="button"
              disabled={isExportingGedcom}
              onClick={handleExportGedcom}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
              title="Export complete family tree as standard GEDCOM 5.5.1 file"
            >
              {isExportingGedcom ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span>Export GEDCOM</span>
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

      {/* GEDCOM Status Alert */}
      {gedcomStatus && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            gedcomStatus.type === "success"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
              : "bg-rose-950/40 border-rose-800 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {gedcomStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{gedcomStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setGedcomStatus(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-3 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

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
          <InteractiveFamilyTreeCanvas role={role} currentUserId={currentUserId} scope="all" />
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
