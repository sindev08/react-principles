import { describe, expect, it } from "vitest";
import { emailSchema, passwordSchema, paginationSchema, userSchema } from "./validators";

describe("emailSchema", () => {
  it("accepts valid email", () => {
    expect(emailSchema.safeParse("User@Example.COM").success).toBe(true);
  });

  it("lowercases the email", () => {
    const result = emailSchema.safeParse("USER@EXAMPLE.COM");
    expect(result.success && result.data).toBe("user@example.com");
  });

  it("rejects invalid email", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("accepts valid password", () => {
    expect(passwordSchema.safeParse("Abcdef1!").success).toBe(true);
  });

  it("rejects short password", () => {
    expect(passwordSchema.safeParse("Ab1!").success).toBe(false);
  });

  it("rejects missing uppercase", () => {
    expect(passwordSchema.safeParse("abcdef1!").success).toBe(false);
  });

  it("rejects missing digit", () => {
    expect(passwordSchema.safeParse("Abcdefg!").success).toBe(false);
  });

  it("rejects missing special character", () => {
    expect(passwordSchema.safeParse("Abcdef12").success).toBe(false);
  });
});

describe("paginationSchema", () => {
  it("uses defaults when empty", () => {
    const result = paginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.sortDirection).toBe("asc");
  });

  it("coerces string numbers", () => {
    const result = paginationSchema.parse({ page: "2", limit: "20" });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(20);
  });

  it("rejects limit above 100", () => {
    expect(paginationSchema.safeParse({ limit: 101 }).success).toBe(false);
  });

  it("rejects invalid sortDirection", () => {
    expect(paginationSchema.safeParse({ sortDirection: "random" }).success).toBe(false);
  });
});

describe("userSchema", () => {
  const validUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
  };

  it("accepts valid user", () => {
    expect(userSchema.safeParse(validUser).success).toBe(true);
  });

  it("rejects invalid role", () => {
    expect(userSchema.safeParse({ ...validUser, role: "superadmin" }).success).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(userSchema.safeParse({ ...validUser, status: "pending" }).success).toBe(false);
  });

  it("rejects invalid createdAt", () => {
    expect(userSchema.safeParse({ ...validUser, createdAt: "not-a-date" }).success).toBe(false);
  });
});
