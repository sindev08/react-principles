import type { RecipeDetail } from "../types";

export const servicesLayer: RecipeDetail = {
  slug: "services-layer",
  title: "Services Layer",
  breadcrumbCategory: "Foundations",
  description: "How to organize all backend communication in one place — so when an API changes, you fix it in one file, not twenty.",
  lastUpdated: "Apr 8, 2026",
  principle: {
    text: "When you fetch data directly inside a component, the component becomes responsible for knowing the URL, the HTTP method, the request format, and the error handling. That is four responsibilities too many. A services layer centralizes all backend communication — components just call a function and get data back. When the API changes, you fix it in one file, not twenty.",
    tip: "A service function should read like plain English: getUserById(id), createOrder(data), deletePost(id). If it needs more than one argument object, consider splitting it into two functions.",
  },
  rules: [
    {
      title: "Services only talk to the API",
      description: "A service function takes inputs, calls the API, and returns data. It does not touch state, does not render anything, and does not know about React.",
    },
    {
      title: "One file per resource",
      description: "Group service functions by the API resource they belong to: users.ts, orders.ts, recipes.ts. Not by HTTP method.",
    },
    {
      title: "Services live in lib/",
      description: "The services layer belongs in src/lib/ alongside the API client and query keys — not inside a feature folder.",
    },
    {
      title: "Hooks consume services, components consume hooks",
      description: "Components never call service functions directly. The chain is: service → custom hook → component.",
    },
  ],
  pattern: {
    filename: "lib/services/users.ts — service layer pattern",
    code: `import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, UsersResponse, CreateUserInput, UpdateUserInput } from '@/shared/types/user';

// ✅ Service functions — pure API communication (no React, no state)
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
};`,
  },
  implementation: {
    nextjs: {
      description: "In Next.js App Router, service functions can be called directly in Server Components. For Client Components, wrap them in React Query hooks. See the full chain in the starter: github.com/sindev08/react-principles-nextjs → src/lib/",
      filename: "lib/services/users.ts — from react-principles-nextjs starter",
      code: `// lib/api-client.ts — fetch-based factory (NOT axios)
import { createApiClient } from './api-client';
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://dummyjson.com',
});

// lib/services/users.ts — pure API communication
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, UsersResponse } from '@/shared/types/user';

export const usersService = {
  getAll: (params?: { limit?: number; skip?: number }): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.list, { params }),
  getById: (id: number): Promise<User> =>
    api.get<User>(ENDPOINTS.users.detail(id)),
  search: (q: string): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.search, { params: { q } }),
};

// features/users/hooks/useUsers.ts — hook wraps service with React Query
'use client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
  });
}`,
    },
    vite: {
      description: "In Vite, the pattern is identical. The services layer is framework-agnostic — the same createApiClient factory works in both Next.js and Vite projects.",
      filename: "lib/services/users.ts + hooks usage",
      code: `// lib/api.ts — same createApiClient factory, different env var
import { createApiClient } from './api-client';
export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'https://dummyjson.com',
});

// lib/services/users.ts — identical to Next.js version
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, UsersResponse } from '@/shared/types/user';

export const usersService = {
  getAll: (params?: { limit?: number; skip?: number }): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.list, { params }),
  getById: (id: number): Promise<User> =>
    api.get<User>(ENDPOINTS.users.detail(id)),
};

// features/users/hooks/useUsers.ts — hook wraps service
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View services layer in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/tree/main/src/lib",
  },
};
