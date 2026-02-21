import { router, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const appointmentRouter = router({
  /**
   * Create a new appointment
   */
  create: protectedProcedure
    .input(
      z.object({
        escortId: z.string().uuid(),
        scheduledAt: z.string().datetime(),
        duration: z.number().min(30), // in minutes
        location: z.string().optional(),
        notes: z.string().optional(),
        agreedPrice: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Customer can only create appointments for themselves
      const customerId = ctx.user.id;

      const [newAppointment] = await db.insert(schema.appointments).values({
        id: crypto.randomUUID(),
        customerId,
        escortId: input.escortId,
        scheduledAt: new Date(input.scheduledAt),
        duration: input.duration,
        location: input.location,
        notes: input.notes,
        agreedPrice: String(input.agreedPrice),
        status: 'pending',
      }).returning();
      
      // TODO: Create a notification for the escort

      return newAppointment;
    }),

  /**
   * List appointments for the current user
   */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(schema.appointmentStatusEnum).optional(),
        limit: z.number().default(20),
        page: z.number().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { status, limit, page } = input;
      
      const whereConditions = [
          or(
              eq(schema.appointments.customerId, userId),
              eq(schema.appointments.escortId, userId)
          )
      ];

      if (status) {
          whereConditions.push(eq(schema.appointments.status, status));
      }

      const appointments = await db.query.appointments.findMany({
        where: and(...whereConditions),
        orderBy: [desc(schema.appointments.createdAt)],
        limit: limit,
        offset: (page - 1) * limit,
        with: {
            customer: { columns: { fullName: true, email: true } },
            escort: { columns: { stageName: true, displayName: true } }
        }
      });
      
      return appointments;
    }),

  /**
   * Update the status of an appointment
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        appointmentId: z.string().uuid(),
        status: schema.appointmentStatusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { appointmentId, status } = input;
      const userId = ctx.user.id;

      const [appointment] = await db.select().from(schema.appointments).where(eq(schema.appointments.id, appointmentId));

      if (!appointment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Randevu bulunamadı.' });
      }

      // Check if user has permission to update this appointment
      if (appointment.customerId !== userId && appointment.escortId !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Bu randevuyu güncelleme yetkiniz yok.' });
      }
      
      // Logic for status transitions (e.g., only escort can confirm)
      if (status === 'confirmed' && ctx.user.role !== 'escort') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Sadece escort randevuyu onaylayabilir.' });
      }
      if (status === 'cancelled' && (appointment.status === 'completed' || appointment.status === 'cancelled')) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bu randevu artık iptal edilemez.' });
      }

      const [updatedAppointment] = await db.update(schema.appointments)
        .set({ status, updatedAt: new Date() })
        .where(eq(schema.appointments.id, appointmentId))
        .returning();

      // TODO: Create notification for the other party

      return updatedAppointment;
    }),
});

export type AppointmentRouter = typeof appointmentRouter;
