/** @type {import('next').NextConfig} */
const rawBackendUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://nirbhor-backend-6yuf.onrender.com/api/v1";

// Normalize origin (e.g. https://nirbhor-backend-6yuf.onrender.com)
const cleanOrigin = rawBackendUrl
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/, "");

const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${cleanOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
