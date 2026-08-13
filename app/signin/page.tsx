"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedRole, setSelectedRole] = useState<"owner" | "admin" | "member">("owner");

  // Quick Demo credentials helper for Kayesur Rahman
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
    setSuccessMsg("Demo credentials loaded! Click 'Sign In' below.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Welcome back! Authenticating your family tree access...`);
    }, 1200);
  };

  return (
    <main className="min-h-screen flex w-full bg-background font-body-md selection:bg-primary-container selection:text-on-primary antialiased">
      {/* Left Visual Banner Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSqPDBa2DaZJCPNFYsi6jc6DYgDUk1cIDzoUIyfnc9wnyF_AB2D0DfvQGU2FHEHHJdmSKn3ACHlyc5rxaPtpW3B0L6G3WxT2HLI7tvSWn8zOiSD8rQ3sYNoua7pxi6NDp-QsJAXKRzVtpSFjt2ioF55WbtTMlSBLWKW0hKQ7aFirOdrg2GdpOSkUgh4NCxbfouta1LE2co8i9U82YkDT23lvNTxPoL3OszCsR54xucN3SwCPV5HOP8kA')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 p-margin-desktop w-full text-on-surface">
          <Link href="/" className="flex items-center gap-2 mb-stack-sm text-primary hover:opacity-90 transition-opacity">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_tree
            </span>
            <span className="font-headline-md text-headline-md">FamilyRoots</span>
          </Link>
          <h2 className="font-display-sm text-display-sm mb-4 text-on-background">
            Your private family sanctuary.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Connect generations, preserve memories, and build your digital legacy in a secure, beautifully crafted space.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-gutter sm:p-margin-desktop bg-surface relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center gap-2 mb-stack-lg text-primary justify-center">
            <Link href="/" className="flex items-center gap-2">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_tree
              </span>
              <span className="font-headline-md text-headline-md">FamilyRoots</span>
            </Link>
          </div>

          <div className="mb-stack-md text-center lg:text-left space-y-1">
            <h1 className="font-headline-lg text-[24px] md:text-[30px] text-on-surface mb-2 font-semibold">
              Sign In
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back to your private sanctuary.
            </p>
          </div>

          {/* Quick Demo Preset Switcher */}
          <div className="mb-5 p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                Quick Demo Presets
              </span>
              <span className="text-[11px] text-on-surface-variant">1-Click Test</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("owner")}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-left truncate ${
                  selectedRole === "owner"
                    ? "bg-primary text-on-primary border-primary font-semibold"
                    : "bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary"
                }`}
              >
                Kayesur (Owner)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-left truncate ${
                  selectedRole === "admin"
                    ? "bg-primary text-on-primary border-primary font-semibold"
                    : "bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary"
                }`}
              >
                Sara (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("member")}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-left truncate ${
                  selectedRole === "member"
                    ? "bg-primary text-on-primary border-primary font-semibold"
                    : "bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary"
                }`}
              >
                Rafi (Member)
              </button>
            </div>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm outline-none placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    className="block font-label-md text-label-md text-on-surface"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="font-label-sm text-label-sm text-primary hover:text-primary-fixed-dim transition-colors"
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setSuccessMsg("Password reset instructions sent to your email.");
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    className="w-full pl-10 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm outline-none placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full flex items-center justify-center py-3 px-4 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed-dim hover:text-on-primary-fixed-variant transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-stack-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link
                className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors underline-offset-4 hover:underline"
                href="/signup"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
