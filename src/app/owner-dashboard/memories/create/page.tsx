"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
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

  // Queries & Mutations
  const { data: members = [] } = useGetMembersQuery();
  const { data: allMemories = [] } = useGetMemoriesQuery();
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

  // File Uploads
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingMediaUrl, setExistingMediaUrl] = useState<string | null>(null);

  // Alerts
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Pre-fill data if in Edit Mode
  useEffect(() => {
    if (!isEditMode) return;

    // Use fetched memory or find in allMemories cache
    const memory = fetchedMemory || allMemories.find((m) => m.id === memoryId);
    if (!memory || hasInitialized) return;

    setTitle(memory.title || "");
    if (memory.mediaUrl) {
      setExistingMediaUrl(memory.mediaUrl);
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

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
      const mediaListStr =
        selectedFiles.length > 0
          ? selectedFiles.map((f) => f.name).join(", ")
          : undefined;

      const finalMediaUrl = mediaListStr
        ? `Files [${selectedFiles.length}]: ${mediaListStr}`
        : existingMediaUrl || undefined;

      const finalTaggedStr =
        taggedMembersList.length > 0
          ? taggedMembersList.join(", ")
          : tagInputText.trim() || undefined;

      if (isEditMode && memoryId) {
        await updateMemory({
          id: memoryId,
          title: title.trim(),
          description: description.trim(),
          sharedBy: "Sanctuary Owner",
          date: date || undefined,
          location: location.trim() || undefined,
          category: category || undefined,
          mediaUrl: finalMediaUrl,
          taggedMembers: finalTaggedStr,
          privacy: privacy || undefined,
        }).unwrap();

        setSuccessMsg("Memory updated successfully! Redirecting...");
      } else {
        await addMemory({
          title: title.trim(),
          description: description.trim(),
          sharedBy: "Sanctuary Owner",
          date: date || undefined,
          location: location.trim() || undefined,
          category: category || undefined,
          mediaUrl: finalMediaUrl,
          taggedMembers: finalTaggedStr,
          privacy: privacy || undefined,
        }).unwrap();

        setSuccessMsg("Memory created successfully! Redirecting...");
      }

      setTimeout(() => {
        router.push("/owner-dashboard/memories");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to save memory.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Navigation & Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/owner-dashboard/memories"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
            title="Back to Memories Vault"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-tight">
                {isEditMode ? "Edit Family Memory" : "Create Family Memory"}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                  isEditMode
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-purple-100 text-purple-800 border border-purple-200"
                }`}
              >
                {isEditMode ? "Edit Mode" : "Create Mode"}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isEditMode
                ? "Update memory details, media attachments, and tagged relatives."
                : "Upload multiple photos, videos, and preserve milestone stories in your family archive."}
            </p>
          </div>
        </div>

        <Link
          href="/owner-dashboard/memories"
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
        >
          Cancel & Return
        </Link>
      </div>

      {/* Loading state when fetching existing memory */}
      {isEditMode && isFetchingMemory && !hasInitialized && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 flex items-center justify-center gap-3 text-slate-500 text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
          <span>Loading previous memory data...</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Status Indicator */}
        <div className="px-4 py-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-900 font-bold">
            <UserCheck className="h-4 w-4 text-purple-600" />
            <span>
              {isEditMode ? "Editing as:" : "Adding as:"} Sanctuary Owner (Authenticated User)
            </span>
          </div>
          <span className="text-[10px] bg-purple-200 text-purple-900 font-extrabold px-2.5 py-0.5 rounded-md">
            Auto-Authorized
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Multiple File Upload Zone */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-purple-600" />
                <span>Upload Photos & Videos</span>
              </span>
              <span className="text-xs text-purple-600 font-extrabold">
                {selectedFiles.length} New File(s) Selected
              </span>
            </label>

            <div className="relative border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/30 rounded-2xl p-6 text-center cursor-pointer transition-colors group">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <ImageIcon className="h-7 w-7 text-purple-500 group-hover:scale-110 transition-transform" />
                  <Film className="h-7 w-7 text-purple-600 group-hover:scale-110 transition-transform" />
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  Click or drag & drop photos and videos here
                </p>
                <p className="text-xs text-slate-400">
                  Select multiple files at once (PNG, JPG, MP4, MOV, PDF)
                </p>
              </div>
            </div>

            {/* Existing Media Attached in Edit Mode */}
            {isEditMode && existingMediaUrl && selectedFiles.length === 0 && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800 truncate">
                    Currently Attached: {existingMediaUrl}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  (Choose new files above to replace)
                </span>
              </div>
            )}

            {/* Selected New Files Preview List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedFiles.map((file, index) => {
                  const isVideo = file.type.startsWith("video/");
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {isVideo ? (
                          <Film className="h-4 w-4 text-amber-500 shrink-0" />
                        ) : (
                          <FileCheck className="h-4 w-4 text-purple-600 shrink-0" />
                        )}
                        <span className="font-bold text-slate-800 truncate text-xs">
                          {file.name}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Memory Title */}
          <div>
            <label className="block font-bold text-slate-700 text-sm mb-1.5">
              Memory Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Eid al-Fitr Family Celebration 2026, Grandparents Golden Anniversary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 text-sm mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>Date of Memory</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-sm mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-purple-600" />
                <span>Location / City</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 text-sm mb-1.5 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-purple-600" />
                <span>Category / Album</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
              <label className="block font-bold text-slate-700 text-sm mb-1.5 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-purple-600" />
                <span>Sanctuary Visibility</span>
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Entire Family Sanctuary">Entire Family Sanctuary</option>
                <option value="Owners & Admins Only">Owners & Admins Only</option>
                <option value="Private / Only Me">Private / Only Me</option>
              </select>
            </div>
          </div>

          {/* Tagged Relatives Autocomplete */}
          <div className="relative">
            <label className="block font-bold text-slate-700 text-sm mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Tagged Relatives</span>
              </span>
              <span className="text-[11px] text-purple-600 font-semibold">
                Type <code className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded">@name</code> to autocomplete
              </span>
            </label>

            {/* Tag Badges Container */}
            {taggedMembersList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />

            {/* Autocomplete Dropdown List */}
            {isTagDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-56 overflow-y-auto p-2 space-y-1">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Sanctuary Family Members</span>
                  <button
                    type="button"
                    onClick={() => setIsTagDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
                            ? "bg-purple-50 text-purple-900 font-bold"
                            : "hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              m.gender === "FEMALE" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"
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
                          <Check className="h-4 w-4 text-purple-600" />
                        ) : (
                          <span className="text-[11px] font-bold text-purple-600 hover:underline">
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
            <label className="block font-bold text-slate-700 text-sm mb-1.5">
              Description / Memory Story
            </label>
            <textarea
              rows={4}
              placeholder="Write a description or milestone story about this memory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/owner-dashboard/memories"
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors text-xs"
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
