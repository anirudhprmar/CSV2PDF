import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { user, one_time_purchase, subscription } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  // ─────────────────────────────────────
  // Get Current User Profile
  // ─────────────────────────────────────
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userProfile = await ctx.db.query.user.findFirst({
      where: eq(user.id, ctx.session.user.id),
    });

    if (!userProfile) {
      throw new Error("User not found");
    }

    return userProfile;
  }),

  // ─────────────────────────────────────
  // Update User Profile
  // ─────────────────────────────────────
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(user)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.session.user.id))
        .returning();

      return updatedUser[0];
    }),

  // ─────────────────────────────────────
  // Get User's Purchases
  // ─────────────────────────────────────
  getPurchases: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.db.query.one_time_purchase.findMany({
      where: eq(one_time_purchase.userId, ctx.session.user.id),
    });

    return purchases;
  }),

  // ─────────────────────────────────────
  // Get User's Active Purchase
  // ─────────────────────────────────────
  getActivePurchase: protectedProcedure.query(async ({ ctx }) => {
    const purchase = await ctx.db.query.one_time_purchase.findFirst({
      where: eq(one_time_purchase.userId, ctx.session.user.id),
    });

    return purchase;
  }),

  // ─────────────────────────────────────
  // Check if User Has Purchased
  // ─────────────────────────────────────
  hasPurchased: protectedProcedure.query(async ({ ctx }) => {
    const purchase = await ctx.db.query.one_time_purchase.findFirst({
      where: eq(one_time_purchase.userId, ctx.session.user.id),
    });

    return !!purchase && purchase.paid === true;
  }),

  // ─────────────────────────────────────
  // Get User's Subscriptions
  // ─────────────────────────────────────
  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await ctx.db.query.subscription.findMany({
      where: eq(subscription.userId, ctx.session.user.id),
    });

    return subscriptions;
  }),

  // ─────────────────────────────────────
  // Get User's Active Subscription
  // ─────────────────────────────────────
  getActiveSubscription: protectedProcedure.query(async ({ ctx }) => {
    const activeSub = await ctx.db.query.subscription.findFirst({
      where: eq(subscription.userId, ctx.session.user.id),
    });

    return activeSub;
  }),

  // ─────────────────────────────────────
  // Check if User Has Active Subscription
  // ─────────────────────────────────────
  hasActiveSubscription: protectedProcedure.query(async ({ ctx }) => {
    const activeSub = await ctx.db.query.subscription.findFirst({
      where: eq(subscription.userId, ctx.session.user.id),
    });

    return !!activeSub && activeSub.status === "active";
  }),

  // ─────────────────────────────────────
  // Get User by Email (Public - for webhook use)
  // ─────────────────────────────────────
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const userRecord = await ctx.db.query.user.findFirst({
        where: eq(user.email, input.email),
      });

      return userRecord;
    }),

  // ─────────────────────────────────────
  // Delete User Account
  // ─────────────────────────────────────
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(user).where(eq(user.id, ctx.session.user.id));

    return { success: true };
  }),
});
