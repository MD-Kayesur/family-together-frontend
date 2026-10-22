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

import {
  saveAuthCookies,
  clearAllAuthCookies,
  getAuthToken,
  getStoredUser,
} from "@/lib/utils/cookieUtils";

export { syncAuthCookies } from "@/lib/utils/cookieUtils";

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false };
  }

  // Prioritize Cookies first for SSR & Security, fallback to localStorage
  const token = getAuthToken();
  const user = getStoredUser();
  const isAuth = Boolean(token);

  if (isAuth && user) {
    saveAuthCookies({ accessToken: token || undefined, user, role: user?.role });
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
      }

      // Persist to Cookies (primary) and localStorage (fallback)
      saveAuthCookies({
        accessToken,
        refreshToken,
        user,
        role: user?.role,
      });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear all auth cookies and local fallback
      clearAllAuthCookies();
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveAuthCookies({
          user: state.user,
          role: state.user?.role,
        });
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
