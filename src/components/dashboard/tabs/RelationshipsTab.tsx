"use client";

import React from "react";
import { useGetRelationshipsQuery } from "@/redux/api/familyApi";
import { Heart, Plus, GitMerge, ShieldCheck, Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

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

  const paginationMeta = (relationships as any)?.meta;
  const safeRelationships = Array.isArray(relationships) ? relationships : [];

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
    </div>
  );
}
