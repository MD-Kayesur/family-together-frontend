"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useSignUpMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole } from "@/lib/utils/roleUtils";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Form states
  const [step, setStep] = useState<"FORM" | "VERIFY_OTP">("FORM");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // OTP states
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [devCode, setDevCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mutations
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(getDashboardRouteByRole(user?.role));
    }
  }, [isAuthenticated, user, router]);

  // Check if routed with ?verifyEmail=... query param
  useEffect(() => {
    const queryEmail = searchParams.get("verifyEmail");
    if (queryEmail) {
      setEmail(queryEmail);
      setStep("VERIFY_OTP");
    }
  }, [searchParams]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

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
      const response = await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      }).unwrap();

      if (response.verificationCode) {
        setDevCode(response.verificationCode);
      }

      setSuccessMsg(
        response.message || "Account created! Please enter the 6-digit code sent to your email."
      );
      setResendCooldown(60);
      setStep("VERIFY_OTP");

      // Auto-focus first OTP input after switching view
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      const msg =
        err?.data?.message || "Failed to create account. Email may already be registered.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal && value !== "") return;

    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // User pasted multiple characters
      const pastedChars = cleanVal.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedChars[i] || "";
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pastedChars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleFillDevCode = () => {
    if (!devCode) return;
    const chars = devCode.slice(0, 6).split("");
    const newDigits = [...otpDigits];
    chars.forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setOtpDigits(newDigits);
    otpInputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      const result = await verifyEmail({
        email: email.trim(),
        code: fullCode,
      }).unwrap();

      setSuccessMsg(result.message || "Email verified successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push(`/signin?verified=true&email=${encodeURIComponent(email.trim())}`);
      }, 1200);
    } catch (err: any) {
      const msg =
        err?.data?.message || "Invalid or expired verification code. Please request a new one.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await resendVerification({ email: email.trim() }).unwrap();
      if (result.verificationCode) {
        setDevCode(result.verificationCode);
      }
      setSuccessMsg(result.message || "A new 6-digit code has been sent to your email.");
      setResendCooldown(60);
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to resend code. Please try again.";
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
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_tree
            </span>
            <span className="font-headline-md text-headline-md font-bold">FamilyRoots</span>
          </Link>
          <h2 className="font-display-sm text-display-sm mb-4 text-on-background">
            Your private family sanctuary.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Connect generations, preserve memories, and build your digital legacy in a secure,
            beautifully crafted space.
          </p>
        </div>
      </div>

      {/* Right Side: Form or OTP Verification */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-gutter sm:p-margin-desktop bg-surface relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-stack-lg text-primary justify-center">
            <Link href="/" className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_tree
              </span>
              <span className="font-headline-md text-headline-md font-bold">FamilyRoots</span>
            </Link>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium flex items-start gap-2.5 animate-fadeIn">
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400 text-sm font-medium flex items-start gap-2.5 animate-fadeIn">
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span>{successMsg}</span>
            </div>
          )}

          {step === "FORM" ? (
            /* STEP 1: Registration Form */
            <>
              <div className="mb-stack-md text-center lg:text-left">
                <h1 className="font-headline-lg text-[26px] md:text-[32px] text-on-surface mb-2 font-bold tracking-tight">
                  Create your account
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Join FamilyRoots to begin building your legacy.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface mb-1 font-medium"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </span>
                    <input
                      className="w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm outline-none placeholder:text-outline-variant"
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
                    className="block font-label-md text-label-md text-on-surface mb-1 font-medium"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </span>
                    <input
                      className="w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm outline-none placeholder:text-outline-variant"
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
                    className="block font-label-md text-label-md text-on-surface mb-1 font-medium"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </span>
                    <input
                      className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md transition-all shadow-sm outline-none placeholder:text-outline-variant"
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1.5">
                    Must be at least 8 characters long.
                  </p>
                </div>

                <button
                  className="w-full mt-2 flex items-center justify-center py-3 px-4 bg-primary text-on-primary rounded-xl font-label-md text-sm font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  type="submit"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <span>Create Family Sanctuary</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-on-surface-variant">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-primary font-semibold hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </>
          ) : (
            /* STEP 2: 6-Digit OTP Verification Screen */
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">mark_email_unread</span>
              </div>

              <h1 className="font-headline-lg text-[24px] md:text-[28px] text-on-surface mb-2 font-bold">
                Verify your email
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-on-surface">{email}</span>. Enter it below to
                activate your account.
              </p>

              {/* Dev Helper Box (displays code for testing) */}
              {devCode && (
                <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    <span>
                      Dev Code: <strong className="font-mono text-sm tracking-wider">{devCode}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDevCode}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit Input Group */}
                <div className="flex justify-center gap-2.5 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold bg-surface-container-lowest border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      autoComplete="one-time-code"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpDigits.join("").length !== 6}
                  className="w-full flex items-center justify-center py-3 px-4 bg-primary text-on-primary rounded-xl font-label-md text-sm font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Code...</span>
                    </span>
                  ) : (
                    <span>Verify Email & Activate</span>
                  )}
                </button>
              </form>

              {/* Resend Code Section */}
              <div className="mt-6 flex flex-col items-center gap-2 text-sm text-on-surface-variant">
                <div>
                  Didn't receive the code?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-outline font-medium">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="text-primary font-semibold hover:underline cursor-pointer"
                    >
                      {isResending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("FORM");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-outline hover:text-on-surface mt-2 transition-colors cursor-pointer"
                >
                  ← Back to account details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
