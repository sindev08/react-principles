import type { User, UserRole, UserStatus } from "@react-principles/shared/types";

export type { UserRole, UserStatus };

export const mockUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active", createdAt: "2024-01-15T08:30:00.000Z" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "editor", status: "active", createdAt: "2024-02-10T14:20:00.000Z" },
  { id: "3", name: "Carol Williams", email: "carol@example.com", role: "viewer", status: "active", createdAt: "2024-02-20T09:45:00.000Z" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "editor", status: "inactive", createdAt: "2024-03-05T11:00:00.000Z" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", role: "admin", status: "active", createdAt: "2024-03-12T16:30:00.000Z" },
  { id: "6", name: "Frank Garcia", email: "frank@example.com", role: "viewer", status: "active", createdAt: "2024-03-18T10:15:00.000Z" },
  { id: "7", name: "Grace Lee", email: "grace@example.com", role: "editor", status: "active", createdAt: "2024-04-01T13:00:00.000Z" },
  { id: "8", name: "Henry Wilson", email: "henry@example.com", role: "viewer", status: "inactive", createdAt: "2024-04-10T08:45:00.000Z" },
  { id: "9", name: "Ivy Chen", email: "ivy@example.com", role: "admin", status: "active", createdAt: "2024-04-22T15:20:00.000Z" },
  { id: "10", name: "Jack Taylor", email: "jack@example.com", role: "editor", status: "active", createdAt: "2024-05-03T09:30:00.000Z" },
  { id: "11", name: "Karen Davis", email: "karen@example.com", role: "viewer", status: "active", createdAt: "2024-05-15T12:00:00.000Z" },
  { id: "12", name: "Leo Anderson", email: "leo@example.com", role: "editor", status: "inactive", createdAt: "2024-05-28T14:45:00.000Z" },
  { id: "13", name: "Mia Thomas", email: "mia@example.com", role: "viewer", status: "active", createdAt: "2024-06-08T11:30:00.000Z" },
  { id: "14", name: "Noah Jackson", email: "noah@example.com", role: "admin", status: "active", createdAt: "2024-06-20T16:00:00.000Z" },
  { id: "15", name: "Olivia White", email: "olivia@example.com", role: "editor", status: "active", createdAt: "2024-07-02T10:20:00.000Z" },
  { id: "16", name: "Peter Harris", email: "peter@example.com", role: "viewer", status: "inactive", createdAt: "2024-07-14T08:00:00.000Z" },
  { id: "17", name: "Quinn Martin", email: "quinn@example.com", role: "editor", status: "active", createdAt: "2024-07-25T13:15:00.000Z" },
  { id: "18", name: "Rachel Clark", email: "rachel@example.com", role: "admin", status: "active", createdAt: "2024-08-06T15:45:00.000Z" },
  { id: "19", name: "Sam Lewis", email: "sam@example.com", role: "viewer", status: "active", createdAt: "2024-08-18T09:00:00.000Z" },
  { id: "20", name: "Tina Robinson", email: "tina@example.com", role: "editor", status: "inactive", createdAt: "2024-08-30T11:30:00.000Z" },
];

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface GetUsersParams {
  search?: string;
  role?: UserRole | null;
  status?: UserStatus | null;
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getUsers(
  params: GetUsersParams = {},
): Promise<PaginatedUsers> {
  await delay();

  let filtered = [...mockUsers];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }

  if (params.role) {
    filtered = filtered.filter((u) => u.role === params.role);
  }

  if (params.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, meta: { page, limit, total, totalPages } };
}

export async function getUser(id: string): Promise<User | null> {
  await delay(300);
  return mockUsers.find((u) => u.id === id) ?? null;
}

export async function createUser(
  data: Omit<User, "id" | "createdAt">,
): Promise<User> {
  await delay(400);
  const newUser: User = {
    ...data,
    id: String(mockUsers.length + 1),
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt">>,
): Promise<User> {
  await delay(400);
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error(`User with id "${id}" not found`);
  }
  const updated = { ...mockUsers[index]!, ...data };
  mockUsers[index] = updated;
  return updated;
}
