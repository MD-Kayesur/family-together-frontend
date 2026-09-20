"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useAppSelector } from "@/redux/store";
import {
  useAddMemoryMutation,
  useUpdateMemoryMutation,
  useGetMemoryByIdQuery,
  useGetMembersQuery,
  useGetMemoriesQuery,
} from "@/redux/api/familyApi";
import {
  ArrowLeft,
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
  Check,
  X,
  Pencil,
  AlertCircle,
} from "lucide-react";

function MemoryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memoryId = searchParams.get("id") || searchParams.get("edit");
  const isEditMode = Boolean(memoryId);

  const { user } = useAppSelector((state) => state.auth);

  // Queries & Mutations
  const { data: members = [] } = useGetMembersQuery();
  const { data: allMemories = [], refetch: refetchMemories } = useGetMemoriesQuery(
    user ? { userId: user.id, userEmail: user.email } : undefined
  );
  const { data: fetchedMemory, isLoading: isFetchingMemory } = useGetMemoryByIdQuery(
    memoryId as string,
    { skip: !memoryId }
  );

  const [addMemory, { isLoading: isAdding }] = useAddMemoryMutation();
  const [updateMemory, { isLoading: isUpdating }] = useUpdateMemoryMutation();
  const isSubmitting = isAdding || isUpdating;

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Reunion & Gathering");
  const [privacy, setPrivacy] = useState("Entire Family Sanctuary");

  // Tagged Relatives State
  const [taggedMembersList, setTaggedMembersList] = useState<string[]>([]);
  const [tagInputText, setTagInputText] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // Media Uploads & URLs State
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [customMediaUrl, setCustomMediaUrl] = useState("");
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);

  // Alerts
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Helper function to read file with Promise.race and timeout
  const readFileWithPromiseRace = (file: File): Promise<string> => {
    return Promise.race([
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("File result is not a string"));
          }
        };
        reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
        reader.readAsDataURL(file);
      }),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout reading file: ${file.name}`)), 5000),
      ),
    ]);
  };

  // Pre-fill data if in Edit Mode
  useEffect(() => {
    if (!isEditMode) return;

    // Use fetched memory or find in allMemories cache
    const memory = fetchedMemory || allMemories.find((m) => m.id === memoryId);
    if (!memory || hasInitialized) return;

    setTitle(memory.title || "");

    // Pre-fill mediaUrls array
    if (memory.mediaUrls && Array.isArray(memory.mediaUrls) && memory.mediaUrls.length > 0) {
      setMediaUrls(memory.mediaUrls);
    } else if (memory.mediaUrl) {
      try {
        const trimmed = memory.mediaUrl.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            setMediaUrls(parsed);
          } else {
            setMediaUrls([memory.mediaUrl]);
          }
        } else {
          setMediaUrls([memory.mediaUrl]);
        }
      } catch {
        setMediaUrls([memory.mediaUrl]);
      }
    }

    if (memory.description) {
      let rawDesc = memory.description;
      const parts = rawDesc.split("\n\n");
      const metaLine = parts[0];

      // Parse metadata if formatted as "Category: ... • Date: ..."
      if (metaLine.includes("Category:") || metaLine.includes("Date:") || metaLine.includes("Location:")) {
        const catMatch = metaLine.match(/Category:\s*([^•\n]+)/);
        if (catMatch) setCategory(catMatch[1].trim());

        const dateMatch = metaLine.match(/Date:\s*([^•\n]+)/);
        if (dateMatch) setDate(dateMatch[1].trim());

        const locMatch = metaLine.match(/Location:\s*([^•\n]+)/);
        if (locMatch) setLocation(locMatch[1].trim());

        const tagMatch = metaLine.match(/Tagged:\s*([^•\n]+)/);
        if (tagMatch) {
          const tags = tagMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
          setTaggedMembersList(tags);
        }

        const privMatch = metaLine.match(/Privacy:\s*([^•\n]+)/);
        if (privMatch) setPrivacy(privMatch[1].trim());

        // Actual description body is everything after the metadata line
        rawDesc = parts.slice(1).join("\n\n").trim();
      }

      setDescription(rawDesc);
    }

    setHasInitialized(true);
  }, [isEditMode, memoryId, fetchedMemory, allMemories, hasInitialized]);

  // Handle Multiple File Selection with Promise.race and try/catch
  // If any single file fails or times out, the other files are safely added!
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setIsProcessingMedia(true);
      setErrorMsg("");

      const successfullyReadUrls: string[] = [];
      const failedFiles: string[] = [];

      for (const file of filesArray) {
        try {
          const dataUrl = await readFileWithPromiseRace(file);
          successfullyReadUrls.push(dataUrl);
        } catch (err) {
          console.warn(`[Promise.race] Failed reading file "${file.name}":`, err);
          failedFiles.push(file.name);
        }
      }

      if (successfullyReadUrls.length > 0) {
        setMediaUrls((prev) => [...prev, ...successfullyReadUrls]);
      }

      if (failedFiles.length > 0) {
        setErrorMsg(
          `Note: ${failedFiles.length} file(s) (${failedFiles.join(", ")}) could not be read, but ${successfullyReadUrls.length} file(s) were added successfully.`
        );
      }

      setIsProcessingMedia(false);
      e.target.value = "";
    }
  };

  const handleAddCustomMediaUrl = () => {
    if (!customMediaUrl.trim()) return;
    setMediaUrls((prev) => [...prev, customMediaUrl.trim()]);
    setCustomMediaUrl("");
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Autocomplete Relative Selection
  const handleSelectRelative = (name: string) => {
    if (!taggedMembersList.includes(name)) {
      setTaggedMembersList((prev) => [...prev, name]);
    }
    setTagInputText("");
    setIsTagDropdownOpen(false);
  };

  const handleRemoveRelativeTag = (name: string) => {
    setTaggedMembersList((prev) => prev.filter((n) => n !== name));
  };

  const filterQuery = tagInputText.startsWith("@")
    ? tagInputText.slice(1).toLowerCase()
    : tagInputText.toLowerCase();

  const suggestedMembers = members.filter((m) => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    return (
      fullName.includes(filterQuery) ||
      (m.bio && m.bio.toLowerCase().includes(filterQuery))
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim()) {
      setErrorMsg("Memory title is required.");
      return;
    }

    try {
      const finalTaggedStr =
        taggedMembersList.length > 0
          ? taggedMembersList.join(", ")
          : tagInputText.trim() || undefined;

      const authorName = user?.fullName || "Sanctuary Owner";

      if (isEditMode && memoryId) {
        await updateMemory({
          id: memoryId,
          title: title.trim(),
          description: description.trim(),
          sharedBy: authorName,
          userId: user?.id,
          userEmail: user?.email,
          date: date || undefined,
          location: location.trim() || undefined,
          category: category || undefined,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
          mediaUrl: mediaUrls[0] || undefined,
          taggedMembers: finalTaggedStr,
          privacy: privacy || undefined,
        }).unwrap();

        refetchMemories();
        setSuccessMsg(`Memory updated successfully with ${mediaUrls.length} media item(s)! Redirecting...`);
      } else {
        await addMemory({
          title: title.trim(),
          description: description.trim(),
          sharedBy: authorName,
          userId: user?.id,
          userEmail: user?.email,
          date: date || undefined,
          location: location.trim() || undefined,
          category: category || undefined,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
          mediaUrl: mediaUrls[0] || undefined,
          taggedMembers: finalTaggedStr,
          privacy: privacy || undefined,
        }).unwrap();

        refetchMemories();
        setSuccessMsg(`Memory created successfully with ${mediaUrls.length} media item(s)! Redirecting...`);
      }

      setTimeout(() => {
        router.push("/owner-dashboard?tab=memories");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to save memory.");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full pb-16">
      {/* Top Navigation & Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/owner-dashboard?tab=memories"
            className="p-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
            title="Back to Memories Vault"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-lg sm:text-xl leading-tight">
                {isEditMode ? "Edit Family Memory" : "Create Family Memory"}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                  isEditMode
                    ? "bg-amber-900/40 text-amber-300 border border-amber-800/60"
                    : "bg-purple-900/40 text-purple-300 border border-purple-800/60"
                }`}
              >
                {isEditMode ? "Edit Mode" : "Create Mode"}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isEditMode
                ? "Update memory details, media attachments, and tagged relatives."
                : "Upload multiple photos, videos, and preserve milestone stories in your family archive."}
            </p>
          </div>
        </div>

        <Link
          href="/owner-dashboard?tab=memories"
          className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-xs transition-colors"
        >
          Cancel & Return
        </Link>
      </div>

      {/* Loading state when fetching existing memory */}
      {isEditMode && isFetchingMemory && !hasInitialized && (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center gap-3 text-slate-400 text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          <span>Loading previous memory data...</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-white">
        {/* Status Indicator */}
        <div className="px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <UserCheck className="h-4 w-4 text-purple-400" />
            <span>
              {isEditMode ? "Editing as:" : "Adding as:"} Sanctuary Owner (Authenticated User)
            </span>
          </div>
          <span className="text-[10px] bg-purple-900/60 text-purple-200 border border-purple-700/50 font-extrabold px-2.5 py-0.5 rounded-md">
            Auto-Authorized
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/70 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/70 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Multiple Media Upload & URL Zone */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-200 text-sm flex items-center gap-2">
                <Upload className="h-4 w-4 text-purple-400" />
                <span>Upload Photos & Videos (Multiple Media)</span>
              </label>
              <span className="text-xs text-purple-300 font-extrabold bg-purple-950/60 border border-purple-800/80 px-3 py-1 rounded-full">
                {mediaUrls.length} Media Item(s) Attached
              </span>
            </div>

            {/* Dropzone for Multiple Local Files */}
            <div className="relative border-2 border-dashed border-purple-800/60 hover:border-purple-500 bg-purple-950/20 rounded-2xl p-6 text-center cursor-pointer transition-colors group">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={isProcessingMedia}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  {isProcessingMedia ? (
                    <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="h-7 w-7 text-purple-400 group-hover:scale-110 transition-transform" />
                      <Film className="h-7 w-7 text-purple-500 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </div>
                <p className="font-bold text-white text-sm">
                  {isProcessingMedia
                    ? "Processing and reading files via resilient Promise.race..."
                    : "Click or drag & drop multiple photos and videos here"}
                </p>
                <p className="text-xs text-slate-400">
                  Select multiple files at once (PNG, JPG, WEBP, MP4, MOV). If any file fails, the rest will still be added!
                </p>
              </div>
            </div>

            {/* Add Media via Direct URL */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste media URL (e.g. Unsplash, Cloudinary, direct MP4 link)..."
                value={customMediaUrl}
                onChange={(e) => setCustomMediaUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomMediaUrl();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomMediaUrl}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                + Add URL
              </button>
            </div>

            {/* Attached Media Preview Gallery Grid */}
            {mediaUrls.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                  <span>Attached Media Gallery Preview ({mediaUrls.length})</span>
                  <button
                    type="button"
                    onClick={() => setMediaUrls([])}
                    className="text-rose-500 hover:text-rose-700 hover:underline cursor-pointer text-[11px]"
                  >
                    Clear all media
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1 border border-slate-800 rounded-2xl bg-slate-950/60">
                  {mediaUrls.map((url, index) => {
                    const isVideo =
                      url.startsWith("data:video/") ||
                      url.endsWith(".mp4") ||
                      url.endsWith(".mov") ||
                      url.endsWith(".webm");

                    return (
                      <div
                        key={index}
                        className="relative group/thumb rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                      >
                        {isVideo ? (
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            controls={false}
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Top Overlay Badges */}
                        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-bold backdrop-blur-sm">
                            #{index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(index)}
                            className="p-1 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white transition-transform hover:scale-110 cursor-pointer shadow-md"
                            title="Remove media"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-1 left-1.5 z-10">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-900/70 text-purple-300 backdrop-blur-sm">
                            {isVideo ? "Video" : "Photo"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                No media attached yet. Select files or paste URLs above to add photos & videos.
              </div>
            )}
          </div>

          {/* Memory Title */}
          <div>
            <label className="block font-bold text-slate-200 text-sm mb-1.5">
              Memory Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Eid al-Fitr Family Celebration 2026, Grandparents Golden Anniversary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 text-sm mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span>Date of Memory</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 text-sm mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>Location / City</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 text-sm mb-1.5 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-purple-400" />
                <span>Category / Album</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Reunion & Gathering" className="bg-slate-950 text-white">Reunion & Gathering</option>
                <option value="Vacation & Travel" className="bg-slate-950 text-white">Vacation & Travel</option>
                <option value="Wedding & Celebration" className="bg-slate-950 text-white">Wedding & Celebration</option>
                <option value="Birthday & Milestones" className="bg-slate-950 text-white">Birthday & Milestones</option>
                <option value="Historic Archive & Deeds" className="bg-slate-950 text-white">Historic Archive & Deeds</option>
                <option value="General Story" className="bg-slate-950 text-white">General Story</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 text-sm mb-1.5 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-purple-400" />
                <span>Sanctuary Visibility</span>
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Entire Family Sanctuary" className="bg-slate-950 text-white">Entire Family Sanctuary</option>
                <option value="Owners & Admins Only" className="bg-slate-950 text-white">Owners & Admins Only</option>
                <option value="Private / Only Me" className="bg-slate-950 text-white">Private / Only Me</option>
              </select>
            </div>
          </div>

          {/* Tagged Relatives Autocomplete */}
          <div className="relative">
            <label className="block font-bold text-slate-200 text-sm mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-400" />
                <span>Tagged Relatives</span>
              </span>
              <span className="text-[11px] text-purple-400 font-semibold">
                Type <code className="bg-purple-950/60 text-purple-300 border border-purple-800/60 px-1 py-0.5 rounded">@name</code> to autocomplete
              </span>
            </label>

            {/* Tag Badges Container */}
            {taggedMembersList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/50">
                {taggedMembersList.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs shadow-sm"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRelativeTag(name)}
                      className="hover:text-rose-200 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input with @ mention trigger */}
            <input
              type="text"
              placeholder="Type @ relative name (e.g. @Amina, @Tariq)..."
              value={tagInputText}
              onFocus={() => setIsTagDropdownOpen(true)}
              onChange={(e) => {
                setTagInputText(e.target.value);
                setIsTagDropdownOpen(true);
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />

            {/* Autocomplete Dropdown List */}
            {isTagDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-56 overflow-y-auto p-2 space-y-1">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Sanctuary Family Members</span>
                  <button
                    type="button"
                    onClick={() => setIsTagDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {suggestedMembers.length === 0 ? (
                  <div className="p-3 text-center text-slate-400 text-xs italic">
                    No family relative matching &quot;{tagInputText}&quot;.
                  </div>
                ) : (
                  suggestedMembers.map((m) => {
                    const fullName = `${m.firstName} ${m.lastName}`;
                    const isAlreadyTagged = taggedMembersList.includes(fullName);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectRelative(fullName)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors text-left text-xs cursor-pointer ${
                          isAlreadyTagged
                            ? "bg-purple-950/60 text-purple-200 font-bold"
                            : "hover:bg-slate-800 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              m.gender === "FEMALE"
                                ? "bg-rose-950/60 text-rose-300 border border-rose-800/50"
                                : "bg-indigo-950/60 text-indigo-300 border border-indigo-800/50"
                            }`}
                          >
                            {m.gender === "FEMALE" ? "👩" : "👨"}
                          </div>
                          <div>
                            <div className="font-bold text-xs">{fullName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {m.bio || m.gender || "Relative"}
                            </div>
                          </div>
                        </div>

                        {isAlreadyTagged ? (
                          <Check className="h-4 w-4 text-purple-400" />
                        ) : (
                          <span className="text-[11px] font-bold text-purple-400 hover:underline">
                            + Tag
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Description / Story */}
          <div>
            <label className="block font-bold text-slate-200 text-sm mb-1.5">
              Description / Memory Story
            </label>
            <textarea
              rows={4}
              placeholder="Write a description or milestone story about this memory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              href="/owner-dashboard?tab=memories"
              className="px-5 py-3 rounded-xl border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 transition-colors text-xs"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? (
                <>
                  <Pencil className="h-4 w-4" />
                  <span>Update Memory</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Save Memory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateOrEditMemoryPage() {
  return (
    <SanctuaryDashboardWrapper
      title="Family Memories Vault"
      subtitle="Preserve family stories, photos, and milestones."
    >
      <Suspense
        fallback={
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <span>Loading memory workspace...</span>
          </div>
        }
      >
        <MemoryFormContent />
      </Suspense>
    </SanctuaryDashboardWrapper>
  );
}
