import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { db } from '@/drizzle/db';
import type { User } from '@/drizzle/schema';

// Define the shape of the user object we'll have in the context
interface UserContext {
  id: number;
  email: string;
  role: User['role'];
}

/**
 * Creates context for each tRPC request.
 * This is where we'll attach things like the database client.
 * The context is available in all tRPC procedures.
 */
export function createContext({ req, res }: CreateExpressContextOptions) {
  // This function can be async if needed
  
  // The 'user' property is optional because it will only exist on protected routes.
  // The 'protectedProcedure' middleware will be responsible for validating the JWT
  // and attaching the user object to the context.
  const user: UserContext | null = null;
  
  return {
    req,
    res,
    db, // Make the Drizzle DB client available to all procedures
    user, // Placeholder for authenticated user
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
