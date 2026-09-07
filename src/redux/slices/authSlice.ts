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
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

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

  return {
    user,
    token,
    isAuthenticated: Boolean(token),
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
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
