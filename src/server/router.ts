import { router, publicProcedure } from "./router.core";
import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";

// Import Sub-Routers (after router is defined in router.core)
import { authRouter } from "./routers/auth.router";
import { escortRouter } from "./routers/escort.router";
import { appointmentRouter } from "./routers/appointment.router";
import { adminRouter } from "./routers/admin.router";
import { adminActionsRouter } from "./routers/admin_actions.router";
import { forumRouter } from "./routers/forum.router";
import { chatRouter } from "./routers/chat.router";
import { mediaRouter } from "./routers/media.router";
import { verificationRouter } from "./routers/verification.router";

// 4. Main Application Router
export const appRouter = router({
  auth: authRouter,
  escort: escortRouter,
  appointment: appointmentRouter,
  admin: adminRouter,
  adminActions: adminActionsRouter,
  forum: forumRouter,
  chat: chatRouter,
  media: mediaRouter,
  verification: verificationRouter,
  // Example: Health check using Drizzle
  health: publicProcedure.query(async ({ ctx }) => {
    try {
      // Drizzle with a simple query to check DB connection
      await ctx.db
        .select({ id: schema.escortProfiles.id })
        .from(schema.escortProfiles)
        .limit(1);
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
      };
    } catch (error) {
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),
});

export type AppRouter = typeof appRouter;
