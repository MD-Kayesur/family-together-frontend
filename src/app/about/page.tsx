"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TreePine,
  ShieldCheck,
  Lock,
  Users,
  Image as ImageIcon,
  Calendar,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Globe,
  KeyRound,
  Eye,
  Layers,
  Zap,
  Menu,
  X,
  Compass,
  Database,
  Share2,
} from "lucide-react";

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const corePillars = [
    {
      icon: ShieldCheck,
      title: "100% Private & Walled Sanctuary",
      color: "from-emerald-500 to-teal-600",
      description:
        "Unlike public social networks, FamilyRoots has zero public feeds, zero advertisers, and zero data brokers. Your lineage, photos, and stories are strictly isolated by familyId and visible solely to verified relatives you invite.",
    },
    {
      icon: TreePine,
      title: "Interactive 2D Canvas Lineage Engine",
      color: "from-indigo-500 to-blue-600",
      description:
        "Visualize generations with high-performance HTML5 canvas rendering. Pan, zoom, inspect relative bios, and trace biological, spouse, and sibling connections across 4+ generations seamlessly.",
    },
    {
      icon: Users,
      title: "Decoupled Ancestor Modeling",
      color: "from-purple-500 to-indigo-600",
      description:
        "Honor both living and departed ancestors. You don't need an email or smartphone for every relative—ancestors exist as independent Person profiles that living family members can view, update, or claim.",
    },
    {
      icon: ImageIcon,
      title: "Milestone Memories & High-Res Vault",
      color: "from-rose-500 to-pink-600",
      description:
        "Preserve historic family albums and milestone stories in a modern slider carousel with full-screen lightbox viewing. Tag relatives, record locations, and never lose a cherished memory.",
    },
    {
      icon: FileText,
      title: "100MB Encrypted Document Vault",
      color: "from-amber-500 to-orange-600",
      description:
        "Store high-resolution scans of land deeds, birth certificates, handwritten family recipes, and legal archives with enterprise-grade Express 100MB body parser support.",
    },
    {
      icon: Calendar,
      title: "Family Events & RSVP Scheduling",
      color: "from-cyan-500 to-blue-600",
      description:
        "Coordinate annual family reunions, milestone anniversaries, and virtual gatherings. Real-time RSVP counters allow everyone to confirm attendance effortlessly.",
    },
  ];

  const faqs = [
    {
      q: "Can other families or strangers see my family tree and photos?",
      a: "Absolutely not. FamilyRoots is built on a strict Multi-Tenant architectural foundation. All records, photos, relationships, and documents are cryptographically and logically isolated by your sanctuary's unique family ID. Search engines and other users cannot index or view your sanctuary.",
    },
    {
      q: "Do my grandparents or deceased ancestors need an email account to be added?",
      a: "No! Our decoupled data model allows you to add any relative (living or deceased) as an ancestor node without an email. Only relatives who wish to actively log into the web platform require an email and login password.",
    },
    {
      q: "Is there a free plan to get started?",
      a: "Yes! Every family receives our Free Sanctuary plan automatically upon signing up. It includes up to 25 members, 500 MB of cloud vault storage, full interactive 2D tree access, event scheduling, and memories sharing with zero credit card required.",
    },
    {
      q: "How does the platform prevent duplicate relatives from being created?",
      a: "Our smart Deduplication & Linking Engine checks existing records in real time as you type a relative's name. It offers an 'Eye Preview' to inspect existing profiles and a 1-click 'Link Person' action to connect relatives without creating duplicate database rows.",
    },
    {
      q: "How can I invite my family members across different countries?",
      a: "You can generate Magic Invite Links from your Sanctuary Invitations Tab or directly specify their email when adding them. They receive an instant welcome invitation and can join from their phone, tablet, or laptop immediately.",
    },
    {
      q: "What happens if our family outgrows 500 MB of storage?",
      a: "The family Owner can upgrade at any time to Heritage Pro ($9.99/mo for 50 GB) or Dynasty Unlimited ($24.99/mo for 500 GB) through secure Stripe billing. A single upgrade by the family head unlocks storage for the entire clan.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Sanctuary",
      description: "Sign up in 30 seconds with your email and give your family sanctuary a name. You become the sanctuary Owner with full administrative control.",
    },
    {
      number: "02",
      title: "Map Your Roots & Relatives",
      description: "Use our visual tree tool to add parents, grandparents, siblings, and children. Connect relationship ties and prevent duplicates with our smart search.",
    },
    {
      number: "03",
      title: "Preserve Memories & Invite Loved Ones",
      description: "Upload photo albums, schedule family gatherings, upload legal certificates, and send 1-click Magic Links to bring everyone together.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION BAR                                        */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <nav
          id="about-navbar"
          className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            id="about-nav-logo"
            className="flex items-center gap-2.5 group transition-transform hover:scale-105"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <TreePine className="h-5 w-5 transition-transform group-hover:rotate-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Family<span className="text-indigo-400">Roots</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="/" className="hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-indigo-400 font-bold">
              About
            </Link>
            <Link href="/#features" className="hover:text-indigo-400 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="hover:text-indigo-400 transition-colors">
              Pricing
            </Link>
            <Link href="/support" className="hover:text-indigo-400 transition-colors">
              Support
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <Link
                href="/signin"
                id="about-nav-signin-btn"
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                id="about-nav-signup-btn"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            id="about-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-6 py-6 space-y-4 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-indigo-400"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-indigo-400"
            >
              About Platform
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-indigo-400"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-indigo-400"
            >
              Pricing
            </Link>
            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-indigo-400"
            >
              Support
            </Link>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <Link
                href="/signin"
                className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION                                              */}
      {/* ============================================================ */}
      <main className="flex-1">
        <section
          id="about-hero"
          className="relative overflow-hidden pt-20 pb-28 px-6 lg:px-12 border-b border-slate-900 bg-radial-[at_top_center] from-indigo-950/40 via-slate-950 to-slate-950"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Dedicated Digital Family Sanctuary</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Preserving Every Generation.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Safe. Private. Forever.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
              FamilyRoots is an enterprise-grade, invite-only family lineage and memory preservation platform.
              We replace scattered chat threads and public social feeds with an interactive 2D family tree,
              encrypted photo vaults, and multi-generational archives built exclusively for your kin.
            </p>

            {/* Key Benefit Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Zero Public Feeds & No Ads
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Strict Multi-Tenant Isolation
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Free Sanctuary Forever Plan
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/signup"
                id="about-hero-cta-signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Create Your Family Sanctuary</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signin"
                id="about-hero-cta-signin"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Existing Member Sign In</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. THE PROBLEM & OUR PHILOSOPHY                              */}
        {/* ============================================================ */}
        <section id="about-philosophy" className="py-24 px-6 lg:px-12 bg-slate-900/40 border-b border-slate-900">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Why FamilyRoots Exists
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Social Media Has Failed the Family
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Modern platforms are engineered for public virality, algorithmic feeds, and ad targeting.
                They are fundamentally the wrong place for your private family history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Problem Card */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-rose-900/30 shadow-xl space-y-6 relative overflow-hidden">
                <div className="h-12 w-12 rounded-2xl bg-rose-950/80 border border-rose-800/60 text-rose-400 flex items-center justify-center shadow-md">
                  <X className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">The Broken Status Quo</h3>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span><strong>Loss of Privacy:</strong> Family photos and milestone updates become fodder for advertisers and AI training sets.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span><strong>Fragmented Chats:</strong> Precious memories and stories vanish forever into unreachable WhatsApp, Messenger, or email archives.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span><strong>No Generational Memory:</strong> Chat apps cannot organize lineages or preserve ancestral records across centuries.</span>
                  </li>
                </ul>
              </div>

              {/* Solution Card */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-emerald-900/30 shadow-xl space-y-6 relative overflow-hidden">
                <div className="h-12 w-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shadow-md">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">The FamilyRoots Sanctuary</h3>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Pure Data Sovereignty:</strong> Your data belongs solely to your family. Zero cross-tenant sharing, zero profiling.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Structured Lineage:</strong> Every aunt, grandparent, and child has an assigned node with bio, milestones, and relationships.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Centuries-Ready Archive:</strong> Designed to outlive chat apps and serve as an interactive heirloom for future generations.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. SIX ARCHITECTURAL PILLARS (CORE FEATURES)                 */}
        {/* ============================================================ */}
        <section id="about-pillars" className="py-24 px-6 lg:px-12 border-b border-slate-900">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                End-to-End Capabilities
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Everything Your Clan Needs in One Place
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                From visual relationship graphing to legal document storage and event scheduling,
                explore how each domain works together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {corePillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={idx}
                    className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 space-y-5 group hover:-translate-y-1 shadow-lg"
                  >
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${pillar.color} text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. HOW IT WORKS (3 EASY STEPS)                               */}
        {/* ============================================================ */}
        <section id="about-how-it-works" className="py-24 px-6 lg:px-12 bg-slate-900/30 border-b border-slate-900">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Simple Setup
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Get Started in Three Intuitive Steps
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                Building your family heritage should be effortless, not cumbersome.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((st, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl relative space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="text-5xl font-black text-indigo-900/60 font-mono tracking-tighter">
                      {st.number}
                    </span>
                    <h3 className="text-xl font-bold text-white">{st.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-900 flex items-center gap-2 text-indigo-400 text-xs font-bold">
                    <span>Ready in seconds</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. TRANSPARENT PRICING & SUBSCRIPTION MODEL                  */}
        {/* ============================================================ */}
        <section id="about-pricing" className="py-24 px-6 lg:px-12 border-b border-slate-900">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Fair & Predictable Pricing
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                One Subscription Covers the Whole Family
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We believe in sanctuary-level pricing. You never pay per-seat. One upgrade by the sanctuary
                Owner provides expanded storage and member limits for all relatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-lg space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Sanctuary</div>
                  <div className="text-4xl font-black text-white">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
                  <p className="text-xs text-slate-400 leading-relaxed">Ideal for getting started and mapping direct branches.</p>
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Up to 25 Family Members</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> 500 MB Encrypted Vault</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Full 2D Canvas Interactive Tree</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Photo Galleries & Story Milestones</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors"
                >
                  Start Free
                </Link>
              </div>

              {/* Pro Tier (Featured) */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-indigo-500 shadow-2xl space-y-6 flex flex-col justify-between relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase shadow-md">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Heritage Pro</div>
                  <div className="text-4xl font-black text-white">$9.99 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                  <p className="text-xs text-slate-300 leading-relaxed">Generous cloud archives for large family clans.</p>
                  <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-indigo-900/60">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Up to 150 Family Members</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> 50 GB High-Speed Vault Storage</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> 4K Ultra-HD Photo Galleries</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Multi-Batch 100MB Document Archive</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Real-time Profile Deduplication</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  Upgrade to Pro
                </Link>
              </div>

              {/* Dynasty Unlimited */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-lg space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dynasty Unlimited</div>
                  <div className="text-4xl font-black text-white">$24.99 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                  <p className="text-xs text-slate-400 leading-relaxed">Permanent archival scale for extensive multi-generational dynasties.</p>
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Unlimited Relatives & Generations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> 500 GB High-Security Vault Storage</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Complete GEDCOM (.ged) Data Export</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Printable Lineage Poster Generator</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> 24/7 Dedicated Concierge Support</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors"
                >
                  Choose Dynasty
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                */}
        {/* ============================================================ */}
        <section id="about-faq" className="py-24 px-6 lg:px-12 bg-slate-900/40 border-b border-slate-900">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Transparency & Clarity
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </p>
              <p className="text-slate-400 text-sm">
                Have questions before creating your family account? Find your answers here.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((f, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(i)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-indigo-300 transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{f.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-indigo-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. HIGH-CONVERTING FINAL CTA BANNER                          */}
        {/* ============================================================ */}
        <section id="about-cta-banner" className="py-24 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white shadow-2xl border border-indigo-400/30 text-center space-y-8 relative overflow-hidden">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Your Family Legacy Begins with a Single Click.
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                Do not let your family's oral history, milestone photos, and ancestral bonds slip away.
                Start your secure digital sanctuary today in under 60 seconds.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/signup"
                id="about-bottom-cta-signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-indigo-600 font-extrabold text-sm hover:bg-slate-100 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Create Your Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signin"
                id="about-bottom-cta-signin"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-950/60 text-white border border-white/20 font-bold text-sm hover:bg-indigo-950 transition-colors"
              >
                Sign In to Sanctuary
              </Link>
            </div>

            <p className="text-[11px] text-indigo-200 font-medium">
              Free Sanctuary plan included • No credit card required to start • Instant access
            </p>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* 9. GLOBAL FOOTER                                             */}
      {/* ============================================================ */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-6 lg:px-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <TreePine className="h-5 w-5 text-indigo-400" />
              <span>FamilyRoots</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The premier privacy-first sanctuary for lineage tracking, generational archives, and media preservation.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors text-indigo-400 font-bold">About Platform</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider">Access</h4>
            <ul className="space-y-1.5">
              <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/signin" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/reset-password" className="hover:text-white transition-colors">Reset Password</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support Desk</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider">Security & Standards</h4>
            <p className="text-slate-400 leading-relaxed">
              Protected by PostgreSQL tenant isolation, Redis token invalidation, and 256-bit encryption.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 pt-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Enterprise Grade Multi-Tenancy</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} FamilyRoots Platform. All rights reserved.</p>
          <p>Built with Next.js 16, React 19, NestJS 11 & Prisma 7.</p>
        </div>
      </footer>
    </div>
  );
}
