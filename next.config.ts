import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
    serverExternalPackages: ["pdf-parse"],
    output: "standalone",
    distDir: isDevelopment ? ".next-dev" : ".next",

    outputFileTracingIncludes: {
        "/api/documents/extract": [
            "./node_modules/@napi-rs/canvas/**/*",
            "./node_modules/@napi-rs/canvas-*/**/*",
            "./node_modules/pdfjs-dist/node_modules/@napi-rs/canvas/**/*",
            "./node_modules/pdfjs-dist/node_modules/@napi-rs/canvas-*/**/*",
            "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
            "./node_modules/pdf-parse/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
        ],
    },

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