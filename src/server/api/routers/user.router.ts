import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { user, one_time_purchase } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  isAuthenticated: publicProcedure.query(async ({ ctx }) => {
    return !!ctx.session?.user;
  }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userProfile = await ctx.db.query.user.findFirst({
      where: eq(user.id, ctx.session.user.id),
    });

    if (!userProfile) {
      throw new Error("User not found");
    }

    return userProfile;
  }),

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

  getPurchases: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.db.query.one_time_purchase.findMany({
      where: eq(one_time_purchase.userId, ctx.session.user.id),
    });

    return purchases;
  }),

  getActivePurchase: protectedProcedure.query(async ({ ctx }) => {
    const purchase = await ctx.db.query.one_time_purchase.findFirst({
      where: eq(one_time_purchase.userId, ctx.session.user.id),
    });

    return purchase;
  }),

  hasPurchased: protectedProcedure.query(async ({ ctx }) => {
    const purchase = await ctx.db.query.one_time_purchase.findFirst({
      where: eq(one_time_purchase.userId, ctx.session.user.id),
    });

    return !!purchase && purchase.paid === true;
  }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const userRecord = await ctx.db.query.user.findFirst({
        where: eq(user.email, input.email),
      });

      return userRecord;
    }),
    
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(user).where(eq(user.id, ctx.session.user.id));

    return { success: true };
  }),
});
