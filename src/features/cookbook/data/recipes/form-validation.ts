import type { RecipeDetail } from "../types";

export const formValidation: RecipeDetail = {
  slug: "form-validation",
  title: "Form Validation with Zod",
  breadcrumbCategory: "Patterns",
  description:
    "Schema-first form validation with React Hook Form and Zod. Type-safe, declarative error messages, and zero boilerplate for create and edit flows.",
  principle: {
    text: "The Zod schema is the single source of truth — it defines the shape, types, and error messages. React Hook Form handles registration, submission, and field state. Components never write validation logic; they display what the schema declares.",
    tip: "Write the schema before a single input. Share schemas across forms with .pick(), .extend(), or .omit(). Keep all error messages inside the schema, not in JSX.",
  },
  rules: [
    { title: "Schema before form", description: "Define the Zod schema first. Never add validation inline with register options or manual if-statements." },
    { title: "Omit server-generated fields", description: "Use .omit({ id: true, createdAt: true }) for create forms. The schema reflects what the user provides." },
    { title: "handleSubmit owns errors", description: "Wrap mutation calls in handleSubmit. Validation errors surface automatically without try/catch in the component." },
    { title: "Reset after success", description: "Call reset() after a successful mutation to clear all field values and dirty state." },
  ],
  pattern: {
    filename: "components/UserForm.tsx",
    code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createUserSchema = z.object({
  name:   z.string().min(1, 'Name is required'),
  email:  z.string().email('Enter a valid email address'),
  role:   z.enum(['viewer', 'editor', 'admin']),
  status: z.enum(['active', 'inactive']),
});

type CreateUserValues = z.infer<typeof createUserSchema>;

export function UserForm() {
  const { register, handleSubmit, reset,
    formState: { errors, isSubmitting } } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', role: 'viewer', status: 'active' },
  });

  const onSubmit = async (data: CreateUserValues) => {
    await createUser(data);
    reset();
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* fields */}</form>;
}`,
  },
  implementation: {
    nextjs: {
      description:
        "In Next.js App Router, pair the form with a Server Action for zero-client-bundle mutations. Validate with the same Zod schema on the server to prevent bypassing client validation.",
      filename: "app/users/actions.ts",
      code: `'use server';

import { createUserSchema } from '@/lib/schemas';
import { db } from '@/lib/db';

export async function createUserAction(values: unknown) {
  const data = createUserSchema.parse(values); // validates server-side too
  await db.user.create({ data });
}`,
    },
    vite: {
      description:
        "In Vite, pair the form with a React Query mutation. On success, invalidate the users list so the table refreshes automatically.",
      filename: "hooks/mutations/useCreateUser.ts",
      code: `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/services/users';
import { queryKeys } from '@/lib/query-keys';

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "forms",
};
