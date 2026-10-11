"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Search
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function FaqPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  const allFaqs = [
    {
      category: "Getting Started & Privacy",
      q: "Why should a family use FamilyRoots over social media or paper trees?",
      a: "Social media platforms are noisy, ad-driven, and publicly exposed, while physical paper trees can be easily misplaced or damaged. FamilyRoots gives your lineage a private, ad-free digital sanctuary. You get a modern interactive tree workspace, secure document vaults, and dedicated family features built strictly for your family—with zero algorithms and 100% privacy.",
    },
    {
      category: "Getting Started & Privacy",
      q: "Is our family tree and personal media data secure and private?",
      a: "Yes! FamilyRoots is built on a privacy-first foundation. Your family photos, vital documents, and relationship histories are completely private to your family sanctuary and never sold, shared, or exposed publicly.",
    },
    {
      category: "Tree & Genealogies",
      q: "Do deceased ancestors or elderly relatives require an email address?",
      a: "No! Our decoupled data model allows you to add any relative (living or deceased) as an ancestor node without an email. Only relatives who wish to actively log into the web platform require an email and login password.",
    },
    {
      category: "Tree & Genealogies",
      q: "How does real-time family member deduplication work?",
      a: "When an Admin or Owner adds a new relative to the family tree, FamilyRoots automatically analyzes incoming names and emails against existing family records in real-time. If a potential match or duplicate is detected, administrators receive an instant alert to merge or confirm records, keeping your family tree clean and accurate.",
    },
    {
      category: "Members & Permissions",
      q: "How do user permissions and roles (Owner, Admin, Member, Viewer) work?",
      a: "• Owner & Admin: Have full control over managing tree structures, inviting family members, verifying duplicates, and managing user roles.\n• Member: Can view family trees, upload memories, update their own profile, and receive notifications.\n• Viewer: Public/guest access restricted strictly to viewing the landing page without accessing private family dashboard data.",
    },
    {
      category: "Members & Permissions",
      q: "What happens when a new family member account is created?",
      a: "When a family member is added with a valid email address, an account activation notice is dispatched. Once the user signs in or completes registration, their account automatically links to their designated spot in the family tree, and a notification banner alerts them in their top navbar.",
    },
    {
      category: "Media & Document Vaults",
      q: "What is the maximum file size for document uploads?",
      a: "FamilyRoots supports enterprise uploads up to 100MB per file with our specialized Express body parser. This allows you to upload high-resolution historical deed scans, birth certificates, and multi-page legal documents without compression artifacts.",
    },
    {
      category: "Media & Document Vaults",
      q: "Can other families or strangers search for my sanctuary photos?",
      a: "No. All media, documents, and relationship graphs are isolated using strict multi-tenant boundaries partitioned by your unique family sanctuary ID. Search engines and unauthorized users are cryptographically prevented from viewing your files.",
    },
    {
      category: "Billing & Plans",
      q: "Is there a free plan to get started?",
      a: "Yes! Every family receives our Free Sanctuary plan automatically upon signing up. It includes up to 25 members, 500 MB of cloud vault storage, full interactive 2D tree access, event scheduling, and memories sharing with zero credit card required.",
    },
    {
      category: "Billing & Plans",
      q: "What happens if our family outgrows 500 MB of storage?",
      a: "The family Owner can upgrade at any time to Heritage Pro ($9.99/mo for 50 GB) or Dynasty Unlimited ($24.99/mo for 500 GB) through secure Stripe billing. A single upgrade unlocks storage for the entire clan.",
    },
  ];

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] dark:bg-slate-950 text-[#141b2b] dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Unified Global Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="pt-16 flex-1">
        {/* Hero Section matching Home Page */}
        <section className="relative bg-gradient-to-b from-[#f9f9ff] dark:from-slate-950 via-[#e2dfff]/30 dark:via-indigo-950/20 to-[#f9f9ff] dark:to-slate-950 pt-20 pb-20 px-6 lg:px-12 overflow-hidden transition-colors">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
              <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Knowledge Base & FAQ</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[60px] font-extrabold text-slate-950 dark:text-white leading-[1.12] tracking-tight mb-6 max-w-4xl">
              Frequently asked questions,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                clearly answered.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mb-8 font-normal leading-relaxed">
              Find answers to common questions about tree mapping, ancestor accounts, real-time deduplication, security boundaries, and subscription plans.
            </p>

            {/* Search Input */}
            <div className="w-full max-w-lg relative mb-4">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or keywords (e.g. storage, email, roles)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="py-16 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
                <HelpCircle className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-base font-semibold">No questions matched your search.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Clear search query
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-950 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {faq.category}
                        </span>
                        <h3 className="text-base sm:text-lg">{faq.q}</h3>
                      </div>
                      <div
                        className={`p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 transition-transform ${
                          isOpen
                            ? "rotate-180 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 whitespace-pre-line bg-slate-50/40 dark:bg-slate-950/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Need More Help Card */}
            <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Still have questions?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Our dedicated sanctuary support team is here to help your family clan.
                  </p>
                </div>
              </div>
              <Link
                href="/support"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 shrink-0 transition-all hover:scale-105"
              >
                Contact Support Desk
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Global Footer */}
      <PublicFooter />
    </div>
  );
}
