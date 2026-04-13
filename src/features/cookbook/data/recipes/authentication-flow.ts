import type { RecipeDetail } from "../types";

export const authenticationFlow: RecipeDetail = {
  slug: "authentication-flow",
  title: "Authentication Flow",
  breadcrumbCategory: "Auth Flows",
  description:
    "Secure login, signup, and token refresh patterns. Auth state lives in Zustand — never in React Query — with JWT and protected route handling.",
  principle: {
    text: "Authentication state is client state, not server state. It belongs in Zustand or Context, not React Query. The auth store manages tokens, user profile, and session status. API interceptors handle token refresh transparently.",
    tip: "Store only the minimum necessary in auth state. Token expiry, user ID, and roles. Fetch full user profile via React Query when needed.",
  },
  rules: [
    { title: "Never Store Sensitive Data in State", description: "Tokens live in httpOnly cookies or secure storage — never in React state or localStorage." },
    { title: "Centralize Interceptors", description: "One Axios/fetch interceptor handles 401 responses and token refresh for all API calls." },
    { title: "Separate Auth from UI", description: "AuthProvider wraps the app. UI components only call useAuth() — never touch tokens directly." },
    { title: "Route Protection at Layout", description: "Protect routes at the layout level, not inside individual pages." },
  ],
  pattern: {
    filename: "stores/useAuthStore.ts",
    code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' },
  ),
);`,
  },
  implementation: {
    nextjs: {
      description: "Use Next.js Middleware to protect routes server-side before the page renders. Check the auth cookie on every request.",
      filename: "middleware.ts",
      code: `import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token');
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}`,
    },
    vite: {
      description: "Wrap protected routes in a PrivateRoute component that checks Zustand auth state and redirects unauthenticated users.",
      filename: "components/PrivateRoute.tsx",
      code: `import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
};
