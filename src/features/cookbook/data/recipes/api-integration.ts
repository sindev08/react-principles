import type { RecipeDetail } from "../types";

export const apiIntegration: RecipeDetail = {
  slug: "api-integration",
  title: "API Integration",
  breadcrumbCategory: "API Integration",
  description:
    "A custom fetch-based API client factory with typed methods, centralized error handling, and optional auth — no Axios needed.",
  principle: {
    text: "All API calls flow through a single typed client created by createApiClient(). The factory configures the base URL, auth headers, and error handling once. Services wrap the client with domain-specific methods. React Query hooks wrap services for caching. Components never call fetch() directly.",
    tip: "The native Fetch API covers most use cases without a library. createApiClient adds type safety, automatic JSON serialization, query parameter handling, and centralized error handling — the exact gaps fetch leaves open — without pulling in Axios as a dependency.",
  },
  rules: [
    { title: "Single API Client Instance", description: "Create one instance via createApiClient() in lib/api.ts and import it everywhere. All requests share the same base URL, headers, and error handler." },
    { title: "Type All Responses", description: "Pass a generic type to every api.get<T>() call. TypeScript interfaces define the contract — if the backend changes shape, the compiler catches it." },
    { title: "Centralized Error Handling", description: "Pass an onError callback to createApiClient(). It fires on every failed request — connect it to a toast or error reporting service. Components never parse error responses." },
    { title: "Service → Hook → Component", description: "Services handle HTTP calls. Hooks wrap services with React Query. Components consume hooks. Each layer has one job — when the API changes, only the service file changes." },
  ],
  pattern: {
    filename: "lib/api-client.ts",
    code: `import type { ApiError } from '@/shared/types/api';

interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  onError?: (error: ApiError) => void;
  getAuthToken?: () => string | null;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, defaultHeaders = {}, onError, getAuthToken } = config;

  async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const { params, body, headers: reqHeaders, ...fetchOptions } = options;
    const url = new URL(path, baseUrl);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
      ...(reqHeaders as Record<string, string> | undefined),
    };
    const token = getAuthToken?.();
    if (token) headers['Authorization'] = \`Bearer \${token}\`;

    const res = await fetch(url, {
      method, headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...fetchOptions,
    });

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({
        message: res.statusText, statusCode: res.status,
      }));
      onError?.(err);
      throw err;
    }

    return (await res.json()) as T;
  }

  return {
    get<T>(path: string, opts?: RequestOptions) { return request<T>('GET', path, opts); },
    post<T>(path: string, body?: unknown, opts?: RequestOptions) { return request<T>('POST', path, { ...opts, body }); },
    put<T>(path: string, body?: unknown, opts?: RequestOptions) { return request<T>('PUT', path, { ...opts, body }); },
    patch<T>(path: string, body?: unknown, opts?: RequestOptions) { return request<T>('PATCH', path, { ...opts, body }); },
    delete<T>(path: string, opts?: RequestOptions) { return request<T>('DELETE', path, opts); },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;`,
  },
  implementation: {
    nextjs: {
      description:
        "Create a singleton instance in lib/api.ts, then build a service layer with typed methods. React Query hooks wrap the service for caching. The chain: createApiClient → usersService → useUsers → UserList.",
      filename: "lib/api.ts + lib/services/users.ts",
      code: `// lib/api.ts — singleton instance
import { createApiClient } from './api-client';

export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://dummyjson.com',
  onError: (err) => console.error(\`[API] \${err.statusCode}: \${err.message}\`),
});

// lib/services/users.ts — typed service layer
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, UsersResponse, CreateUserInput, UpdateUserInput } from '@/shared/types/user';

export const usersService = {
  getAll: (params?: { limit?: number; skip?: number }): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.list, { params }),
  getById: (id: number): Promise<User> =>
    api.get<User>(ENDPOINTS.users.detail(id)),
  create: (data: CreateUserInput): Promise<User> =>
    api.post<User>(ENDPOINTS.users.create, data),
  update: (id: number, data: UpdateUserInput): Promise<User> =>
    api.put<User>(ENDPOINTS.users.update(id), data),
  delete: (id: number): Promise<User> =>
    api.delete<User>(ENDPOINTS.users.delete(id)),
  search: (q: string): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.search, { params: { q } }),
};

// features/users/hooks/useUsers.ts — React Query hook
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { usersService } from '@/lib/services/users';

export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
  });
}`,
    },
    vite: {
      description:
        "The pattern is identical in Vite — the API client and services are framework-agnostic. Only the environment variable syntax changes.",
      filename: "lib/api.ts + hooks/useUsers.ts",
      code: `// lib/api.ts — same factory, Vite env syntax
import { createApiClient } from './api-client';

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'https://dummyjson.com',
  onError: (err) => console.error(\`[API] \${err.statusCode}: \${err.message}\`),
});

// lib/services/users.ts — same pattern as Next.js (showing key methods)
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, UsersResponse, CreateUserInput, UpdateUserInput } from '@/shared/types/user';

export const usersService = {
  getAll: (params?: { limit?: number; skip?: number }): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.list, { params }),
  getById: (id: number): Promise<User> =>
    api.get<User>(ENDPOINTS.users.detail(id)),
  create: (data: CreateUserInput): Promise<User> =>
    api.post<User>(ENDPOINTS.users.create, data),
  update: (id: number, data: UpdateUserInput): Promise<User> =>
    api.put<User>(ENDPOINTS.users.update(id), data),
  delete: (id: number): Promise<User> =>
    api.delete<User>(ENDPOINTS.users.delete(id)),
};

// features/users/hooks/useUsers.ts — React Query hook
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { usersService } from '@/lib/services/users';

export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
  });
}`,
    },
  },
  lastUpdated: "May 10, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View API client in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/tree/main/src/lib",
  },
};
