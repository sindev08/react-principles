// Hooks
export {
  useDebounce,
  useProgressBar,
  useMediaQuery,
  useAnimatedMount,
  useLocalStorage,
  type ProgressBarState,
  type AnimatedMountResult,
} from "./shared/hooks";

// Utils
export {
  cn,
  formatCurrency,
  formatDate,
  formatNumber,
  emailSchema,
  passwordSchema,
  paginationSchema,
  userSchema,
  type ValidatedUser,
  type PaginationParams,
} from "./shared/utils";

// Types
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  QueryParams,
  UserRole,
  UserStatus,
  User,
  SortDirection,
  SortConfig,
  SelectOption,
  WithRequired,
  Nullable,
  CreateUserInput,
  UpdateUserInput,
} from "./shared/types";

// Stores
export { useAppStore, useFilterStore, useHasActiveFilters, useSearchStore } from "./shared/stores";

// Components
export { EmptyState, ErrorBoundary, LoadingState } from "./shared/components";

// Lib
export { createApiClient, type ApiClient, type ApiClientConfig, type RequestOptions } from "./lib/exportable";
