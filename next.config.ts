import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "/fleet-management",
  assetPrefix: "/fleet-management",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;