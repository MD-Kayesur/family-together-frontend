"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignInMutation, useForgotPasswordMutation } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole } from "@/lib/utils/roleUtils";
import { Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function SignInContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace(getDashboardRouteByRole(user?.role));
    }
  }, [mounted, isAuthenticated, user, router]);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const paramEmail = searchParams.get("email");
    if (paramEmail) {
      setEmail(paramEmail);
    }
    if (verified === "true") {
      setSuccessMsg("Email verified successfully! Please enter your password to sign in.");
    }
  }, [searchParams]);

  // Prevent flash of sign-in page if already authenticated (rendered AFTER all hooks)
  if (mounted && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="flex flex-col items-center gap-4 text-center p-8 rounded-2xl bg-surface-container-high/70 backdrop-blur-md border border-outline-variant/30 shadow-2xl max-w-sm">
          <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <div>
            <h3 className="text-lg font-semibold text-on-surface">Already Logged In</h3>
            <p className="text-sm text-on-surface-variant mt-1">Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setNeedsVerification(false);

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await signIn({ email, password }).unwrap();
      const target = getDashboardRouteByRole(response.user?.role);
      setSuccessMsg(`Welcome back, ${response.user?.fullName || "User"}! Redirecting...`);
      setTimeout(() => {
        router.replace(target);
      }, 800);
    } catch (err: any) {
      if (err?.status === "FETCH_ERROR" || !err?.data) {
        setErrorMsg(
          "Unable to connect to the backend server. Please check your internet connection or verify the backend service is running."
        );
        return;
      }
      if (err?.data?.requiresEmailVerification) {
        setNeedsVerification(true);
      }
      const message = err?.data?.message
        ? Array.isArray(err.data.message)
          ? err.data.message.join(", ")
          : err.data.message
        : "Failed to sign in. Please check your credentials.";
      setErrorMsg(message);
    }
  };

  return (
    <main className="min-h-screen flex w-full bg-background font-body-md selection:bg-primary-container selection:text-on-primary antialiased relative">
      {/* Top Floating Theme Toggle (Sun & Moon) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
        <ThemeToggle className="hover:scale-105" />
      </div>

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
              {t("auth.signInTitle")}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("auth.signInSubtitle")}
            </p>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>{errorMsg}</span>
              </div>
              {needsVerification && (
                <div className="pt-1 border-t border-red-200/60">
                  <Link
                    href={`/signup?verifyEmail=${encodeURIComponent(email)}`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline underline-offset-2"
                  >
                    <span>Enter 6-digit verification code now</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              )}
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
                  {t("auth.emailLabel")}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm outline-none placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder={t("auth.emailPlaceholder")}
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-1"
                  htmlFor="password"
                >
                  {t("auth.passwordLabel")}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    className="w-full pl-10 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm outline-none placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Forgot Password Link Below Password Field */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setSuccessMsg("");
                      setIsForgotModalOpen(true);
                    }}
                    className="font-label-sm text-xs font-semibold text-primary hover:underline hover:text-primary-fixed-dim transition-colors cursor-pointer"
                  >
                    {t("auth.forgotPassword")}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full flex items-center justify-center py-3 px-4 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed-dim hover:text-on-primary-fixed-variant transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              type="submit"
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("auth.signingIn")}</span>
                </span>
              ) : (
                t("auth.signInBtn")
              )}
            </button>
          </form>

          {/* Social OAuth Providers */}
          <div className="mt-4">
            <SocialAuthButtons labelPrefix="Continue with" />
          </div>

          {/* Footer Link */}
          <div className="mt-stack-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("auth.noAccount")}{" "}
              <Link
                className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors underline-offset-4 hover:underline"
                href="/signup"
              >
                {t("nav.createAccount")}
              </Link>
            </p>
          </div>
        </div>

        {/* 3-Step Interactive Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
          initialEmail={email}
          onSuccess={(resetEmail, newPass) => {
            if (resetEmail) setEmail(resetEmail);
            if (newPass) setPassword(newPass);
            setSuccessMsg("Password reset successfully! You can now click 'Sign In' below.");
          }}
        />
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
