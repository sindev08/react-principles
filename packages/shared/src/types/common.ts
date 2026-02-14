/**
 * User roles controlling access permissions.
 */
export type UserRole = "admin" | "editor" | "viewer";

/**
 * User account status.
 */
export type UserStatus = "active" | "inactive";

/**
 * Core user entity.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

/**
 * Sort direction for list queries.
 */
export type SortDirection = "asc" | "desc";

/**
 * Generic sort configuration for a given type's keys.
 */
export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

/**
 * Describes a selectable option in dropdowns, radio groups, etc.
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * Utility type to make specific keys required on a type.
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Utility type to make all properties nullable.
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null };
