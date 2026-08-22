import { baseApi } from "./baseApi";
import { setCredentials, logout, User } from "../slices/authSlice";

export interface SignUpRequest {
  email: string;
  fullName: string;
  password: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user: User;
  message?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.user) {
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              })
            );
          }
        } catch {
          // Handled in component catch block
        }
      },
      invalidatesTags: ["User", "Auth"],
    }),

    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getProfile: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
      invalidatesTags: ["User", "Auth"],
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useLogoutMutation,
} = authApi;
