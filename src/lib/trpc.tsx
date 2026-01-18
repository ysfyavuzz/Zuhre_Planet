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
