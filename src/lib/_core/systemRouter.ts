/**
 * System Router Module (systemRouter.ts)
 * 
 * Core system endpoints for health checks and version information.
 * Public procedures that don't require authentication.
 * Used for monitoring and debugging application status.
 * 
 * @module lib/_core/systemRouter
 * @category Library - Core
 * 
 * Features:
 * - Health check endpoint (system.health)
 * - Version information endpoint (system.version)
 * - Both endpoints are publicly accessible
 * 
 * Endpoints:
 * - health: Returns {status: 'ok', timestamp: ISO string}
 * - version: Returns {version: '1.0.0'}
 * 
 * Usage:
 * Used for uptime monitoring, API readiness checks, and deployment verification.
 * Can be called before authentication to verify backend availability.
 * 
 * @example
 * ```typescript
 * import { systemRouter } from '@/lib/_core/systemRouter';
 * import { trpc } from '@/lib/trpc';
 * 
 * // Check system health
 * const { data } = trpc.system.health.useQuery();
 * console.log(data?.status); // 'ok'
 * 
 * // Get version
 * const { data: versionInfo } = trpc.system.version.useQuery();
 * console.log(versionInfo?.version); // '1.0.0'
 * ```
 * 
 * @todo Add database health check to health endpoint
 * @todo Add cache status to health endpoint
 * @todo Add external service status checks
 */

/**
 * System Router
 *
 * Sistem ile ilgili temel API endpoint'leri
 */

import { router, publicProcedure } from './trpc';

export const systemRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  version: publicProcedure.query(() => {
    return { version: '1.0.0' };
  }),
});
