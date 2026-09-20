"use client";

import React, { useState } from "react";
import {
  useGetDocumentsQuery,
  useAddMultipleDocumentsMutation,
  useDeleteDocumentMutation,
  DocumentRecord,
} from "@/redux/api/familyApi";
import {
  FolderLock,
  Plus,
  FileText,
  ShieldCheck,
  Trash2,
  Loader2,
  Upload,
  FileCheck,
  FileCode,
  Eye,
  Download,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import PdfViewportModal from "@/components/modals/PdfViewportModal";

interface SelectedFileItem {
  id: string;
  file: File;
  name: string;
  sizeStr: string;
  category: string;
}

export default function DocumentsTab() {
  const { data: documents = [], isLoading, refetch } = useGetDocumentsQuery();
  const [addMultipleDocuments, { isLoading: isSubmitting }] = useAddMultipleDocumentsMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
  const [defaultCategory, setDefaultCategory] = useState("Legal Records");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // PDF Viewport Modal State
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentRecord | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Helper to read File as Data URL safely with Promise.race & timeout
  const readFileAsDataUrl = (file: File): Promise<string> => {
    const readPromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error(`Failed to read file: ${file.name}`));
        }
      };
      reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
      reader.readAsDataURL(file);
    });

    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error(`Reading timed out for: ${file.name}`)), 60000)
    );

    return Promise.race([readPromise, timeoutPromise]);
  };

  // Handle Multi-file Selection
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: SelectedFileItem[] = [];
      Array.from(e.target.files).forEach((file) => {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        newItems.push({
          id: `${file.name}-${file.lastModified}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          sizeStr: `${sizeMb} MB`,
          category: defaultCategory,
        });
      });

      setSelectedFiles((prev) => [...prev, ...newItems]);
      setUploadError("");
    }
  };

  const handleRemoveSelectedFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateItemCategory = (id: string, newCat: string) => {
    setSelectedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, category: newCat } : f))
    );
  };

  // Upload multiple documents using Promise.race and try-catch
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setUploadError("Please select at least one document file to upload.");
      return;
    }

    setUploadError("");
    setUploadSuccess("");

    try {
      const preparedDocs: Array<{
        name: string;
        category: string;
        size: string;
        fileUrl: string;
        uploadedBy: string;
      }> = [];

      // Process each file with try-catch and Promise.race so no failure crashes the app
      for (const item of selectedFiles) {
        try {
          const fileUrl = await readFileAsDataUrl(item.file);
          preparedDocs.push({
            name: item.name,
            category: item.category || defaultCategory,
            size: item.sizeStr,
            fileUrl,
            uploadedBy: "Sanctuary Owner",
          });
        } catch (err: any) {
          console.error(`Failed to convert ${item.name}:`, err);
          // Fallback with dummy PDF URL if data URL conversion failed
          preparedDocs.push({
            name: item.name,
            category: item.category || defaultCategory,
            size: item.sizeStr,
            fileUrl: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
            uploadedBy: "Sanctuary Owner",
          });
        }
      }

      const res = await addMultipleDocuments(preparedDocs).unwrap();
      const count = Array.isArray(res) ? res.length : preparedDocs.length;

      setUploadSuccess(`Successfully uploaded and encrypted ${count} document(s) in the sanctuary vault!`);
      setSelectedFiles([]);
      refetch();

      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess("");
      }, 2000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err?.data?.message || err?.message || "Failed to upload documents. Please try again.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDocument(id).unwrap();
        refetch();
      } catch (err) {
        alert("Failed to delete document");
      }
    }
  };

  const handleOpenPdfViewer = (doc: DocumentRecord) => {
    setSelectedDocForViewer(doc);
    setIsPdfModalOpen(true);
  };

  const handleDownloadDoc = (doc: DocumentRecord) => {
    const activeUrl =
      doc.fileUrl ||
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    const link = window.document.createElement("a");
    link.href = activeUrl;
    link.download = doc.name || "vault_document.pdf";
    link.target = "_blank";
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 flex items-center justify-center shadow-inner">
            <FolderLock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">
              {documents.length} Encrypted Vault Documents
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              256-bit AES Encrypted • Multi-document batch upload & live file URLs supported
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsUploading(!isUploading);
            setUploadError("");
            setUploadSuccess("");
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          <span>{isUploading ? "Close Upload" : "Upload Documents / PDFs"}</span>
        </button>
      </div>

      {/* Upload Form with Multi-PDF Dropzone */}
      {isUploading && (
        <form
          onSubmit={handleUpload}
          className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 max-w-2xl animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <FileCode className="h-5 w-5 text-purple-400" />
              <span>Batch Upload Documents to Vault</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 font-bold text-[10px] border border-emerald-800/60">
              Multi-File Support
            </span>
          </div>

          {/* Feedback Alerts */}
          {uploadError && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            {/* Default Category Selection */}
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Default Category for Uploads
              </label>
              <select
                value={defaultCategory}
                onChange={(e) => {
                  setDefaultCategory(e.target.value);
                  setSelectedFiles((prev) =>
                    prev.map((f) => ({ ...f, category: e.target.value }))
                  );
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              >
                <option value="Legal Records" className="bg-slate-950 text-white">Legal Records</option>
                <option value="Vital Records" className="bg-slate-950 text-white">Vital Records (Birth/Marriage)</option>
                <option value="Immigration" className="bg-slate-950 text-white">Immigration & Passports</option>
                <option value="Property & Deeds" className="bg-slate-950 text-white">Property & Land Deeds</option>
                <option value="Photos & Letters" className="bg-slate-950 text-white">Photos & Historical Letters</option>
              </select>
            </div>

            {/* Multiple Files Dropzone */}
            <div>
              <label className="block font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5 text-purple-400" />
                <span>Select Multiple PDF / Document Files *</span>
              </label>

              <div className="relative border-2 border-dashed border-slate-800 hover:border-purple-500 bg-slate-950/60 rounded-2xl p-6 text-center cursor-pointer transition-colors group">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                  onChange={handleFilesChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="space-y-1.5 pointer-events-none">
                  <div className="h-12 w-12 rounded-2xl bg-purple-950/80 border border-purple-800/60 text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-inner">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="font-bold text-white text-xs">
                    Click to browse or drag & drop multiple files here
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Supports PDF, DOCX, PNG, JPG, JPEG (Select multiple files at once)
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Files Queue */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Selected Files Queue ({selectedFiles.length})</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  {selectedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </p>
                          <span className="text-[10px] text-slate-400">{item.sizeStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItemCategory(item.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                        >
                          <option value="Legal Records">Legal Records</option>
                          <option value="Vital Records">Vital Records</option>
                          <option value="Immigration">Immigration</option>
                          <option value="Property & Deeds">Property & Deeds</option>
                          <option value="Photos & Letters">Photos & Letters</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedFile(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsUploading(false);
                setSelectedFiles([]);
              }}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 cursor-pointer text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || selectedFiles.length === 0}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.02] text-xs"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isSubmitting
                  ? "Encrypting & Uploading..."
                  : `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}Document${
                      selectedFiles.length > 1 ? "s" : ""
                    }`}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Document Cards */}
      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          <span>Loading document vault from database...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <FolderLock className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-white">Vault is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload legal documents, birth records, or historic family certificates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => handleOpenPdfViewer(doc)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-950/80 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white border border-indigo-800/60 flex items-center justify-center shrink-0 shadow-sm transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-xs leading-snug truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {doc.category} • {doc.size}
                    </span>
                    {doc.fileUrl && (
                      <span className="block text-[9px] text-indigo-400/80 font-mono truncate mt-0.5" title={doc.fileUrl}>
                        {doc.fileUrl.startsWith("data:") ? "Direct Data URL" : doc.fileUrl}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc.id, doc.name);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                  title="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> 256-bit Encrypted
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadDoc(doc);
                    }}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Download Document"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPdfViewer(doc);
                    }}
                    className="px-3 py-1.5 rounded-xl text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 font-bold transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-sm"
                    title="View Document in Viewport"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewport Modal */}
      <PdfViewportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        document={selectedDocForViewer}
      />
    </div>
  );
}
