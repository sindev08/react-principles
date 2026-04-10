import type { RecipeDetail } from "../types";

export const componentAnatomy: RecipeDetail = {
  slug: "component-anatomy",
  title: "Component Anatomy",
  breadcrumbCategory: "Foundations",
  description: "The consistent internal structure every component follows — imports, types, constants, function, export.",
  lastUpdated: "Apr 8, 2026",
  principle: {
    text: "When every component follows the same structure, you stop thinking about where things go inside a file and start thinking about what the component actually does. Consistent anatomy means anyone on the team can open any file and immediately know where to look — props are always at the top, constants are always before the function, exports are always at the bottom.",
    tip: "The hardest part of component anatomy is constants vs. props. Rule of thumb: if it never changes based on what's passed in, it is a constant. If it could change from outside, it is a prop.",
  },
  rules: [
    {
      title: "Imports first",
      description: "Order: React → external libraries → internal aliases (@/) → relative imports (./). This makes dependencies visible at a glance.",
    },
    {
      title: "Types and interfaces second",
      description: "Define all types used in this file immediately after imports. Props interface always comes first.",
    },
    {
      title: "Constants third",
      description: "Component-scoped constants (static data, config, labels) come before the function. Never define constants inside the function body.",
    },
    {
      title: "Component function fourth",
      description: "The function itself comes after everything it depends on. Keep it focused — if it grows past 200 lines, split it.",
    },
    {
      title: "Named export last",
      description: "Always use named exports, never default exports. Named exports make refactoring and search easier.",
    },
  ],
  pattern: {
    filename: "components/RecipeCard.tsx — anatomy template",
    code: `// 1. IMPORTS — React → external → internal → relative
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/utils/cn';
import { useSavedStore } from '../stores/useSavedStore';

// 2. TYPES
interface RecipeCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
}

// 3. CONSTANTS — static, never changes based on props
const MAX_DESCRIPTION_LENGTH = 120;
const CARD_BASE_CLASS = 'rounded-xl border bg-white shadow-sm';

// 4. COMPONENT FUNCTION
export function RecipeCard({ slug, title, description, category }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isSaved } = useSavedStore();

  const truncated = description.slice(0, MAX_DESCRIPTION_LENGTH);

  return (
    <div className={cn(CARD_BASE_CLASS, isHovered && 'shadow-lg')}>
      {/* ... */}
    </div>
  );
}

// 5. EXPORT — named, at the bottom
// (already exported above with "export function")`,
  },
  implementation: {
    nextjs: {
      description: "In Next.js, mark client components explicitly with 'use client' — it goes above all imports as the very first line. See the annotated Button component in the starter template: github.com/sindev08/react-principles-nextjs → src/ui/Button.tsx",
      filename: "ui/Button.tsx — from react-principles-nextjs starter",
      code: `// 'use client' goes ABOVE imports if the component is a Client Component
// (Button doesn't need it — no hooks or browser APIs)

// 1. IMPORTS — React → external → internal (@/) → relative (./)
import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils';

// 2. TYPES — props interface first, then supporting types
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// 3. CONSTANTS — static, never changes based on props
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-zinc-900 text-white hover:bg-zinc-800 ...',
  secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 ...',
  // ...
};
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

// 4. COMPONENT — named export, never default
export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)} {...props}>
      {children}
    </button>
  );
}`,
    },
    vite: {
      description: "In Vite + React, all components are client-side by default. No 'use client' needed — just follow the anatomy.",
      filename: "features/cookbook/components/RecipeCard.tsx",
      code: `// 1. IMPORTS
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

// 2. TYPES
interface RecipeCardProps {
  slug: string;
  title: string;
}

// 3. CONSTANTS
const BASE_PATH = '/cookbook';

// 4. COMPONENT
export function RecipeCard({ slug, title }: RecipeCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <Link to={\`\${BASE_PATH}/\${slug}\`}>
      <span>{title}</span>
    </Link>
  );
}`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View Button anatomy in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/blob/main/src/ui/Button.tsx",
  },
};
