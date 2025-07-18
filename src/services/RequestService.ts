import Cookies from 'universal-cookie';
import ToastService from './ToastService';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const APPLICATION_JSON = 'application/json';

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
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (response.status === 200) {
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
    return {
      Accept: APPLICATION_JSON,
      Authorization: 'Bearer ' + this.cookies.get('token'),
    };
  }
}

export default RequestService;
