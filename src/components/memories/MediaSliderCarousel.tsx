"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Maximize2, Sparkles, Heart } from "lucide-react";
import { MemoryRecord } from "@/redux/api/familyApi";
import MediaLightboxModal from "@/components/modals/MediaLightboxModal";

interface MediaSliderCarouselProps {
  memories: MemoryRecord[];
}

export default function MediaSliderCarousel({ memories }: MediaSliderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  if (memories.length === 0) return null;

  // Sample curated fallback images
  const sampleImages = [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542037104857-ffbb0b9152fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Slider Carousel Container */}
      <div className="relative group p-1">
        {/* Navigation Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-md shadow-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
          title="Previous Slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Navigation Right Arrow */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-md shadow-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Cards Carousel Viewport */}
        <div ref={containerRef} className="overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {memories.map((mem, idx) => {
              const displayImg =
                mem.mediaUrl && mem.mediaUrl.startsWith("http")
                  ? mem.mediaUrl
                  : sampleImages[idx % sampleImages.length];

              return (
                <div
                  key={mem.id || idx}
                  className="w-full shrink-0 px-2 cursor-pointer"
                  onClick={() => handleOpenLightbox(idx)}
                >
                  <div className="h-64 sm:h-80 w-full rounded-3xl overflow-hidden relative border border-slate-200/80 shadow-md group/card">
                    {/* Background Image */}
                    <img
                      src={displayImg}
                      alt={mem.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-md text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                        <span>Owner Media #{idx + 1}</span>
                      </span>

                      <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-md hover:bg-white/30 transition-colors">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Bottom Info Content */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 text-white space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-purple-300">
                        <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
                        <span>Shared by {mem.sharedBy || "Sanctuary Owner"}</span>
                      </div>

                      <h3 className="font-extrabold text-lg sm:text-xl tracking-tight leading-snug truncate">
                        {mem.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-1 font-normal">
                        {mem.description || "Preserved in family sanctuary archive."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-3">
          {memories.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? "w-8 bg-purple-600 shadow-md shadow-purple-600/30"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
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
    </div>
  );
}
