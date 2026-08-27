"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import {
  useGetSanctuaryQuery,
  useGetMembersQuery,
  useGetRelationshipsQuery,
  useGetMemoriesQuery,
  useUpdateFamilyDetailsMutation,
} from "@/redux/api/familyApi";
import {
  Users,
  ShieldCheck,
  Heart,
  Calendar,
  ArrowRight,
  Sparkles,
  Edit3,
  Search,
  UserPlus,
  Image as ImageIcon,
  TreePine,
  MapPin,
  Globe,
  Award,
  Loader2,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import AddMemberModal from "@/components/modals/AddMemberModal";
import AddMemoryModal from "@/components/modals/AddMemoryModal";

export default function MyFamilyPage() {
  const { data: sanctuaryData, isLoading: isLoadingSanctuary } = useGetSanctuaryQuery();
  const { data: members = [], isLoading: isLoadingMembers } = useGetMembersQuery();
  const { data: relationships = [] } = useGetRelationshipsQuery();
  const { data: memories = [] } = useGetMemoriesQuery();
  const [updateFamilyDetails, { isLoading: isUpdating }] = useUpdateFamilyDetailsMutation();

  // Modals & Search state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isEditFamilyOpen, setIsEditFamilyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Family Form State
  const [familyName, setFamilyName] = useState("");
  const [familyDesc, setFamilyDesc] = useState("");
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  const family = sanctuaryData?.family;
  const stats = sanctuaryData?.stats;

  // Filter members by search
  const filteredMembers = members.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.bio || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Demographics calculation
  const maleCount = members.filter((m) => m.gender === "MALE").length;
  const femaleCount = members.filter((m) => m.gender === "FEMALE").length;

  const handleOpenEditModal = () => {
    setFamilyName(family?.name || "The Rahman Family");
    setFamilyDesc(
      family?.description ||
        "Established in roots of resilience and growth. Dedicated to preserving our shared history, celebrating current milestones, and connecting generations across the globe."
    );
    setEditSuccessMsg("");
    setIsEditFamilyOpen(true);
  };

  const handleSaveFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) return;

    try {
      await updateFamilyDetails({
        name: familyName.trim(),
        description: familyDesc.trim(),
      }).unwrap();
      setEditSuccessMsg("Family sanctuary details updated successfully!");
      setTimeout(() => {
        setIsEditFamilyOpen(false);
        setEditSuccessMsg("");
      }, 1000);
    } catch (err) {
      alert("Failed to update family details.");
    }
  };

  return (
    <SanctuaryDashboardWrapper
      title="My Family Sanctuary"
      subtitle="Central lineage hub for managing your family network, member records, and legacy stats."
    >
      <div className="space-y-8 pb-12">
        {/* 1. Hero Family Sanctuary Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider">
                Sanctuary ID: FML-8921
              </span>
              <span className="text-xs text-indigo-200 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> PostgreSQL Protected
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenEditModal}
              className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Family Details</span>
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {family?.name || "The Rahman Family"}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-3xl leading-relaxed font-normal">
              {family?.description ||
                "Established in roots of resilience and growth. Dedicated to preserving our shared history, celebrating current milestones, and connecting generations across the globe."}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-indigo-700/60">
            <button
              type="button"
              onClick={() => setIsAddMemberOpen(true)}
              className="bg-white text-indigo-900 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-indigo-600" />
              <span>Add Member</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddMemoryOpen(true)}
              className="bg-indigo-700/80 text-white border border-indigo-500/50 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ImageIcon className="h-4 w-4 text-indigo-200" />
              <span>Add Memory</span>
            </button>

            <Link
              href="/owner-dashboard/tree"
              className="bg-indigo-600/90 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-500 transition-all flex items-center gap-2"
            >
              <TreePine className="h-4 w-4" />
              <span>Explore 2D Canvas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Key Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Sanctuary Members</span>
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {stats?.totalMembers ?? members.length}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                ({maleCount} 👨 • {femaleCount} 👩)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Fetched live from PostgreSQL</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Lineage Connections</span>
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.relationships ?? relationships.length}
            </span>
            <p className="text-[11px] text-slate-400">Biological & Marital Links</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Memories Archived</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.totalMemories ?? memories.length}
            </span>
            <p className="text-[11px] text-slate-400">Photos & Historic Records</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Global Locations</span>
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">3 Regions</span>
            <p className="text-[11px] text-slate-400">Dhaka • London • Toronto</p>
          </div>
        </div>

        {/* 3. Ancestral Lineage & Heritage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Ancestral Roots</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rooted in deep lineage heritage. Documenting family origins from historic Lahore and Dhaka to modern settlements in London and Toronto.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">3 Active Generations</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connecting Generation 1 (Patriarchs & Matriarchs), Generation 2 (Parents & Aunts), and Generation 3 (Children & Cousins).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Private & Encrypted</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your sanctuary is strictly private. Only invited family members with authenticated roles can view or manage lineage data.
            </p>
          </div>
        </div>

        {/* 4. Family Members Directory Preview Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Family Relatives Directory</h3>
              <p className="text-xs text-slate-500">Search and explore registered family members in your sanctuary.</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search relative by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>
          </div>

          {isLoadingMembers ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
              Loading sanctuary members...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              No family members match &quot;{searchQuery}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMembers.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-all space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-full font-bold text-base flex items-center justify-center shrink-0 shadow-sm ${
                        m.gender === "FEMALE" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {m.gender === "FEMALE" ? "👩" : "👨"}
                    </div>
                    <div className="overflow-hidden space-y-0.5">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate">
                        {m.firstName} {m.lastName}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 block truncate">
                        {idx === 0 ? "Sanctuary Owner" : m.bio || m.gender || "Relative"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                    <Link href="/owner-dashboard/tree" className="hover:underline">
                      View Node ➔
                    </Link>
                    <Link href="/owner-dashboard/members" className="hover:underline text-slate-500">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Family Details Modal */}
      {isEditFamilyOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-indigo-600" />
                <span>Edit Family Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditFamilyOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {editSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveFamily} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Family Name *</label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sanctuary Description</label>
                <textarea
                  rows={4}
                  value={familyDesc}
                  onChange={(e) => setFamilyDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditFamilyOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
      <AddMemoryModal isOpen={isAddMemoryOpen} onClose={() => setIsAddMemoryOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}
