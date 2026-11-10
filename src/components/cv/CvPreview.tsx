"use client";

import { useMemo, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import type { CvData } from "@/types/cv";
import TemplateSelector from "./TemplateSelector";
import {
    DEFAULT_CV_TEMPLATE,
    type CvTemplateId,
} from "./templateRegistry";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";

interface CvPreviewProps {
    cv: CvData;
}

export default function CvPreview({ cv }: CvPreviewProps) {
    console.log("NEW CV PREVIEW LOADED");
    const [selectedTemplate, setSelectedTemplate] =
        useState<CvTemplateId>(DEFAULT_CV_TEMPLATE);

    const document = useMemo(() => {
        switch (selectedTemplate) {
            case "classic":
                return <ClassicTemplate cv={cv} />;
            case "modern":
                return <ModernTemplate cv={cv} />;
            case "minimal":
                return <MinimalTemplate cv={cv} />;
            case "creative":
                return <CreativeTemplate cv={cv} />;
            default:
                return <ClassicTemplate cv={cv} />;
        }
    }, [selectedTemplate, cv]);

    return (
        <div className="flex h-[calc(100vh-100px)] min-h-[500px] overflow-hidden rounded-xl border border-[#E8EDEF] bg-white">
            <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
            />

            <main className="flex min-w-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E8EDEF] bg-white px-6 py-4">
                    <div>
                        <h1 className="text-lg font-semibold text-[#141414]">
                            CV Preview
                        </h1>
                        <p className="text-sm text-[#54595F]">
                            Selected template: {selectedTemplate}
                        </p>
                    </div>

                    <PDFDownloadLink
                        key={selectedTemplate}
                        document={document}
                        fileName={`tailored-cv-${selectedTemplate}.pdf`}
                        className="rounded-lg bg-[#008EED] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#05A7F7]"
                    >
                        {({ loading, error }) =>
                            error
                                ? "Unable to generate PDF"
                                : loading
                                  ? "Generating PDF..."
                                  : "Download PDF"
                        }
                    </PDFDownloadLink>
                </div>

                <div className="min-h-0 flex-1 bg-[#F5F7FA] p-4">
                    <PDFViewer
                        key={selectedTemplate}
                        width="100%"
                        height="100%"
                        showToolbar={false}
                        className="rounded-lg border border-[#E8EDEF]"
                    >
                        {document}
                    </PDFViewer>
                </div>
            </main>
        </div>
    );
}