import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment
  basePath: '/mission-control',
};

export default nextConfig;
