# TypeScript

## Principle

Why `strict: true`? Because TypeScript without strict mode is like a seat belt that isn't clicked — it's there but doesn't protect. Strict mode forces us to handle `null`, `undefined`, and type narrowing explicitly. The result: bugs are caught at compile time, not in production.

`noUncheckedIndexedAccess` is especially important because array/object access in JavaScript can always return `undefined`. Without this flag, `arr[0]` is assumed to definitely exist — but the array can be empty. This flag makes TypeScript honest about the reality of JavaScript.

Interface vs type is not just a preference — there is a semantic difference. `interface` is a contract for shape (props, API responses), it's extendable, and good for declaration merging. `type` is for computation — unions, intersections, mapped types, conditional types. Use the one that fits the context.

## Rules

- `strict: true` + `noUncheckedIndexedAccess: true` required in `tsconfig.json`
- **Never use `any`** — use `unknown` and narrow with a type guard
- `interface` for: component props, API response shapes, class contracts
- `type` for: unions, utility types, function signatures, mapped types
- Export types from the file where they are defined
- Discriminated unions for state management (loading/error/success)
- Generic constraints use `extends` — don't leave generics too loose
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

> **Version:** TypeScript v5 | Tested on: 2026-02

### Base Config

From `tsconfig.json`:

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

### Interface for Props & API Shapes

From `src/shared/types/common.ts`:

```ts
// User roles — union type because this is a set of literal values
type UserRole = "admin" | "editor" | "viewer";
type UserStatus = "active" | "inactive";

// User entity — interface because this is an object shape
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// Generic sort config — interface with generic constraint
interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

// Select option — interface with default generic
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

From `src/shared/types/api.ts`:

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

From `src/shared/types/user.ts`:

```ts
// Re-export from shared — single source of truth
export type { User, UserRole, UserStatus } from "@/shared/types/common";

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

TypeScript configuration is managed in a single `tsconfig.json` for this repository.

## Common Mistakes

- **`any` as an escape hatch** — Use `unknown` and narrow. `any` turns off the compiler — every `any` is a potential runtime error that can't be caught.
- **Overusing type assertion (`as`)** — `data as User` is not validation. If data comes from an external source, validate it first (with Zod) then infer the type.
- **Forgetting to handle `undefined` from indexed access** — `users[0].name` crashes if the array is empty. Check first: `if (users[0]) { ... }`.
- **Interface for union** — `interface Status = "active" | "inactive"` is not valid. Unions use `type`.
- **Re-defining types** — If a type already exists in a shared package, import it — don't recreate it.
- **`enum` usage** — Prefer union types (`type Role = "admin" | "editor"`) over enums. Enums have runtime cost and surprising edge cases.
- **Overly complex generics** — If a type signature needs > 3 generic parameters, it can likely be simplified.

## Related

- [Component Patterns](./component-patterns.md) — Interface patterns for component props
- [Forms](./forms.md) — Zod schema inference for form types
- [Services](./services.md) — Generic API client types
- [React Query](./react-query.md) — Type-safe query keys and return types
