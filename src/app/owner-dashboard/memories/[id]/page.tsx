"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetMemoryByIdQuery } from "@/redux/api/familyApi";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Users,
  Film,
  Image as ImageIcon,
  UserCheck,
  Pencil,
  Loader2,
  Sparkles,
  Lock,
  Share2,
} from "lucide-react";

export default function MemoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memoryId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const { data: memory, isLoading, error } = useGetMemoryByIdQuery(memoryId, {
    skip: !memoryId,
  });

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542037104857-ffbb0b9152fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
  ];

  if (isLoading) {
    return (
      <SanctuaryDashboardWrapper
        title="Family Memory Details"
        subtitle="Loading preserved milestone memory from the database archive..."
      >
        <div className="p-16 text-center bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center gap-3 text-slate-400 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          <span>Fetching memory details...</span>
        </div>
      </SanctuaryDashboardWrapper>
    );
  }

  if (error || !memory) {
    return (
      <SanctuaryDashboardWrapper
        title="Memory Not Found"
        subtitle="The requested memory could not be located in your sanctuary vault."
      >
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-sm font-semibold text-slate-300">
            This memory may have been removed or does not exist.
          </p>
          <Link
            href="/owner-dashboard/memories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Memories Vault</span>
          </Link>
        </div>
      </SanctuaryDashboardWrapper>
    );
  }

  // Parse media list
  const mediaList: string[] =
    memory.mediaUrls && memory.mediaUrls.length > 0
      ? memory.mediaUrls
      : memory.mediaUrl && memory.mediaUrl.startsWith("http")
      ? [memory.mediaUrl]
      : fallbackImages;

  const activeMediaUrl = mediaList[activeMediaIndex] || mediaList[0];
  const isVideo =
    activeMediaUrl.startsWith("data:video/") ||
    activeMediaUrl.endsWith(".mp4") ||
    activeMediaUrl.endsWith(".mov") ||
    activeMediaUrl.endsWith(".webm");

  // Parse metadata from description if present
  let cleanDescription = memory.description || "No description provided.";
  let extractedCategory = "Reunion & Gathering";
  let extractedDate = "";
  let extractedLocation = "";
  let extractedTagged: string[] = [];
  let extractedPrivacy = "Entire Family Sanctuary";

  if (memory.description && memory.description.includes("Category:")) {
    const parts = memory.description.split("\n\n");
    const metaLine = parts[0];

    const catMatch = metaLine.match(/Category:\s*([^•\n]+)/);
    if (catMatch) extractedCategory = catMatch[1].trim();

    const dateMatch = metaLine.match(/Date:\s*([^•\n]+)/);
    if (dateMatch) extractedDate = dateMatch[1].trim();

    const locMatch = metaLine.match(/Location:\s*([^•\n]+)/);
    if (locMatch) extractedLocation = locMatch[1].trim();

    const tagMatch = metaLine.match(/Tagged:\s*([^•\n]+)/);
    if (tagMatch) {
      extractedTagged = tagMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
    }

    const privMatch = metaLine.match(/Privacy:\s*([^•\n]+)/);
    if (privMatch) extractedPrivacy = privMatch[1].trim();

    cleanDescription = parts.slice(1).join("\n\n").trim() || "Milestone memory preserved in database.";
  }

  return (
    <SanctuaryDashboardWrapper
      title={memory.title}
      subtitle={`Preserved family memory with ${mediaList.length} media file(s).`}
    >
      <div className="space-y-6 pb-16">
        {/* Navigation Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/owner-dashboard/memories"
              className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
              title="Back to Memories"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-lg sm:text-xl leading-tight">
                  {memory.title}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-purple-950/60 text-purple-300 border border-purple-800/60">
                  {mediaList.length} Media File{mediaList.length > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Uploaded by {memory.sharedBy || "Sanctuary Owner"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/owner-dashboard/memories/create?id=${memory.id}`}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Memory</span>
            </Link>
          </div>
        </div>

        {/* Main Details & Media Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Media Player & Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Active Media Card */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative aspect-video sm:aspect-4/3 flex items-center justify-center group">
              {isVideo ? (
                <video
                  src={activeMediaUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeMediaUrl}
                  alt={memory.title}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Media Type Badge */}
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 z-20">
                {isVideo ? (
                  <>
                    <Film className="h-4 w-4 text-amber-400" />
                    <span>Video (Autoplaying)</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 text-purple-400" />
                    <span>Photo {activeMediaIndex + 1} of {mediaList.length}</span>
                  </>
                )}
              </div>
            </div>

            {/* Multiple Media Thumbnails Carousel Strip */}
            {mediaList.length > 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white px-1">
                  <span>Attached Media Files ({mediaList.length})</span>
                  <span className="text-[11px] text-slate-400 font-medium">Click thumbnail to view</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {mediaList.map((url, idx) => {
                    const isThumbVideo =
                      url.startsWith("data:video/") ||
                      url.endsWith(".mp4") ||
                      url.endsWith(".mov") ||
                      url.endsWith(".webm");

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`relative h-16 w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeMediaIndex === idx
                            ? "border-purple-500 scale-105 shadow-md shadow-purple-600/30"
                            : "border-slate-800 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {isThumbVideo ? (
                          <video src={url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded">
                          #{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right / Story & Metadata Information (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Story & Description Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Sparkles className="h-4 w-4" />
                <span>Memory Milestone Story</span>
              </div>

              <h3 className="font-extrabold text-white text-xl leading-snug">
                {memory.title}
              </h3>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                {cleanDescription}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
                  <Tag className="h-4 w-4 text-purple-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
                    <span className="text-xs font-bold text-white truncate block">{extractedCategory}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Date</span>
                    <span className="text-xs font-bold text-white truncate block">
                      {extractedDate || (memory.createdAt ? new Date(memory.createdAt).toLocaleDateString() : "Milestone")}
                    </span>
                  </div>
                </div>

                {extractedLocation && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                      <span className="text-xs font-bold text-white truncate block">{extractedLocation}</span>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
                  <Lock className="h-4 w-4 text-indigo-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Visibility</span>
                    <span className="text-xs font-bold text-white truncate block">{extractedPrivacy}</span>
                  </div>
                </div>
              </div>

              {/* Tagged Relatives */}
              {extractedTagged.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-purple-400" />
                    <span>Tagged Relatives ({extractedTagged.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedTagged.map((name, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-purple-950/50 text-purple-300 border border-purple-800/60 text-xs font-bold"
                      >
                        @{name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploader Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-purple-400" />
                  <span>Shared by <strong className="text-white">{memory.sharedBy || "Sanctuary Owner"}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
