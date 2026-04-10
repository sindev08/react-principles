import type { RecipeDetail } from "../types";

export const apiIntegration: RecipeDetail = {
  slug: "api-integration",
  title: "API Integration",
  breadcrumbCategory: "API Integration",
  description:
    "Typed REST and GraphQL clients with interceptors, retry logic, and centralized error handling using React Query.",
  principle: {
    text: "All API calls flow through a single typed client layer. React Query wraps the client for caching and synchronization. Components never call fetch() directly — they use custom hooks that compose the query client and API client together.",
    tip: "Use Zod to validate API responses at the boundary. This catches backend contract violations early and ensures your types are always accurate.",
  },
  rules: [
    { title: "Single API Client Instance", description: "One Axios/fetch instance with all interceptors. Import it everywhere via a singleton." },
    { title: "Type All Responses", description: "Define TypeScript interfaces for every endpoint. Use Zod for runtime validation." },
    { title: "Centralized Error Handling", description: "Map API error codes to user-friendly messages in one place — not scattered in components." },
    { title: "Retry Transient Failures", description: "Configure React Query retry logic for 5xx errors. Never retry 4xx client errors." },
  ],
  pattern: {
    filename: "lib/api-client.ts",
    code: `import axios from 'axios';
import { z } from 'zod';

const apiClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export async function fetchTyped<T>(
  url: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const { data } = await apiClient.get(url);
  return schema.parse(data);
}`,
  },
  implementation: {
    nextjs: {
      description: "In Next.js, use Route Handlers as a BFF (Backend for Frontend) layer to proxy external APIs and add auth headers server-side.",
      filename: "app/api/posts/route.ts",
      code: `import { NextResponse } from 'next/server';
import { postListSchema } from '@/lib/schemas';

export async function GET() {
  const res = await fetch(process.env.EXTERNAL_API + '/posts', {
    headers: { Authorization: \`Bearer \${process.env.API_SECRET}\` },
    next: { revalidate: 60 },
  });
  const data = postListSchema.parse(await res.json());
  return NextResponse.json(data);
}`,
    },
    vite: {
      description: "In Vite, call external APIs directly from custom hooks using the typed API client. Use environment variables for base URLs.",
      filename: "hooks/queries/usePosts.ts",
      code: `import { useQuery } from '@tanstack/react-query';
import { fetchTyped } from '@/lib/api-client';
import { postListSchema } from '@/lib/schemas';

export const usePosts = () =>
  useQuery({
    queryKey: ['posts', 'list'],
    queryFn: () => fetchTyped('/posts', postListSchema),
    staleTime: 1000 * 60,
  });`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
};
