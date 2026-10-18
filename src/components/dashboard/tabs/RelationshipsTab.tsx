"use client";

import React, { useState } from "react";
import {
  useGetRelationshipsQuery,
  useUpdateRelationshipMutation,
  useDeleteRelationshipMutation,
  RelationshipRecord,
} from "@/redux/api/familyApi";
import {
  Heart,
  Plus,
  GitMerge,
  ShieldCheck,
  Loader2,
  Search,
  X,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

const RELATIONSHIP_TYPES = [
  { code: "FATHER", label: "Father" },
  { code: "MOTHER", label: "Mother" },
  { code: "SPOUSE", label: "Spouse / Partner" },
  { code: "CHILD", label: "Child" },
  { code: "SON", label: "Son" },
  { code: "DAUGHTER", label: "Daughter" },
  { code: "SIBLING", label: "Sibling (Brother / Sister)" },
  { code: "BROTHER", label: "Brother" },
  { code: "SISTER", label: "Sister" },
  { code: "COUSIN", label: "Cousin" },
  { code: "UNCLE_AUNT", label: "Uncle / Aunt" },
  { code: "GRANDPARENT", label: "Grandparent" },
  { code: "GRANDCHILD", label: "Grandchild" },
  { code: "RELATIVE", label: "Other Relative" },
];

export default function RelationshipsTab() {
  const {
    searchTerm,
    debouncedSearch,
    page,
    limit,
    setLimit,
    setSearchTerm,
    setPage,
    clearSearch,
  } = usePaginationSearch({
    defaultLimit: 10,
    searchParamKey: "rel_search",
    pageParamKey: "rel_page",
    limitParamKey: "rel_limit",
  });

  const { data: relationships = [], isLoading } = useGetRelationshipsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [updateRelationship, { isLoading: isUpdating }] = useUpdateRelationshipMutation();
  const [deleteRelationship, { isLoading: isDeleting }] = useDeleteRelationshipMutation();

  const paginationMeta = (relationships as any)?.meta;
  const safeRelationships = Array.isArray(relationships) ? relationships : [];

  // Edit State
  const [editingRel, setEditingRel] = useState<RelationshipRecord | null>(null);
  const [editTypeCode, setEditTypeCode] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [editSuccessMsg, setEditSuccessMsg] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");

  // Delete State
  const [deletingRel, setDeletingRel] = useState<RelationshipRecord | null>(null);

  const handleOpenEdit = (rel: RelationshipRecord) => {
    setEditingRel(rel);
    setEditTypeCode(rel.type || "RELATIVE");
    setEditStatus(rel.status || "ACTIVE");
    setEditSuccessMsg("");
    setEditErrorMsg("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRel) return;

    setEditErrorMsg("");
    setEditSuccessMsg("");

    try {
      await updateRelationship({
        id: editingRel.id,
        typeCode: editTypeCode,
        status: editStatus,
      }).unwrap();
      setEditSuccessMsg("Relationship updated successfully!");
      setTimeout(() => {
        setEditingRel(null);
        setEditSuccessMsg("");
      }, 1000);
    } catch (err: any) {
      setEditErrorMsg(err?.data?.message || err?.message || "Failed to update relationship");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingRel) return;
    try {
      await deleteRelationship(deletingRel.id).unwrap();
      setDeletingRel(null);
    } catch (err: any) {
      console.error("Failed to delete relationship:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-400" />
          <span className="font-bold text-xs text-white">
            {paginationMeta?.total ?? safeRelationships.length} Active Relationship Connections
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search relatives or tie types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Link
            href="/owner-dashboard?tab=tree"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Map In 2D Tree</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          <span>Loading relationships matrix from database...</span>
        </div>
      ) : safeRelationships.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <Heart className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-white">No relationships mapped</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Map family ties between parents, children, spouses, and siblings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 whitespace-nowrap">From Relative</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Relationship Type</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">To Relative</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Verification Status</th>
                    <th className="px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {safeRelationships.map((rel) => (
                    <tr key={rel.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{rel.from || "Relative A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-[11px]">
                          <GitMerge className="h-3.5 w-3.5" />
                          {rel.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{rel.to || "Relative B"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <ShieldCheck className="h-4 w-4" />
                          {rel.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rel)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Relationship"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingRel(rel)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Unlink / Delete Relationship"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.total > 0 && (
            <PaginationControls
              meta={paginationMeta}
              currentPage={page}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={setLimit}
              isLoading={isLoading}
              itemLabel="relationship connections"
            />
          )}
        </div>
      )}

      {/* Edit Relationship Modal */}
      {editingRel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitMerge className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Update Relationship Tie</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRel(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">From</span>
                  <span className="font-bold text-white">{editingRel.from || "Relative A"}</span>
                </div>
                <GitMerge className="h-4 w-4 text-slate-600" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">To</span>
                  <span className="font-bold text-white">{editingRel.to || "Relative B"}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Relationship Type</label>
                <select
                  value={editTypeCode}
                  onChange={(e) => setEditTypeCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {RELATIONSHIP_TYPES.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.label} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Verification Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Verified Connection)</option>
                  <option value="PENDING_CONFIRMATION">PENDING_CONFIRMATION</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              {editErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                  {editErrorMsg}
                </div>
              )}

              {editSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRel(null)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Unlink Confirmation Modal */}
      {deletingRel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-950/80 border border-rose-800/60 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-base">Unlink Relationship?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to remove the connection between{" "}
                <strong className="text-white">{deletingRel.from}</strong> and{" "}
                <strong className="text-white">{deletingRel.to}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRel(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Keep Link
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Unlink Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
