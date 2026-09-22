import { baseApi } from "./baseApi";
import { transformPaginatedList, PaginatedList } from "./familyApi";

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
    getUsersList: builder.query<
      PaginatedList<AdminUserRecord>,
      { page?: number; limit?: number; search?: string; role?: string; status?: string } | void
    >({
      query: (params) => {
        if (!params) return "/users";
        const sp = new URLSearchParams();
        if (params.page) sp.set("page", String(params.page));
        if (params.limit) sp.set("limit", String(params.limit));
        if (params.search) sp.set("search", params.search);
        if (params.role) sp.set("role", params.role);
        if (params.status) sp.set("status", params.status);
        const qs = sp.toString();
        return qs ? `/users?${qs}` : "/users";
      },
      transformResponse: (res) => transformPaginatedList<AdminUserRecord>(res),
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
    createUser: builder.mutation<
      AdminUserRecord,
      { email: string; fullName: string; password?: string; role?: string }
    >({
      query: (body) => ({
        url: "/users",
        method: "POST",
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
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = adminApi;
