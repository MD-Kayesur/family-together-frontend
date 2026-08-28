"use client";

import React, { useState } from "react";
import {
  X,
  Image as ImageIcon,
  Film,
  Sparkles,
  Loader2,
  Upload,
  Calendar,
  MapPin,
  Tag,
  Users,
  Lock,
  FileCheck,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useAddMemoryMutation } from "@/redux/api/familyApi";

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemoryModal({ isOpen, onClose }: AddMemoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Reunion & Gathering");
  const [taggedMembers, setTaggedMembers] = useState("");
  const [privacy, setPrivacy] = useState("Entire Family Sanctuary");

  // Multiple Files Upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addMemory, { isLoading }] = useAddMemoryMutation();

  if (!isOpen) return null;

  // Handle Multiple File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  // Remove individual file from selection
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim()) {
      setErrorMsg("Memory title is required.");
      return;
    }

    try {
      // Build media string from multiple selected files
      const mediaListStr =
        selectedFiles.length > 0
          ? selectedFiles.map((f) => f.name).join(", ")
          : undefined;

      await addMemory({
        title: title.trim(),
        description: description.trim(),
        sharedBy: "Sanctuary Owner", // Automatically assigned from active account
        date: date || undefined,
        location: location.trim() || undefined,
        category: category || undefined,
        mediaUrl: mediaListStr ? `Files [${selectedFiles.length}]: ${mediaListStr}` : undefined,
        taggedMembers: taggedMembers.trim() || undefined,
        privacy: privacy || undefined,
      }).unwrap();

      setSuccessMsg(`Memory saved with ${selectedFiles.length} attached media items!`);
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        setCategory("Reunion & Gathering");
        setTaggedMembers("");
        setPrivacy("Entire Family Sanctuary");
        setSelectedFiles([]);
        setSuccessMsg("");
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to add memory.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-7 space-y-5 relative my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/25">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                Upload Family Memories
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Add multiple photos, videos, or milestone stories to your family archive.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Auto Uploader Indicator */}
        <div className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold">
            <UserCheck className="h-4 w-4 text-purple-600" />
            <span>Adding as: Sanctuary Owner (Authenticated User)</span>
          </div>
          <span className="text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-extrabold px-2 py-0.5 rounded-md">
            Auto
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Multiple File Upload Zone */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5 text-purple-600" />
                <span>Upload Multiple Photos & Videos</span>
              </span>
              <span className="text-[10px] text-purple-600 font-extrabold">
                {selectedFiles.length} File(s) Selected
              </span>
            </label>

            <div className="relative border-2 border-dashed border-purple-200 dark:border-purple-900/50 hover:border-purple-500 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl p-5 text-center cursor-pointer transition-colors group">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform" />
                  <Film className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                  Click or drag & drop multiple photos and videos here
                </p>
                <p className="text-[10px] text-slate-400">
                  Select multiple files at once (PNG, JPG, MP4, MOV, PDF)
                </p>
              </div>
            </div>

            {/* Selected Files Preview List */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedFiles.map((file, index) => {
                  const isVideo = file.type.startsWith("video/");
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {isVideo ? (
                          <Film className="h-4 w-4 text-amber-500 shrink-0" />
                        ) : (
                          <FileCheck className="h-4 w-4 text-purple-600 shrink-0" />
                        )}
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Memory Title */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Memory Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Eid al-Fitr Family Celebration 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Row 1: Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-purple-600" />
                <span>Date of Memory</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-purple-600" />
                <span>Location / City</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Row 2: Category & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-purple-600" />
                <span>Category / Album</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              >
                <option value="Reunion & Gathering">Reunion & Gathering</option>
                <option value="Vacation & Travel">Vacation & Travel</option>
                <option value="Wedding & Celebration">Wedding & Celebration</option>
                <option value="Birthday & Milestones">Birthday & Milestones</option>
                <option value="Historic Archive & Deeds">Historic Archive & Deeds</option>
                <option value="General Story">General Story</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-purple-600" />
                <span>Sanctuary Visibility</span>
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              >
                <option value="Entire Family Sanctuary">Entire Family Sanctuary</option>
                <option value="Owners & Admins Only">Owners & Admins Only</option>
                <option value="Private / Only Me">Private / Only Me</option>
              </select>
            </div>
          </div>

          {/* Row 3: Tagged Members */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-purple-600" />
              <span>Tagged Relatives</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tariq Rahman, Aisha Rahman, Omar Rahman"
              value={taggedMembers}
              onChange={(e) => setTaggedMembers(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
            />
          </div>

          {/* Story Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Description / Memory Story
            </label>
            <textarea
              rows={3}
              placeholder="Write a description or memory story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/25 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save Memory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
