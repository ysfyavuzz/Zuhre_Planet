/**
 * tRPC Core Configuration
 *
 * Backend tarafında tRPC router oluşturmak için gerekli yapılandırmalar
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // Authentication check burada yapılacak
  return next({ ctx });
});
