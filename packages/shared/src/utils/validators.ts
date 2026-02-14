import { z } from "zod";

/**
 * Email validation schema.
 * Validates a trimmed, lowercased, properly formatted email address.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

/**
 * Password validation schema.
 * Requires at least 8 characters, one uppercase letter,
 * one lowercase letter, one digit, and one special character.
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

/**
 * Pagination query parameters schema.
 * Provides sensible defaults for page (1) and limit (10).
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

/**
 * User validation schema matching the User interface.
 */
export const userSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "inactive"]),
  createdAt: z.string().datetime({ message: "Invalid ISO date string" }),
});

export type ValidatedUser = z.infer<typeof userSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
