"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreePine, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";
import UserNavbarAvatarMenu from "@/components/dashboard/UserNavbarAvatarMenu";
import NavbarNotificationMenu from "@/components/dashboard/NavbarNotificationMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function PublicNavbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  const navLinks = [
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.features"), href: "/features" },
    { name: t("nav.pricing"), href: "/pricing" },
    { name: t("nav.faq"), href: "/faq" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#f9f9ff]/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-[#c7c4d8]/50 dark:border-slate-800/80 px-6 lg:px-12 h-16 flex items-center justify-between transition-colors">
        {/* Brand Logo - clicking goes Home */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-all">
            <TreePine className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-indigo-950 dark:text-white">
            FamilyRoots
          </span>
        </Link>

        {/* Desktop Links (Clean dedicated routes, active state awareness) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Language Switcher, Theme Toggle & Auth Cluster */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
            {/* IP Geolocation Language Switcher */}
            <LanguageSwitcher />

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 pl-1 border-l border-slate-200 dark:border-slate-800">
                <NavbarNotificationMenu />
                <Link
                  href={dashboardHref}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>{dashboardLabel}</span>
                </Link>
                <div className="pl-1 border-l border-slate-200 dark:border-slate-800">
                  <UserNavbarAvatarMenu />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/signin"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2"
                >
                  {t("nav.signin")}
                </Link>

                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
                >
                  {t("nav.getStarted")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle, Language & Theme */}
        <div className="flex items-center gap-1.5 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {isAuthenticated && user ? (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                    ) : (
                      <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <NavbarNotificationMenu />
              </div>

              <Link
                href={dashboardHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{dashboardLabel}</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold text-xs cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("nav.logout")}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t("nav.signin")}
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                {t("nav.getStarted")}
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
