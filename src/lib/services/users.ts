import type { User } from "@/shared/types/common";
import { createApiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/endpoints";

const dummyJsonClient = createApiClient({ baseUrl: "https://dummyjson.com" });

interface DummyJsonUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface DummyUsersResponse {
  users: DummyJsonUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface GetUsersParams {
  limit?: number;
  skip?: number;
}

export interface SearchUsersParams {
  q: string;
  limit?: number;
  skip?: number;
}

function mapUser(raw: DummyJsonUser): User {
  return {
    id: String(raw.id),
    name: `${raw.firstName} ${raw.lastName}`,
    email: raw.email,
    role: "viewer",
    status: "active",
    createdAt: new Date().toISOString(),
  };
}

function mapResponse(raw: DummyUsersResponse): UsersResponse {
  return {
    users: raw.users.map(mapUser),
    total: raw.total,
    skip: raw.skip,
    limit: raw.limit,
  };
}

export const usersService = {
  getAll(params: GetUsersParams = {}): Promise<UsersResponse> {
    return dummyJsonClient
      .get<DummyUsersResponse>(ENDPOINTS.users.list, {
        params: params as Record<string, string | number | boolean | undefined>,
      })
      .then(mapResponse);
  },

  getById(id: string): Promise<User> {
    return dummyJsonClient
      .get<DummyJsonUser>(ENDPOINTS.users.detail(id))
      .then(mapUser);
  },

  search(params: SearchUsersParams): Promise<UsersResponse> {
    const { q, ...rest } = params;
    return dummyJsonClient
      .get<DummyUsersResponse>(ENDPOINTS.users.search, {
        params: { q, ...rest } as Record<string, string | number | boolean | undefined>,
      })
      .then(mapResponse);
  },
};
