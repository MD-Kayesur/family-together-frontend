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
  Bell,
  Search,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import UserNavbarAvatarMenu from "@/components/dashboard/UserNavbarAvatarMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getDashboardRouteByRole } from "@/lib/utils/roleUtils";

interface SanctuaryDashboardWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function SanctuaryDashboardWrapper({
  children,
  title,
  subtitle,
}: SanctuaryDashboardWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

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

  const sidebarLinks = [
    { name: "Dashboard", href: getDashboardRouteByRole(user?.role), icon: LayoutDashboard, badge: null },
    { name: "My Family", href: "/owner-dashboard/family", icon: Users, badge: null },
    { name: "Family Tree", href: "/owner-dashboard/tree", icon: TreePine, badge: null },
    { name: "Members", href: "/owner-dashboard/members", icon: UserCheck, badge: null },
    { name: "Relationships", href: "/owner-dashboard/relationships", icon: Heart, badge: null },
    { name: "Memories", href: "/owner-dashboard/memories", icon: ImageIcon, badge: null },
    { name: "Events", href: "/owner-dashboard/events", icon: Calendar, badge: null },
    { name: "Documents", href: "/owner-dashboard/documents", icon: FolderLock, badge: null },
    { name: "Invitations", href: "/owner-dashboard/invitations", icon: Mail, badge: "2" },
    { name: "Settings", href: "/owner-dashboard/settings", icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen transition-colors duration-200">
        <div className="space-y-7 overflow-y-auto">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-all">
              <TreePine className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-indigo-950 dark:text-white tracking-tight leading-none">
                FamilyRoots
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mt-0.5">
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
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400"}`} />
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

        {/* Clean Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
          <span>FamilyRoots Sanctuary</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200">
          <div className="relative w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search family records..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button (Sun & Moon) */}
            <ThemeToggle />

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            <div className="pl-2 border-l border-slate-200 dark:border-slate-700">
              <UserNavbarAvatarMenu />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-8 space-y-6 w-full max-w-full">
          {title && (
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">{subtitle}</p>}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
