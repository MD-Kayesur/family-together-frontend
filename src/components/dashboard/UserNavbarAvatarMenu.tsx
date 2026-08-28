"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCheck, HelpCircle, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";

export default function UserNavbarAvatarMenu() {
  const [isOpen, setIsOpen] = useState(false);
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
  const profileRoute = userRole.toUpperCase() === "ADMIN" || userRole.toUpperCase() === "SUPER_ADMIN"
    ? "/admin-dashboard/settings"
    : "/owner-dashboard/profile";

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
        className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-stone-800 transition-all cursor-pointer group border border-transparent hover:border-slate-200"
        aria-label="User Account Menu"
      >
        <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
          {userInitial}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
            {user.fullName}
          </span>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            {userRole}
          </span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* User Account Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-3xl shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
          {/* Header Summary */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-stone-800/60 border border-slate-100 dark:border-stone-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                {user.fullName}
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>

          {/* Menu Actions */}
          <div className="space-y-1 pt-1">
            <Link
              href={profileRoute}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
            >
              <UserCheck className="h-4 w-4 text-indigo-600" />
              <span>User Profile</span>
            </Link>

            <Link
              href="/support"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-indigo-600" />
              <span>Help & Support</span>
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
