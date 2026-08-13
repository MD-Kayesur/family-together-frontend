"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TreePine,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Users,
  Sparkles,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  Heart,
  Globe2,
  Info
} from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedRole, setSelectedRole] = useState<"owner" | "admin" | "member">("owner");

  // Quick Demo credentials helper for Kayesur Rahman (from FAMILYROOTS_SPEC.md)
  const handleQuickDemoLogin = (role: "owner" | "admin" | "member") => {
    setSelectedRole(role);
    if (role === "owner") {
      setEmail("kayesur.rahman@familyroots.io");
      setPassword("FamilyLegacy2026!");
    } else if (role === "admin") {
      setEmail("sara.rahman@familyroots.io");
      setPassword("AdminAccess2026!");
    } else {
      setEmail("rafi.rahman@familyroots.io");
      setPassword("MemberUser2026!");
    }
    setErrorMsg("");
    setSuccessMsg("Demo credentials loaded! Click 'Sign In to FamilyRoots' below.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid family account email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    // Simulate authenticating user
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Welcome back, ${email.split("@")[0].replace(".", " ")}! Authenticating family tree access...`);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 bg-mesh-amber selection:bg-amber-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-all">
            <TreePine className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-stone-50 leading-none">
              FamilyRoots
            </span>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 tracking-wider uppercase">
              Family SaaS Platform
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 bg-white/80 dark:bg-stone-900/80 px-3.5 py-2 rounded-full border border-stone-200/80 dark:border-stone-800 backdrop-blur-md shadow-xs transition-all hover:border-amber-400/50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Left Panel: Visual Showcase & Brand Legacy */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between p-12 lg:p-16 pt-28 overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white">
        {/* Ambient background decorative trees & lights */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Private Family SaaS Suite</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
            Preserve your family legacy across generations.
          </h1>

          <p className="text-stone-300 text-base lg:text-lg leading-relaxed">
            Interactive multi-generational family trees, encrypted document vaults, anniversary calendars, and shared memories—all in one secure place.
          </p>

          {/* Mini Interactive Tree Visualizer Mockup */}
          <div className="mt-8 p-6 rounded-2xl glass-panel border border-white/10 space-y-4 shadow-2xl backdrop-blur-xl animate-float-slow">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-stone-200">
                  Live Tree: Rahman Family Network
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-mono">
                4 Generations • 12 Members
              </span>
            </div>

            {/* Tree Nodes Graphic */}
            <div className="py-2 flex flex-col items-center gap-3">
              {/* Gen 1 */}
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-amber-200 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  Rahim Uddin (G1)
                </div>
                <span className="text-stone-500 text-xs">♥</span>
                <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-amber-200 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  Ayesha Begum (G1)
                </div>
              </div>

              {/* Vertical connector line */}
              <div className="h-4 w-0.5 bg-gradient-to-b from-amber-400/60 to-emerald-400/60" />

              {/* Gen 2 Primary User */}
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-sm font-bold text-white flex items-center gap-2 shadow-lg">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Kayesur Rahman (Primary Owner)
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Footer */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-200">256-Bit Encryption</div>
              <div className="text-[11px] text-stone-400">Zero data sell policy</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-200">Role Permissions</div>
              <div className="text-[11px] text-stone-400">Owner, Admin, Viewer</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-200">Shared Memories</div>
              <div className="text-[11px] text-stone-400">Milestone timelines</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 pt-28 sm:pt-32">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Sign in to your family tree
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Welcome back! Please enter your details to access your family network.
            </p>
          </div>

          {/* Quick Demo User Switcher Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Quick Demo Accounts</span>
              </div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                1-Click Preset
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("owner")}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 ${
                  selectedRole === "owner"
                    ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                    : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400"
                }`}
              >
                <span className="truncate">Kayesur Rahman</span>
                <span className="text-[10px] opacity-80 font-normal">Family Owner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 ${
                  selectedRole === "admin"
                    ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                    : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400"
                }`}
              >
                <span className="truncate">Sara Rahman</span>
                <span className="text-[10px] opacity-80 font-normal">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("member")}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 ${
                  selectedRole === "member"
                    ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                    : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400"
                }`}
              >
                <span className="truncate">Rafi Rahman</span>
                <span className="text-[10px] opacity-80 font-normal">Member</span>
              </button>
            </div>
          </div>

          {/* Success or Error Alert Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@familyroots.io"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setSuccessMsg("Password reset link requested. Check your email inbox.");
                  }}
                  className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                />
                <span className="text-xs text-stone-600 dark:text-stone-400">
                  Remember this device for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to FamilyRoots</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stone-50 dark:bg-stone-950 px-3 text-stone-500 dark:text-stone-400 font-medium">
                Or sign in with
              </span>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setEmail("kayesur.google@familyroots.io");
                setPassword("GoogleOAuthPass2026");
                setSuccessMsg("Google SSO authentication initiated.");
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:border-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all shadow-xs"
            >
              <Globe2 className="h-4 w-4 text-amber-500" />
              <span>Google Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSuccessMsg("Biometric Passkey detected for Kayesur Rahman.");
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:border-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all shadow-xs"
            >
              <KeyRound className="h-4 w-4 text-emerald-500" />
              <span>Passkey / FaceID</span>
            </button>
          </div>

          {/* Sign up prompt & footer */}
          <div className="pt-4 text-center space-y-3">
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Don&apos;t have a family workspace yet?{" "}
              <Link
                href="/signup"
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Create Family Tree
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 dark:text-stone-500">
              <a href="#privacy" className="hover:underline">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#terms" className="hover:underline">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#help" className="hover:underline">
                Help & Security
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
