"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  Lock,
} from "lucide-react";
import { DocumentRecord, DocumentFileAttachment } from "@/redux/api/familyApi";

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
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // Reset active file index when document changes
  useEffect(() => {
    setActiveFileIndex(0);
    setZoomLevel(100);
  }, [document?.id]);

  if (!isOpen || !document) return null;

  // Curated PDF sample view URL or fallback blob PDF
  const samplePdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  // Resolve all attached files
  const files: DocumentFileAttachment[] =
    Array.isArray(document.files) && document.files.length > 0
      ? document.files
      : Array.isArray(document.fileUrls) && document.fileUrls.length > 0
      ? document.fileUrls.map((u, i) => ({
          name: `${document.name} (File ${i + 1})`,
          size: document.size,
          fileUrl: u,
        }))
      : [
          {
            name: document.name,
            size: document.size,
            fileUrl: document.fileUrl || samplePdfUrl,
          },
        ];

  const activeFile = files[activeFileIndex] || files[0];
  const activeUrl = activeFile.fileUrl || samplePdfUrl;

  const isImage =
    activeUrl.startsWith("data:image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(activeFile.name) ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(activeUrl);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));

  const handlePrevFile = () => {
    setActiveFileIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextFile = () => {
    setActiveFileIndex((prev) => Math.min(prev + 1, files.length - 1));
  };

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = activeUrl;
    link.download = activeFile.name || document.name || "document.pdf";
    link.target = "_blank";
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (isImage) {
      const printWin = window.open("");
      if (printWin) {
        printWin.document.write(
          `<img src="${activeUrl}" style="max-width:100%" onload="window.print();window.close()" />`
        );
        printWin.document.close();
      }
    } else {
      window.open(activeUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 top-16 md:left-64 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fadeIn p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[88vh] shadow-2xl flex flex-col overflow-hidden relative">
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
                {files.length > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
                    <Layers className="h-3 w-3" /> {files.length} Files
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Category: {document.category || "Vault Document"} • Total Size: {document.size || "2.5 MB"}
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
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer hidden sm:flex"
              title="Print Active File"
            >
              <Printer className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download Active File"
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

        {/* Multi-file Navigation Bar (Only visible when document has multiple files) */}
        {files.length > 1 && (
          <div className="px-5 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevFile}
                disabled={activeFileIndex === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Previous file"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-bold text-slate-200 px-2">
                File {activeFileIndex + 1} of {files.length}
              </span>

              <button
                type="button"
                onClick={handleNextFile}
                disabled={activeFileIndex === files.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Next file"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Horizontal File Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 no-scrollbar">
              {files.map((file, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveFileIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    idx === activeFileIndex
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                  title={file.name}
                >
                  <FileText className="h-3 w-3" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  {file.size && <span className="text-[10px] opacity-75">({file.size})</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Viewport Render Area */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-auto flex items-center justify-center relative">
          <div
            className="w-full h-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center transition-all duration-300"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            {isImage ? (
              <img
                src={activeUrl}
                alt={activeFile.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <iframe
                src={`${activeUrl}#toolbar=0`}
                title={activeFile.name}
                className="w-full h-full min-h-[600px] border-none"
              />
            )}
          </div>
        </div>

        {/* Viewport Bottom Status Bar */}
        <div className="px-5 py-2.5 bg-slate-900 text-slate-400 text-xs flex items-center justify-between border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300 truncate max-w-xs sm:max-w-md">
              Viewing: {activeFile.name} {activeFile.size ? `(${activeFile.size})` : ""}
            </span>
          </div>

          <span className="text-[11px] font-bold text-indigo-400">
            {isImage ? "Image Preview Active" : "PDF Viewport Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
