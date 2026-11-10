
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const environment =
    process.env.APP_ENV ?? "development";

const environmentLabels: Record<string, string> = {
    development: "Development",
    staging: "Staging",
    production: "",
};

const environmentLabel =
    environmentLabels[environment] ?? "Development";

const appName = process.env.APP_NAME;

export const metadata: Metadata = {
    title: environmentLabel
        ? `${appName} · ${environmentLabel}`
        : appName,
    description: process.env.APP_DESCRIPTION,
    applicationName: appName,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}