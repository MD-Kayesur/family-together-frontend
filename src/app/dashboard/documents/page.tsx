"use client";

import React from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { FolderLock, Plus, FileText, Download, ShieldCheck } from "lucide-react";

export default function DocumentsPage() {
  const documents = [
    { id: "doc_1", name: "Rahman_Family_Heritage_Will_1954.pdf", size: "4.2 MB", category: "Legal Records", date: "Aug 12, 2026" },
    { id: "doc_2", name: "Grandpa_Birth_Certificate_Scanned.pdf", size: "1.8 MB", category: "Vital Records", date: "Jul 28, 2026" },
    { id: "doc_3", name: "Immigration_Passports_Archive.pdf", size: "12.5 MB", category: "Immigration", date: "May 14, 2026" },
  ];

  return (
    <SanctuaryDashboardWrapper
      title="Legacy Documents Vault"
      subtitle="Encrypted document store for birth certificates, legal deeds, wills, and historical papers."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderLock className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-xs text-slate-800">3 Encrypted Documents Stored</span>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-snug break-all">
                    {doc.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400">{doc.category} • {doc.size}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> 256-bit Encrypted
                </span>
                <button
                  type="button"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Download File"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
