# TypeScript

## Principle

Kenapa `strict: true`? Karena TypeScript tanpa strict mode itu seperti seat belt yang ga diklik — ada tapi ga protect. Strict mode forces kita untuk handle `null`, `undefined`, dan type narrowing secara explicit. Hasilnya: bugs ketangkap di compile time, bukan di production.

`noUncheckedIndexedAccess` khususnya penting karena array/object access di JavaScript selalu bisa return `undefined`. Tanpa flag ini, `arr[0]` dianggap pasti ada — padahal array bisa kosong. Flag ini bikin TypeScript jujur tentang realita JavaScript.

Interface vs type bukan preferensi — ada semantic difference. `interface` itu contract untuk shape (props, API response), extendable, dan bagus untuk declaration merging. `type` itu computation — unions, intersections, mapped types, conditional types. Pakai yang sesuai context.

## Rules

- `strict: true` + `noUncheckedIndexedAccess: true` wajib di `tsconfig.base.json`
- **Never use `any`** — pakai `unknown` dan narrow dengan type guard
- `interface` untuk: component props, API response shapes, class contracts
- `type` untuk: unions, utility types, function signatures, mapped types
- Export types dari file tempat mereka defined
- Discriminated unions untuk state management (loading/error/success)
- Generic constraints pakai `extends` — jangan biarkan generic terlalu loose
- Utility types (`Partial`, `Pick`, `Omit`, `Record`) > manual type duplication

## Pattern

```ts
// Discriminated union — each variant identified by literal type
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Utility type composition
type CreateInput<T> = Omit<T, "id" | "createdAt">;
type UpdateInput<T> = Partial<CreateInput<T>>;

// Type guard
function isApiError(value: unknown): value is ApiError {
  return typeof value === "object" && value !== null && "statusCode" in value;
}
```

## Implementation

> **Version:** TypeScript v5 | Tested on: 2025-05

### Base Config

Dari `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "skipLibCheck": true,
    "declaration": true,
    "jsx": "react-jsx"
  }
}
```

### Interface untuk Props & API Shapes

Dari `packages/shared/src/types/common.ts`:

```ts
// User roles — union type karena ini set of literal values
type UserRole = "admin" | "editor" | "viewer";
type UserStatus = "active" | "inactive";

// User entity — interface karena ini object shape
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// Generic sort config — interface dengan generic constraint
interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

// Select option — interface dengan default generic
interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
```

### Custom Utility Types

```ts
// Make specific keys required (useful for partial updates)
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Make all properties nullable (useful for form initial state)
type Nullable<T> = { [P in keyof T]: T[P] | null };
```

Usage:
```ts
// User with guaranteed email (even if base type has optional fields)
type UserWithEmail = WithRequired<Partial<User>, "email">;

// Form state where everything can be null initially
type UserFormState = Nullable<User>;
```

### API Response Types — Discriminated Union

Dari `packages/shared/src/types/api.ts`:

```ts
// Success response — discriminated by `success: true`
interface ApiResponse<T> {
  data: T;
  message: string;
  success: true;
}

// Error response — discriminated by `success: false`
interface ApiError {
  message: string;
  success: false;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Paginated response — extends success pattern
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: true;
}
```

Discriminated union in action:
```ts
type ApiResult<T> = ApiResponse<T> | ApiError;

function handleResult<T>(result: ApiResult<T>) {
  if (result.success) {
    // TypeScript knows: result is ApiResponse<T>
    console.log(result.data);
  } else {
    // TypeScript knows: result is ApiError
    console.log(result.statusCode);
  }
}
```

### Type-safe Input Types

Dari `apps/nextjs/types/user.ts`:

```ts
// Re-export dari shared — single source of truth
export type { User, UserRole, UserStatus } from "@react-principles/shared/types";

// Create input — omit server-generated fields
interface CreateUserInput {
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
}

// Update input — all fields optional
interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: "admin" | "editor" | "viewer";
  status?: "active" | "inactive";
}
```

### noUncheckedIndexedAccess in Practice

```ts
const users: User[] = [];

// WITHOUT noUncheckedIndexedAccess:
const first = users[0]; // type: User (WRONG — could be undefined)

// WITH noUncheckedIndexedAccess:
const first = users[0]; // type: User | undefined (CORRECT)

// Now you MUST narrow:
if (first) {
  console.log(first.name); // type: User, safe
}

// Or with non-null assertion (use sparingly, only when you're CERTAIN):
const first = users[0]!; // type: User (you take responsibility)
```

### Type Guards

```ts
// For unknown API responses
function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as ApiError).success === false
  );
}

// Usage in catch blocks
try {
  await apiClient.post("/users", data);
} catch (error: unknown) {
  if (isApiError(error)) {
    // TypeScript knows error is ApiError
    console.log(error.statusCode, error.errors);
  }
}
```

### Next.js

Tidak ada perbedaan TypeScript config antara Next.js dan Vite — keduanya extend `tsconfig.base.json`.

### Vite

Sama seperti Next.js. Vite menambahkan `vite-env.d.ts` untuk Vite-specific types:
```ts
/// <reference types="vite/client" />
```

## Common Mistakes

- **`any` sebagai escape hatch** — Pakai `unknown` dan narrow. `any` turns off the compiler — setiap `any` adalah potential runtime error yang ga bisa di-catch.
- **Type assertion (`as`) berlebihan** — `data as User` bukan validation. Kalau data dari external source, validate dulu (pakai Zod) baru infer type.
- **Lupa handle `undefined` dari indexed access** — `users[0].name` crash kalau array kosong. Check dulu: `if (users[0]) { ... }`.
- **Interface untuk union** — `interface Status = "active" | "inactive"` ga valid. Union = `type`.
- **Re-defining types** — Kalau type sudah ada di shared package, import — jangan buat ulang.
- **`enum` usage** — Prefer union types (`type Role = "admin" | "editor"`) over enum. Enum punya runtime cost dan edge cases yang surprising.
- **Overly complex generics** — Kalau type signature butuh > 3 generic parameters, kemungkinan bisa disimplify.

## Related

- [Component Patterns](./component-patterns.md) — Interface patterns untuk component props
- [Forms](./forms.md) — Zod schema inference untuk form types
- [Services](./services.md) — Generic API client types
- [React Query](./react-query.md) — Type-safe query keys dan return types
