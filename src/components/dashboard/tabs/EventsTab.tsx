"use client";

import React, { useState } from "react";
import {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  EventRecord,
} from "@/redux/api/familyApi";
import {
  Calendar,
  Plus,
  MapPin,
  Video,
  Loader2,
  Search,
  X,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import AddEventModal from "@/components/modals/AddEventModal";
import { usePaginationSearch } from "@/hooks/usePaginationSearch";
import PaginationControls from "@/components/common/PaginationControls";

/**
 * Helper to compute event active/inactive status.
 * If server-provided status ('ACTIVE' or 'INACTIVE') is present, use it.
 * Otherwise, compare day-level date: eventDay >= today is ACTIVE, else INACTIVE.
 */
export function isEventActive(date: string | Date, serverStatus?: string): boolean {
  if (serverStatus === "ACTIVE") return true;
  if (serverStatus === "INACTIVE") return false;
  if (!date) return false;
  const eventDate = new Date(date);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
  return eventDay >= todayStart;
}

/**
 * Event Details Modal - Fetches complete event record via GET /family/events/:id
 */
function EventDetailsModal({
  id,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}: {
  id: string;
  onClose: () => void;
  onEdit: (event: EventRecord) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}) {
  const { data: event, isLoading, isError } = useGetEventByIdQuery(id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 font-bold flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Event Details</h3>
              <p className="text-xs text-slate-400">ID: {id.slice(0, 16)}...</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              <span>Fetching event details from API...</span>
            </div>
          ) : isError || !event ? (
            <div className="py-8 text-center text-rose-400 space-y-2">
              <AlertTriangle className="h-8 w-8 mx-auto" />
              <p className="font-bold text-sm">Failed to load event details</p>
              <p className="text-slate-400 text-xs">The event might have been cancelled or deleted.</p>
            </div>
          ) : (
            <>
              {/* Event Type & Date Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                      isEventActive(event.date, event.status)
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                        : "bg-slate-800/80 text-slate-400 border-slate-700/60"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">
                      {new Date(event.date).toLocaleString("default", { month: "short" })}
                    </span>
                    <span className="text-base font-black leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{event.title}</h4>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  {isEventActive(event.date, event.status) ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active (Upcoming)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800/90 text-slate-400 border border-slate-700/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      Inactive (Expired)
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      event.isVirtual
                        ? "bg-indigo-950/60 text-indigo-300 border border-indigo-800/60"
                        : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                    }`}
                  >
                    {event.isVirtual ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                    {event.isVirtual ? "Virtual Event" : "Physical Venue"}
                  </span>
                </div>
              </div>

              {/* Location or Meeting Link */}
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between">
                <div className="truncate mr-2">
                  <span className="text-slate-400 text-[11px] font-medium block">
                    {event.isVirtual ? "Virtual Meeting URL / Platform" : "Physical Venue Address"}
                  </span>
                  <span className="text-white font-bold text-xs block mt-0.5 truncate">
                    {event.location || (event.isVirtual ? "Online Video Call" : "Location To Be Decided")}
                  </span>
                </div>
                {event.location && (
                  <button
                    type="button"
                    onClick={() => handleCopy(event.location!, "location")}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    title="Copy Location"
                  >
                    {copiedKey === "location" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Description / Agenda */}
              {event.description && (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
                  <span className="text-slate-400 text-[11px] font-medium block">Agenda &amp; Celebration Notes</span>
                  <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-line">{event.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2 text-slate-400 text-[11px]">
                <div className="flex items-center justify-between">
                  <span>Lifecycle Status</span>
                  <span
                    className={`font-semibold flex items-center gap-1.5 ${
                      isEventActive(event.date, event.status)
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isEventActive(event.date, event.status)
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-slate-500"
                      }`}
                    />
                    {isEventActive(event.date, event.status)
                      ? "Active (Upcoming / Scheduled)"
                      : "Inactive (Expired / Past Date)"}
                  </span>
                </div>

                {event.family?.name && (
                  <div className="flex items-center justify-between">
                    <span>Family Sanctuary</span>
                    <span className="text-slate-200 font-semibold">{event.family.name}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Unique Event ID</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(event.id, "id")}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[10px] cursor-pointer"
                  >
                    <span>{event.id}</span>
                    {copiedKey === "id" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {event && !isLoading && (
          <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(event.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-800/60 hover:bg-rose-950/40 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isDeleting ? "Deleting..." : "Delete Event"}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(event);
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Event</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Edit Event Modal - Updates record via PATCH /family/events/:id
 */
function EditEventModal({
  event,
  onClose,
  onSuccess,
}: {
  event: EventRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [updateEvent, { isLoading }] = useUpdateEventMutation();
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(
    event?.date ? new Date(event.date).toISOString().split("T")[0] : ""
  );
  const [location, setLocation] = useState(event?.location || "");
  const [description, setDescription] = useState(event?.description || "");
  const [isVirtual, setIsVirtual] = useState(event?.isVirtual || false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!event) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      setErrorMsg("Title and date are required.");
      return;
    }

    try {
      await updateEvent({
        id: event.id,
        body: {
          title: title.trim(),
          date,
          location: location.trim(),
          description: description.trim(),
          isVirtual,
        },
      }).unwrap();

      setSuccessMsg("Event updated successfully!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to update event.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-5 relative my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white leading-tight">Edit Event</h2>
              <p className="text-xs text-slate-400">Modify celebration schedule, location, or agenda.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 text-xs overflow-y-auto pr-1">
          <div>
            <label className="block font-bold text-slate-200 mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Event Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                required
              />
              {date && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  {new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Status: Active (Upcoming)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/90 text-slate-400 border border-slate-700 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      Status: Inactive (Expired / Past)
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Location or Link</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Description &amp; Agenda</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="editIsVirtual"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-950 cursor-pointer"
            />
            <label htmlFor="editIsVirtual" className="font-semibold text-slate-300 cursor-pointer">
              Virtual / Online Event
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/25 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventsTab() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

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
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);

  const paginationMeta = (events as any)?.meta;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently cancel and delete this event?")) {
      return;
    }

    try {
      await deleteEvent(id).unwrap();
      if (selectedEventId === id) setSelectedEventId(null);
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to delete event.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header & Search Controls */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-xs text-white">
              {paginationMeta ? `${paginationMeta.total} Events` : `${events.length} Events`}
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

        {/* Status Filter Tabs (All / Active / Inactive) */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60 overflow-x-auto pb-0.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0">Filter Status:</span>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("ALL");
              setPage(1);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === "ALL"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            All Events
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("ACTIVE");
              setPage(1);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              statusFilter === "ACTIVE"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm"
                : "bg-slate-950 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active (Upcoming)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("INACTIVE");
              setPage(1);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              statusFilter === "INACTIVE"
                ? "bg-slate-800 text-slate-200 border border-slate-600 shadow-sm"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span>Inactive (Expired)</span>
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
            {searchTerm
              ? `No events found matching "${searchTerm}"`
              : statusFilter === "ACTIVE"
              ? "No active upcoming events"
              : statusFilter === "INACTIVE"
              ? "No inactive expired events"
              : "No events scheduled"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? "Try adjusting your search keywords or clear the filter."
              : statusFilter !== "ALL"
              ? "Change the filter status or schedule an upcoming family event."
              : "Schedule an upcoming birthday or virtual reunion for your family members."}
          </p>
          {searchTerm || statusFilter !== "ALL" ? (
            <button
              type="button"
              onClick={() => {
                clearSearch();
                setStatusFilter("ALL");
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Reset Filters
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
            {events.map((evt) => {
              const isActive = isEventActive(evt.date, evt.status);
              return (
                <div
                  key={evt.id}
                  className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4 transition-all ${
                    isActive
                      ? "border-slate-800 hover:border-emerald-500/40 hover:shadow-emerald-950/20"
                      : "border-slate-800/80 hover:border-slate-700 opacity-90"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Calendar Date Badge */}
                    <div
                      className={`h-14 w-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border transition-colors ${
                        isActive
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60 shadow-sm"
                          : "bg-slate-800/80 text-slate-400 border-slate-700/60"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase">
                        {new Date(evt.date).toLocaleString("default", { month: "short" })}
                      </span>
                      <span className="text-lg font-black leading-none">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-white text-base leading-tight truncate">
                          {evt.title}
                        </h4>

                        {/* Status Badge */}
                        {isActive ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                            title="Active: Scheduled on or after today"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/90 text-slate-400 border border-slate-700/60 shrink-0"
                            title="Inactive: Event date has passed / expired"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        {evt.isVirtual ? (
                          <>
                            <Video className="h-4 w-4 text-indigo-400 shrink-0" />
                            <span className="truncate">Virtual ({evt.location || "Online Call"})</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{evt.location || "Location TBD"}</span>
                          </>
                        )}
                      </div>

                      {evt.description && (
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Action Bar */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedEventId(evt.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View details"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingEvent(evt)}
                      className="px-3 py-1.5 rounded-xl border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Edit event"
                    >
                      <Pencil className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(evt.id)}
                      className="p-1.5 px-2.5 rounded-xl border border-rose-900/40 text-rose-400 hover:bg-rose-950/50 hover:border-rose-700/60 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Delete event"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
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
              itemLabel="events"
            />
          )}
        </div>
      )}

      {/* Create Event Modal */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => {
          setIsAddEventOpen(false);
          refetch();
        }}
      />

      {/* View Event Details Modal */}
      {selectedEventId && (
        <EventDetailsModal
          id={selectedEventId}
          onClose={() => setSelectedEventId(null)}
          onEdit={(evt) => setEditingEvent(evt)}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSuccess={() => {
            refetch();
            if (selectedEventId === editingEvent.id) {
              setSelectedEventId(null);
            }
          }}
        />
      )}
    </div>
  );
}
