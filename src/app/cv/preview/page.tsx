"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { CvData } from "@/types/cv";

const CvPreview = dynamic(
    () => import("@/components/cv/CvPreview"),
    {
        ssr: false,
        loading: () => (
            <div className="flex min-h-64 items-center justify-center text-sm text-[#54595F]">
                Loading CV preview...
            </div>
        ),
    }
);

export default function CvPreviewPage() {
    const [cv, setCv] = useState<CvData | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedCv = sessionStorage.getItem("tailoredCv");

        if (!storedCv) {
            setError("No CV data found. Please generate a CV first.");
            return;
        }

        try {
            setCv(JSON.parse(storedCv) as CvData);
        } catch {
            setError("Unable to load CV data.");
        }
    }, []);

    return (
        <main className="min-h-dvh w-full min-w-0 overflow-x-hidden bg-[#F5F7FA] px-3 py-4 text-[#02394F] sm:px-6 sm:py-6 lg:px-8">
            <div className="mx-auto w-full min-w-0 max-w-6xl">
                <header className="mb-6 hidden lg:block">
                    <h1 className="text-2xl font-semibold">
                        CV Preview
                    </h1>
                    <p className="mt-1 text-sm text-[#54595F]">
                        Choose a template, preview your CV, and download the PDF.
                    </p>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {cv && (
                    <section className="w-full min-w-0">
                        <CvPreview cv={cv} />
                    </section>
                )}
            </div>
        </main>
    );
}