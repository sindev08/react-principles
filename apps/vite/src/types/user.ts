export type {
  User,
  UserRole,
  UserStatus,
} from "@react-principles/shared/types";

/** Input for creating a new user (no id or createdAt). */
export interface CreateUserInput {
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
}

/** Input for updating an existing user (all fields optional). */
export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: "admin" | "editor" | "viewer";
  status?: "active" | "inactive";
}
