"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCode,
  Lock,
} from "lucide-react";
import { DocumentRecord } from "@/redux/api/familyApi";

interface PdfViewportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentRecord | null;
}

export default function PdfViewportModal({
  isOpen,
  onClose,
  document,
}: PdfViewportModalProps) {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !document) return null;

  // Curated PDF sample view URL or fallback blob PDF
  const samplePdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fadeIn p-3 sm:p-6 overflow-hidden">
      <div className="bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-3xl w-full max-w-5xl h-[88vh] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Viewport Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white truncate max-w-xs sm:max-w-md">
                  {document.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Encrypted
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Category: {document.category || "Vault Document"} • {document.size || "2.5 MB"}
              </p>
            </div>
          </div>

          {/* Viewport Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700 text-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="font-bold text-slate-200 px-1 min-w-[42px] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert(`Printing document: ${document.name}`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer hidden sm:flex"
              title="Print PDF"
            >
              <Printer className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => alert(`Downloading PDF document: ${document.name}`)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
              title="Close Viewport"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewport Render Area */}
        <div className="flex-1 bg-slate-100 dark:bg-stone-950 p-4 sm:p-6 overflow-auto flex items-center justify-center relative">
          <div
            className="w-full h-full max-w-4xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-stone-800 overflow-hidden flex flex-col transition-all duration-300"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            {/* Native Iframe PDF Viewer / Preview Canvas */}
            <iframe
              src={`${samplePdfUrl}#toolbar=0`}
              title={document.name}
              className="w-full h-full min-h-[600px] border-none"
            />
          </div>
        </div>

        {/* Viewport Bottom Status Bar */}
        <div className="px-5 py-2.5 bg-slate-900 text-slate-400 text-xs flex items-center justify-between border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">Sanctuary Vault Access • Logged as Sanctuary Owner</span>
          </div>

          <span className="text-[11px] font-bold text-indigo-400">PDF Viewport Active</span>
        </div>
      </div>
    </div>
  );
}
