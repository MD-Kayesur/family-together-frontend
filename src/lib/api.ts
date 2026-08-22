const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
    avatarUrl?: string;
    emailVerified?: boolean;
  };
  message?: string;
}

export interface SignUpData {
  email: string;
  fullName: string;
  password: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Universal fetch wrapper that manages base URLs, JSON headers, and error parsing
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Required for HttpOnly cookies
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMessage = "An unexpected error occurred.";
    if (data?.message) {
      errorMessage = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    } else if (response.statusText) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return data as T;
}

/**
 * Register a new user account
 */
export async function signUpApi(data: SignUpData): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Sign in user with credentials
 */
export async function signInApi(data: SignInData): Promise<AuthResponse> {
  const result = await fetchApi<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.accessToken && typeof window !== "undefined") {
    localStorage.setItem("accessToken", result.accessToken);
    if (result.refreshToken) {
      localStorage.setItem("refreshToken", result.refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
}

/**
 * Get current authenticated user profile
 */
export async function getProfileApi(): Promise<AuthResponse["user"]> {
  return fetchApi<AuthResponse["user"]>("/auth/me", {
    method: "GET",
  });
}

/**
 * Request password reset email token
 */
export async function forgotPasswordApi(email: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Log out user session
 */
export async function logoutApi(): Promise<{ message: string }> {
  try {
    const result = await fetchApi<{ message: string }>("/auth/logout", {
      method: "POST",
    });
    return result;
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }
}
