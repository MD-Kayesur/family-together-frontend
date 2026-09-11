"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TreePine,
  Image as ImageIcon,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import {
  useGetMemoriesQuery,
  useGetEventsQuery,
  useGetMembersQuery,
} from "@/redux/api/familyApi";
import SanctuaryDashboardWrapper from "@/components/dashboard/SanctuaryDashboardWrapper";

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: memories = [] } = useGetMemoriesQuery(undefined, { skip: !isAuthenticated });
  const { data: events = [] } = useGetEventsQuery(undefined, { skip: !isAuthenticated });
  const { data: members = [] } = useGetMembersQuery(undefined, { skip: !isAuthenticated });

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center gap-3 text-indigo-400 font-semibold">
          <span className="h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading your family portal...</span>
        </div>
      </div>
    );
  }

  const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  return (
    <SanctuaryDashboardWrapper>
      <div className="space-y-8 w-full max-w-full">
        {/* Welcome Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl shadow-indigo-950/10">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <TreePine className="w-80 h-80" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Normal Member Account</span>
              <span className="mx-1">•</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <CheckCircle className="h-3 w-3" />
                Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.fullName}!
            </h1>
            <p className="text-indigo-100/80 text-sm leading-relaxed">
              Explore your family lineage, discover ancestors, preserve precious memories, and celebrate upcoming family gatherings together.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/owner-dashboard/tree"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all group"
              >
                <TreePine className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>Explore Family Tree</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/owner-dashboard/memories"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-semibold text-xs hover:bg-white/20 border border-white/20 transition-all"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Browse Memories</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Family Tree */}
          <Link
            href="/owner-dashboard/tree"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TreePine className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Interactive Family Tree
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Visualize multi-generational family connections, ancestors, and descendants in an interactive canvas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>View Canvas</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Memories */}
          <Link
            href="/owner-dashboard/memories"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Memory Vault & Photos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Cherish timeless family photos, audio stories, heirloom snapshots, and milestone memories.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>{memories.length} Memories Saved</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Events */}
          <Link
            href="/owner-dashboard/events"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Family Events & Dates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Stay updated on upcoming birthdays, anniversaries, weddings, and family reunions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>{events.length} Upcoming Events</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Members */}
          <Link
            href="/owner-dashboard/members"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Family Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                View connected relatives, their generations, relationships, and profiles in your family directory.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>{members.length} Members Listed</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Two Column Layout: Recent Memories & Family Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Highlights */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">Recent Memories</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Photographs and stories shared by family members</p>
                </div>
                <Link
                  href="/owner-dashboard/memories"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  View All →
                </Link>
              </div>

              {memories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memories.slice(0, 4).map((memory: any) => (
                    <div
                      key={memory.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all space-y-2"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{memory.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{memory.description || "No description provided."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No memories shared yet</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    Memories added by your family sanctuary will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming Gatherings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">Upcoming Gatherings</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Upcoming celebrations and anniversaries</p>
                </div>
                <Link
                  href="/owner-dashboard/events"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  Calendar →
                </Link>
              </div>

              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.slice(0, 3).map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex flex-col items-center justify-center font-bold leading-none">
                          <span className="text-xs">{new Date(event.startDate || event.createdAt).toLocaleDateString("en-US", { month: "short" })}</span>
                          <span className="text-sm">{new Date(event.startDate || event.createdAt).getDate()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{event.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{event.location || "Family Virtual Gathering"}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {event.type || "Celebration"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No events scheduled</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Check back later for family reunion announcements.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 Col): Account & Membership Info */}
          <div className="space-y-6">
            {/* User Profile Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Your Account Details</h3>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-indigo-600/20">
                  {userInitial}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{user.fullName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Role Status:</span>
                  <span className="font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 uppercase tracking-wide text-[10px]">
                    {user.role || "USER"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Email Verification:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Access Level:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Member (View & Explore)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/user-dashboard/profile"
                  className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                >
                  Edit Profile Settings
                </Link>
              </div>
            </div>

            {/* Start Your Own Sanctuary Banner */}
            <div className="rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/40 p-5 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-xs text-indigo-950 dark:text-indigo-200">Want to create your own family sanctuary?</h4>
              <p className="text-[11px] text-indigo-900/70 dark:text-indigo-300/70 leading-relaxed">
                If you are looking to become an Owner and manage your own family sanctuary, invite relatives, and configure administration settings, you can upgrade your account anytime.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span>Learn more</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SanctuaryDashboardWrapper>
  );
}
