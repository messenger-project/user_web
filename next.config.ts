import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
    output: "standalone",
    distDir: isDevelopment ? ".next-dev" : ".next",
};

export default nextConfig;