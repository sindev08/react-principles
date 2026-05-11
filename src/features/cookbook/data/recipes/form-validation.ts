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
    { title: "Share schemas between create and edit", description: "Define a base schema, then derive create and edit variants with .omit() or .partial(). Single source of truth for all validation rules." },
  ],
  pattern: {
    filename: "lib/schemas/user.ts",
    code: `import { z } from 'zod';

// Base schema matching DummyJSON user payload
const baseUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Enter a valid email address'),
  role:      z.enum(['viewer', 'editor', 'admin']),
  age:       z.number().int().min(18, 'Must be at least 18').max(120),
});

// Create: user provides all fields, no id/createdAt
export const createUserSchema = baseUserSchema;

// Edit: all fields optional — partial of base
export const editUserSchema = baseUserSchema.partial();

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type EditUserValues   = z.infer<typeof editUserSchema>;`,
  },
  implementation: {
    nextjs: {
      description:
        "In Next.js App Router, pair the form with a React Query mutation. The form is a Client Component ('use client'). On success, invalidate the users list so the table refreshes automatically. Reset the form to clear dirty state.",
      filename: "features/examples/components/UserCreateForm.tsx",
      code: `'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '@/features/examples/hooks/useCreateUser';
import { createUserSchema, type CreateUserValues } from '@/lib/schemas/user';

export function UserCreateForm() {
  const { register, handleSubmit, reset,
    formState: { errors, isSubmitting } } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { firstName: '', lastName: '', email: '', role: 'viewer', age: 18 },
  });

  const createMutation = useCreateUser();

  const onSubmit = async (data: CreateUserValues) => {
    await createMutation.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="First name" />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <input {...register('lastName')} placeholder="Last name" />
      {errors.lastName && <p>{errors.lastName.message}</p>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit" disabled={isSubmitting}>Create User</button>
    </form>
  );
}`,
    },
    vite: {
      description:
        "In Vite, the pattern is identical — React Query mutation with cache invalidation. The only difference is routing: use react-router instead of Next.js file-based routing.",
      filename: "features/examples/components/UserEditForm.tsx",
      code: `'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/features/examples/hooks/useUser';
import { useUpdateUser } from '@/features/examples/hooks/useUpdateUser';
import { editUserSchema, type EditUserValues } from '@/lib/schemas/user';

export function UserEditForm({ id }: { id: string }) {
  const { data: user } = useUser(id);
  const updateMutation = useUpdateUser(id);

  const { register, handleSubmit, reset,
    formState: { errors, isSubmitting } } = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
  });

  // Pre-populate form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.name.split(' ')[0],
        lastName:  user.name.split(' ')[1] ?? '',
        email:     user.email,
        role:      user.role,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditUserValues) => {
    await updateMutation.mutateAsync(data);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="First name" />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <button type="submit" disabled={isSubmitting}>Save Changes</button>
    </form>
  );
}`,
    },
  },
  lastUpdated: "May 11, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "forms",
};
