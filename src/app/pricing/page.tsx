"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Lock,
  HelpCircle,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function PricingPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  const pricingFaqs = [
    {
      q: "Can I use FamilyRoots completely free?",
      a: "Yes! Every newly created family sanctuary automatically receives our Free Sanctuary tier. You get up to 25 members, 500 MB cloud vault storage, full interactive 2D family tree mapping, and event planning with zero credit card required.",
    },
    {
      q: "Does every relative in my family need to purchase a subscription?",
      a: "No! Subscriptions are purchased per sanctuary, not per person. When the family Owner upgrades to Heritage Pro or Dynasty Unlimited, every invited relative automatically enjoys the expanded storage and features.",
    },
    {
      q: "How does payment processing work?",
      a: "All payments are securely processed through Stripe. We support major credit and debit cards with bank-level encryption. Your card credentials never touch our servers.",
    },
    {
      q: "Can I cancel or change plans anytime?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from the Sanctuary Billing tab. Your data is always preserved.",
    },
  ];

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
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Transparent Sanctuary Pricing</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[60px] font-extrabold text-slate-950 dark:text-white leading-[1.12] tracking-tight mb-6 max-w-4xl">
              Simple, honest pricing{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                for every family clan.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mb-10 font-normal leading-relaxed">
              Start with our Free Forever tier or choose an expanded capacity plan for high-resolution document scans, lifelong photo vaults, and historical exports.
            </p>

            {isAuthenticated && user && (
              <div className="mb-6">
                <Link
                  href={`${dashboardHref}?tab=billing`}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Manage Your Active Sanctuary Subscription</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Free Sanctuary */}
              <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                    Starter
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 dark:text-white">Free Sanctuary</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ forever</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Perfect for mapping your immediate household and creating your first family tree.
                  </p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Up to 25 family members</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>500 MB cloud vault storage</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Interactive 2D visual tree</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Events & RSVP tracking</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center block"
                >
                  Start Free Today
                </Link>
              </div>

              {/* Heritage Pro (Most Popular) */}
              <div className="bg-indigo-600 text-white rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-2xl relative border-2 border-indigo-500">
                <span className="absolute -top-3.5 right-8 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular
                </span>

                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-500 text-indigo-100 text-[11px] font-bold uppercase tracking-wider">
                    Extended Family
                  </div>
                  <h3 className="font-bold text-2xl text-white">Heritage Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$9.99</span>
                    <span className="text-sm font-medium text-indigo-200">/ month</span>
                  </div>
                  <p className="text-sm text-indigo-100">
                    Connect aunts, uncles, cousins, and in-laws across multiple branches and generations.
                  </p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>Up to 100 family members</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>50 GB encrypted cloud storage</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>100MB high-res document scans</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>Automated deduplication checks</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>Priority email support</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="w-full py-3.5 rounded-xl bg-white text-indigo-600 font-bold text-xs hover:bg-slate-100 transition-colors text-center block shadow-md hover:scale-[1.02]"
                >
                  Choose Heritage Pro
                </Link>
              </div>

              {/* Dynasty Unlimited */}
              <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                    Generational Clan
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 dark:text-white">Dynasty Unlimited</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$24.99</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ month</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    For deep genealogical archives, historic clans, and lifelong generational preservation.
                  </p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Unlimited family members</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>500 GB cloud vault storage</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Full genealogical JSON/PDF exports</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Dedicated concierge onboarding</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center block"
                >
                  Choose Dynasty Unlimited
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 px-6 lg:px-12 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Plan Comparison
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Detailed breakdown of facilities included with every sanctuary tier.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white">
                      <th className="py-4 px-6 font-bold">Feature</th>
                      <th className="py-4 px-6 font-bold text-center">Free Sanctuary</th>
                      <th className="py-4 px-6 font-bold text-center text-indigo-600 dark:text-indigo-400">Heritage Pro</th>
                      <th className="py-4 px-6 font-bold text-center">Dynasty Unlimited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-4 px-6 font-semibold">Member Profiles</td>
                      <td className="py-4 px-6 text-center">Up to 25</td>
                      <td className="py-4 px-6 text-center font-bold text-indigo-600 dark:text-indigo-400">Up to 100</td>
                      <td className="py-4 px-6 text-center font-bold">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">Vault Storage</td>
                      <td className="py-4 px-6 text-center">500 MB</td>
                      <td className="py-4 px-6 text-center font-bold text-indigo-600 dark:text-indigo-400">50 GB</td>
                      <td className="py-4 px-6 text-center font-bold">500 GB</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">Max Document Size</td>
                      <td className="py-4 px-6 text-center">10 MB</td>
                      <td className="py-4 px-6 text-center font-bold text-indigo-600 dark:text-indigo-400">100 MB</td>
                      <td className="py-4 px-6 text-center font-bold">100 MB</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">Interactive 2D Canvas</td>
                      <td className="py-4 px-6 text-center">Included</td>
                      <td className="py-4 px-6 text-center font-bold text-indigo-600 dark:text-indigo-400">Included</td>
                      <td className="py-4 px-6 text-center font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">Deduplication Engine</td>
                      <td className="py-4 px-6 text-center">Basic</td>
                      <td className="py-4 px-6 text-center font-bold text-indigo-600 dark:text-indigo-400">Advanced Real-Time</td>
                      <td className="py-4 px-6 text-center font-bold">Advanced Real-Time</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">Data Export</td>
                      <td className="py-4 px-6 text-center">Standard</td>
                      <td className="py-4 px-6 text-center font-bold text-indigo-600 dark:text-indigo-400">High-Res Archives</td>
                      <td className="py-4 px-6 text-center font-bold">Full Complete Archive</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing FAQs */}
        <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Billing Inquiries</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Billing & Membership Questions
              </h2>
            </div>

            <div className="space-y-4">
              {pricingFaqs.map((faq, idx) => {
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
                      <div
                        className={`p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform ${
                          isOpen
                            ? "rotate-180 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
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
          </div>
        </section>
      </main>

      {/* Unified Global Footer */}
      <PublicFooter />
    </div>
  );
}
