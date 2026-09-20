"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";

export default function UserNavbarAvatarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";
  const userRole = user.role || "OWNER";
  const dashboardHref = getDashboardRouteByRole(user.role);
  const dashboardLabel = getDashboardLabelByRole(user.role);
  const avatarUrl = user.avatarUrl || (user as any).avatar || (user as any).profileImage || (user as any).image;

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      router.push("/signin");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Navbar User Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-stone-800 transition-all cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-stone-700"
        aria-label="User Account Menu"
      >
        <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform overflow-hidden relative border border-white/20 shrink-0">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={user.fullName || "User avatar"}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{userInitial}</span>
          )}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
            {user.fullName}
          </span>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {userRole}
          </span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* User Account Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-3xl shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
          {/* Header Summary */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-stone-800/60 border border-slate-100 dark:border-stone-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt={user.fullName || "User avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {user.fullName}
                  </span>
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 ml-1" />
                </div>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Actions: Only Dashboard and Logout */}
          <div className="space-y-1 pt-1">
            <Link
              href={dashboardHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{dashboardLabel}</span>
            </Link>

            <div className="pt-1 border-t border-slate-100 dark:border-stone-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
