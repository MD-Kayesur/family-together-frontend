"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  Shield,
  Search,
  MessageSquare,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import NavbarNotificationMenu from "@/components/dashboard/NavbarNotificationMenu";
import UserNavbarAvatarMenu from "@/components/dashboard/UserNavbarAvatarMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getDashboardRouteByRole, canAccessRoute } from "@/lib/utils/roleUtils";

export function normalizeDashboardTab(rawTab?: string | null): string {
  if (!rawTab) return "dashboard";
  const cleaned = rawTab.toLowerCase().trim().replace(/[\s_-]+/g, "");
  if (cleaned === "dahsbord" || cleaned === "dashboard" || cleaned === "overview") return "dashboard";
  if (cleaned === "users" || cleaned === "allusers" || cleaned === "alllusers" || cleaned === "useraccounts") return "users";
  if (cleaned === "family" || cleaned === "myfamily") return "family";
  if (cleaned === "tree" || cleaned === "familytree") return "tree";
  if (cleaned === "members" || cleaned === "member") return "members";
  if (cleaned === "relationships" || cleaned === "relation" || cleaned === "relations") return "relationships";
  if (cleaned === "memories" || cleaned === "memory") return "memories";
  if (cleaned === "events" || cleaned === "event") return "events";
  if (cleaned === "documents" || cleaned === "document" || cleaned === "docs") return "documents";
  if (cleaned === "invitations" || cleaned === "invites" || cleaned === "invite") return "invitations";
  if (cleaned === "messages" || cleaned === "message" || cleaned === "chat" || cleaned === "inbox") return "messages";
  if (cleaned === "settings" || cleaned === "setting") return "settings";
  if (cleaned === "profile" || cleaned === "myprofile") return "profile";
  return cleaned;
}

interface SidebarNavLinksProps {
  isOwnerOrAdmin: boolean;
  pathname: string;
}

function SidebarNavLinks({ isOwnerOrAdmin, pathname }: SidebarNavLinksProps) {
  const searchParams = useSearchParams();
  const currentTab = normalizeDashboardTab(searchParams?.get("tab"));

  const sidebarLinks = isOwnerOrAdmin
    ? [
        { name: "Dashboard", href: "/owner-dashboard?tab=dashboard", tabKey: "dashboard", icon: LayoutDashboard, badge: null },
        { name: "User Accounts", href: "/owner-dashboard?tab=users", tabKey: "users", icon: Shield, badge: null },
        { name: "My Family", href: "/owner-dashboard?tab=family", tabKey: "family", icon: Users, badge: null },
        { name: "Family Tree", href: "/owner-dashboard?tab=tree", tabKey: "tree", icon: TreePine, badge: null },
        { name: "Members", href: "/owner-dashboard?tab=members", tabKey: "members", icon: UserCheck, badge: null },
        { name: "Relationships", href: "/owner-dashboard?tab=relationships", tabKey: "relationships", icon: Heart, badge: null },
        { name: "Messages", href: "/owner-dashboard?tab=messages", tabKey: "messages", icon: MessageSquare, badge: "3" },
        { name: "Memories", href: "/owner-dashboard?tab=memories", tabKey: "memories", icon: ImageIcon, badge: null },
        { name: "Events", href: "/owner-dashboard?tab=events", tabKey: "events", icon: Calendar, badge: null },
        { name: "Documents", href: "/owner-dashboard?tab=documents", tabKey: "documents", icon: FolderLock, badge: null },
        { name: "Invitations", href: "/owner-dashboard?tab=invitations", tabKey: "invitations", icon: Mail, badge: "2" },
        { name: "Settings", href: "/owner-dashboard?tab=settings", tabKey: "settings", icon: Settings, badge: null },
      ]
    : [
        { name: "Sanctuary Portal", href: "/user-dashboard?tab=dashboard", tabKey: "dashboard", icon: LayoutDashboard, badge: null },
        { name: "Family Tree", href: "/user-dashboard?tab=tree", tabKey: "tree", icon: TreePine, badge: null },
        { name: "Family Directory", href: "/user-dashboard?tab=members", tabKey: "members", icon: Users, badge: null },
        { name: "Messages", href: "/user-dashboard?tab=messages", tabKey: "messages", icon: MessageSquare, badge: "2" },
        { name: "Memory Vault", href: "/user-dashboard?tab=memories", tabKey: "memories", icon: ImageIcon, badge: null },
        { name: "Upcoming Events", href: "/user-dashboard?tab=events", tabKey: "events", icon: Calendar, badge: null },
        { name: "My Profile", href: "/user-dashboard?tab=profile", tabKey: "profile", icon: UserCheck, badge: null },
        { name: "Settings", href: "/user-dashboard?tab=settings", tabKey: "settings", icon: Settings, badge: null },
      ];

  return (
    <nav className="space-y-1">
      {sidebarLinks.map((item) => {
        const Icon = item.icon;
        const isActive = isOwnerOrAdmin
          ? (pathname === "/owner-dashboard" && currentTab === item.tabKey) ||
            pathname === `/owner-dashboard/${item.tabKey}` ||
            pathname.startsWith(`/owner-dashboard/${item.tabKey}/`)
          : (pathname === "/user-dashboard" && currentTab === item.tabKey) ||
            (pathname === "/user-dashboard" && !searchParams?.get("tab") && item.tabKey === "dashboard") ||
            pathname === item.href ||
            pathname === `/user-dashboard/${item.tabKey}` ||
            pathname.startsWith(`/user-dashboard/${item.tabKey}/`);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
              isActive
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
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
  );
}

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

  // Route Protection & Role Authorization: Redirect unauthenticated or unauthorized users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (user && !canAccessRoute(pathname, user.role)) {
      const targetRoute = getDashboardRouteByRole(user.role);
      router.replace(targetRoute);
    }
  }, [isAuthenticated, user, pathname, router]);

  if (!isAuthenticated || !user || !canAccessRoute(pathname, user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center gap-3 text-indigo-400 font-semibold">
          <span className="h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating your sanctuary access...</span>
        </div>
      </div>
    );
  }

  const roleUpper = user?.role?.toUpperCase();
  const isOwnerOrAdmin =
    roleUpper === "OWNER" ||
    roleUpper === "ADMIN" ||
    roleUpper === "SUPER_ADMIN";

  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 font-sans text-slate-100 antialiased transition-colors duration-200">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 shrink-0 h-screen transition-colors duration-200 relative z-50">
        <div className="space-y-7 overflow-y-auto">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-all">
              <TreePine className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                FamilyRoots
              </span>
              <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase mt-0.5">
                Private Sanctuary
              </span>
            </div>
          </Link>

          {/* Navigation Links with Suspense */}
          <Suspense
            fallback={
              <div className="space-y-1 py-2 text-xs text-slate-500">
                Loading navigation...
              </div>
            }
          >
            <SidebarNavLinks isOwnerOrAdmin={isOwnerOrAdmin} pathname={pathname} />
          </Suspense>
        </div>

        {/* Clean Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span>FamilyRoots Sanctuary</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-50 transition-colors duration-200">
          <div className="relative w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search family records..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-full text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button (Sun & Moon) */}
            <ThemeToggle />

            {/* Interactive Notification Bell */}
            <NavbarNotificationMenu />

            <div className="pl-2 border-l border-slate-700">
              <UserNavbarAvatarMenu />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 w-full max-w-full">
          {title && (
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-400 font-normal">{subtitle}</p>}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
