"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  MapPin,
  Tag,
  Users,
  Film,
  Download,
  Share2,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { MemoryRecord } from "@/redux/api/familyApi";
import { parseMediaUrls, isVideoUrl } from "@/utils/mediaUtils";

interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryRecord[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export default function MediaLightboxModal({
  isOpen,
  onClose,
  memories,
  currentIndex,
  onNavigate,
}: MediaLightboxModalProps) {
  const [subIndex, setSubIndex] = useState(0);

  useEffect(() => {
    setSubIndex(0);
  }, [currentIndex, isOpen]);

  if (!isOpen || memories.length === 0) return null;

  const currentMem = memories[currentIndex] || memories[0];

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + memories.length) % memories.length);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % memories.length);
  };

  // Sample curated fallback images for demonstration
  const sampleImages = [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542037104857-ffbb0b9152fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  ];

  const mediaList = parseMediaUrls(currentMem.mediaUrl);
  const activeList =
    mediaList.length > 0
      ? mediaList
      : [sampleImages[currentIndex % sampleImages.length]];

  const safeSubIndex = Math.min(subIndex, activeList.length - 1);
  const currentMedia = activeList[safeSubIndex] || activeList[0];
  const isVid = isVideoUrl(currentMedia);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fadeIn p-4 sm:p-6 overflow-hidden">
      {/* Top Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/20">
            Memory {currentIndex + 1} of {memories.length}
          </span>
          <span className="text-xs text-slate-300 font-semibold hidden sm:inline-block">
            {currentMem.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert(`Sharing link copied for ${currentMem.title}`)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Share Memory"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Close Lightbox"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Lightbox Content Area */}
      <div className="w-full max-w-5xl h-[85vh] flex flex-col md:flex-row items-center bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 relative">
        {/* Memory Item Navigation Left/Right */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md shadow-lg transition-transform hover:scale-110 cursor-pointer"
          title="Previous Memory"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 md:right-[380px] top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md shadow-lg transition-transform hover:scale-110 cursor-pointer"
          title="Next Memory"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Media Preview Container */}
        <div className="w-full md:w-3/5 h-full bg-black flex items-center justify-center relative overflow-hidden group p-2">
          {/* Main Photo / Video Media View */}
          {isVid ? (
            <video
              src={currentMedia}
              controls
              autoPlay
              playsInline
              className="w-full h-full max-h-[75vh] md:max-h-full object-contain rounded-2xl"
            />
          ) : (
            <img
              src={currentMedia}
              alt={currentMem.title}
              className="w-full h-full object-contain max-h-[75vh] md:max-h-full rounded-2xl transition-all duration-300"
            />
          )}

          {/* Bottom Overlay Info & Sub-Media File Tabs */}
          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-2">
              {isVid ? (
                <>
                  <Video className="h-4 w-4 text-purple-400" />
                  <span>Playing Video ({safeSubIndex + 1}/{activeList.length})</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 text-emerald-400" />
                  <span>Viewing Photo ({safeSubIndex + 1}/{activeList.length})</span>
                </>
              )}
            </div>

            {/* Sub Media File Buttons if memory contains multiple items */}
            {activeList.length > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl pointer-events-auto overflow-x-auto max-w-[240px]">
                {activeList.map((item, idx) => {
                  const itemIsVid = isVideoUrl(item);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSubIndex(idx)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                        safeSubIndex === idx
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      }`}
                    >
                      {itemIsVid ? "📹" : "📷"} #{idx + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="w-full md:w-2/5 h-full p-6 bg-stone-900 text-white overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Title & Category */}
            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase tracking-wider inline-block">
                {currentMem.category || "Memory Milestone"}
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                {currentMem.title}
              </h2>
            </div>

            {/* Uploader Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-800/70 border border-stone-700/60">
              <div className="h-10 w-10 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Uploaded By</span>
                <span className="text-xs font-extrabold text-white">{currentMem.sharedBy || "Sanctuary Owner"}</span>
              </div>
            </div>

            {/* Memory Metadata Badges */}
            <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                <span>Date: {currentMem.date || (currentMem.createdAt ? new Date(currentMem.createdAt).toLocaleDateString() : "2026 Milestone")}</span>
              </div>
              {currentMem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Location: {currentMem.location}</span>
                </div>
              )}
              {currentMem.taggedMembers && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Tagged: {currentMem.taggedMembers}</span>
                </div>
              )}
              {activeList.length > 1 && (
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Total Files Attached: {activeList.length}</span>
                </div>
              )}
            </div>

            {/* Description / Story */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Memory Story & Notes</h4>
              <p className="text-xs text-stone-300 leading-relaxed font-normal bg-stone-800/40 p-3.5 rounded-2xl border border-stone-800">
                {currentMem.description || "Milestone memory preserved in your family sanctuary database."}
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all text-center cursor-pointer"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
