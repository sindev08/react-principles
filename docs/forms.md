# Forms

## Principle

Why schema-first? Because form validation is a **data problem, not a UI problem**. When the schema (Zod) is the single source of truth, validation rules, types, and error messages are all defined in one place. No more mismatch between frontend validation and type definitions — `z.infer<typeof schema>` automatically generates types from the schema.

React Hook Form is chosen because it is **uncontrolled by default** — meaning form inputs don't trigger a re-render on every keystroke. This is critical for large forms with many fields. Controlled forms (useState per field) can cause 50+ re-renders per second in complex forms. RHF only re-renders on submit or error state change.

Zod + React Hook Form via `@hookform/resolvers` is a seamless integration: define the schema, infer the type, pass the resolver, done. One schema = one form. Reuse via `.pick()`, `.omit()`, `.extend()`.

## Rules

- Schema-first: define the Zod schema **before** the form component
- 1 schema = 1 form (if forms differ, derive schemas via pick/omit/extend)
- Error messages in the Zod schema, not in JSX
- Use `zodResolver` from `@hookform/resolvers/zod`
- Type form values: `z.infer<typeof schema>` — don't define types manually
- Default values must match the schema shape
- Handle submit errors via mutation error state, not manual try/catch in JSX
- Reusable schemas in `src/shared/utils/validators.ts`

## Pattern

```
// 1. Define schema
const formSchema = z.object({
  field: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
});

// 2. Infer type
type FormValues = z.infer<typeof formSchema>;

// 3. Setup form
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { field: "", email: "" },
});

// 4. Submit handler — typed
const onSubmit = (data: FormValues) => { ... };

// 5. Render — register fields
<form onSubmit={form.handleSubmit(onSubmit)}>
  <input {...form.register("field")} />
  {form.formState.errors.field && <span>{errors.field.message}</span>}
</form>
```

## Implementation

> **Version:** React Hook Form v7 + Zod v4 + @hookform/resolvers v5 | Tested on: 2026-02

### Reusable Schemas

From `src/shared/utils/validators.ts`:

```ts
import { z } from "zod";

// Reusable field schemas
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one digit")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

// Entity schema — full validation
export const userSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "inactive"]),
  createdAt: z.string().datetime({ message: "Invalid ISO date string" }),
});

// Inferred types — single source of truth
export type ValidatedUser = z.infer<typeof userSchema>;

// Pagination schema with defaults
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
```

### Deriving Schemas — pick/omit/extend

```ts
// Create form: omit server-generated fields
const createUserFormSchema = userSchema.omit({ id: true, createdAt: true });
type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
// → { name: string; email: string; role: ...; status: ... }

// Update form: make all fields optional
const updateUserFormSchema = createUserFormSchema.partial();
type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;
// → { name?: string; email?: string; role?: ...; status?: ... }

// Login form: pick specific fields + add password
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Registration: extend login with confirmation
const registerSchema = loginSchema
  .extend({
    name: z.string().min(1, "Name is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

### Complete Form Component

From `src/features/examples/components/UserForm.tsx`:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userSchema } from "@/shared/utils/validators";
import { useCreateUser } from "@/features/examples/hooks/useCreateUser";

// 1. Derive schema from base
const createUserFormSchema = userSchema.omit({ id: true, createdAt: true });
type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export function UserForm() {
  // 2. Setup form with resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      status: "active",
    },
  });

  // 3. Mutation hook
  const createUser = useCreateUser();

  // 4. Submit handler
  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      await createUser.mutateAsync(data);
      reset(); // reset form on success
    } catch {
      // Error accessible via createUser.error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input id="name" type="text" {...register("name")} placeholder="John Doe" />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" type="email" {...register("email")} placeholder="john@example.com" />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Select fields */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium">Role</label>
        <select id="role" {...register("role")}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Submit with mutation state */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create User"}
      </button>
      {createUser.isSuccess && <p className="text-green-600">User created!</p>}
      {createUser.isError && <p className="text-red-600">{createUser.error.message}</p>}
    </form>
  );
}
```

### Dynamic Fields Pattern

```tsx
import { useFieldArray } from "react-hook-form";

const schema = z.object({
  users: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
    })
  ).min(1, "At least one user required"),
});

function DynamicForm() {
  const { control, register } = useForm({ resolver: zodResolver(schema) });
  const { fields, append, remove } = useFieldArray({ control, name: "users" });

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`users.${index}.name`)} />
          <input {...register(`users.${index}.email`)} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: "", email: "" })}>
        Add User
      </button>
    </>
  );
}
```

### Next.js

- Form components must be `"use client"` because they use hooks and event handlers
- Server Actions can be used as an alternative submit handler, but form validation remains client-side via Zod + RHF

### Runtime Note

This repository currently uses a Next.js App Router implementation for form examples.

## Common Mistakes

- **Validation in JSX** — `{value.length < 3 && <span>Too short</span>}` — validation belongs in the schema. JSX only renders `errors.field.message`.
- **Manual type instead of infer** — `interface FormValues { name: string; ... }` defined separately from the schema. Use `z.infer<typeof schema>` to always stay in sync.
- **Controlled inputs without need** — `<input value={...} onChange={...}>` instead of `{...register("field")}`. RHF is uncontrolled by default = better performance.
- **Forgetting default values** — A form without `defaultValues` can cause uncontrolled-to-controlled warnings and unexpected behavior.
- **Schema duplication** — Defining a user schema in the form file even though one already exists in shared validators. Import and derive (`omit`, `pick`, `extend`).
- **Error handling in submit** — `try { mutate() } catch (e) { setError(e) }` — use `mutateAsync` + mutation error state, not manual error state.
- **Nested form without Controller** — Complex fields (date picker, rich text) need `Controller` from RHF, not `register`.

## Related

- [TypeScript](./typescript.md) — Zod infer for type generation
- [React Query](./react-query.md) — Mutation hooks for form submission
- [Services](./services.md) — API types that must match the form schema
- [Component Patterns](./component-patterns.md) — Form component anatomy
