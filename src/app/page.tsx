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
  ChevronRight,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";
import LandingFamilyTreeCanvas from "@/components/tree/LandingFamilyTreeCanvas";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function Home() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] dark:bg-slate-950 text-[#141b2b] dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Global Unified Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="pt-16 flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#f9f9ff] dark:from-slate-950 via-[#e2dfff]/30 dark:via-indigo-950/20 to-[#f9f9ff] dark:to-slate-950 pt-20 pb-28 px-6 lg:px-12 overflow-hidden transition-colors">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Next-Gen Family Sanctuary</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold text-slate-950 dark:text-white leading-[1.1] tracking-tight mb-6 max-w-4xl">
              Your family, <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">connected.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 font-normal leading-relaxed">
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
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Explore Demo</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Family Tree Canvas (Full-Screen Edge-to-Edge DB Design Canvas) */}
        <section className="w-full h-screen min-h-screen p-0 m-0 overflow-hidden relative">
          <LandingFamilyTreeCanvas variant="fullscreen" readOnly={false} storageKey="landing_tree_v6" />
        </section>

        {/* The Signature Tree Section */}
        <section id="features" className="py-24 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                The Signature Tree
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Experience a revolutionary way to visualize your lineage. Our interactive workspace makes exploring generational tracking intuitive, beautiful, and deeply personal.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-800/50">
                    <TreePine className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Dynamic Mapping</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Seamlessly trace roots across centuries with fluid, responsive layouts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Deep Insights</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Uncover trends, shared traits, and historical context automatically.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View-Only Signature Tree Preview Card (Auto-synced with above interactive canvas) */}
            <div className="w-full relative">
              <LandingFamilyTreeCanvas variant="card" readOnly={true} storageKey="landing_tree_v6" />
            </div>
          </div>
        </section>

        {/* Legacy Vaults Section */}
        <section className="py-24 px-6 lg:px-12 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Legacy Vaults
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                More than just names. Organize and preserve the stories, documents, and moments that define your family&apos;s history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Memories */}
              <div className="group bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-indigo-600/20">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Memories</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A shared gallery for photos, videos, and audio recordings. Tag relatives to automatically link media to their profile.
                </p>
              </div>

              {/* Documents */}
              <div className="group bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-purple-600/20">
                  <FolderLock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Documents</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Securely store vital records, certificates, immigration papers, and scanned letters in high-resolution.
                </p>
              </div>

              {/* Events */}
              <div className="group bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-emerald-600/20">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Events</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
        <section id="pricing" className="py-24 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 relative transition-colors">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose the perfect plan to grow and preserve your family legacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Legacy Starter */}
              <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">Legacy Starter</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/mo</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Perfect for getting started with your immediate family.</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Up to 5 family members</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Basic tree visualization</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">Heritage Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$200</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">one-time / tier</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">For comprehensive family history projects and deep genealogy.</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Up to 25 family members</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Full analytics & insights</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Priority dedicated support</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6 lg:px-12 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Got Questions?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                Everything you need to know about FamilyRoots, user roles, real-time deduplication, and how our private family sanctuary works.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Why should a family use FamilyRoots over social media or paper trees?",
                  a: "Social media platforms are noisy, ad-driven, and publicly exposed, while physical paper trees can be easily misplaced or damaged. FamilyRoots gives your lineage a private, ad-free digital sanctuary. You get a modern interactive tree workspace, secure document vaults, and dedicated family features built strictly for your family—with zero algorithms and 100% privacy."
                },
                {
                  q: "What facilities and core features are available in this platform?",
                  a: "• 🌳 Interactive Family Tree Visualizer: Fluidly trace parents, siblings, children, and extended roots across generations.\n• 🛡️ Real-Time Relative Deduplication: Live validation detects duplicate names or emails instantly when adding family members.\n• 🔐 Secure Legacy Vaults: Store photos, scanned historical records, birth certificates, and memorial dates safely.\n• 🔔 Account Activation & Navbar Alerts: Automated account link generation and instant notifications for new members.\n• 👥 Role-Based Governance: Dedicated dashboards and permissions tailored for Owner, Admin, Member, and Viewer roles."
                },
                {
                  q: "What key benefits will our family gain by using FamilyRoots?",
                  a: "• 📜 Generational Preservation: Ensure younger generations stay connected to their heritage, stories, and family roots.\n• 🤝 Seamless Extended Connection: Connect family members across different cities and countries in one private hub.\n• 🔒 100% Data Privacy & Ownership: Your family history is strictly yours—never indexed publicly or sold to third parties.\n• ⏱️ Instant Onboarding: Administrators can add relatives with valid emails for immediate account access and notifications."
                },
                {
                  q: "How do user permissions and roles (Owner, Admin, Member, Viewer) work?",
                  a: "• Owner & Admin: Have full control over managing tree structures, inviting family members, verifying duplicates, and managing user roles.\n• Member: Can view family trees, upload memories, update their own profile, and receive notifications.\n• Viewer: Public/guest access restricted strictly to viewing the landing page without accessing private family dashboard data."
                },
                {
                  q: "How does real-time family member deduplication work?",
                  a: "When an Admin or Owner adds a new relative to the family tree, FamilyRoots automatically analyzes incoming names and emails against existing family records in real-time. If a potential match or duplicate is detected, administrators receive an instant alert to merge or confirm records, keeping your family tree clean and accurate."
                },
                {
                  q: "What happens when a new family member account is created?",
                  a: "When a family member is added with a valid email address, an account activation notice is dispatched. Once the user signs in or completes registration, their account automatically links to their designated spot in the family tree, and a notification banner alerts them in their top navbar."
                },
                {
                  q: "Is our family tree and personal media data secure and private?",
                  a: "Yes! FamilyRoots is built on a privacy-first foundation. Your family photos, vital documents, and relationship histories are completely private to your family sanctuary and never sold, shared, or exposed publicly."
                },
                {
                  q: "How do I get started and create an account today?",
                  a: "Getting started takes less than a minute! Click the 'Create Your Family' or 'Get Started' button at the top of this page, sign up with your email, name your family sanctuary, and start building your interactive family tree immediately."
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-950 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                      <div className={`p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform ${isOpen ? "rotate-180 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 whitespace-pre-line bg-slate-50/40 dark:bg-slate-950/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FAQ Call to Action Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/30 mt-12">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-extrabold tracking-tight">Ready to preserve your family legacy?</h3>
                <p className="text-sm text-indigo-100 max-w-lg">
                  Join thousands of families building their private digital sanctuary today. Setup takes under a minute.
                </p>
              </div>
              <Link
                href="/signup"
                className="bg-white text-indigo-600 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition-all shadow-md shrink-0 flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Create Your Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Unified Footer */}
      <PublicFooter />
    </div>
  );
}
