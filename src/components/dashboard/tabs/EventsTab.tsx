"use client";

import React, { useState } from "react";
import { useGetEventsQuery } from "@/redux/api/familyApi";
import { Calendar, Plus, MapPin, Video, Loader2, Search, X } from "lucide-react";
import AddEventModal from "@/components/modals/AddEventModal";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

export default function EventsTab() {
  const {
    searchTerm,
    debouncedSearch,
    page,
    limit,
    setLimit,
    setSearchTerm,
    setPage,
    clearSearch,
  } = usePaginationSearch({ defaultLimit: 6, searchParamKey: "search" });

  const { data: events = [], isLoading, refetch } = useGetEventsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const paginationMeta = (events as any)?.meta;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-400" />
          <span className="font-bold text-xs text-white">
            {paginationMeta ? `${paginationMeta.total} Events` : `${events.length} Upcoming Events`}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Real-time Route Synced Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events by title, place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
                title="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsAddEventOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Events Cards */}
      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-400 text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Searching family events in database...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <Calendar className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-white">
            {searchTerm ? `No events found matching "${searchTerm}"` : "No events scheduled"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? "Try adjusting your search keywords or clear the filter."
              : "Schedule an upcoming birthday or virtual reunion for your family members."}
          </p>
          {searchTerm ? (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Clear Filter
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddEventOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              + Create Event
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:border-slate-700 transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-emerald-950/80 text-emerald-400 flex flex-col items-center justify-center shrink-0 border border-emerald-800/60">
                  <span className="text-xs font-black uppercase">
                    {new Date(evt.date).toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="text-lg font-black leading-none">
                    {new Date(evt.date).getDate()}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <h4 className="font-extrabold text-white text-base leading-tight">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    {evt.isVirtual ? (
                      <>
                        <Video className="h-4 w-4 text-indigo-400" />
                        <span>Virtual Event ({evt.location || "Online Link"})</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        <span>{evt.location || "Location TBD"}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            meta={paginationMeta}
            currentPage={page}
            onPageChange={setPage}
            limit={limit}
            onLimitChange={setLimit}
            isLoading={isLoading}
            itemLabel="events"
          />
        </div>
      )}

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => {
          setIsAddEventOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

