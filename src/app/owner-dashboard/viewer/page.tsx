"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TreePine,
  UserCheck,
  Heart,
  Image as ImageIcon,
  Calendar,
  FolderLock,
  Mail,
  Settings,
  HelpCircle,
  LogOut,
  Eye,
  MessageSquare,
  Lock,
  ArrowRight,
  MapPin,
  Video,
  Info,
  ChevronRight,
  Search,
  Bell
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";
import {
  useGetMemoriesQuery,
  useGetEventsQuery,
  useGetMembersQuery,
} from "@/redux/api/familyApi";
import UserNavbarAvatarMenu from "@/components/dashboard/UserNavbarAvatarMenu";

export default function ViewerDashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const { data: memories = [] } = useGetMemoriesQuery();
  const { data: events = [] } = useGetEventsQuery();
  const { data: members = [] } = useGetMembersQuery();

  // Route Protection: Redirect unauthenticated users to Sign In
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
          <span>Authenticating your sanctuary access...</span>
        </div>
      </div>
    );
  }

  const familyName = user.fullName.split(" ").slice(-1)[0] || "Rahman";

  const sidebarLinks = [
    { name: "Dashboard", href: "/owner-dashboard", icon: LayoutDashboard, badge: null },
    { name: "My Family", href: "/owner-dashboard/family", icon: Users, badge: null },
    { name: "Family Tree", href: "/owner-dashboard/tree", icon: TreePine, badge: null },
    { name: "Members", href: "/owner-dashboard/members", icon: UserCheck, badge: null },
    { name: "Relationships", href: "/owner-dashboard/relationships", icon: Heart, badge: null },
    { name: "Memories", href: "/owner-dashboard/memories", icon: ImageIcon, badge: null },
    { name: "Events", href: "/owner-dashboard/events", icon: Calendar, badge: null },
    { name: "Documents", href: "/owner-dashboard/documents", icon: FolderLock, badge: null },
    { name: "Invitations", href: "/owner-dashboard/invitations", icon: Mail, badge: null },
    { name: "Settings", href: "/owner-dashboard/settings", icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/70 font-sans text-slate-800 antialiased">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen">
        <div className="space-y-7 overflow-y-auto">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-all">
              <TreePine className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-indigo-950 tracking-tight leading-none">
                FamilyRoots
              </span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mt-0.5">
                Private Sanctuary
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.name === "Dashboard" && pathname === "/owner-dashboard/viewer");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Clean Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>FamilyRoots Guest Sanctuary</span>
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Search & Notifications */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search family records..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <div className="pl-2 border-l border-slate-200">
              <UserNavbarAvatarMenu />
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl w-full">
          {/* Header Title & Role Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 text-slate-700 uppercase tracking-wider">
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>VIEWER</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">Read-only access</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                The {familyName} Family
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-slate-500" />
                <span>Message Owner</span>
              </button>

              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>Request Edit Access</span>
              </button>
            </div>
          </div>

          {/* Middle Section Grid (Featured Memory + Lineage/Events Stack) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Memory Card (2 Columns) */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl min-h-[380px] border border-slate-200/80 shadow-md group flex flex-col justify-between p-8 text-white bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent">
              {/* Background Image Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center -z-10 group-hover:scale-105 transition-all duration-500"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/20 -z-10" />

              {/* Top Badges */}
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white">
                  Latest Memory
                </span>
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-medium text-slate-200 inline-flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>{memories[0]?.photoCount || 1} photos</span>
                </span>
              </div>

              {/* Bottom Memory Details */}
              <div className="space-y-3 max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {memories[0]?.title || "Eid al-Fitr Gathering 2023"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {memories[0]?.description || "Shared by Amina Rahman • A wonderful weekend celebrating with extended family."}
                </p>
                <Link
                  href="/owner-dashboard/memories"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-indigo-300 transition-colors pt-1"
                >
                  <span>View Gallery</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Stacked Right Column (Lineage Preview + Upcoming Events) */}
            <div className="space-y-6">
              {/* Lineage Preview Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Lineage Preview</h3>
                  <Link
                    href="/owner-dashboard/tree"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Explore Tree
                  </Link>
                </div>

                {/* Lineage Tree Diagram */}
                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 flex flex-col items-center justify-center space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="h-9 w-9 rounded-full bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center border border-white shadow-sm overflow-hidden">
                      👨
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1">
                      {members[0]?.firstName || "Tariq"} R.
                    </span>
                  </div>

                  <div className="w-24 border-t-2 border-slate-200 relative">
                    <div className="absolute left-1/2 -top-2 bottom-0 w-0.5 bg-slate-200" />
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center border border-white shadow-sm">
                        👩
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 mt-1">
                        {members[1]?.firstName || "Aisha"} R.
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 font-bold text-[11px] flex items-center justify-center border border-white shadow-sm">
                        👦
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 mt-1">
                        {members[2]?.firstName || "Omar"} R.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Info className="h-3.5 w-3.5" />
                  <span>Read-only view</span>
                </div>
              </div>

              {/* Upcoming Events Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Upcoming Events</h3>
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>

                <div className="space-y-3">
                  {events.length > 0 ? (
                    events.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0 leading-none">
                          <span className="text-[9px] font-extrabold uppercase text-slate-500">
                            {new Date(evt.date).toLocaleString("default", { month: "short" })}
                          </span>
                          <span className="text-base font-extrabold text-slate-900 mt-0.5">
                            {new Date(evt.date).getDate()}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-slate-800">{evt.title}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            {evt.isVirtual ? (
                              <Video className="h-3 w-3 text-indigo-500" />
                            ) : (
                              <MapPin className="h-3 w-3 text-slate-400" />
                            )}
                            <span>{evt.location || "Location TBD"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic">No events scheduled.</div>
                  )}
                </div>

                <div className="pt-2 text-center border-t border-slate-100">
                  <Link
                    href="/owner-dashboard/events"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Full Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Key Family Members */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-900">Key Family Members</h2>
              <Link
                href="/owner-dashboard/members"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
              >
                <span>View Directory</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {members.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col items-center text-center space-y-2"
                >
                  <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-base flex items-center justify-center border border-white shadow-sm">
                    {m.gender === "FEMALE" ? "👩" : "👨"}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      {m.firstName} {m.lastName.charAt(0)}.
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {m.bio || m.gender || "Member"}
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/owner-dashboard/members"
                className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center text-center justify-center space-y-1 cursor-pointer hover:bg-indigo-100/50 transition-colors"
              >
                <span className="text-xl font-extrabold text-indigo-600">+{members.length}</span>
                <div>
                  <div className="font-bold text-xs text-indigo-950">Explore All</div>
                  <div className="text-[10px] text-indigo-600 font-medium">Shared Profiles</div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
