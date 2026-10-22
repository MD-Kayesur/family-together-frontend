import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "@/lib/utils/cookieUtils";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include", // Supports automatic cookie transmission
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Auth",
    "Sessions",
    "Sanctuary",
    "Members",
    "Memories",
    "Events",
    "Relationships",
    "Documents",
    "Invitations",
    "Activity",
    "AdminStats",
    "UsersList",
    "Subscription",
    "Billing",
    "Announcements",
    "Conversations",
    "ChatMessages",
  ],
  endpoints: () => ({}),
});
