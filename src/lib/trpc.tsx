/**
 * tRPC React Client Module (trpc.tsx)
 * 
 * React-specific tRPC client setup with Query Client provider.
 * Handles client-side communication with the tRPC backend.
 * Provides React hooks and context provider for tRPC queries and mutations.
 * 
 * @module lib/trpc
 * @category Library - API
 * 
 * Features:
 * - tRPC React client initialization
 * - Query Client with optimized default options
 * - HTTP batch link for efficient API calls
 * - Authentication header injection
 * - Server-side rendering (SSR) client support
 * - React context provider component
 * 
 * Default Query Options:
 * - staleTime: 60 seconds
 * - refetchOnWindowFocus: disabled
 * 
 * Client Initialization:
 * - Browser: Single QueryClient instance reused across renders
 * - Server: New QueryClient created per request
 * 
 * @example
 * ```typescript
 * import { TRPCProvider, useTRPC } from '@/lib/trpc';
 * 
 * // Wrap app with provider
 * export function App() {
 *   return (
 *     <TRPCProvider>
 *       <YourApp />
 *     </TRPCProvider>
 *   );
 * }
 * 
 * // Use tRPC in components
 * function MyComponent() {
 *   const trpc = useTRPC();
 *   const { data, isLoading } = trpc.catalog.list.useQuery();
 *   
 *   return <div>{data?.length} escorts found</div>;
 * }
 * ```
 * 
 * @typedef {import('@/routers').AppRouter} AppRouter
 */

import { useState, useEffect } from 'react';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/routers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

// Create tRPC client for React
export const trpc = createTRPCReact<AppRouter>();

// Create Query Client
let browserQueryClient: QueryClient | undefined = null;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new client
    return new QueryClient();
  }

  // Browser: create a client once and reuse
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return browserQueryClient;
}

// tRPC Provider Props
interface TRPCProviderProps {
  children: React.ReactNode;
}

// tRPC Provider Component
export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => getQueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          // You can add headers here
          headers: () => {
            const token = localStorage.getItem('auth-token');
            return {
              authorization: token ? `Bearer ${token}` : undefined,
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

// Hook to use tRPC
export function useTRPC() {
  return trpc;
}

// Server-side tRPC client (for SSR/SSG)
export function createSSRClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/trpc',
      }),
    ],
  });
}

// Example usage:
// const utils = trpc.useContext();
// const { data, isLoading, error } = trpc.escort.list.useQuery();
// const mutate = trpc.escort.create.useMutation();
