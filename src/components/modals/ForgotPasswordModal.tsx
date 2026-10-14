"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} from "@/redux/api/authApi";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess?: (email: string, newPassword?: string) => void;
}

type Step = "SEND_CODE" | "KEEP_CODE" | "NEW_PASSWORD" | "SUCCESS";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = "",
  onSuccess,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("SEND_CODE");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // RTK Query Mutations
  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [verifyResetCode, { isLoading: isVerifyingCode }] = useVerifyResetCodeMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  // Sync initial email when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialEmail && initialEmail.includes("@")) {
        setEmail(initialEmail);
      }
      setErrorMsg("");
      setSuccessNotice("");
    }
  }, [isOpen, initialEmail]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Handle OTP digit changes with auto-focus
  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const nextCode = [...code];
    nextCode[index] = cleaned.slice(-1);
    setCode(nextCode);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const nextCode = [...code];
    for (let i = 0; i < 6; i++) {
      nextCode[i] = pasted[i] || "";
    }
    setCode(nextCode);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // STEP 1: Send Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessNotice("");

    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      setErrorMsg("Please provide a valid registered Gmail/email address.");
      return;
    }

    try {
      const res = await forgotPassword({ email: targetEmail }).unwrap();
      setSuccessNotice(res.message || "A 6-digit verification code has been dispatched to your email.");
      setResendCooldown(60);
      setStep("KEEP_CODE");
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to dispatch verification code. Please try again.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  // Resend Code handler
  const handleResend = async () => {
    if (resendCooldown > 0 || isSendingCode) return;
    setErrorMsg("");
    try {
      const res = await forgotPassword({ email: email.trim().toLowerCase() }).unwrap();
      setSuccessNotice(res.message || "Fresh verification code sent.");
      setResendCooldown(60);
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to resend code.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  // STEP 2: Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessNotice("");

    const fullCode = code.join("").trim();
    if (fullCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      const res = await verifyResetCode({
        email: email.trim().toLowerCase(),
        code: fullCode,
      }).unwrap();

      if (res.resetToken) {
        setResetToken(res.resetToken);
        setStep("NEW_PASSWORD");
      } else {
        setErrorMsg("Code verified, but reset token could not be generated.");
      }
    } catch (err: any) {
      const msg = err?.data?.message || "Invalid or expired verification code. Please check your Gmail or resend.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  // STEP 3: Confirm & Set New Password
  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      const res = await resetPassword({
        token: resetToken,
        newPassword,
      }).unwrap();

      setSuccessNotice(res.message || "Password updated successfully!");
      setStep("SUCCESS");
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to update password. Reset token may have expired.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const handleFinishAndLogin = () => {
    if (onSuccess) {
      onSuccess(email, newPassword);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center">
              {step === "SEND_CODE" && <Mail className="h-5 w-5" />}
              {step === "KEEP_CODE" && <KeyRound className="h-5 w-5" />}
              {step === "NEW_PASSWORD" && <Lock className="h-5 w-5" />}
              {step === "SUCCESS" && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {step === "SEND_CODE" && "Reset Your Password"}
                {step === "KEEP_CODE" && "Enter Verification Code"}
                {step === "NEW_PASSWORD" && "Create New Password"}
                {step === "SUCCESS" && "Password Reset Complete"}
              </h3>
              <p className="text-[11px] text-slate-400">
                {step === "SEND_CODE" && "Step 1 of 3: Send OTP Code"}
                {step === "KEEP_CODE" && "Step 2 of 3: Verify 6-Digit Code"}
                {step === "NEW_PASSWORD" && "Step 3 of 3: Set New Password"}
                {step === "SUCCESS" && "All steps completed successfully"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-slate-950 h-1">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{
              width:
                step === "SEND_CODE"
                  ? "33%"
                  : step === "KEEP_CODE"
                  ? "66%"
                  : step === "NEW_PASSWORD"
                  ? "90%"
                  : "100%",
            }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success / Notice Message */}
          {successNotice && step !== "SUCCESS" && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: SEND CODE MODAL                                  */}
          {/* ======================================================== */}
          {step === "SEND_CODE" && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-200">
                  Your Registered Gmail / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    required
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We will dispatch a secure 6-digit OTP verification code directly to this inbox.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSendingCode || !email.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 inline-flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSendingCode ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 2: KEEP CODE (ENTER 6-DIGIT OTP)                    */}
          {/* ======================================================== */}
          {step === "KEEP_CODE" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-300">
                  Please keep and enter the 6-digit verification code sent to:
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-indigo-300">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{email}</span>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex items-center justify-center gap-2 pt-2" onPaste={handlePasteOtp}>
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-extrabold rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Option */}
              <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => setStep("SEND_CODE")}
                  className="text-slate-400 hover:text-indigo-400 font-semibold cursor-pointer"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isSendingCode}
                  className="text-indigo-400 hover:text-indigo-300 font-bold disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSendingCode ? "animate-spin" : ""}`} />
                  <span>
                    {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend Code"}
                  </span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isVerifyingCode || code.join("").length !== 6}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 inline-flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isVerifyingCode ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 3: NEW PASSWORD & CONFIRM PASSWORD                  */}
          {/* ======================================================== */}
          {step === "NEW_PASSWORD" && (
            <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
              <p className="text-xs text-slate-300">
                Code verified! Enter and confirm your new password below:
              </p>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  New Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Match Helper */}
              {confirmPassword && (
                <div className="text-[11px] font-semibold">
                  {newPassword === confirmPassword ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Passwords match!</span>
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Passwords do not match yet</span>
                    </span>
                  )}
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isResettingPassword ||
                    newPassword.length < 8 ||
                    newPassword !== confirmPassword
                  }
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 inline-flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Confirm & Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 4: SUCCESS CONFIRMATION                             */}
          {/* ======================================================== */}
          {step === "SUCCESS" && (
            <div className="py-4 text-center space-y-4 animate-fadeIn">
              <div className="h-16 w-16 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-lg">
                  Password Reset Successfully!
                </h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Your account password has been updated and all active sessions have been secured. You can now sign in with your new credentials.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleFinishAndLogin}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-all"
                >
                  <span>Sign In with New Password</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
