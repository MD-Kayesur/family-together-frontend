/**
 * Centralized API & Backend URL Configuration
 *
 * Normalizes the backend URL across all environments (local, Render, Vercel).
 * Automatically cleans trailing slashes, /api/docs, /docs, or accidental /api suffixes
 * so that both REST controllers (/auth, /family, /users, /billing) and Socket.IO
 * connect reliably without 404 errors or network timeouts.
 */

export function getBackendUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
  let url = envUrl && envUrl.trim() ? envUrl.trim() : "https://family-together-backend-f18y.onrender.com";

  // Strip trailing slashes and any Swagger/API subpaths
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/api\/docs$/i, "");
  url = url.replace(/\/docs$/i, "");
  url = url.replace(/\/api$/i, "");
  url = url.replace(/\/+$/, "");

  return url || "https://family-together-backend-f18y.onrender.com";
}

export const BACKEND_API_URL = getBackendUrl();
