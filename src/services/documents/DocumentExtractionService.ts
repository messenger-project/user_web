import PdfExtractor from "./extractors/PdfExtractor";
import TxtExtractor from "./extractors/TxtExtractor";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10Mb

export interface ExtractedDocument {
    filename: string;
    type: "pdf" | "txt";
    text: string;
}

export class DocumentExtractionError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number
    ) {
        super(message);
        this.name = "DocumentExtractionError";
    }
}

export default class DocumentExtractionService {
    static async extract(file: File): Promise<ExtractedDocument> {
        if (!file || file.size === 0) {
            throw new DocumentExtractionError(
                "File cannot be empty.",
                400
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new DocumentExtractionError(
                "Maximum file size is 10 MB.",
                413
            );
        }

        const extension = file.name.split(".").pop()?.toLowerCase();

        if (extension !== "pdf" && extension !== "txt") {
            throw new DocumentExtractionError(
                "Unsupported file format. Only PDF and TXT are supported.",
                415
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        let text: string;

        try {
            switch (extension) {
                case "pdf":
                    text = await PdfExtractor.extract(buffer);
                    break;

                case "txt":
                    text = TxtExtractor.extract(buffer);
                    break;

                default:
                    throw new DocumentExtractionError(
                        "Unsupported file format.",
                        415
                    );
            }
        } catch (error) {
            if (error instanceof DocumentExtractionError) {
                throw error;
            }

            if (
                extension === "txt" &&
                error instanceof TypeError
            ) {
                throw new DocumentExtractionError(
                    "Unsupported or invalid text encoding.",
                    400
                );
            }

            if (
                error instanceof Error &&
                error.message === "Invalid PDF file."
            ) {
                throw new DocumentExtractionError(
                    error.message,
                    400
                );
            }

            if (
                error instanceof Error &&
                error.message === "No selectable text found. OCR may be required."
            ) {
                throw new DocumentExtractionError(
                    error.message,
                    422
                );
            }

            throw error;
        }

        if (!text) {
            throw new DocumentExtractionError(
                "No text found in the document.",
                422
            );
        }

        return {
            filename: file.name,
            type: extension,
            text,
        };
    }
}