"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetMemoriesQuery } from "@/redux/api/familyApi";
<<<<<<< HEAD
import { Image as ImageIcon, Plus, Heart, Sparkles, Loader2, SlidersHorizontal } from "lucide-react";
import AddMemoryModal from "@/components/modals/AddMemoryModal";
import MediaSliderCarousel from "@/components/memories/MediaSliderCarousel";
import MediaLightboxModal from "@/components/modals/MediaLightboxModal";
=======
import { Image as ImageIcon, Plus, Heart, Sparkles, Loader2 } from "lucide-react";
import AddMemoryModal from "@/components/modals/AddMemoryModal";
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3

export default function MemoriesPage() {
  const { data: memories = [], isLoading } = useGetMemoriesQuery();
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
<<<<<<< HEAD
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
=======
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3

  return (
    <SanctuaryDashboardWrapper
      title="Family Memories Vault"
      subtitle="Shared media gallery, milestone stories, and photo archives stored in PostgreSQL."
    >
<<<<<<< HEAD
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
=======
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-xs text-slate-800">
              {memories.length} Memories Archived
            </span>
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
          </div>

          <button
            type="button"
            onClick={() => setIsAddMemoryOpen(true)}
<<<<<<< HEAD
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
=======
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
          >
            <Plus className="h-4 w-4" />
            <span>Upload Memory</span>
          </button>
        </div>

<<<<<<< HEAD
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
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
                        Click to View
                      </span>
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
                      <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddMemoryModal isOpen={isAddMemoryOpen} onClose={() => setIsAddMemoryOpen(false)} />
      <MediaLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        memories={memories}
        currentIndex={lightboxIndex}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
=======
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
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
    </SanctuaryDashboardWrapper>
  );
}
