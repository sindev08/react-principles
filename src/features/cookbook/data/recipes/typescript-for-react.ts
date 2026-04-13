import type { RecipeDetail } from "../types";

export const typescriptForReact: RecipeDetail = {
  slug: "typescript-for-react",
  title: "TypeScript for React",
  breadcrumbCategory: "Foundations",
  description: "How to type component props, event handlers, and hooks correctly. The contracts that prevent silent bugs.",
  lastUpdated: "Apr 11, 2026",
  principle: {
    text: "Bugs caught at compile time cost nothing to fix. Bugs caught in production cost everything. TypeScript for React is not about learning the full TypeScript language — it is about writing the right contracts between your components so that mistakes are caught before the code even runs.",
    tip: "Start by typing your component props. If you can describe what a component accepts and returns, the rest of the types follow naturally.",
  },
  rules: [
    {
      title: "interface for component props",
      description: "Use interface to define component props. It is extendable and reads clearly as a contract.",
    },
    {
      title: "type for unions and utilities",
      description: "Use type for union types, utility types, and function signatures — things that are not directly 'objects with fields'.",
    },
    {
      title: "Never use any",
      description: "any disables type checking completely. Use unknown and narrow it with type guards instead.",
    },
    {
      title: "strict: true in tsconfig",
      description: "Strict mode enables the full set of type checks. Without it, TypeScript catches only the most obvious errors.",
    },
  ],
  pattern: {
    filename: "components/UserCard.tsx — typed component",
    code: `import type { ReactNode } from 'react';

// ✅ interface for component props
interface UserCardProps {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';  // union type
  isActive: boolean;
  onEdit: (id: string) => void;          // typed event handler
  children?: ReactNode;
}

// ✅ typed event handler
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

// ✅ typed useState
const [count, setCount] = useState<number>(0);

// ❌ never do this
const fetchUser = async (): Promise<any> => { ... }

// ✅ use unknown and narrow
const fetchUser = async (): Promise<unknown> => { ... }`,
  },
  implementation: {
    nextjs: {
      description: "Next.js page components receive typed params and searchParams. Always type these explicitly. URL params are always strings — convert to the expected type before use.",
      filename: "app/users/[id]/page.tsx",
      code: `// ✅ Typed Next.js page props
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  // URL params are always strings — convert to number before passing to the hook
  return <UserDetail id={Number(id)} />;
}

// ✅ Typed Server Action
async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<{ success: boolean }> {
  'use server';
  // ...
}`,
    },
    vite: {
      description: "In Vite + React Router, type your route params using useParams with a generic.",
      filename: "features/users/components/UserDetail.tsx",
      code: `import { useParams } from 'react-router-dom';

// ✅ Typed route params
function UserDetail() {
  const { id } = useParams<{ id: string }>();

  // id is string | undefined — handle both cases
  if (!id) return null;

  return <div>{id}</div>;
}

// ✅ Typed custom hook return
function useUser(id: string): {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
} {
  // ...
}`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View TypeScript config in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/blob/main/tsconfig.json",
  },
};
