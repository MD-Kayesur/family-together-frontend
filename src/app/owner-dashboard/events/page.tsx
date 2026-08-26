"use client";

import React, { useState } from "react";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";
import { useGetEventsQuery } from "@/redux/api/familyApi";
import { Calendar, Plus, MapPin, Video, Loader2 } from "lucide-react";
import AddEventModal from "@/components/modals/AddEventModal";

export default function EventsPage() {
  const { data: events = [], isLoading } = useGetEventsQuery();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  return (
    <SanctuaryDashboardWrapper
      title="Family Events Calendar"
      subtitle="Reunions, birthdays, anniversaries, and virtual gatherings scheduled in PostgreSQL."
    >
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-xs text-slate-800">
              {events.length} Upcoming Events
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddEventOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Events Cards */}
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Loading family events from database...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No events scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Schedule an upcoming birthday or virtual reunion for your family members.
            </p>
            <button
              type="button"
              onClick={() => setIsAddEventOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              + Create Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center shrink-0 border border-emerald-200/60">
                  <span className="text-xs font-black uppercase">
                    {new Date(evt.date).toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="text-lg font-black leading-none">
                    {new Date(evt.date).getDate()}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    {evt.isVirtual ? (
                      <>
                        <Video className="h-4 w-4 text-indigo-500" />
                        <span>Virtual Event ({evt.location || "Online Link"})</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        <span>{evt.location || "Location TBD"}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddEventModal isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} />
    </SanctuaryDashboardWrapper>
  );
}
