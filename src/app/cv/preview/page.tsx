"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { CvData } from "@/types/cv";

const CvPreview = dynamic(
    () => import("@/components/cv/CvPreview"),
    {
        ssr: false,
        loading: () => <p>Loading CV preview...</p>,
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
        <main className="min-h-screen bg-[#F5F7FA] p-6">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-6 text-2xl font-semibold">
                    CV Preview
                </h1>

                {error && (
                    <p className="text-red-600">{error}</p>
                )}

                {cv && <CvPreview cv={cv} />}
            </div>
        </main>
    );
}