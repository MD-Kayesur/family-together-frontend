"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import {
  useGetDocumentsQuery,
  useAddDocumentMutation,
  useDeleteDocumentMutation,
<<<<<<< HEAD
  DocumentRecord,
} from "@/redux/api/familyApi";
import {
  FolderLock,
  Plus,
  FileText,
  Download,
  ShieldCheck,
  Trash2,
  Loader2,
  Upload,
  FileCheck,
  FileCode,
  Eye,
} from "lucide-react";
import PdfViewportModal from "@/components/modals/PdfViewportModal";
=======
} from "@/redux/api/familyApi";
import { FolderLock, Plus, FileText, Download, ShieldCheck, Trash2, Loader2 } from "lucide-react";
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useGetDocumentsQuery();
  const [addDocument] = useAddDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("Legal Records");
<<<<<<< HEAD
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState("2.5 MB");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PDF Viewport Modal State
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentRecord | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Handle PDF / File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docName.trim()) {
        setDocName(file.name.replace(/\.[^/.]+$/, ""));
      }
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeStr(`${sizeMb} MB`);
    }
  };
=======
  const [isUploading, setIsUploading] = useState(false);
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
<<<<<<< HEAD

    setIsSubmitting(true);
    try {
      await addDocument({
        name: selectedFile ? selectedFile.name : `${docName.trim()}.pdf`,
        category,
        size: fileSizeStr,
        uploadedBy: "Sanctuary Owner",
      }).unwrap();

      setDocName("");
      setSelectedFile(null);
      setIsUploading(false);
    } catch (err) {
      alert("Failed to upload document");
    } finally {
      setIsSubmitting(false);
=======
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
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
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

<<<<<<< HEAD
  const handleOpenPdfViewer = (doc: DocumentRecord) => {
    setSelectedDocForViewer(doc);
    setIsPdfModalOpen(true);
  };

=======
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
  return (
    <SanctuaryDashboardWrapper
      title="Legacy Documents Vault"
      subtitle="Encrypted document store for birth certificates, legal deeds, wills, and historical papers saved in PostgreSQL."
    >
<<<<<<< HEAD
      <div className="space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderLock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {documents.length} Encrypted Vault Documents
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                256-bit AES Encrypted • Click any document card to view PDF in viewport
              </p>
            </div>
=======
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderLock className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-xs text-slate-800">
              {documents.length} Encrypted Documents Stored
            </span>
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
          </div>

          <button
            type="button"
            onClick={() => setIsUploading(!isUploading)}
<<<<<<< HEAD
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>{isUploading ? "Close Upload" : "Upload Document / PDF"}</span>
          </button>
        </div>

        {/* Upload Form with PDF Dropzone */}
        {isUploading && (
          <form
            onSubmit={handleUpload}
            className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-xl space-y-5 max-w-xl animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileCode className="h-5 w-5 text-indigo-600" />
                <span>Upload New PDF Document to Vault</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                Encrypted Vault
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* PDF File Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Choose PDF / Document File *</span>
                </label>

                <div className="relative border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 rounded-2xl p-5 text-center cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold">
                      <FileCheck className="h-5 w-5 text-indigo-600" />
                      <span className="truncate max-w-xs">{selectedFile.name}</span>
                      <span className="text-[10px] text-indigo-500 font-normal">
                        ({fileSizeStr})
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <FileText className="h-7 w-7 text-indigo-500 mx-auto group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-slate-800 text-xs">
                        Click or drag & drop PDF document file here
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Supports PDF, DOCX, PNG, JPG (Max 50MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Document Title / Description *
                </label>
=======
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
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
                <input
                  type="text"
                  placeholder="e.g. Birth_Certificate_1965.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
<<<<<<< HEAD
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
=======
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
                  required
                />
              </div>

<<<<<<< HEAD
              {/* Category Dropdown */}
=======
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
<<<<<<< HEAD
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  <option value="Legal Records">Legal Records</option>
                  <option value="Vital Records">Vital Records (Birth/Marriage)</option>
                  <option value="Immigration">Immigration & Passports</option>
                  <option value="Property & Deeds">Property & Land Deeds</option>
                  <option value="Photos & Letters">Photos & Historical Letters</option>
=======
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Legal Records">Legal Records</option>
                  <option value="Vital Records">Vital Records</option>
                  <option value="Immigration">Immigration</option>
                  <option value="Photos & Letters">Photos & Letters</option>
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
                </select>
              </div>
            </div>

<<<<<<< HEAD
            {/* Form Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Confirm & Upload PDF</span>
              </button>
            </div>
          </form>
        )}

        {/* Document Cards */}
=======
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Confirm Upload
            </button>
          </form>
        )}

>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
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
<<<<<<< HEAD
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handleOpenPdfViewer(doc)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 shadow-sm transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs leading-snug break-all">
=======
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug break-all">
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
                        {doc.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {doc.category} • {doc.size}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
<<<<<<< HEAD
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id, doc.name);
                    }}
=======
                    onClick={() => handleDelete(doc.id, doc.name)}
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
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
<<<<<<< HEAD
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPdfViewer(doc);
                    }}
                    className="px-3 py-1.5 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-sm"
                    title="View PDF in Viewport"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View PDF</span>
=======
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Download File"
                  >
                    <Download className="h-4 w-4" />
>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
<<<<<<< HEAD

      {/* PDF Viewport Modal */}
      <PdfViewportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        document={selectedDocForViewer}
      />
    </SanctuaryDashboardWrapper>
  );
}
=======
    </SanctuaryDashboardWrapper>
  );
}

>>>>>>> b36a47bb3e2e75eeae2080b97085c73043fc76d3
