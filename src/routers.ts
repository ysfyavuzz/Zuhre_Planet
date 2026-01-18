/**
 * tRPC Router Export Module (routers.ts)
 * 
 * Central export point for tRPC router configuration and types.
 * Re-exports the AppRouter type and appRouter instance from lib/routers.ts.
 * 
 * @module routers
 * @category API
 * 
 * Features:
 * - Type-safe tRPC router export
 * - Router instance export for backend setup
 * - Centralized API configuration access
 * 
 * Exports:
 * - AppRouter: TypeScript type for full router structure
 * - appRouter: tRPC router instance
 * 
 * Usage:
 * This module serves as the single source of truth for router exports,
 * making it easy to import the router in multiple places without circular dependencies.
 * 
 * @example
 * ```typescript
 * import type { AppRouter } from '@/routers';
 * import { appRouter } from '@/routers';
 *
 * // Type-safe tRPC client
 * const trpcClient = trpc.createClient({
 *   links: [httpBatchLink({ url: '/api/trpc' })]
 * });
 * 
 * // Use router on backend
 * const handler = trpcHTTPHandler({
 *   router: appRouter,
 * });
 * ```
 * 
 * @typedef {import('./lib/routers').AppRouter} AppRouter
 */

export type { AppRouter } from './lib/routers';
export { appRouter } from './lib/routers';
