"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TreePine,
  Users,
  UserPlus,
  Heart,
  Image as ImageIcon,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FolderLock
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  // Route Protection: Redirect unauthenticated users to Sign In
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-100">
        <div className="flex items-center gap-3 text-amber-500 font-semibold">
          <span className="h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating your sanctuary access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              <TreePine className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-stone-50 leading-none">
                FamilyRoots
              </span>
              <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
                Dashboard Sanctuary
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{user.fullName} ({user.role || "Member"})</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/signin");
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/20 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome Banner Card */}
        <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-emerald-950/60 border border-stone-800 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Active Session • JWT Authenticated</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">{user.fullName}</span>!
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Your private family tree sanctuary is active and connected to PostgreSQL database. Map relationships, upload family memories, and preserve your legacy.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-stone-400">
            <span className="flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Email: {user.email}
            </span>
            <span className="flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
              <Clock className="h-4 w-4 text-amber-400" />
              Account Status: {user.status || "ACTIVE"}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Family Members</span>
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">12</div>
            <p className="text-xs text-stone-500">Connected across 3 generations</p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Relationships</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">18</div>
            <p className="text-xs text-stone-500">Parent, Spouse & Sibling links</p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Shared Memories</span>
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <ImageIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">45</div>
            <p className="text-xs text-stone-500">Photos & milestone records</p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Vault Documents</span>
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FolderLock className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">8</div>
            <p className="text-xs text-stone-500">Encrypted family certificates</p>
          </div>
        </div>

        {/* Quick Actions & Recent Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Quick Actions</span>
            </h2>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-stone-200 group-hover:text-white">Add Family Member</span>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
              </button>

              <button
                type="button"
                className="w-full p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <TreePine className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-stone-200 group-hover:text-white">Family Tree Visualizer</span>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                type="button"
                className="w-full p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-stone-200 group-hover:text-white">Upload Family Memory</span>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-500 group-hover:text-rose-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" />
              <span>Recent Activity Feed</span>
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-stone-200">Account Authenticated</p>
                  <p className="text-xs text-stone-400">Signed in as <span className="text-amber-400">{user.email}</span> via PostgreSQL NestJS Auth API.</p>
                  <span className="text-[10px] text-stone-500 block">Just now</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-stone-200">Family Sanctuary Ready</p>
                  <p className="text-xs text-stone-400">Database node hierarchy initialized for family tree records.</p>
                  <span className="text-[10px] text-stone-500 block">Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-800 py-5 px-6 text-center text-xs text-stone-500">
        FamilyRoots © {new Date().getFullYear()} — Signed in as {user.email}.
      </footer>
    </div>
  );
}
