"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetMembersQuery, useDeleteMemberMutation } from "@/redux/api/familyApi";
import { Users, Plus, Search, Trash2, Edit, Loader2 } from "lucide-react";
import AddMemberModal from "@/components/modals/AddMemberModal";

export default function MembersPage() {
  const { data: members = [], isLoading } = useGetMembersQuery();
  const [deleteMember] = useDeleteMemberMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const filteredMembers = members.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.bio || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from your PostgreSQL database?`)) {
      try {
        await deleteMember(id).unwrap();
      } catch (err) {
        alert("Failed to delete member.");
      }
    }
  };

  return (
    <SanctuaryDashboardWrapper
      title="Family Members Directory"
      subtitle="Manage all verified family members stored live in your PostgreSQL sanctuary database."
    >
      <div className="space-y-6">
        {/* Search & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search member by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Family Member</span>
          </button>
        </div>

        {/* Member Cards Grid */}
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading family members from database...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No members found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your first family member to start building your private PostgreSQL sanctuary tree.
            </p>
            <button
              type="button"
              onClick={() => setIsAddMemberOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
            >
              + Add Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-base flex items-center justify-center shadow-sm">
                      {member.firstName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                        {member.firstName} {member.lastName}
                      </h4>
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {member.gender || "MEMBER"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(member.id, `${member.firstName} ${member.lastName}`)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete member from database"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  {member.bio || "No biography added."}
                </p>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>ID: {member.id.substring(0, 8)}...</span>
                  <span className="text-emerald-600 font-semibold">Active in PostgreSQL</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}
