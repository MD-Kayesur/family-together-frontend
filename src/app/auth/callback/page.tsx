"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { setCredentials, User } from "@/redux/slices/authSlice";
import { saveAuthCookies } from "@/lib/utils/cookieUtils";
import { getDashboardRouteByRole } from "@/lib/utils/roleUtils";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const role = searchParams.get("role") || "USER";
    const name = searchParams.get("name") || "Family Member";
    const avatar = searchParams.get("avatar");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setStatus("error");
      setErrorMessage(errorParam || "Authentication with the social provider was cancelled or failed.");
      return;
    }

    if (!token || !userId || !email) {
      setStatus("error");
      setErrorMessage("Missing authentication credentials. Please try signing in again.");
      return;
    }

    try {
      const user: User = {
        id: userId,
        email,
        fullName: decodeURIComponent(name),
        role: role as any,
        avatarUrl: avatar ? decodeURIComponent(avatar) : undefined,
        emailVerified: true,
        status: "ACTIVE",
      };

      // 1. Dispatch to Redux store (which also persists in Cookies)
      dispatch(
        setCredentials({
          user,
          accessToken: token,
          refreshToken: refreshToken || undefined,
        })
      );

      // 2. Explicitly persist to Cookies
      saveAuthCookies({
        accessToken: token,
        refreshToken: refreshToken || undefined,
        user,
        role,
      });

      setStatus("success");

      // 4. Smooth redirection to user's assigned role dashboard
      const destination = getDashboardRouteByRole(role);
      const timer = setTimeout(() => {
        router.replace(destination);
      }, 1200);

      return () => clearTimeout(timer);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred while finalizing authentication session.");
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-on-surface p-4 relative overflow-hidden">
      {/* Top Floating Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle className="hover:scale-105" />
      </div>

      {/* Decorative gradient glow backgrounds */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-surface-container-high/80 dark:bg-slate-900/80 backdrop-blur-xl border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center relative z-10 transition-all">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="w-6 h-6 text-primary absolute animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Authenticating Account</h2>
              <p className="text-sm text-on-surface-variant mt-1.5">
                Connecting your secure profile and setting up your family sanctuary session...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Authentication Verified!</h2>
              <p className="text-sm text-on-surface-variant mt-1.5">
                Welcome back! Taking you to your dashboard now...
              </p>
            </div>
            <div className="w-full bg-surface-container-lowest/60 rounded-full h-1.5 overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full w-full animate-pulse transition-all" />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Authentication Notice</h2>
              <p className="text-sm text-rose-500/90 mt-1.5">{errorMessage}</p>
            </div>
            <button
              onClick={() => router.push("/signin")}
              className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
