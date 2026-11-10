import { NextRequest, NextResponse } from "next/server";

import DocumentExtractionService, {
    DocumentExtractionError,
} from "@/services/documents/DocumentExtractionService";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { message: "A document file is required." },
                { status: 400 }
            );
        }

        const result = await DocumentExtractionService.extract(file);

        return NextResponse.json({
            message: "Document text extracted successfully.",
            ...result,
        });
    } catch (error) {
        if (error instanceof DocumentExtractionError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.statusCode }
            );
        }

        console.error("Document extraction failed:", error);

        return NextResponse.json(
            { message: "Failed to extract document text." },
            { status: 500 }
        );
    }
}