/**
 * Unified Cookie Management Utility for FamilyRoots
 * Provides secure, SameSite=Lax cookie persistence for access tokens,
 * refresh tokens, and user session metadata across SSR and CSR.
 */

export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secure}`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export interface AuthSessionData {
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  role?: string;
}

export function syncAuthCookies(isAuth: boolean, role?: string) {
  if (typeof document === "undefined") return;
  if (isAuth) {
    setCookie("is_authenticated", "true", 7);
    if (role) {
      setCookie("user_role", String(role), 7);
    }
  } else {
    deleteCookie("is_authenticated");
    deleteCookie("user_role");
  }
}

/**
 * Persists all authentication state in browser cookies
 */
export function saveAuthCookies(data: AuthSessionData) {
  if (typeof document === "undefined") return;

  if (data.accessToken) {
    setCookie("access_token", data.accessToken, 7);
    // Also sync localStorage for fallback/transition safety
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("accessToken", data.accessToken);
    }
  }

  if (data.refreshToken) {
    setCookie("refresh_token", data.refreshToken, 7);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  }

  if (data.user) {
    setCookie("user", JSON.stringify(data.user), 7);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  setCookie("is_authenticated", "true", 7);

  const effectiveRole = data.role || data.user?.role;
  if (effectiveRole) {
    setCookie("user_role", String(effectiveRole), 7);
  }
}

/**
 * Clears all authentication cookies and fallback localStorage keys
 */
export function clearAllAuthCookies() {
  if (typeof document === "undefined") return;

  deleteCookie("access_token");
  deleteCookie("refresh_token");
  deleteCookie("user");
  deleteCookie("is_authenticated");
  deleteCookie("user_role");

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}

/**
 * Retrieves the active access token, prioritizing Cookies first
 */
export function getAuthToken(): string | null {
  const cookieToken = getCookie("access_token");
  if (cookieToken) return cookieToken;

  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("accessToken");
  }

  return null;
}

/**
 * Retrieves the active authenticated user, prioritizing Cookies first
 */
export function getStoredUser(): any | null {
  const cookieUser = getCookie("user");
  if (cookieUser) {
    try {
      return JSON.parse(cookieUser);
    } catch {
      // Fall through to localStorage
    }
  }

  if (typeof localStorage !== "undefined") {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch {
        return null;
      }
    }
  }

  return null;
}
