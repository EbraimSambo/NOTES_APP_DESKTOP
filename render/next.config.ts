import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["better-sqlite3"], // Esta é a forma moderna (Next.js 14/15) de lidar com binários nativos
};

export default nextConfig;