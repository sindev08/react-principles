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
    filename: "shared/utils/validators.ts",
    code: `import { z } from 'zod';

// Base schema matching the User interface
const userSchema = z.object({
  id:        z.string().min(1, 'ID is required'),
  name:      z.string().min(1, 'Name is required'),
  email:     z.string().email('Enter a valid email address'),
  role:      z.enum(['viewer', 'editor', 'admin']),
  status:    z.enum(['active', 'inactive']),
  createdAt: z.string().datetime({ message: 'Invalid ISO date string' }),
});

// Create: omit server-generated fields
export const createUserSchema = userSchema.omit({ id: true, createdAt: true });

// Edit: partial of create schema — all fields optional
export const editUserSchema = createUserSchema.partial();

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type EditUserValues   = z.infer<typeof editUserSchema>;`,
  },
  implementation: {
    nextjs: {
      description:
        "In Next.js App Router, pair the form with a React Query mutation. The form is a Client Component ('use client'). On success, invalidate the users list so the table refreshes automatically. Reset the form to clear dirty state.",
      filename: "features/examples/components/UserForm.tsx",
      code: `'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { userSchema } from '@/shared/utils/validators';
import { useCreateUser } from '@/features/examples/hooks/useCreateUser';

const createUserFormSchema = userSchema.omit({ id: true, createdAt: true });
type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export function UserForm() {
  const { register, handleSubmit, reset,
    formState: { errors, isSubmitting } } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: { name: '', email: '', role: 'viewer', status: 'active' },
  });

  const createMutation = useCreateUser();

  const onSubmit = async (data: CreateUserFormValues) => {
    await createMutation.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Full name" />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <select {...register('role')}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <select {...register('status')}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

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
import { type z } from 'zod';
import { userSchema } from '@/shared/utils/validators';
import { useUser } from '@/features/examples/hooks/useUser';
import { useUpdateUser } from '@/features/examples/hooks/useUpdateUser';

const editUserFormSchema = userSchema.omit({ id: true, createdAt: true });
type EditUserFormValues = z.infer<typeof editUserFormSchema>;

export function UserEditForm({ id }: { id: string }) {
  const { data: user } = useUser(id);
  const updateMutation = useUpdateUser(id);

  const { register, handleSubmit, reset,
    formState: { errors, isSubmitting } } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
  });

  // Pre-populate form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        name:   user.name,
        email:  user.email,
        role:   user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditUserFormValues) => {
    await updateMutation.mutateAsync(data);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Full name" />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <select {...register('role')}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <select {...register('status')}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

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
