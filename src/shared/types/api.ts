/**
 * Standard API success response wrapper.
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: true;
}

/**
 * Standard API error response.
 */
export interface ApiError {
  message: string;
  success: false;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Paginated API response with metadata.
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: true;
}

/**
 * Common query parameters for list endpoints.
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
