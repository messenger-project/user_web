import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
    serverExternalPackages: ["pdf-parse"],
    output: "standalone",
    distDir: isDevelopment ? ".next-dev" : ".next",

    async rewrites() {
        return [
            {
                source: "/api/llm/:path*",
                destination: "http://127.0.0.1:1234/:path*",
            },
        ];
    },
};

export default nextConfig;