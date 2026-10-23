import type { NextConfig } from "next";

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "https://family-together-backend-f18y.onrender.com";

// Normalize URL (strip trailing slashes, /api/docs, or accidental /api)
const BACKEND_URL = rawUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api\/docs$/i, "")
  .replace(/\/docs$/i, "")
  .replace(/\/api$/i, "")
  .replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${BACKEND_URL}/auth/:path*`,
      },
      {
        source: "/family/:path*",
        destination: `${BACKEND_URL}/family/:path*`,
      },
      {
        source: "/users/:path*",
        destination: `${BACKEND_URL}/users/:path*`,
      },
      {
        source: "/billing/:path*",
        destination: `${BACKEND_URL}/billing/:path*`,
      },
      {
        source: "/health",
        destination: `${BACKEND_URL}/health`,
      },
      {
        source: "/api/docs/:path*",
        destination: `${BACKEND_URL}/api/docs/:path*`,
      },
      {
        source: "/docs/:path*",
        destination: `${BACKEND_URL}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;

