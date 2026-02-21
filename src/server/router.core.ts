import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import jwt from "jsonwebtoken";
import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

// 1. tRPC Initialization - CORE
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// 2. JWT-based Authentication Middleware
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Yetkilendirme başlığı bulunamadı veya hatalı.",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!process.env.JWT_SECRET) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "JWT Secret anahtarı sunucuda tanımlanmamış.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
      role: schema.User["role"];
      iat: number;
      exp: number;
    };

    // Find the user in the database to ensure they still exist
    const userProfile = await db.query.users.findFirst({
      where: eq(schema.users.id, decoded.userId),
    });

    if (!userProfile) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Kullanıcı bulunamadı.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          id: userProfile.id,
          email: userProfile.email,
          role: userProfile.role,
        },
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Geçersiz veya süresi dolmuş token.",
    });
  }
});

// 3. Admin-specific Middleware
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Bu kaynağa erişim yetkiniz yok.",
    });
  }
  return next();
});
