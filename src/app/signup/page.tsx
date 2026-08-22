"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSignUpMutation } from "@/lib/redux/api/authApi";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName || fullName.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      }).unwrap();
      setSuccessMsg(`Welcome to FamilyRoots, ${fullName.split(" ")[0]}! Account created successfully via RTK Query. Please sign in.`);
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to create account. Email may already be registered.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  return (
    <main className="min-h-screen flex w-full bg-background font-body-md text-on-background selection:bg-primary-container selection:text-on-primary antialiased">
      {/* Left Side: Image / Brand Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSqPDBa2DaZJCPNFYsi6jc6DYgDUk1cIDzoUIyfnc9wnyF_AB2D0DfvQGU2FHEHHJdmSKn3ACHlyc5rxaPtpW3B0L6G3WxT2HLI7tvSWn8zOiSD8rQ3sYNoua7pxi6NDp-QsJAXKRzVtpSFjt2ioF55WbtTMlSBLWKW0hKQ7aFirOdrg2GdpOSkUgh4NCxbfouta1LE2co8i9U82YkDT23lvNTxPoL3OszCsR54xucN3SwCPV5HOP8kA')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-margin-desktop w-full text-on-surface">
          <Link
            href="/"
            className="flex items-center gap-2 mb-stack-sm text-primary hover:opacity-90 transition-opacity"
          >
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

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-gutter sm:p-margin-desktop bg-surface relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
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

          <div className="mb-stack-md text-center lg:text-left">
            <h1 className="font-headline-lg text-[24px] md:text-[30px] text-on-surface mb-2 font-semibold">
              Create your account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Join FamilyRoots to begin building your legacy.
            </p>
          </div>

          {/* Error / Success Banners */}
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

          <form onSubmit={handleSubmit} className="space-y-stack-md">
            {/* Name Fields */}
            <div className="space-y-4">
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm focus:shadow-md focus:shadow-primary/20 outline-none placeholder:text-outline-variant"
                    id="fullName"
                    name="fullName"
                    placeholder="Jane Doe"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm focus:shadow-md focus:shadow-primary/20 outline-none placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="jane@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    className="w-full pl-10 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm focus:shadow-md focus:shadow-primary/20 outline-none placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-sm">
                  Must be at least 8 characters long.
                </p>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center py-3 px-4 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed-variant hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              type="submit"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Sanctuary via RTK Query...</span>
                </span>
              ) : (
                <>
                  <span>Create Family Sanctuary</span>
                  <span className="material-symbols-outlined ml-2 text-[20px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social Signup Section */}
          <div className="mt-stack-md">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-on-surface-variant font-body-sm text-body-sm">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-stack-md">
              <button
                type="button"
                onClick={() => {
                  setFullName("Jane Doe");
                  setEmail("jane.google@example.com");
                  setPassword("GoogleAuthPass2026");
                  setSuccessMsg("Google sign-up initiated. Welcome to FamilyRoots!");
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>

          {/* Footer Log In Link */}
          <div className="mt-stack-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link
                className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors underline-offset-4 hover:underline"
                href="/signin"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
