/**
 * Centralized API endpoint definitions.
 * All paths are relative to the API base URL.
 */
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
    search: "/users/search",
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
