import { baseApi } from "./baseApi";

export interface AdminUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface AdminStatsResponse {
  totalUsers: number;
  activeLogins: number;
  relationshipsCreated: number;
  avgTreeDepth: string;
  totalFamilies: number;
  highActivityFamilies: {
    id: string;
    name: string;
    leader: string;
    nodeCount: number;
  }[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStatsResponse, void>({
      query: () => "/family/admin/stats",
      providesTags: ["AdminStats"],
    }),
    getUsersList: builder.query<AdminUserRecord[], void>({
      query: () => "/users",
      providesTags: ["UsersList"],
    }),
    updateUserRole: builder.mutation<
      AdminUserRecord,
      { id: string; role?: string; status?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["UsersList", "AdminStats"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UsersList", "AdminStats"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetUsersListQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = adminApi;
