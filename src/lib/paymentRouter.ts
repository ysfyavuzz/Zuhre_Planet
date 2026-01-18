import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

export const paymentRouter = router({
  // Kredi paketi satın alma başlat
  initiatePurchase: protectedProcedure
    .input(z.object({
      packageId: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: İyzico/PayTR API çağrısı burada yapılacak
      // Şimdilik demo için başarılı dönüyoruz
      
      const paymentId = `PAY-${Date.now()}`;
      
      // İşlemi veritabanına kaydet
      await db.createCreditTransaction({
        userId: ctx.user.id,
        transactionType: 'purchase',
        amount: input.amount,
        balanceBefore: 0, // Gerçek bakiye db'den alınmalı
        balanceAfter: input.amount,
        description: `${input.packageId} paketi satın alımı`,
        paymentMethod: 'credit_card',
        paymentId: paymentId,
      });

      return {
        success: true,
        paymentId: paymentId,
        checkoutUrl: 'https://sandbox-checkout.iyzipay.com/auth?token=demo-token', // Örnek checkout URL
      };
    }),

  // VIP Üyelik satın alma
  purchaseVip: protectedProcedure
    .input(z.object({
      plan: z.enum(['monthly', 'quarterly', 'yearly']),
      price: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await db.getEscortProfileByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Escort profili bulunamadı' });
      }

      // Ödeme simülasyonu
      const paymentId = `VIP-${Date.now()}`;
      
      await db.activateVip(profile.id, input.plan);

      return {
        success: true,
        message: 'VIP üyeliğiniz başarıyla aktif edildi.',
        paymentId: paymentId,
      };
    }),

  // Bakiye sorgulama
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const credits = await db.getUserCredits(ctx.user.id);
    return credits || { balance: 0 };
  }),
});
