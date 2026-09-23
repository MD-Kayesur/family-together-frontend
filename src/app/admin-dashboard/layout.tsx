"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  Network,
  Settings,
  FileText,
  HelpCircle,
  LogOut,
  Search,
  TreePine,
  UserCheck,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";
import NavbarNotificationMenu from "@/components/dashboard/NavbarNotificationMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { normalizeDashboardTab } from "@/components/dashboard/SanctuaryDashboardWrapper";

function AdminSidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const searchParams = useSearchParams();
  const rawTab = searchParams?.get("tab");
  const currentTab = normalizeDashboardTab(rawTab);

  const navItems = [
    { name: "Dashboard", href: "/admin-dashboard?tab=dashboard", subHref: "/admin-dashboard", tabKey: "dashboard", icon: LayoutDashboard },
    { name: "User Management", href: "/admin-dashboard?tab=users", subHref: "/admin-dashboard/users", tabKey: "users", icon: Users },
    { name: "Family Members", href: "/admin-dashboard?tab=members", subHref: "/admin-dashboard/members", tabKey: "members", icon: UserCheck },
    { name: "Messages", href: "/admin-dashboard?tab=messages", subHref: "/admin-dashboard/messages", tabKey: "messages", icon: MessageSquare },
    { name: "Activity Monitor", href: "/admin-dashboard?tab=activity", subHref: "/admin-dashboard/activity", tabKey: "activity", icon: Activity },
    { name: "Network Analytics", href: "/admin-dashboard?tab=analytics", subHref: "/admin-dashboard/analytics", tabKey: "analytics", icon: Network },
    { name: "System Settings", href: "/admin-dashboard?tab=settings", subHref: "/admin-dashboard/settings", tabKey: "settings", icon: Settings },
  ];

  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          (pathname === "/admin-dashboard" && currentTab === item.tabKey) ||
          (pathname === "/admin-dashboard" && !rawTab && item.tabKey === "dashboard") ||
          pathname === item.subHref ||
          pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onNavigate?.()}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              isActive
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Protect Admin Routes
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
          <span>Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Off-canvas Mobile Drawer for Admin */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Brand Logo & Close Button */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin-dashboard"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <TreePine className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                  FamilyRoots
                </span>
                <span className="text-xs font-bold text-purple-400 tracking-wider">
                  Admin
                </span>
                <span className="text-[10px] text-slate-400 font-medium">System Controller</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links with Suspense */}
          <Suspense fallback={<div className="h-48 animate-pulse bg-slate-800/40 rounded-xl" />}>
            <AdminSidebarNav pathname={pathname} onNavigate={() => setIsMobileNavOpen(false)} />
          </Suspense>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </button>

          <div className="space-y-1">
            <Link
              href="/support"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <HelpCircle className="h-4 w-4 text-slate-400" />
              <span>Support</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/signin");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-rose-400 hover:bg-rose-950/40 transition-all text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col justify-between p-6 shrink-0 h-screen">
        <div className="space-y-8 overflow-y-auto">
          {/* Brand Logo */}
          <Link href="/admin-dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-all">
              <TreePine className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                FamilyRoots
              </span>
              <span className="text-xs font-bold text-purple-400 tracking-wider">
                Admin
              </span>
              <span className="text-[10px] text-slate-400 font-medium">System Controller</span>
            </div>
          </Link>

          {/* Navigation Links with Suspense */}
          <Suspense fallback={<div className="h-48 animate-pulse bg-slate-800/40 rounded-xl" />}>
            <AdminSidebarNav pathname={pathname} />
          </Suspense>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </button>

          <div className="space-y-1">
            <Link
              href="/support"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <HelpCircle className="h-4 w-4 text-slate-400" />
              <span>Support</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/signin");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-rose-400 hover:bg-rose-950/40 transition-all text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
            {/* Hamburger Button for Mobile & Tablet */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0 truncate">
              <h1 className="font-bold text-sm sm:text-base md:text-lg text-white truncate">
                Admin Control
              </h1>
              {user.role?.toUpperCase() === "SUPER_ADMIN" && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-950/60 text-rose-400 border border-rose-800 uppercase tracking-wider shrink-0">
                  SUPER ADMIN
                </span>
              )}
              {user.role?.toUpperCase() === "ADMIN" && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-950/60 text-purple-400 border border-purple-800 uppercase tracking-wider shrink-0">
                  ADMIN
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 max-w-[120px] min-[400px]:max-w-[160px] sm:max-w-xs md:max-w-sm lg:w-64">
              <Search className="h-3.5 sm:h-4 w-3.5 sm:w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium transition-all"
              />
            </div>

            {/* Theme Toggle Button (Sun & Moon) */}
            <ThemeToggle />

            {/* Interactive Notification Bell */}
            <NavbarNotificationMenu />

            {/* Settings Gear */}
            <Link
              href="/admin-dashboard?tab=settings"
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>

            {/* User Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
