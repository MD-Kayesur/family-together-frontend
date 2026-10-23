"use client";

import React, { useState } from "react";
import { getBackendUrl } from "@/lib/apiConfig";

interface SocialAuthButtonsProps {
  labelPrefix?: string;
}

export default function SocialAuthButtons({ labelPrefix = "Continue with" }: SocialAuthButtonsProps) {
  const [redirectingProvider, setRedirectingProvider] = useState<string | null>(null);

  const apiUrl = getBackendUrl();

  const handleOAuthRedirect = (provider: "google" | "facebook") => {
    setRedirectingProvider(provider);
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Divider */}
      <div className="relative my-2 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative px-3 bg-surface dark:bg-slate-900 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Or continue with
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google OAuth Button */}
        <button
          type="button"
          disabled={Boolean(redirectingProvider)}
          onClick={() => handleOAuthRedirect("google")}
          className="relative flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
          id="oauth-google-btn"
        >
          {redirectingProvider === "google" ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>{redirectingProvider === "google" ? "Connecting..." : `${labelPrefix} Google`}</span>
        </button>

        {/* Facebook OAuth Button */}
        <button
          type="button"
          disabled={Boolean(redirectingProvider)}
          onClick={() => handleOAuthRedirect("facebook")}
          className="relative flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
          id="oauth-facebook-btn"
        >
          {redirectingProvider === "facebook" ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>{redirectingProvider === "facebook" ? "Connecting..." : `${labelPrefix} Facebook`}</span>
        </button>
      </div>
    </div>
  );
}
