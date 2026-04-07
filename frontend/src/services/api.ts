import type { GenerateRequest, GenerateResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.minimaxi.com/v1/image_generation';

export class ApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            code: response.status,
            message: errorData.base_resp?.status_msg || `HTTP error! status: ${response.status}`,
          },
        };
      }

      const data = await response.json();

      if (data.base_resp?.status_code !== 0) {
        return {
          success: false,
          error: {
            code: data.base_resp?.status_code || -1,
            message: data.base_resp?.status_msg || 'Unknown error occurred',
          },
        };
      }

      return {
        success: true,
        data: {
          image_urls: data.data?.image_urls,
          image_base64: data.data?.image_base64,
        },
        metadata: {
          success_count: data.metadata?.success_count || '0',
          failed_count: data.metadata?.failed_count || '0',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: -1,
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }
}

let apiService: ApiService | null = null;

export const initializeApiService = (apiKey: string): void => {
  apiService = new ApiService(apiKey);
};

export const getApiService = (): ApiService => {
  if (!apiService) {
    throw new Error('API service not initialized. Please set your API key first.');
  }
  return apiService;
};

export const isApiServiceInitialized = (): boolean => {
  return apiService !== null;
};
