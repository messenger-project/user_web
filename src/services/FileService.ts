import RequestService from "./RequestService";

export interface ExtractedDocument {
    filename: string;
    type: string;
    text: string;
}

class FileService {
    private readonly requestService: RequestService;

    constructor() {
        this.requestService = new RequestService(
            "/api/documents/extract",
            ""
        );
    }

    async extract(file: File): Promise<ExtractedDocument> {
        const formData = new FormData();
        formData.append("file", file);

        const result = await this.requestService.post(formData);

        if (
            !result ||
            typeof result.filename !== "string" ||
            typeof result.type !== "string" ||
            typeof result.text !== "string"
        ) {
            throw new Error(
                result?.message || "Document extraction failed."
            );
        }

        return {
            filename: result.filename,
            type: result.type,
            text: result.text,
        };
    }
}

export default FileService;