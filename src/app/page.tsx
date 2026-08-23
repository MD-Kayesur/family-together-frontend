"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TreePine,
  ArrowRight,
  ShieldCheck,
  Users,
  Calendar,
  Image as ImageIcon,
  FolderLock,
  Sparkles,
  Heart,
  LogIn,
  LogOut,
  UserCheck,
  LayoutDashboard,
  Globe,
  Lock,
  Database,
  Shield,
  CheckCircle2,
  Quote,
  Menu,
  X,
  FileText,
  Activity,
  Layers,
  ChevronRight
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/api/authApi";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";

export default function Home() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#141b2b] font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f9f9ff]/85 backdrop-blur-md border-b border-[#c7c4d8]/50 px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-all">
            <TreePine className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-indigo-950">
            FamilyRoots
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Pricing
          </a>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02]"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{dashboardLabel}</span>
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold">
                <UserCheck className="h-4 w-4" />
                <span>{user.fullName}</span>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all border border-rose-200 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-indigo-600"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-200 p-6 space-y-4 shadow-xl">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700"
          >
            Pricing
          </a>

          {isAuthenticated && user ? (
            <div className="pt-2 space-y-3">
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
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#f9f9ff] via-[#e2dfff]/30 to-[#f9f9ff] pt-20 pb-28 px-6 lg:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Next-Gen Family Sanctuary</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold text-slate-950 leading-[1.1] tracking-tight mb-6 max-w-4xl">
              Your family, <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">connected.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mb-10 font-normal leading-relaxed">
              Build your private family network, preserve memories, and understand every relationship across generations in a beautiful, modern space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              {isAuthenticated && user ? (
                <Link
                  href={dashboardHref}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Go to {dashboardLabel}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Create Your Family</span>
                  </Link>
                  <Link
                    href="/signin"
                    className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Explore Demo</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </>
              )}
            </div>

            {/* Interactive Family Tree Canvas Preview */}
            <div className="relative w-full max-w-5xl h-[460px] bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 p-8 hidden md:block overflow-hidden">
              {/* Connecting Lines */}
              <div className="absolute left-1/2 top-[120px] -ml-[0.5px] w-px h-16 bg-slate-400/40" />
              <div className="absolute left-1/2 top-[136px] -ml-32 w-64 h-px bg-slate-400/40" />
              <div className="absolute left-1/2 top-[240px] -ml-[0.5px] w-px h-16 bg-slate-400/40" />

              {/* Grandparents */}
              <div className="absolute top-[35px] left-1/2 -ml-[140px] w-[120px] bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center shadow-md">
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center mb-1">
                  👴
                </div>
                <span className="text-xs font-bold text-slate-800">Grandfather</span>
              </div>

              <div className="absolute top-[35px] left-1/2 ml-[20px] w-[120px] bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center shadow-md">
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center mb-1">
                  👵
                </div>
                <span className="text-xs font-bold text-slate-800">Grandmother</span>
              </div>

              {/* Parents */}
              <div className="absolute top-[155px] left-1/2 -ml-[60px] w-[120px] bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center shadow-md">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mb-1">
                  👨
                </div>
                <span className="text-xs font-bold text-slate-800">Father</span>
              </div>

              {/* Siblings Row */}
              <div className="absolute top-[270px] left-1/2 -ml-[210px] w-[120px] bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center shadow-md">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center mb-1">
                  👦
                </div>
                <span className="text-xs font-bold text-slate-800">Brother</span>
              </div>

              {/* You Node */}
              <div className="absolute top-[265px] left-1/2 -ml-[70px] w-[140px] bg-white rounded-2xl border-2 border-indigo-600 p-3 flex flex-col items-center shadow-xl ring-4 ring-indigo-600/15">
                <div className="h-11 w-11 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-1 shadow-md">
                  👩
                </div>
                <span className="text-xs font-extrabold text-indigo-600">You</span>
              </div>

              <div className="absolute top-[270px] left-1/2 ml-[90px] w-[120px] bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center shadow-md">
                <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center mb-1">
                  👧
                </div>
                <span className="text-xs font-bold text-slate-800">Sister</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Signature Tree Section */}
        <section id="features" className="py-24 px-6 lg:px-12 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                The Signature Tree
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Experience a revolutionary way to visualize your lineage. Our interactive workspace makes exploring generational tracking intuitive, beautiful, and deeply personal.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <TreePine className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-slate-900">Dynamic Mapping</h4>
                    <p className="text-sm text-slate-600">Seamlessly trace roots across centuries with fluid, responsive layouts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-slate-900">Deep Insights</h4>
                    <p className="text-sm text-slate-600">Uncover trends, shared traits, and historical context automatically.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[380px] rounded-3xl bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 border border-slate-200 flex items-center justify-center overflow-hidden p-8">
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex gap-8 items-center">
                  <div className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-lg">👴</div>
                  <div className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-lg">👵</div>
                </div>
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center text-xl font-bold border-4 border-white">
                  👩
                </div>
                <div className="flex gap-6 items-center">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-sm">👦</div>
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-sm">👧</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legacy Vaults Section */}
        <section className="py-24 px-6 lg:px-12 bg-slate-50/60 border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Legacy Vaults
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                More than just names. Organize and preserve the stories, documents, and moments that define your family&apos;s history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Memories */}
              <div className="group bg-white border border-slate-200/80 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-indigo-600/20">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900">Memories</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A shared gallery for photos, videos, and audio recordings. Tag relatives to automatically link media to their profile.
                </p>
              </div>

              {/* Documents */}
              <div className="group bg-white border border-slate-200/80 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-purple-600/20">
                  <FolderLock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900">Documents</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Securely store vital records, certificates, immigration papers, and scanned letters in high-resolution.
                </p>
              </div>

              {/* Events */}
              <div className="group bg-white border border-slate-200/80 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-emerald-600/20">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900">Events</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A collaborative family calendar for reunions, anniversaries, and memorial dates, complete with RSVP tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy First Section */}
        <section className="py-24 px-6 lg:px-12 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Privacy First
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                Your family&apos;s history is yours alone. We built FamilyRoots as a private sanctuary, free from ads, data mining, and public exposure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                  <Lock className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-lg text-white">End-to-End Encryption</h4>
                <p className="text-sm text-slate-400">Your sensitive documents and private conversations are securely encrypted.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <Database className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-lg text-white">Data Sovereignty</h4>
                <p className="text-sm text-slate-400">You own your data. Export your entire family archive in standard formats at any time.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-lg text-white">Private Sanctuary</h4>
                <p className="text-sm text-slate-400">Invite-only access ensures only verified family members can view your network.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 lg:px-12 bg-white relative">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Choose the perfect plan to grow and preserve your family legacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Legacy Starter */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-slate-900">Legacy Starter</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">$0</span>
                    <span className="text-sm font-semibold text-slate-500">/mo</span>
                  </div>
                  <p className="text-sm text-slate-600">Perfect for getting started with your immediate family.</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span>Up to 5 family members</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span>Basic tree visualization</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Current Plan
                </button>
              </div>

              {/* Growth Premium */}
              <div className="bg-indigo-600 text-white rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-2xl relative border-2 border-indigo-500">
                <span className="absolute -top-3.5 right-8 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular
                </span>

                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-white">Growth Premium</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$100</span>
                    <span className="text-sm font-medium text-indigo-200">one-time / tier</span>
                  </div>
                  <p className="text-sm text-indigo-100">Expand your roots and connect with extended family.</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>Up to 10 more members (15 total)</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>Advanced relationship mapping</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>Secure document vault</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="w-full py-3.5 rounded-xl bg-white text-indigo-600 font-bold text-xs hover:bg-slate-100 transition-colors text-center block shadow-md"
                >
                  Upgrade to Premium
                </Link>
              </div>

              {/* Heritage Pro */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-slate-900">Heritage Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">$200</span>
                    <span className="text-sm font-semibold text-slate-500">one-time / tier</span>
                  </div>
                  <p className="text-sm text-slate-600">For comprehensive family history projects and deep genealogy.</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span>Up to 25 family members</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span>Full analytics & insights</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span>Priority dedicated support</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-white pt-16 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <TreePine className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-lg text-white">FamilyRoots</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your private sanctuary for preserving family history and connecting generations in a secure, modern space.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tree Workspace</a></li>
              </ul>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} FamilyRoots. All rights reserved.</p>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300 font-semibold">Secure & Private</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
