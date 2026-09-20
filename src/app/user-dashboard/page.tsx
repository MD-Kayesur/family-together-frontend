"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import SanctuaryDashboardWrapper, {
  normalizeDashboardTab,
} from "@/components/dashboard/SanctuaryDashboardWrapper";
import TreeTab from "@/components/dashboard/tabs/TreeTab";
import MembersTab from "@/components/dashboard/tabs/MembersTab";
import MemoriesTab from "@/components/dashboard/tabs/MemoriesTab";
import EventsTab from "@/components/dashboard/tabs/EventsTab";
import MessagesTab from "@/components/dashboard/tabs/MessagesTab";
import FamilyTab from "@/components/dashboard/tabs/FamilyTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";

interface UserOverviewTabProps {
  user: any;
  memories: any[];
  events: any[];
  members: any[];
}

function UserOverviewTab({ user, memories, events, members }: UserOverviewTabProps) {
  const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl shadow-indigo-950/10">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <TreePine className="w-80 h-80" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{user.role || "MEMBER"} Account</span>
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
              href="/user-dashboard?tab=tree"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all group"
            >
              <TreePine className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Explore Family Tree</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/user-dashboard?tab=memories"
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
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TreePine className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
              Interactive Family Tree
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize multi-generational family connections, ancestors, and descendants in an interactive canvas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>Personal Lineage</span>
            <Link href="/user-dashboard?tab=tree" className="inline-flex items-center gap-1 hover:underline">
              <span>Open Tree</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Memories */}
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
              Memory Vault & Photos
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cherish timeless family photos, audio stories, heirloom snapshots, and milestone memories.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>{memories.length} Memories Saved</span>
            <Link href="/user-dashboard?tab=memories" className="inline-flex items-center gap-1 hover:underline">
              <span>View Vault</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 3: Events */}
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
              Family Events & Dates
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay updated on upcoming birthdays, anniversaries, weddings, and family reunions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>{events.length} Upcoming Events</span>
            <Link href="/user-dashboard?tab=events" className="inline-flex items-center gap-1 hover:underline">
              <span>View Events</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 4: Members */}
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
              Family Directory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View connected relatives, their generations, relationships, and profiles in your family directory.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>{members.length} Members Listed</span>
            <Link href="/user-dashboard?tab=members" className="inline-flex items-center gap-1 hover:underline">
              <span>Directory</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Memories & Family Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Highlights */}
        <div className="lg:col-span-2 space-y-6">
          <div id="memories-feed" className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-base text-white">Recent Memories</h2>
                <p className="text-xs text-slate-400">Photographs and stories shared by family members</p>
              </div>
              <Link
                href="/user-dashboard?tab=memories"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                View All →
              </Link>
            </div>

            {memories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memories.slice(0, 4).map((memory: any) => (
                  <div
                    key={memory.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{memory.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{memory.description || "No description provided."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 bg-slate-950 rounded-xl border border-dashed border-slate-800">
                <ImageIcon className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">No memories shared yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Memories added by your family sanctuary will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Upcoming Gatherings */}
          <div id="gatherings-feed" className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-base text-white">Upcoming Gatherings</h2>
                <p className="text-xs text-slate-400">Upcoming celebrations and anniversaries</p>
              </div>
              <Link
                href="/user-dashboard?tab=events"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Calendar →
              </Link>
            </div>

            {events.length > 0 ? (
              <div className="space-y-3">
                {events.slice(0, 3).map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/60 flex flex-col items-center justify-center font-bold leading-none">
                        <span className="text-xs">{new Date(event.startDate || event.createdAt).toLocaleDateString("en-US", { month: "short" })}</span>
                        <span className="text-sm">{new Date(event.startDate || event.createdAt).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white">{event.title}</p>
                        <p className="text-[11px] text-slate-400">{event.location || "Family Virtual Gathering"}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {event.type || "Celebration"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-slate-950 rounded-xl border border-dashed border-slate-800">
                <Calendar className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">No events scheduled</p>
                <p className="text-[11px] text-slate-500 mt-1">Check back later for family reunion announcements.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Account & Membership Info */}
        <div className="space-y-6">
          {/* User Profile Summary */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white">Your Account Details</h3>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="h-12 w-12 rounded-full bg-purple-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-purple-600/20">
                {userInitial}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{user.fullName}</h4>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Role Status:</span>
                <span className="font-semibold px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800 uppercase tracking-wide text-[10px]">
                  {user.role || "USER"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email Verification:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Access Level:</span>
                <span className="font-medium text-slate-300">Member (Interactive Tree & Relatives)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/user-dashboard?tab=profile"
                className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Edit Profile Settings
              </Link>
            </div>
          </div>

          {/* Start Your Own Sanctuary Banner */}
          <div className="rounded-2xl bg-linear-to-br from-indigo-950/40 to-purple-950/40 border border-purple-900/40 p-5 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-xs text-purple-200">Want to create your own family sanctuary?</h4>
            <p className="text-[11px] text-purple-300/70 leading-relaxed">
              If you are looking to become an Owner and manage your own family sanctuary, invite relatives, and configure administration settings, you can upgrade your account anytime.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Learn more</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const rawTab = searchParams?.get("tab");
  const currentTab = normalizeDashboardTab(rawTab);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: memories = [] } = useGetMemoriesQuery(
    user ? { userId: user.id, userEmail: user.email } : undefined,
    { skip: !isAuthenticated }
  );
  const { data: events = [] } = useGetEventsQuery(undefined, { skip: !isAuthenticated });
  const { data: members = [] } = useGetMembersQuery(undefined, { skip: !isAuthenticated });

  if (!user) return null;

  switch (currentTab) {
    case "tree":
      return <TreeTab role="MEMBER" currentUserId={user.id} />;
    case "members":
      return <MembersTab role="MEMBER" currentUserId={user.id} />;
    case "messages":
      return <MessagesTab role="MEMBER" currentUserId={user.id} />;
    case "memories":
      return <MemoriesTab role="MEMBER" />;
    case "events":
      return <EventsTab />;
    case "family":
      return <FamilyTab />;
    case "documents":
      return <DocumentsTab />;
    case "profile":
    case "settings":
      return <SettingsTab />;
    case "dashboard":
    default:
      return (
        <UserOverviewTab
          user={user}
          memories={memories}
          events={events}
          members={members}
        />
      );
  }
}

export default function UserDashboardPage() {
  return (
    <SanctuaryDashboardWrapper>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-slate-400">
            <span className="h-6 w-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading sanctuary tab...</span>
          </div>
        }
      >
        <UserDashboardContent />
      </Suspense>
    </SanctuaryDashboardWrapper>
  );
}
