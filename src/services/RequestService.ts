import Cookies from 'universal-cookie';
import ToastService from './ToastService';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PATCH = 'PATCH';
const METHOD_DELETE = 'DELETE';
const APPLICATION_JSON = 'application/json';
const APPLICATION_FORM_DATA = 'application/form-data';

interface ApiResponse {
  message: string;
  [key: string]: any;
}

class RequestService {
  private readonly endpoint: string;
  private cookies: Cookies;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.cookies = new Cookies(null, { path: '/' });
  }
  async get(params = ''): Promise<any> {
    try {
      const response = await fetch(BASE_URL + this.endpoint + params, {
        method: METHOD_GET,
        headers: this.getHeaders(),
        credentials: 'include',
      });

      return await response.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async post(payload?: object): Promise<any> {
    try {
      ToastService.showLoading();

      const isFormData = payload instanceof FormData;

      const response = await fetch(BASE_URL + this.endpoint, {
        method: METHOD_POST,
        headers: {
          ...this.getHeaders(),
          ...(isFormData ? {} : { 'Content-Type': APPLICATION_JSON }),
        },
        credentials: this.endpoint === '/v1/chat/completions'
          ? 'omit'
          : 'include',
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        ToastService.updateSuccess(data.message);
      } else {
        ToastService.updateError(data.message);
      }

      return data;
    } catch (error: any) {
      ToastService.updateError(error.message);
      return null;
    }
  }

  async postChunk(payload?: object): Promise<any> {
    try {
      const isFormData = payload instanceof FormData;
      const response = await fetch(BASE_URL + this.endpoint, {
        method: METHOD_POST,
        headers: {
          ...this.getHeaders(),
        },
        credentials: 'include',
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (response.status !== 200) {
        ToastService.updateError(data.message);
      }

      return data;
    } catch (error: any) {
      ToastService.updateError(error.message);
      return null;
    }
  }

  async patch(payload?: object): Promise<any> {
    try {
      ToastService.showLoading();

      const isFormData = payload instanceof FormData;

      const response = await fetch(BASE_URL + this.endpoint, {
        method: METHOD_PATCH,
        headers: {
          ...this.getHeaders(),
          ...(isFormData ? {} : { 'Content-Type': APPLICATION_JSON }),
        },
        credentials: 'include',
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        ToastService.updateSuccess(data.message);
      } else {
        ToastService.updateError(data.message);
      }

      return data;
    } catch (error: any) {
      ToastService.updateError(error.message);
      return null;
    }
  }

  async delete(payload?: object): Promise<any> {
    try {
      ToastService.showLoading();

      const isFormData = payload instanceof FormData;

      const response = await fetch(BASE_URL + this.endpoint, {
        method: METHOD_DELETE,
        headers: {
          ...this.getHeaders(),
          ...(isFormData ? {} : { 'Content-Type': APPLICATION_JSON }),
        },
        credentials: 'include',
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        ToastService.updateSuccess(data.message);
      } else {
        ToastService.updateError(data.message);
      }

      return data;
    } catch (error: any) {
      ToastService.updateError(error.message);
      return null;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: APPLICATION_JSON,
      'Accept-Language': this.cookies.get('lang') || 'en',
    };

    return headers;
  }

  private async parseResponse(response: Response): Promise<any> {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  }
}

export default RequestService;