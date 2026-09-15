"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  X,
  CheckCheck,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "WELCOME" | "ROLE" | "SYSTEM";
}

export default function NavbarNotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);

  // Initial Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Account Created & Activated",
      message: "Your account has been created successfully! Welcome to your private FamilyRoots Sanctuary.",
      timestamp: "Just now",
      isRead: false,
      type: "WELCOME",
    },
    {
      id: "notif-2",
      title: "Active Access Level",
      message: `Your user profile is active with ${user?.role || "MEMBER"} role permissions.`,
      timestamp: "Active",
      isRead: false,
      type: "ROLE",
    },
    {
      id: "notif-3",
      title: "PostgreSQL Database Sync",
      message: "Sanctuary database connection is live, verified, and synchronized.",
      timestamp: "Live",
      isRead: true,
      type: "SYSTEM",
    },
  ]);

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

  if (!user || (user.role && user.role.toUpperCase() === "VIEWER")) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in duration-150 space-y-3">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Sanctuary Notifications
              </h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  {unreadCount} New
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  All Read
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 space-y-1">
              <Bell className="h-6 w-6 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="font-semibold">No active notifications</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-2xl border transition-all relative group flex items-start gap-3 ${
                    notif.isRead
                      ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-80"
                      : "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/40 shadow-xs"
                  }`}
                >
                  {/* Icon Column */}
                  <div className="mt-0.5 shrink-0">
                    {notif.type === "WELCOME" ? (
                      <div className="h-7 w-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    ) : notif.type === "ROLE" ? (
                      <div className="h-7 w-7 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 space-y-0.5 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-normal">
                      {notif.message}
                    </p>
                  </div>

                  {/* Dismiss Action */}
                  <button
                    type="button"
                    onClick={() => handleDismissNotification(notif.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity cursor-pointer shrink-0"
                    title="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
