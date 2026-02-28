# Services

## Principle

Why do we need a separate service layer? Because **API calls should not be scattered across components or hooks**. The service layer is the boundary between our application and external APIs. If an endpoint changes, only one file needs to be updated — not a hunt across 20 components. If auth token logic changes, only one interceptor.

The factory pattern (`createApiClient`) is chosen so the client can be configured per environment (baseUrl, headers, auth), but all instances have consistent behavior: error handling, JSON parsing, query param building. This also makes testing easy — inject a mock client without changing consumer code.

Endpoint constants (`ENDPOINTS`) are not over-engineering — they provide **typo prevention** and **discoverability**. A hardcoded string `/users/${id}` in 5 places means 5 places that can have typos. A centralized constant means autocomplete, refactor-safe, and easy to search.

## Rules

- API client in `src/lib/api-client.ts` — centralized request boundary
- Endpoints in `src/lib/endpoints.ts` — centralized constants
- Never hardcode API paths in components or hooks — always use `ENDPOINTS`
- Request/response types in `src/shared/types/api.ts`
- Error handling centralized in the client, not per-call
- Auth token injection via `getAuthToken` callback — not manual headers per request
- Query params auto-filtered: `undefined` values are skipped

## Pattern

```
// 1. API Client factory — configured once
const api = createApiClient({
  baseUrl: "https://api.example.com",
  getAuthToken: () => getToken(),
  onError: (error) => handleGlobalError(error),
});

// 2. Endpoints — centralized constants
const ENDPOINTS = {
  entity: {
    list: "/entities",
    detail: (id) => `/entities/${id}`,
    create: "/entities",
  },
};

// 3. Usage — type-safe calls
const users = await api.get<PaginatedResponse<User>>(ENDPOINTS.users.list, {
  params: { page: 1, limit: 10 },
});

const user = await api.post<ApiResponse<User>>(ENDPOINTS.users.create, {
  name: "John",
});
```

## Implementation

> **Version:** Native fetch API | Tested on: 2025-05

### API Client

From `src/lib/api-client.ts`:

```ts
import type { ApiError, ApiResponse } from "../types/api";

interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  onError?: (error: ApiError) => void;
  getAuthToken?: () => string | null;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

// URL builder — filters undefined params
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

// Factory — creates typed API client
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

    // Auto-inject auth token
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

      onError?.(apiError); // Global error handler
      throw apiError;
    }

    return (await response.json()) as T;
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
```

### Endpoint Constants

From `src/lib/endpoints.ts`:

```ts
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
    refreshToken: "/auth/refresh-token",
    me: "/auth/me",
  },
  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    create: "/users",
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  products: {
    list: "/products",
    detail: (id: string) => `/products/${id}`,
    create: "/products",
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
} as const;
```

Key points:
- `as const` so TypeScript preserves literal types (not widened to `string`)
- Dynamic paths use functions: `detail: (id: string) => ...`
- Grouped by domain: `auth`, `users`, `products`

### Response Types

From `src/shared/types/api.ts`:

```ts
// Success wrapper
interface ApiResponse<T> {
  data: T;
  message: string;
  success: true;
}

// Error response
interface ApiError {
  message: string;
  success: false;
  statusCode: number;
  errors?: Record<string, string[]>;  // field-level errors
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: true;
}

// Query params for list endpoints
interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
```

### Usage with React Query

```ts
// In query hook
import { createApiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/endpoints";

const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  getAuthToken: () => localStorage.getItem("token"),
});

// In useUsers hook
export function useUsers(params: QueryParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () =>
      api.get<PaginatedResponse<User>>(ENDPOINTS.users.list, { params }),
  });
}

// In useCreateUser hook
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      api.post<ApiResponse<User>>(ENDPOINTS.users.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
```

### Global Error Handling

```ts
const api = createApiClient({
  baseUrl: API_BASE,
  onError: (error) => {
    // 401 — redirect to login
    if (error.statusCode === 401) {
      window.location.href = "/login";
    }
    // 403 — show forbidden toast
    if (error.statusCode === 403) {
      toast.error("You don't have permission to perform this action");
    }
    // 500 — log to error tracker
    if (error.statusCode >= 500) {
      errorTracker.capture(error);
    }
  },
});
```

### Next.js

- `process.env.NEXT_PUBLIC_API_URL` for client-side API URL
- Server-side API calls can use `process.env.API_URL` (internal network URL)

### Runtime Note

This repository currently uses Next.js environment variables (`NEXT_PUBLIC_*` on client, server-only vars without prefix on server code).

## Common Mistakes

- **Hardcoded URL in component** — `fetch("http://localhost:3001/users")` scattered everywhere. Use ENDPOINTS + configured client.
- **Auth token per-request** — Manually setting `Authorization` header on every call. Use the `getAuthToken` callback in the client config.
- **Forgetting to handle non-JSON errors** — The server can return an HTML error page. The client must catch `.json()` failures — already handled in `createApiClient`.
- **Duplicate API types** — Defining response types in a component and in the service. Single source in `types/api.ts`.
- **No global error handler** — 401 errors handled per-component. Use the `onError` callback for cross-cutting concerns.
- **Query params without filtering** — Sending `{ page: 1, search: undefined }` as `?page=1&search=undefined`. `buildUrl` already filters out undefined values.
- **Direct fetch instead of client** — Bypassing the API client for "quick" calls. All calls must go through the client so auth, headers, and error handling are consistent.

## Related

- [React Query](./react-query.md) — Service functions used as queryFn/mutationFn
- [TypeScript](./typescript.md) — Generic types for API client
- [Forms](./forms.md) — Form submission using mutation + service
- [Hooks](./hooks.md) — Query/mutation hooks that wrap service calls
