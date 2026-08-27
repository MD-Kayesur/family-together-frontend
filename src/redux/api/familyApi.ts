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
  createdAt?: string;
}

export interface EventRecord {
  id: string;
  title: string;
  date: string;
  location?: string;
  isVirtual?: boolean;
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

export interface DocumentRecord {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedBy: string;
  createdAt?: string;
}

export interface InvitationRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  note?: string;
}

export interface ActivityRecord {
  id: string;
  title: string;
  timestamp: string;
  type: string;
  description?: string;
  user?: string;
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
    getMembers: builder.query<FamilyMemberRecord[], void>({
      query: () => "/family/members",
      providesTags: ["Members"],
    }),
    addMember: builder.mutation<
      FamilyMemberRecord,
      {
        firstName: string;
        lastName: string;
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
      }
    >({
      query: (body) => ({
        url: "/family/members",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Members", "Activity"],
    }),
    updateMember: builder.mutation<
      FamilyMemberRecord,
      { id: string; firstName?: string; lastName?: string; bio?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/family/members/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Members"],
    }),
    deleteMember: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/family/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sanctuary", "Members"],
    }),
    getMemories: builder.query<MemoryRecord[], void>({
      query: () => "/family/memories",
      providesTags: ["Memories"],
    }),
    addMemory: builder.mutation<
      MemoryRecord,
      { title: string; description?: string; sharedBy?: string }
    >({
      query: (body) => ({
        url: "/family/memories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Memories", "Activity"],
    }),
    getEvents: builder.query<EventRecord[], void>({
      query: () => "/family/events",
      providesTags: ["Events"],
    }),
    addEvent: builder.mutation<
      EventRecord,
      { title: string; date: string; location?: string; isVirtual?: boolean }
    >({
      query: (body) => ({
        url: "/family/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Events"],
    }),
    getRelationships: builder.query<RelationshipRecord[], void>({
      query: () => "/family/relationships",
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
    getDocuments: builder.query<DocumentRecord[], void>({
      query: () => "/family/documents",
      providesTags: ["Documents"],
    }),
    addDocument: builder.mutation<
      DocumentRecord,
      { name: string; category?: string; size?: string; uploadedBy?: string }
    >({
      query: (body) => ({
        url: "/family/documents",
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
    getInvitations: builder.query<InvitationRecord[], void>({
      query: () => "/family/invitations",
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
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/family/invitations/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Sanctuary", "Invitations"],
    }),
    getActivityLogs: builder.query<ActivityRecord[], void>({
      query: () => "/family/activity",
      providesTags: ["Activity"],
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
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetMemoriesQuery,
  useAddMemoryMutation,
  useGetEventsQuery,
  useAddEventMutation,
  useGetRelationshipsQuery,
  useAddRelationshipMutation,
  useGetDocumentsQuery,
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetInvitationsQuery,
  useAddInvitationMutation,
  useUpdateInvitationStatusMutation,
  useGetActivityLogsQuery,
  useUpdateSanctuarySettingsMutation,
} = familyApi;

