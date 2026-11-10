"use client";

import { useMemo, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Download } from "lucide-react";

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
        <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#E8EDEF] bg-white lg:h-[calc(100dvh-180px)] lg:min-h-[500px] lg:flex-row">
            <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
            />

            <main className="flex min-w-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-end border-b border-[#E8EDEF] bg-white px-3 py-3 lg:justify-between lg:px-6 lg:py-4">
                    <div className="hidden min-w-0 lg:block">
                        <h2 className="text-lg font-semibold text-[#141414]">
                            CV Preview
                        </h2>
                        <p className="mt-1 text-sm text-[#54595F]">
                            Selected template: {selectedTemplate}
                        </p>
                    </div>

                    <PDFDownloadLink
                        key={selectedTemplate}
                        document={document}
                        fileName={`tailored-cv-${selectedTemplate}.pdf`}
                        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#008EED] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#05A7F7] sm:w-auto"
                    >
                        {({ loading, error }) => (
                            <>
                                <Download size={17} />
                                <span>
                                    {error
                                        ? "Unable to generate PDF"
                                        : loading
                                          ? "Generating PDF..."
                                          : "Download PDF"}
                                </span>
                            </>
                        )}
                    </PDFDownloadLink>
                </div>

                <div className="min-w-0 flex-1 bg-[#F5F7FA] p-2 sm:p-4">
                    <div className="h-[65dvh] min-h-[350px] w-full overflow-hidden rounded-lg border border-[#E8EDEF] bg-white lg:h-full lg:min-h-0">
                        <PDFViewer
                            key={selectedTemplate}
                            width="100%"
                            height="100%"
                            showToolbar={false}
                            className="block h-full w-full"
                        >
                            {document}
                        </PDFViewer>
                    </div>
                </div>
            </main>
        </div>
    );
}