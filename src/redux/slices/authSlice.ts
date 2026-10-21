import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "@/lib/utils/roleUtils";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: UserRole;
  status?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const syncAuthCookies = (isAuth: boolean, role?: string) => {
  if (typeof document === "undefined") return;
  if (isAuth) {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `is_authenticated=true; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (role) {
      document.cookie = `user_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  } else {
    document.cookie = "is_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
};

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false };
  }

  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user");
  let user: User | null = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  const isAuth = Boolean(token);
  if (isAuth && user) {
    syncAuthCookies(true, user?.role);
  }

  return {
    user,
    token,
    isAuthenticated: isAuth,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken?: string; refreshToken?: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.isAuthenticated = true;

      if (accessToken) {
        state.token = accessToken;
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
          syncAuthCookies(true, user?.role);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        syncAuthCookies(false);
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
          syncAuthCookies(true, state.user?.role);
        }
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
