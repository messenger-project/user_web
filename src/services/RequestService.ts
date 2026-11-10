import Cookies from "universal-cookie";
import ToastService from "./ToastService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

const APPLICATION_JSON = "application/json";

type RequestPayload = FormData | Record<string, unknown> | undefined;

interface ApiResponse {
    message?: string;
    [key: string]: any;
}

class RequestService {
    private readonly endpoint: string;
    private readonly baseUrl: string;
    private cookies: Cookies;

    constructor(endpoint: string, baseUrl: string = BASE_URL) {
        this.endpoint = endpoint;
        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.cookies = new Cookies(null, { path: "/" });
    }

    private getUrl(params = ""): string {
        return `${this.baseUrl}${this.endpoint}${params}`;
    }

    private getHeaders(): Record<string, string> {
        return {
            Accept: APPLICATION_JSON,
            "Accept-Language": this.cookies.get("lang") || "en",
        };
    }

    private getCredentials(): RequestCredentials {
        return this.endpoint === "/v1/chat/completions"
            ? "omit"
            : "include";
    }

    private getBody(payload?: RequestPayload): BodyInit | undefined {
        if (payload instanceof FormData) {
            return payload;
        }

        return payload === undefined
            ? undefined
            : JSON.stringify(payload);
    }

    private getContentHeaders(
        payload?: RequestPayload
    ): Record<string, string> {
        return payload instanceof FormData
            ? {}
            : { "Content-Type": APPLICATION_JSON };
    }

    private async parseResponse(response: Response): Promise<ApiResponse> {
        try {
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch {
            return {
                message: "Invalid server response.",
            };
        }
    }

    async get(params = ""): Promise<ApiResponse | null> {
        try {
            const response = await fetch(this.getUrl(params), {
                method: "GET",
                headers: this.getHeaders(),
                credentials: this.getCredentials(),
            });

            const data = await this.parseResponse(response);

            if (!response.ok) {
                ToastService.showError(
                    data.message || "Request failed."
                );
            }

            return data;
        } catch (error) {
            console.error("GET request failed:", error);
            ToastService.showError("Unable to connect to the server.");
            return null;
        }
    }

    async post(payload?: RequestPayload): Promise<ApiResponse | null> {
        const toastId = ToastService.showLoading();

        try {
            const response = await fetch(this.getUrl(), {
                method: "POST",
                headers: {
                    ...this.getHeaders(),
                    ...this.getContentHeaders(payload),
                },
                credentials: this.getCredentials(),
                body: this.getBody(payload),
            });

            const data = await this.parseResponse(response);

            if (response.ok) {
                ToastService.updateSuccess(
                    data.message || "Operation completed.",
                    toastId
                );
            } else {
                ToastService.updateError(
                    data.message || "Request failed.",
                    toastId
                );
            }

            return data;
        } catch (error) {
            console.error("POST request failed:", error);

            ToastService.updateError(
                "Unable to connect to the server.",
                toastId
            );

            return null;
        }
    }

    async postChunk(payload?: RequestPayload): Promise<ApiResponse | null> {
        try {
            const response = await fetch(this.getUrl(), {
                method: "POST",
                headers: {
                    ...this.getHeaders(),
                    ...this.getContentHeaders(payload),
                },
                credentials: this.getCredentials(),
                body: this.getBody(payload),
            });

            const data = await this.parseResponse(response);

            if (!response.ok) {
                ToastService.showError(
                    data.message || "Request failed."
                );
            }

            return data;
        } catch (error) {
            console.error("Chunk upload failed:", error);
            ToastService.showError("Unable to connect to the server.");
            return null;
        }
    }

    async patch(payload?: RequestPayload): Promise<ApiResponse | null> {
        return this.sendWithToast("PATCH", payload);
    }

    async delete(payload?: RequestPayload): Promise<ApiResponse | null> {
        return this.sendWithToast("DELETE", payload);
    }

    private async sendWithToast(
        method: "PATCH" | "DELETE",
        payload?: RequestPayload
    ): Promise<ApiResponse | null> {
        const toastId = ToastService.showLoading();

        try {
            const response = await fetch(this.getUrl(), {
                method,
                headers: {
                    ...this.getHeaders(),
                    ...this.getContentHeaders(payload),
                },
                credentials: this.getCredentials(),
                body: this.getBody(payload),
            });

            const data = await this.parseResponse(response);

            if (response.ok) {
                ToastService.updateSuccess(
                    data.message || "Operation completed.",
                    toastId
                );
            } else {
                ToastService.updateError(
                    data.message || "Request failed.",
                    toastId
                );
            }

            return data;
        } catch (error) {
            console.error(`${method} request failed:`, error);

            ToastService.updateError(
                "Unable to connect to the server.",
                toastId
            );

            return null;
        }
    }
}

export default RequestService;