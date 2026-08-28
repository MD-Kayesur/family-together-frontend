"use client";

import React, { useState } from "react";
import {
  X,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Upload,
  Calendar,
  MapPin,
  Tag,
  Users,
  Lock,
  FileCheck,
} from "lucide-react";
import { useAddMemoryMutation } from "@/redux/api/familyApi";

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemoryModal({ isOpen, onClose }: AddMemoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sharedBy, setSharedBy] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Reunion & Gathering");
  const [mediaUrl, setMediaUrl] = useState("");
  const [taggedMembers, setTaggedMembers] = useState("");
  const [privacy, setPrivacy] = useState("Entire Family Sanctuary");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addMemory, { isLoading }] = useAddMemoryMutation();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
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
      await addMemory({
        title: title.trim(),
        description: description.trim(),
        sharedBy: sharedBy.trim() || "Family Member",
        date: date || undefined,
        location: location.trim() || undefined,
        category: category || undefined,
        mediaUrl: mediaUrl.trim() || (selectedFile ? `file://${fileName}` : undefined),
        taggedMembers: taggedMembers.trim() || undefined,
        privacy: privacy || undefined,
      }).unwrap();

      setSuccessMsg("Memory saved successfully to database!");
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setSharedBy("");
        setDate("");
        setLocation("");
        setCategory("Reunion & Gathering");
        setMediaUrl("");
        setTaggedMembers("");
        setPrivacy("Entire Family Sanctuary");
        setSelectedFile(null);
        setFileName("");
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/25">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                Upload Family Memory
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Save a milestone photo, video, or historical story to your family archive.
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
          {/* File Upload Zone */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5 text-purple-600" />
              <span>Attach File / Media Photo</span>
            </label>

            <div className="relative border-2 border-dashed border-purple-200 dark:border-purple-900/50 hover:border-purple-500 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl p-4 text-center cursor-pointer transition-colors group">
              <input
                type="file"
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
                  <FileCheck className="h-4 w-4" />
                  <span className="truncate max-w-xs">{fileName}</span>
                  <span className="text-[10px] text-purple-500 font-normal">
                    ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="h-6 w-6 text-purple-500 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    Click or drag & drop photo/video file here
                  </p>
                  <p className="text-[10px] text-slate-400">Supports PNG, JPG, MP4, PDF (Max 50MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Row 1: Title & Shared By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Eid al-Fitr Gathering 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Shared By
              </label>
              <input
                type="text"
                placeholder="e.g. Amina Rahman"
                value={sharedBy}
                onChange={(e) => setSharedBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Row 2: Date & Location */}
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

          {/* Row 3: Category & Privacy */}
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

          {/* Row 4: Tagged Members & Image URL fallback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-purple-600" />
                <span>Tagged Relatives</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tariq Rahman, Aisha Rahman"
                value={taggedMembers}
                onChange={(e) => setTaggedMembers(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Media URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              />
            </div>
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
