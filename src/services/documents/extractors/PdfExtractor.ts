import { PDFParse } from "pdf-parse";

export default class PdfExtractor {
    static async extract(buffer: Buffer): Promise<string> {
        if (buffer.subarray(0, 5).toString() !== "%PDF-") {
            throw new Error("Invalid PDF file.");
        }

        const parser = new PDFParse({ data: buffer });

        try {
            const result = await parser.getText();
            const text = result.text.trim();

            if (!text) {
                throw new Error("No selectable text found. OCR may be required.");
            }

            return text;
        } finally {
            await parser.destroy();
        }
    }
}