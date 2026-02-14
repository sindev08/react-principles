# Forms

## Principle

Kenapa schema-first? Karena form validation itu **data problem, bukan UI problem**. Ketika schema (Zod) jadi single source of truth, validation rules, types, dan error messages semua defined di satu tempat. Ga ada lagi mismatch antara frontend validation dan type definition — `z.infer<typeof schema>` otomatis generate type dari schema.

React Hook Form dipilih karena **uncontrolled by default** — artinya form input ga trigger re-render setiap keystroke. Ini critical untuk form besar dengan banyak fields. Controlled forms (useState per field) bisa bikin 50+ re-renders per second di form kompleks. RHF hanya re-render saat submit atau error state change.

Zod + React Hook Form via `@hookform/resolvers` itu integration yang seamless: define schema, infer type, pass resolver, done. Satu schema = satu form. Reuse via `.pick()`, `.omit()`, `.extend()`.

## Rules

- Schema-first: define Zod schema **sebelum** form component
- 1 schema = 1 form (kalau form berbeda, derive schema via pick/omit/extend)
- Error messages di Zod schema, bukan di JSX
- Pakai `zodResolver` dari `@hookform/resolvers/zod`
- Type form values: `z.infer<typeof schema>` — jangan define type manual
- Default values harus match schema shape
- Handle submit errors via mutation error state, bukan manual try/catch di JSX
- Reusable schemas di `packages/shared/src/utils/validators.ts`

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

> **Version:** React Hook Form v7 + Zod v3 + @hookform/resolvers v3 | Tested on: 2025-05

### Reusable Schemas

Dari `packages/shared/src/utils/validators.ts`:

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

Dari `apps/nextjs/components/examples/UserForm.tsx`:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userSchema } from "@react-principles/shared/utils";
import { useCreateUser } from "@/hooks/mutations/useCreateUser";

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

- Form components harus `"use client"` karena pakai hooks dan event handlers
- Server Actions bisa dipakai sebagai alternative submit handler, tapi form validation tetap client-side via Zod + RHF

### Vite

- Tidak ada perbedaan — form works identically

## Common Mistakes

- **Validation di JSX** — `{value.length < 3 && <span>Too short</span>}` — validasi harus di schema. JSX cuma render `errors.field.message`.
- **Manual type instead of infer** — `interface FormValues { name: string; ... }` yang terpisah dari schema. Pakai `z.infer<typeof schema>` supaya selalu in sync.
- **Controlled inputs tanpa perlu** — `<input value={...} onChange={...}>` instead of `{...register("field")}`. RHF uncontrolled by default = better performance.
- **Lupa default values** — Form tanpa defaultValues bisa cause uncontrolled-to-controlled warnings dan unexpected behavior.
- **Schema duplication** — Define user schema di form file padahal sudah ada di shared validators. Import dan derive (`omit`, `pick`, `extend`).
- **Error handling di submit** — `try { mutate() } catch (e) { setError(e) }` — pakai `mutateAsync` + mutation error state, bukan manual error state.
- **Nested form tanpa Controller** — Complex fields (date picker, rich text) butuh `Controller` dari RHF, bukan `register`.

## Related

- [TypeScript](./typescript.md) — Zod infer untuk type generation
- [React Query](./react-query.md) — Mutation hooks untuk form submission
- [Services](./services.md) — API types yang harus match form schema
- [Component Patterns](./component-patterns.md) — Form component anatomy
