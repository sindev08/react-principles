interface LoadingStateProps {
  /** Number of skeleton rows to show */
  rows?: number;
  /** Optional message below the spinner */
  message?: string;
}

export function LoadingState({ rows = 3, message }: LoadingStateProps) {
  return (
    <div className="space-y-4">
      {message && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
          style={{ height: "3rem" }}
        />
      ))}
    </div>
  );
}
