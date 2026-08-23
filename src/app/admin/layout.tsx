"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Bell,
  TreePine,
  ShieldAlert
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

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

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Activity Monitor", href: "/admin/activity", icon: Activity },
    { name: "Network Analytics", href: "/admin/analytics", icon: Network },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-indigo-50/50 border-r border-indigo-100 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-all">
              <TreePine className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-indigo-950 tracking-tight leading-none">
                FamilyRoots
              </span>
              <span className="text-xs font-bold text-indigo-600 tracking-wider">
                Admin
              </span>
              <span className="text-[10px] text-slate-400 font-medium">System Controller</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-600 hover:text-indigo-900 hover:bg-indigo-100/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-indigo-100">
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </button>

          <div className="space-y-1">
            <Link
              href="/support"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:bg-indigo-100/50 hover:text-indigo-900 transition-all"
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
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-rose-600 hover:bg-rose-50 transition-all text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg text-slate-800">Admin Control Center</h1>
            {user.role?.toUpperCase() === "SUPER_ADMIN" && (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-600 uppercase tracking-wider">
                SUPER ADMIN
              </span>
            )}
            {user.role?.toUpperCase() === "ADMIN" && (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-600 uppercase tracking-wider">
                ADMIN
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs, users..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Settings Gear */}
            <Link
              href="/admin/settings"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>

            {/* User Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
