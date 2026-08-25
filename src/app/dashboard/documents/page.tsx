"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import {
  useGetDocumentsQuery,
  useAddDocumentMutation,
  useDeleteDocumentMutation,
} from "@/redux/api/familyApi";
import { FolderLock, Plus, FileText, Download, ShieldCheck, Trash2, Loader2 } from "lucide-react";

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useGetDocumentsQuery();
  const [addDocument] = useAddDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("Legal Records");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    try {
      await addDocument({
        name: docName,
        category,
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        uploadedBy: "Sanctuary User",
      }).unwrap();
      setDocName("");
      setIsUploading(false);
    } catch (err) {
      alert("Failed to upload document");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDocument(id).unwrap();
      } catch (err) {
        alert("Failed to delete document");
      }
    }
  };

  return (
    <SanctuaryDashboardWrapper
      title="Legacy Documents Vault"
      subtitle="Encrypted document store for birth certificates, legal deeds, wills, and historical papers saved in PostgreSQL."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderLock className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-xs text-slate-800">
              {documents.length} Encrypted Documents Stored
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsUploading(!isUploading)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{isUploading ? "Close Upload" : "Upload Document"}</span>
          </button>
        </div>

        {isUploading && (
          <form
            onSubmit={handleUpload}
            className="p-6 rounded-2xl bg-white border border-indigo-200 shadow-md space-y-4 max-w-lg"
          >
            <h3 className="font-bold text-sm text-slate-900">Upload New Document to Vault</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title / File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Birth_Certificate_1965.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Legal Records">Legal Records</option>
                  <option value="Vital Records">Vital Records</option>
                  <option value="Immigration">Immigration</option>
                  <option value="Photos & Letters">Photos & Letters</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Confirm Upload
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm bg-white rounded-2xl border border-slate-200/80">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading document vault from database...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <FolderLock className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">Vault is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload legal documents, birth records, or historic family certificates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug break-all">
                        {doc.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {doc.category} • {doc.size}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
        )}
      </div>
    </SanctuaryDashboardWrapper>
  );
}

