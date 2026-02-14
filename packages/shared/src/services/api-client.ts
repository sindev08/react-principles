import type { ApiError, ApiResponse } from "../types/api";

/**
 * Configuration for the API client.
 */
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  onError?: (error: ApiError) => void;
  getAuthToken?: () => string | null;
}

/**
 * Options for individual requests, extending the standard RequestInit.
 */
export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

/**
 * Builds a URL with query parameters, filtering out undefined values.
 */
function buildUrl(
  base: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(path, base);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Creates a type-safe API client with built-in error handling,
 * authentication, and response parsing.
 */
export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, defaultHeaders = {}, onError, getAuthToken } = config;

  async function request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { params, body, headers: requestHeaders, ...fetchOptions } = options;

    const url = buildUrl(baseUrl, path, params);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...(requestHeaders as Record<string, string> | undefined),
    };

    const token = getAuthToken?.();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...fetchOptions,
    });

    if (!response.ok) {
      const errorBody: ApiError = await response.json().catch(() => ({
        message: response.statusText || "An unknown error occurred",
        success: false as const,
        statusCode: response.status,
      }));

      const apiError: ApiError = {
        message: errorBody.message || response.statusText,
        success: false,
        statusCode: response.status,
        errors: errorBody.errors,
      };

      onError?.(apiError);
      throw apiError;
    }

    const data: T = await response.json() as T;
    return data;
  }

  return {
    get<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>("GET", path, options);
    },

    post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>("POST", path, { ...options, body });
    },

    put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>("PUT", path, { ...options, body });
    },

    patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>("PATCH", path, { ...options, body });
    },

    delete<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>("DELETE", path, options);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
