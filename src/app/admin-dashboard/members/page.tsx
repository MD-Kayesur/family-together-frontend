"use client";

import React, { useState } from "react";
import {
  useGetMembersQuery,
  useDeleteMemberMutation,
  FamilyMemberRecord,
} from "@/redux/api/familyApi";
import {
  Users,
  Search,
  Plus,
  Trash2,
  UserCheck,
  Loader2,
  AlertTriangle,
  TreePine,
  CheckCircle2,
  Calendar,
  MapPin,
  Briefcase,
  Mail,
} from "lucide-react";
import AddMemberModal from "@/components/modals/AddMemberModal";

export default function AdminMembersPage() {
  const { data: members = [], isLoading, refetch } = useGetMembersQuery();
  const [deleteMember] = useDeleteMemberMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete family member profile (${name}) from your PostgreSQL sanctuary database?`
      )
    ) {
      try {
        await deleteMember(id).unwrap();
        refetch();
      } catch (err) {
        alert("Failed to delete family member.");
      }
    }
  };

  const filteredMembers = members.filter((m) => {
    const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
    const email = ((m as any).email || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800">
              <UserCheck className="h-5 w-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Family Members Directory
            </h1>
          </div>
          <p className="text-sm text-slate-400 font-normal">
            Add relatives, manage verified family member profiles, detect existing members, and prevent duplicate entries live in PostgreSQL.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddMemberOpen(true)}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Add Relative / Member</span>
        </button>
      </div>

      {/* Search & Action Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search member by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium placeholder:text-slate-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Showing {filteredMembers.length} of {members.length} registered family members
        </div>
      </div>

      {/* Members Grid */}
      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          <span>Loading family member profiles from database...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <Users className="h-12 w-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">
              No family members found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No family member records match your current search term. Click below to add a new relative or member.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 cursor-pointer"
          >
            + Add Relative / Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-purple-950/80 text-purple-300 border border-purple-800/60 font-extrabold text-base flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      {member.firstName ? member.firstName.charAt(0).toUpperCase() : "M"}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base leading-tight">
                        {member.firstName} {member.lastName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-extrabold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full uppercase border border-purple-800">
                          {member.gender || "MEMBER"}
                        </span>
                        {(member as any).isDeceased ? (
                          <span className="text-[10px] font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800">
                            Deceased
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                            Living
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(member.id, `${member.firstName} ${member.lastName}`)
                    }
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete member profile"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  {(member as any).email && (
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <Mail className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{(member as any).email}</span>
                    </div>
                  )}

                  {(member as any).dob && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>Born: {(member as any).dob}</span>
                    </div>
                  )}

                  {(member as any).birthplace && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{(member as any).birthplace}</span>
                    </div>
                  )}

                  {(member as any).occupation && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{(member as any).occupation}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sanctuary Record</span>
                </span>
                <span>ID: {member.id.substring(0, 8)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal with Real-Time Deduplication */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => {
          setIsAddMemberOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
