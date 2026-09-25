"use client";

import React, { useState } from "react";
import { X, Calendar, Sparkles, Loader2 } from "lucide-react";
import { useAddEventMutation, useGetEventsQuery } from "@/redux/api/familyApi";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const { refetch: refetchEvents } = useGetEventsQuery();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addEvent, { isLoading }] = useAddEventMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !date) {
      setErrorMsg("Event title and date are required.");
      return;
    }

    try {
      await addEvent({
        title: title.trim(),
        date,
        location: location.trim() || "Virtual Link",
        description: description.trim(),
        isVirtual,
      }).unwrap();

      refetchEvents();
      setSuccessMsg("Family event created successfully!");
      setTimeout(() => {
        setTitle("");
        setDate("");
        setLocation("");
        setDescription("");
        setIsVirtual(false);
        setSuccessMsg("");
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to create event.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white leading-tight">
                Create Family Event
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Schedule a reunion, birthday, or milestone for your family tree.
              </p>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Annual Family Reunion 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Location or Link
              </label>
              <input
                type="text"
                placeholder="e.g. Community Center or Zoom URL"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Description & Agenda
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Gathering with all cousins, dinner, photo presentation, and fun activities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isVirtual"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-950 cursor-pointer"
            />
            <label htmlFor="isVirtual" className="font-semibold text-slate-300 cursor-pointer">
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
              <span>Save Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
