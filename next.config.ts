import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;