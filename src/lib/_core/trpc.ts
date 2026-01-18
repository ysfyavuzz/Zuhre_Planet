/**
 * tRPC Core Configuration Module (trpc.ts)
 * 
 * Core tRPC initialization and procedure definitions for backend API setup.
 * Provides the foundation for all tRPC router definitions and API procedures.
 * 
 * @module lib/_core/trpc
 * @category Library - Core
 * 
 * Features:
 * - tRPC initialization with context
 * - Router creation
 * - Public procedures (no authentication required)
 * - Protected procedures (authentication required)
 * - Middleware support for additional checks
 * 
 * Procedures:
 * - publicProcedure: Available to all users (unauthenticated or authenticated)
 * - protectedProcedure: Requires user authentication in context
 * 
 * Middleware:
 * Protected procedures use middleware to verify authentication status.
 * Can be extended with role-based access control (RBAC) checks.
 * 
 * Context:
 * Context typically includes:
 * - req: HTTP request object
 * - res: HTTP response object
 * - user: Authenticated user data (if available)
 * - db: Database connection
 * 
 * @example
 * ```typescript
 * import { publicProcedure, protectedProcedure, router } from '@/lib/_core/trpc';
 * import { z } from 'zod';
 * 
 * // Public endpoint
 * export const publicRouter = router({
 *   getStatus: publicProcedure.query(() => ({
 *     status: 'running'
 *   }))
 * });
 * 
 * // Protected endpoint
 * export const protectedRouter = router({
 *   getProfile: protectedProcedure.query(({ ctx }) => ({
 *     userId: ctx.user.id
 *   }))
 * });
 * ```
 * 
 * @typedef {object} TRPCContext - The context object passed to procedures
 * @property {object} req - HTTP request
 * @property {object} res - HTTP response
 * @property {object} [user] - Authenticated user data
 * 
 * @todo Implement role-based access control middleware
 * @todo Add rate limiting middleware
 * @todo Add request logging middleware
 */

/**
 * tRPC Core Configuration
 *
 * Backend tarafında tRPC router oluşturmak için gerekli yapılandırmalar
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

// Define the context type
export interface TRPCContext {
  req?: any;
  res?: any;
  user?: {
    id: number;
    email: string;
    name?: string;
    role: 'admin' | 'escort' | 'client';
  };
}

export const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // Authentication check burada yapılacak
  return next({ ctx });
});
