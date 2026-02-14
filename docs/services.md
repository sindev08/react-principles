# Services

## Principle

Kenapa butuh service layer terpisah? Karena **API calls seharusnya tidak scattered di components atau hooks**. Service layer itu boundary antara aplikasi kita dan external APIs. Kalau endpoint berubah, cuma satu file yang perlu di-update — bukan hunt di 20 component. Kalau auth token logic berubah, cuma satu interceptor.

Factory pattern (`createApiClient`) dipilih supaya client bisa di-configure per environment (baseUrl, headers, auth), tapi semua instance punya behavior yang konsisten: error handling, JSON parsing, query param building. Ini juga bikin testing gampang — inject mock client tanpa ubah consumer code.

Endpoint constants (`ENDPOINTS`) bukan over-engineering — ini **typo prevention** dan **discoverability**. Hardcoded string `/users/${id}` di 5 tempat berarti 5 tempat yang bisa typo. Centralized constant berarti autocomplete, refactor-safe, dan gampang di-search.

## Rules

- API client di `packages/shared/src/services/api-client.ts` — shared across apps
- Endpoints di `packages/shared/src/services/endpoints.ts` — centralized constants
- Never hardcode API paths di components atau hooks — selalu pakai `ENDPOINTS`
- Request/response types di `packages/shared/src/types/api.ts`
- Error handling centralized di client, bukan per-call
- Auth token injection via `getAuthToken` callback — bukan manual header per request
- Query params auto-filtered: `undefined` values di-skip

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

Dari `packages/shared/src/services/api-client.ts`:

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

Dari `packages/shared/src/services/endpoints.ts`:

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
- `as const` supaya TypeScript preserve literal types (bukan widened ke `string`)
- Dynamic paths pakai functions: `detail: (id: string) => ...`
- Grouped by domain: `auth`, `users`, `products`

### Response Types

Dari `packages/shared/src/types/api.ts`:

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
import { createApiClient } from "@react-principles/shared/services";
import { ENDPOINTS } from "@react-principles/shared/services";

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

- `process.env.NEXT_PUBLIC_API_URL` untuk client-side API URL
- Server-side API calls bisa pakai `process.env.API_URL` (internal network URL)

### Vite

- `import.meta.env.VITE_API_URL` untuk API URL (Vite env convention)
- Semua API calls client-side

## Common Mistakes

- **Hardcode URL di component** — `fetch("http://localhost:3001/users")` scattered everywhere. Pakai ENDPOINTS + configured client.
- **Auth token per-request** — Manually set `Authorization` header di setiap call. Pakai `getAuthToken` callback di client config.
- **Lupa handle non-JSON error** — Server bisa return HTML error page. Client harus catch `.json()` failure — sudah di-handle di `createApiClient`.
- **Duplicate API types** — Define response type di component dan di service. Single source di `types/api.ts`.
- **No global error handler** — 401 errors di-handle per-component. Pakai `onError` callback untuk cross-cutting concerns.
- **Query params tanpa filter** — Send `{ page: 1, search: undefined }` as `?page=1&search=undefined`. `buildUrl` sudah filter undefined values.
- **Direct fetch instead of client** — Bypass API client untuk "quick" calls. Semua calls harus lewat client supaya auth, headers, dan error handling consistent.

## Related

- [React Query](./react-query.md) — Service functions dipakai sebagai queryFn/mutationFn
- [TypeScript](./typescript.md) — Generic types untuk API client
- [Forms](./forms.md) — Form submission pakai mutation + service
- [Hooks](./hooks.md) — Query/mutation hooks yang wrap service calls
