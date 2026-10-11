"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  HardDrive,
  Users,
  ImageIcon,
  FolderLock,
  ArrowRight,
  Loader2,
  ExternalLink,
  Zap,
  Lock,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  useGetPlansQuery,
  useGetSubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
  PricingPlan,
} from "@/redux/api/billingApi";

export default function BillingTab() {
  const [billingInterval, setBillingInterval] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpgradingTier, setIsUpgradingTier] = useState<string | null>(null);

  const {
    data: plans = [],
    isLoading: isPlansLoading,
  } = useGetPlansQuery();

  const {
    data: subResponse,
    isLoading: isSubLoading,
    refetch: refetchSubscription,
  } = useGetSubscriptionQuery();

  const [createCheckout] = useCreateCheckoutSessionMutation();
  const [createPortal, { isLoading: isOpeningPortal }] = useCreatePortalSessionMutation();

  const subscription = subResponse?.subscription;
  const currentTier = subscription?.tier || "FREE";
  const isSandbox = subResponse?.isSandbox;

  const handleSelectPlan = async (tier: "FREE" | "HERITAGE_PRO" | "DYNASTY_UNLIMITED") => {
    if (tier === currentTier) return;
    try {
      setIsUpgradingTier(tier);
      setErrorMessage("");
      setActionMessage("");

      const res = await createCheckout({
        tier,
        interval: billingInterval,
        successUrl: typeof window !== "undefined" ? `${window.location.origin}/owner-dashboard?tab=billing&status=success&tier=${tier}` : undefined,
      }).unwrap();

      if (res.url) {
        if (res.url.startsWith("http") && !res.url.includes("status=success")) {
          // Live Stripe redirect
          window.location.href = res.url;
        } else {
          // Sandbox or instant upgrade
          setActionMessage(res.message || `Successfully switched to ${tier === "FREE" ? "Free Tier" : "Premium Tier"}!`);
          refetchSubscription();
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to initiate Stripe checkout.");
    } finally {
      setIsUpgradingTier(null);
    }
  };

  const handleOpenStripePortal = async () => {
    try {
      setErrorMessage("");
      const res = await createPortal().unwrap();
      if (res.url && res.url.startsWith("http") && !res.url.includes("portal=simulated")) {
        window.location.href = res.url;
      } else {
        setActionMessage(res.message || "Stripe Customer Billing Portal opened in development mode.");
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to open customer portal.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-full pb-16 antialiased text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-bold">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span>Stripe Billing & Storage Infrastructure</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Plans & Storage Vault
          </h1>
          <p className="text-sm text-slate-400 font-normal">
            Manage your sanctuary storage capacity, member limits, and billing subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetchSubscription()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw className={`h-4 w-4 ${isSubLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            disabled={isOpeningPortal}
            onClick={handleOpenStripePortal}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-slate-700 disabled:opacity-50"
          >
            {isOpeningPortal ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            ) : (
              <ExternalLink className="h-4 w-4 text-indigo-400" />
            )}
            <span>Stripe Customer Portal</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hero Overview & Storage Usage Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Current Subscription
              </span>
              <span className="px-3 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-extrabold text-xs">
                {currentTier.replace("_", " ")}
              </span>
              {isSandbox && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 font-mono text-[10px] font-bold">
                  Stripe Sandbox Mode
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {subResponse?.plan?.name || "Free Sanctuary"}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl font-normal leading-relaxed">
              {subResponse?.plan?.tagline || "Essential lineage preservation for families."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Members</div>
              <div className="text-lg font-black text-white">
                {subscription?.currentMembersCount ?? 9}
                <span className="text-xs text-slate-500 font-normal">/{subscription?.maxMembersLimit ?? 25}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Documents</div>
              <div className="text-lg font-black text-indigo-300">
                {subscription?.totalDocuments ?? 1}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Memories</div>
              <div className="text-lg font-black text-purple-300">
                {subscription?.totalMemories ?? 2}
              </div>
            </div>
          </div>
        </div>

        {/* Live Storage Usage Meter */}
        <div className="space-y-2.5 pt-4 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-slate-300">
              <HardDrive className="h-4 w-4 text-indigo-400" />
              <span>Sanctuary Storage Capacity</span>
            </div>
            <span className="text-indigo-400 font-mono">
              {subscription?.storageUsedMb ?? 12.5} MB of {subscription?.storageLimitMb ?? 500} MB (
              {subscription?.storagePercent ?? 3}%)
            </span>
          </div>

          <div className="h-3.5 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-1000 shadow-sm"
              style={{ width: `${Math.max(3, subscription?.storagePercent ?? 3)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Encrypted cloud archives with automatic daily replication</span>
            <span>Up to 500 GB on Dynasty Unlimited</span>
          </div>
        </div>
      </div>

      {/* Billing Interval Toggle (Monthly / Yearly) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h3 className="text-xl font-extrabold text-white">Choose Your Family Tier</h3>
          <p className="text-xs text-slate-400 font-normal">
            Switch plans anytime. Upgrades take effect immediately with prorated billing.
          </p>
        </div>

        {/* Interval Selector */}
        <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 inline-flex items-center gap-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingInterval("MONTHLY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingInterval === "MONTHLY"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>

          <button
            type="button"
            onClick={() => setBillingInterval("YEARLY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              billingInterval === "YEARLY"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p) => {
          const isCurrent = p.id === currentTier;
          const price = billingInterval === "YEARLY" ? p.yearlyPrice : p.monthlyPrice;
          const isSelectedLoading = isUpgradingTier === p.id;

          return (
            <div
              key={p.id}
              className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-6 transition-all duration-300 relative ${
                p.popular
                  ? "bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500/80 shadow-2xl shadow-indigo-950/50 scale-[1.02]"
                  : "bg-slate-900 border-slate-800 shadow-xl hover:border-slate-700"
              }`}
            >
              {/* Badge */}
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-extrabold shadow-md tracking-wider uppercase">
                  {p.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-extrabold text-white tracking-tight">{p.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-normal leading-relaxed min-h-[36px]">
                    {p.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {price === 0 ? "Free" : `$${price}`}
                  </span>
                  {price > 0 && (
                    <span className="text-xs text-slate-400 font-semibold">
                      /{billingInterval === "YEARLY" ? "year" : "month"}
                    </span>
                  )}
                </div>

                {/* Storage & Member limits highlight */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{p.storageLimitMb >= 1024 ? `${p.storageLimitMb / 1024} GB` : `${p.storageLimitMb} MB`}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span>{p.maxMembersLimit >= 1000 ? "Unlimited" : `${p.maxMembersLimit} Relatives`}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Included Features:
                  </div>
                  <ul className="space-y-2 text-xs font-medium">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {f.included ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className={f.included ? "text-slate-200" : "text-slate-500"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/80">
                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-extrabold flex items-center justify-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Active Current Plan</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSelectedLoading}
                    onClick={() => handleSelectPlan(p.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-md disabled:opacity-50 ${
                      p.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    {isSelectedLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>{p.monthlyPrice === 0 ? "Downgrade to Free" : `Upgrade to ${p.name}`}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Guarantee Footer */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800/60">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <div className="font-extrabold text-white text-xs mb-0.5">PCI-DSS Level 1 Security</div>
            <p className="leading-relaxed">
              All payment transactions are processed through Stripe with end-to-end tokenization.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center shrink-0 border border-purple-800/60">
            <HardDrive className="h-4 w-4" />
          </div>
          <div>
            <div className="font-extrabold text-white text-xs mb-0.5">Instant Storage Allocation</div>
            <p className="leading-relaxed">
              Vault storage limits expand instantly in PostgreSQL upon checkout confirmation.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-extrabold text-white text-xs mb-0.5">Cancel Anytime Without Lock-in</div>
            <p className="leading-relaxed">
              Cancel or downgrade directly anytime via Stripe customer portal with no penalty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
