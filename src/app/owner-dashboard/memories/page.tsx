"use client";

import React, { useState } from "react";
import Link from "next/link";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetMemoriesQuery, useDeleteMemoryMutation } from "@/redux/api/familyApi";
import { Image as ImageIcon, Plus, Heart, Sparkles, Loader2, SlidersHorizontal, Pencil, Trash2 } from "lucide-react";
import MediaSliderCarousel from "@/components/memories/MediaSliderCarousel";
import MediaLightboxModal from "@/components/modals/MediaLightboxModal";

export default function MemoriesPage() {
  const { data: memories = [], isLoading } = useGetMemoriesQuery();
  const [deleteMemory] = useDeleteMemoryMutation();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sampleImages = [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542037104857-ffbb0b9152fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleDeleteMemory = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMemory(id).unwrap();
      } catch (err) {
        console.error("Failed to delete memory:", err);
      }
    }
  };

  return (
    <SanctuaryDashboardWrapper
      title="Family Memories Vault"
      subtitle="Shared media gallery, milestone stories, and photo archives stored in PostgreSQL."
    >
      <div className="space-y-8 pb-12">
        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Owner Media Vault</h3>
              <p className="text-xs text-slate-500 font-medium">
                {memories.length} Memories & Milestone Media Items Preserved
              </p>
            </div>
          </div>

          <Link
            href="/owner-dashboard/memories/create"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Memory</span>
          </Link>
        </div>

        {/* 1. Featured Media Slider Carousel Section */}
        {!isLoading && memories.length > 0 && (
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-purple-400" />
                <h3 className="font-extrabold text-base text-white">Interactive Owner Media Slider</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Swipe / Click card to preview</span>
            </div>

            <MediaSliderCarousel memories={memories} />
          </div>
        )}

        {/* 2. All Memories Gallery Grid */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg">All Family Memories</h3>

          {isLoading ? (
            <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm bg-white rounded-3xl border border-slate-200">
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
              <Link
                href="/owner-dashboard/memories/create"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Memory</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((mem, idx) => {
                const displayImg =
                  mem.mediaUrl && mem.mediaUrl.startsWith("http")
                    ? mem.mediaUrl
                    : sampleImages[idx % sampleImages.length];

                return (
                  <div
                    key={mem.id || idx}
                    onClick={() => handleOpenLightbox(idx)}
                    className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="h-48 rounded-2xl overflow-hidden relative border border-slate-100">
                      <img
                        src={displayImg}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
                          Click to View
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-base leading-tight truncate">
                        {mem.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {mem.description || "No description provided."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                      <span>Shared by {mem.sharedBy || "Sanctuary Owner"}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/owner-dashboard/memories/create?id=${mem.id}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 border border-slate-200 transition-colors"
                            title="Edit Memory"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteMemory(e, mem.id, mem.title)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                            title="Delete Memory"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500 ml-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <MediaLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        memories={memories}
        currentIndex={lightboxIndex}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </SanctuaryDashboardWrapper>
  );
}
