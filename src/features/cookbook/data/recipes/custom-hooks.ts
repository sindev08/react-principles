import type { RecipeDetail } from "../types";

export const customHooks: RecipeDetail = {
  slug: "custom-hooks",
  title: "Custom Hooks",
  breadcrumbCategory: "Foundations",
  description: "The boundary between logic and rendering. When to extract a hook, what the rules are, and how to avoid the most common mistake.",
  lastUpdated: "Apr 11, 2026",
  principle: {
    text: "A custom hook is not just a function that starts with 'use' — it is a boundary between logic and rendering. The component handles what the user sees. The hook handles how data gets there. When you separate these two concerns, components become easier to read, logic becomes easier to test, and both become easier to change independently.",
    tip: "If you would write a unit test for the logic, it belongs in a hook. If you would write a component test for it, it belongs in the JSX.",
  },
  rules: [
    {
      title: "Name starts with 'use'",
      description: "This is not just a convention — React uses it to enforce the rules of hooks. A function starting with 'use' is treated as a hook.",
    },
    {
      title: "Extract when logic repeats",
      description: "If the same stateful logic appears in two components, extract it to a hook. Do not copy-paste hooks between components.",
    },
    {
      title: "Extract when logic is complex",
      description: "If a component has more than one useEffect, multiple useState calls, or complex derived state — that logic belongs in a hook.",
    },
    {
      title: "Hooks are not global state",
      description: "Each component that calls a hook gets its own isolated instance. Hooks do not share state between components unless backed by a store or context.",
    },
  ],
  pattern: {
    filename: "hooks/useDebounce.ts — logic extracted from component",
    code: `// ❌ Before — logic mixed into component
function SearchInput() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Component is doing too much
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// ✅ After — logic extracted to a hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Component is now focused on rendering only
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`,
  },
  implementation: {
    nextjs: {
      description: "In Next.js, hooks that use browser APIs need 'use client'. Feature-specific hooks live in the feature folder, shared hooks in shared/. See the starter: github.com/sindev08/react-principles-nextjs → src/features/users/hooks/",
      filename: "features/users/hooks/useUsers.ts — from react-principles-nextjs starter",
      code: `'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { usersService } from '@/lib/services/users';

// Feature hook — encapsulates query key, service call, and caching
// Components just call useUsers() and get typed data back
export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
  });
}

// Also in the starter:
// features/users/hooks/useCreateUser.ts — mutation with cache invalidation
// shared/hooks/useDebounce.ts — generic debounce (logic extraction)
// shared/hooks/useMediaQuery.ts — browser API sync (useSyncExternalStore)
// shared/hooks/useLocalStorage.ts — storage sync with cross-tab support`,
    },
    vite: {
      description: "In Vite, hooks work the same way with no SSR considerations. Co-locate feature-specific hooks inside the feature folder.",
      filename: "shared/hooks/useDebounce.ts",
      code: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage in a component
// features/cookbook/components/SearchInput.tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search recipes..."
    />
  );
}`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View custom hooks in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/tree/main/src/shared/hooks",
  },
};
