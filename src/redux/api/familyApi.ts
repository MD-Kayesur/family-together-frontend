import { baseApi } from "./baseApi";

export interface SanctuaryResponse {
  family: {
    id: string;
    name: string;
    description: string;
    members: any[];
    memories: any[];
    events: any[];
  };
  stats: {
    totalMembers: number;
    connectedUsers: number;
    relationships: number;
    pendingInvites: number;
    totalMemories: number;
  };
}

export interface FamilyMemberRecord {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  bio?: string;
  photoUrl?: string;
  createdAt?: string;
}

export interface MemoryRecord {
  id: string;
  title: string;
  description?: string;
  sharedBy?: string;
  photoCount?: number;
  mediaUrl?: string;
  mediaUrls?: string[];
  createdAt?: string;
}

export interface EventRecord {
  id: string;
  familyId?: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
  isVirtual?: boolean;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt?: string;
  updatedAt?: string;
  family?: {
    id: string;
    name: string;
  };
}

export interface RelationshipRecord {
  id: string;
  from: string;
  to: string;
  type: string;
  status: string;
  fromPersonId?: string;
  toPersonId?: string;
}

export interface DocumentFileAttachment {
  name: string;
  size?: string;
  fileUrl: string;
}

export interface DocumentRecord {
  id: string;
  familyId?: string;
  name: string;
  category: string;
  size: string;
  fileUrl?: string | null;
  fileUrls?: string[];
  files?: DocumentFileAttachment[];
  fileCount?: number;
  uploadedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvitationRecord {
  id: string;
  familyId?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  family?: {
    id: string;
    name: string;
  };
}

export interface ActivityRecord {
  id: string;
  title: string;
  timestamp: string;
  type: string;
  description?: string;
  user?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type PaginatedList<T> = T[] & { meta?: PaginationMeta; data?: T[] };

export function transformPaginatedList<T>(response: any): PaginatedList<T> {
  if (response && Array.isArray(response.data)) {
    const list = [...response.data] as any;
    list.meta = response.meta;
    list.data = response.data;
    return list;
  }
  if (Array.isArray(response)) {
    const list = [...response] as any;
    list.meta = {
      total: response.length,
      page: 1,
      limit: response.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
    list.data = response;
    return list;
  }
  return response;
}

export const familyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSanctuary: builder.query<SanctuaryResponse, void>({
      query: () => "/family/sanctuary",
      providesTags: ["Sanctuary"],
    }),
    updateFamilyDetails: builder.mutation<
      any,
      { name?: string; description?: string }
    >({
      query: (body) => ({
        url: "/family/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sanctuary"],
    }),
    getMembers: builder.query<
      PaginatedList<FamilyMemberRecord>,
      { page?: number; limit?: number; search?: string; q?: string } | void
    >({
      query: (params) => {
        if (!params) return "/family/members";
        const sp = new URLSearchParams();
        if (params.page) sp.set("page", String(params.page));
        if (params.limit) sp.set("limit", String(params.limit));
        if (params.search || params.q) sp.set("search", params.search || params.q || "");
        const qs = sp.toString();
        return qs ? `/family/members?${qs}` : "/family/members";
      },
      transformResponse: (res) => transformPaginatedList<FamilyMemberRecord>(res),
      providesTags: ["Members"],
    }),
    searchMembers: builder.query<
      PaginatedList<FamilyMemberRecord>,
      string | { q: string; page?: number; limit?: number }
    >({
      query: (arg) => {
        if (typeof arg === "string") {
          return `/family/members/search?q=${encodeURIComponent(arg)}`;
        }
        const sp = new URLSearchParams();
        sp.set("q", arg.q);
        if (arg.page) sp.set("page", String(arg.page));
        if (arg.limit) sp.set("limit", String(arg.limit));
        return `/family/members/search?${sp.toString()}`;
      },
      transformResponse: (res) => transformPaginatedList<FamilyMemberRecord>(res),
      providesTags: ["Members"],
    }),
    addMember: builder.mutation<
      FamilyMemberRecord,
      {
        existingPersonId?: string;
        firstName: string;
        lastName: string;
        email?: string;
        password?: string;
        gender?: string;
        bio?: string;
        middleName?: string;
        nickname?: string;
        dob?: string;
        birthplace?: string;
        isDeceased?: boolean;
        dateOfPassing?: string;
        occupation?: string;
        location?: string;
        contactInfo?: string;
        avatarUrl?: string;
        relativeToPersonId?: string;
        relationshipType?: string;
      }
    >({
      query: (body) => ({
        url: "/family/members",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Members", "Relationships", "Activity"],
    }),
    updateMember: builder.mutation<
      FamilyMemberRecord,
      { id: string; data: Partial<FamilyMemberRecord> }
    >({
      query: ({ id, data }) => ({
        url: `/family/members/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Sanctuary", "Members", "Activity"],
    }),
    deleteMember: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/family/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sanctuary", "Members", "Relationships", "Activity"],
    }),
    getMemories: builder.query<
      PaginatedList<MemoryRecord>,
      { userId?: string; userEmail?: string; page?: number; limit?: number; search?: string; category?: string } | void
    >({
      query: (params) => {
        if (!params) return "/family/memories";
        const queryParams = new URLSearchParams();
        if (params.userId) queryParams.set("userId", params.userId);
        if (params.userEmail) queryParams.set("userEmail", params.userEmail);
        if (params.page) queryParams.set("page", String(params.page));
        if (params.limit) queryParams.set("limit", String(params.limit));
        if (params.search) queryParams.set("search", params.search);
        if (params.category) queryParams.set("category", params.category);
        const qs = queryParams.toString();
        return qs ? `/family/memories?${qs}` : "/family/memories";
      },
      transformResponse: (res) => transformPaginatedList<MemoryRecord>(res),
      providesTags: ["Memories"],
    }),
    addMemory: builder.mutation<
      MemoryRecord,
      {
        title: string;
        description?: string;
        sharedBy?: string;
        userId?: string;
        userEmail?: string;
        date?: string;
        location?: string;
        category?: string;
        mediaUrl?: string;
        mediaUrls?: string[];
        taggedMembers?: string;
        privacy?: string;
      }
    >({
      query: (body) => ({
        url: "/family/memories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Memories", "Activity"],
    }),
    getMemoryById: builder.query<
      MemoryRecord,
      string | { id: string; userId?: string; userEmail?: string }
    >({
      query: (arg) => {
        if (typeof arg === "string") {
          return `/family/memories/${arg}`;
        }
        const sp = new URLSearchParams();
        if (arg.userId) sp.set("userId", arg.userId);
        if (arg.userEmail) sp.set("userEmail", arg.userEmail);
        const qs = sp.toString();
        return qs ? `/family/memories/${arg.id}?${qs}` : `/family/memories/${arg.id}`;
      },
      providesTags: (_result, _error, arg) => {
        const id = typeof arg === "string" ? arg : arg.id;
        return [{ type: "Memories", id }];
      },
    }),
    updateMemory: builder.mutation<
      MemoryRecord,
      {
        id: string;
        title?: string;
        description?: string;
        sharedBy?: string;
        userId?: string;
        userEmail?: string;
        date?: string;
        location?: string;
        category?: string;
        mediaUrl?: string;
        mediaUrls?: string[];
        taggedMembers?: string;
        privacy?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/family/memories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Memories", "Activity"],
    }),
    deleteMemory: builder.mutation<
      { success: boolean; message: string },
      string | { id: string; userId?: string; userEmail?: string }
    >({
      query: (arg) => {
        if (typeof arg === "string") {
          return {
            url: `/family/memories/${arg}`,
            method: "DELETE",
          };
        }
        const sp = new URLSearchParams();
        if (arg.userId) sp.set("userId", arg.userId);
        if (arg.userEmail) sp.set("userEmail", arg.userEmail);
        const qs = sp.toString();
        return {
          url: qs ? `/family/memories/${arg.id}?${qs}` : `/family/memories/${arg.id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Sanctuary", "Memories", "Activity"],
    }),
    getEvents: builder.query<
      PaginatedList<EventRecord>,
      { page?: number; limit?: number; search?: string; status?: string } | void
    >({
      query: (params) => {
        if (!params) return "/family/events";
        const sp = new URLSearchParams();
        if (params.page) sp.set("page", String(params.page));
        if (params.limit) sp.set("limit", String(params.limit));
        if (params.search) sp.set("search", params.search);
        if (params.status && params.status !== "ALL") sp.set("status", params.status);
        const qs = sp.toString();
        return qs ? `/family/events?${qs}` : "/family/events";
      },
      transformResponse: (res) => transformPaginatedList<EventRecord>(res),
      providesTags: ["Events"],
    }),
    addEvent: builder.mutation<
      EventRecord,
      { title: string; date: string; location?: string; description?: string; isVirtual?: boolean }
    >({
      query: (body) => ({
        url: "/family/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Events"],
    }),
    getEventById: builder.query<EventRecord, string>({
      query: (id) => `/family/events/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Events", id }],
    }),
    updateEvent: builder.mutation<
      EventRecord,
      { id: string; body: { title?: string; date?: string; location?: string; description?: string; isVirtual?: boolean } }
    >({
      query: ({ id, body }) => ({
        url: `/family/events/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Events"],
    }),
    deleteEvent: builder.mutation<
      { success: boolean; message: string; id: string },
      string
    >({
      query: (id) => ({
        url: `/family/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sanctuary", "Events"],
    }),
    getRelationships: builder.query<
      PaginatedList<RelationshipRecord>,
      { page?: number; limit?: number; search?: string; personId?: string } | void
    >({
      query: (params) => {
        if (!params) return "/family/relationships";
        const sp = new URLSearchParams();
        if (params.page) sp.set("page", String(params.page));
        if (params.limit) sp.set("limit", String(params.limit));
        if (params.search) sp.set("search", params.search);
        if (params.personId) sp.set("personId", params.personId);
        const qs = sp.toString();
        return qs ? `/family/relationships?${qs}` : "/family/relationships";
      },
      transformResponse: (res) => transformPaginatedList<RelationshipRecord>(res),
      providesTags: ["Relationships"],
    }),
    addRelationship: builder.mutation<
      RelationshipRecord,
      { fromPersonId: string; toPersonId: string; typeCode?: string }
    >({
      query: (body) => ({
        url: "/family/relationships",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Relationships"],
    }),
    getDocuments: builder.query<
      PaginatedList<DocumentRecord>,
      { page?: number; limit?: number; search?: string; category?: string } | void
    >({
      query: (params) => {
        if (!params) return "/family/documents";
        const sp = new URLSearchParams();
        if (params.page) sp.set("page", String(params.page));
        if (params.limit) sp.set("limit", String(params.limit));
        if (params.search) sp.set("search", params.search);
        if (params.category) sp.set("category", params.category);
        const qs = sp.toString();
        return qs ? `/family/documents?${qs}` : "/family/documents";
      },
      transformResponse: (res) => transformPaginatedList<DocumentRecord>(res),
      providesTags: ["Documents"],
    }),
    addDocument: builder.mutation<
      DocumentRecord,
      {
        name: string;
        category?: string;
        size?: string;
        fileUrl?: string;
        fileUrls?: string[];
        files?: DocumentFileAttachment[];
        uploadedBy?: string;
      }
    >({
      query: (body) => ({
        url: "/family/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Documents"],
    }),
    addMultipleDocuments: builder.mutation<
      DocumentRecord[],
      | Array<{ name: string; category?: string; size?: string; fileUrl?: string; uploadedBy?: string }>
      | { documents: Array<{ name: string; category?: string; size?: string; fileUrl?: string; uploadedBy?: string }> }
    >({
      query: (body) => ({
        url: "/family/documents/multiple",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Documents"],
    }),
    deleteDocument: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/family/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sanctuary", "Documents"],
    }),
    deleteAllDocuments: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: "/family/documents",
        method: "DELETE",
      }),
      invalidatesTags: ["Sanctuary", "Documents"],
    }),
    getInvitations: builder.query<
      PaginatedList<InvitationRecord>,
      { page?: number; limit?: number; search?: string; status?: string } | void
    >({
      query: (params) => {
        if (!params) return "/family/invitations";
        const sp = new URLSearchParams();
        if (params.page) sp.set("page", String(params.page));
        if (params.limit) sp.set("limit", String(params.limit));
        if (params.search) sp.set("search", params.search);
        if (params.status) sp.set("status", params.status);
        const qs = sp.toString();
        return qs ? `/family/invitations?${qs}` : "/family/invitations";
      },
      transformResponse: (res) => transformPaginatedList<InvitationRecord>(res),
      providesTags: ["Invitations"],
    }),
    addInvitation: builder.mutation<
      InvitationRecord,
      { name: string; email: string; role?: string; note?: string }
    >({
      query: (body) => ({
        url: "/family/invitations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Invitations"],
    }),
    updateInvitationStatus: builder.mutation<
      InvitationRecord,
      { id: string; status: "APPROVED" | "REJECTED" }
    >({
      query: ({ id, status }) => ({
        url: `/family/invitations/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Sanctuary", "Invitations", "Members"],
    }),
    getInvitationById: builder.query<InvitationRecord, string>({
      query: (id) => `/family/invitations/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Invitations", id }],
    }),
    deleteInvitation: builder.mutation<
      { success: boolean; message: string; id: string },
      string
    >({
      query: (id) => ({
        url: `/family/invitations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sanctuary", "Invitations"],
    }),
    getActivityLogs: builder.query<
      PaginatedList<ActivityRecord>,
      { page?: number; limit?: number; search?: string; type?: string } | void
    >({
      query: (params) => {
        if (!params) return "/family/activity-logs";
        const sp = new URLSearchParams();
        if (params.page) sp.set("page", String(params.page));
        if (params.limit) sp.set("limit", String(params.limit));
        if (params.search) sp.set("search", params.search);
        if (params.type) sp.set("type", params.type);
        const qs = sp.toString();
        return qs ? `/family/activity-logs?${qs}` : "/family/activity-logs";
      },
      transformResponse: (res) => transformPaginatedList<ActivityRecord>(res),
      providesTags: ["Sanctuary"],
    }),
    updateSanctuarySettings: builder.mutation<
      any,
      { name?: string; description?: string }
    >({
      query: (body) => ({
        url: "/family/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sanctuary"],
    }),
  }),
});

export const {
  useGetSanctuaryQuery,
  useUpdateFamilyDetailsMutation,
  useGetMembersQuery,
  useSearchMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetMemoriesQuery,
  useGetMemoryByIdQuery,
  useAddMemoryMutation,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetRelationshipsQuery,
  useAddRelationshipMutation,
  useGetDocumentsQuery,
  useAddDocumentMutation,
  useAddMultipleDocumentsMutation,
  useDeleteDocumentMutation,
  useDeleteAllDocumentsMutation,
  useGetInvitationsQuery,
  useGetInvitationByIdQuery,
  useAddInvitationMutation,
  useUpdateInvitationStatusMutation,
  useDeleteInvitationMutation,
  useGetActivityLogsQuery,
  useUpdateSanctuarySettingsMutation,
} = familyApi;

