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

export const familyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSanctuary: builder.query<SanctuaryResponse, void>({
      query: () => "/family/sanctuary",
      providesTags: ["Sanctuary"],
    }),
    getMembers: builder.query<FamilyMemberRecord[], void>({
      query: () => "/family/members",
      providesTags: ["Members"],
    }),
    addMember: builder.mutation<
      FamilyMemberRecord,
      { firstName: string; lastName: string; gender?: string; bio?: string }
    >({
      query: (body) => ({
        url: "/family/members",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sanctuary", "Members"],
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
      invalidatesTags: ["Sanctuary", "Memories"],
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
  }),
});

export const {
  useGetSanctuaryQuery,
  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetMemoriesQuery,
  useAddMemoryMutation,
  useGetEventsQuery,
  useAddEventMutation,
} = familyApi;
