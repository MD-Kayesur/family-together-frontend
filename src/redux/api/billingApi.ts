import { baseApi } from "./baseApi";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: "FREE" | "HERITAGE_PRO" | "DYNASTY_UNLIMITED";
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  storageLimitMb: number;
  maxMembersLimit: number;
  badge?: string;
  popular?: boolean;
  features: PlanFeature[];
}

export interface SubscriptionData {
  id: string;
  familyId: string;
  userId: string;
  tier: "FREE" | "HERITAGE_PRO" | "DYNASTY_UNLIMITED";
  status: string;
  interval: "MONTHLY" | "YEARLY";
  storageLimitMb: number;
  storageUsedMb: number;
  storagePercent: number;
  maxMembersLimit: number;
  currentMembersCount: number;
  totalDocuments: number;
  totalMemories: number;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionResponse {
  subscription: SubscriptionData;
  plan: PricingPlan;
  isSandbox?: boolean;
}

export interface CreateCheckoutRequest {
  tier: "FREE" | "HERITAGE_PRO" | "DYNASTY_UNLIMITED";
  interval: "MONTHLY" | "YEARLY";
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  message?: string;
}

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<PricingPlan[], void>({
      query: () => "/billing/plans",
      providesTags: ["Billing"],
    }),
    getSubscription: builder.query<
      SubscriptionResponse,
      { familyId?: string } | void
    >({
      query: (params) => {
        if (params?.familyId) {
          return `/billing/subscription?familyId=${encodeURIComponent(params.familyId)}`;
        }
        return "/billing/subscription";
      },
      providesTags: ["Subscription"],
    }),
    createCheckoutSession: builder.mutation<
      CheckoutResponse,
      CreateCheckoutRequest
    >({
      query: (body) => ({
        url: "/billing/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription", "Sanctuary", "Billing"],
    }),
    createPortalSession: builder.mutation<
      { url: string; message?: string },
      { returnUrl?: string } | void
    >({
      query: (body) => ({
        url: "/billing/portal",
        method: "POST",
        body: body || {},
      }),
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetSubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
} = billingApi;
