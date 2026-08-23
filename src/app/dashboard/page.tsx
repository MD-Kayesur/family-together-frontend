"use client";

import React, { useState, useEffect } from "react";
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
  UserPlus,
  Plus,
  Link as LinkIcon,
  Check,
  X,
  ExternalLink,
  Edit2,
  Clock,
  Bell,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";
import ViewerDashboardPage from "./viewer/page";

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: "req_1",
      initial: "Z",
      name: "Zain Rahman",
      note: "Claims to be cousin",
    },
  ]);

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

  // Render Viewer Sanctuary Dashboard for VIEWER role
  if (user?.role?.toUpperCase() === "VIEWER") {
    return <ViewerDashboardPage />;
  }

  const familyName = user.fullName.split(" ").slice(-1)[0] || "Rahman";

  const sidebarLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
    { name: "My Family", href: "/dashboard/family", icon: Users, badge: null },
    { name: "Family Tree", href: "/dashboard/tree", icon: TreePine, badge: null },
    { name: "Members", href: "/dashboard/members", icon: UserCheck, badge: null },
    { name: "Relationships", href: "/dashboard/relationships", icon: Heart, badge: null },
    { name: "Memories", href: "/dashboard/memories", icon: ImageIcon, badge: null },
    { name: "Events", href: "/dashboard/events", icon: Calendar, badge: null },
    { name: "Documents", href: "/dashboard/documents", icon: FolderLock, badge: null },
    { name: "Invitations", href: "/dashboard/invitations", icon: Mail, badge: "2" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, badge: null },
  ];

  const handleApprove = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

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
              const isActive = pathname === item.href;
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
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-1 pt-4 border-t border-slate-100">
          <Link
            href="/support"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>Help & Support</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
          >
            <UserCheck className="h-4 w-4 text-slate-400" />
            <span>User Profile</span>
          </Link>

          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/signin");
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all text-left cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-end sticky top-0 z-40 gap-4">
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user.fullName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl w-full">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  The {familyName} Family
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm uppercase tracking-wider">
                  {user.role || "OWNER"}
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-xl">
                Manage your family&apos;s legacy, members, and shared history from this central command hub.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="h-4 w-4 text-slate-500" />
                <span>Invite User</span>
              </button>

              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* 4 Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Family Members */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Family Members</span>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">42</span>
                <span className="text-xs font-medium text-emerald-600">+3 this month</span>
              </div>
            </div>

            {/* Connected Users */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Connected Users</span>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <LinkIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">12</div>
            </div>

            {/* Relationships */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Relationships</span>
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Heart className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">86</div>
            </div>

            {/* Pending Invites */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Invites</span>
                <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-rose-600">2</span>
                <Link
                  href="/dashboard/invitations"
                  className="text-xs font-bold text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1"
                >
                  <span>Review</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Middle Section (Tree Overview + Action Required/Activity) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Family Tree Overview (2 Columns) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-indigo-600" />
                  <h2 className="font-bold text-xl text-slate-900">Family Tree Overview</h2>
                </div>
                <Link
                  href="/dashboard/tree"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>Open Full Tree</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Tree Diagram Visual Canvas */}
              <div className="p-8 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col items-center justify-center space-y-8 min-h-[260px] relative overflow-hidden">
                {/* Top Node */}
                <div className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 z-10">
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    👨‍🦳
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Omar Rahman</div>
                    <div className="text-[10px] text-slate-400 font-medium">1945 - Present</div>
                  </div>
                </div>

                {/* Connecting Lines */}
                <div className="w-1/2 border-t-2 border-slate-200 relative -my-4">
                  <div className="absolute left-1/2 -top-4 bottom-0 w-0.5 bg-slate-200" />
                </div>

                {/* Child Nodes Row */}
                <div className="grid grid-cols-3 gap-6 w-full max-w-lg z-10">
                  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-center justify-center">
                    <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      A
                    </div>
                    <span className="font-semibold text-xs text-slate-700 truncate">Aisha R.</span>
                  </div>

                  <div className="px-3 py-2 rounded-xl bg-white border-2 border-indigo-600 shadow-md flex items-center gap-2 justify-center relative">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                      👩
                    </div>
                    <div className="truncate text-left">
                      <div className="font-bold text-xs text-slate-900">Tariq Rahman</div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-100 text-indigo-700 uppercase">
                        YOU
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-center justify-center">
                    <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      F
                    </div>
                    <span className="font-semibold text-xs text-slate-700 truncate">Farah N.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stacked Column (Action Required + Recent Activity) */}
            <div className="space-y-6">
              {/* Action Required Card */}
              <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-4">
                <div className="flex items-center gap-2 text-rose-700">
                  <UserPlus className="h-4 w-4" />
                  <h3 className="font-bold text-sm">Action Required</h3>
                </div>

                <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  PENDING JOIN REQUESTS ({pendingRequests.length})
                </div>

                {pendingRequests.length > 0 ? (
                  pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {req.initial}
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-slate-900">{req.name}</div>
                          <div className="text-[11px] text-slate-400">{req.note}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleReject(req.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          aria-label="Decline"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(req.id)}
                          className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-600 hover:text-white text-indigo-600 transition-colors cursor-pointer"
                          aria-label="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">No pending join requests.</div>
                )}
              </div>

              {/* Recent Activity Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <h3 className="font-bold text-sm text-slate-900">Recent Activity</h3>
                  </div>
                  <Link
                    href="/dashboard/activity"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800">
                        <span className="font-bold">Sarah R.</span> updated her profile information.
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">2 hours ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800">
                        <span className="font-bold">Ahmed R.</span> added a new relationship: <span className="italic">Spouse</span>.
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Yesterday, 4:30 PM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FolderLock className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800">
                        <span className="font-bold">Uncle Javed</span> added a new memory document.
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Oct 24, 2023</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <UserPlus className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800">
                        You invited <span className="font-bold">Laila M.</span> to the family.
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Oct 20, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Family Overview */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-900">Family Overview</h2>
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                aria-label="Edit description"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              Established in roots of resilience and growth. The {familyName} family sanctuary is dedicated to preserving our shared history, celebrating current milestones, and connecting generations across the globe. Documenting origins from Lahore to modern settlements in London and Toronto.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
