// src/lib/queryClient.ts — React Query client configuration (Optimized for Performance)
import { QueryClient } from "@tanstack/react-query";

function isAuthorizationError(error: unknown) {
  const message = error instanceof Error
    ? error.message
    : typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: unknown }).message ?? '')
      : String(error ?? '');
  return /permission|row-level security|not authenticated|jwt|token|401|403|42501/i.test(message);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Short enough that stale admin data self-heals on navigation.
      gcTime: 1000 * 60 * 30, // 30 minutes - keep data in cache longer for faster navigation
      retry: (failureCount, error) => !isAuthorizationError(error) && failureCount < 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true, // Refetch on network reconnect
      refetchOnMount: 'always',
      networkMode: 'online', // Only run queries when online
      // Suspense mode for better loading states
      suspense: false,
    },
    mutations: {
      retry: 0, // Don't retry mutations
      networkMode: 'online',
    },
  },
});
