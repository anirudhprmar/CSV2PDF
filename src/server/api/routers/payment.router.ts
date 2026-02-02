import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { one_time_purchase } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────
export const purchaseDetailsSchema = z.object({
  id: z.string(),
  productId: z.string(),
  status: z.string(),
  totalAmount: z.number(),
  currency: z.string(),
  paid: z.boolean(),
  refundedAmount: z.number().nullable(),
  refundedTaxAmount: z.number().nullable(),
  isInvoiceGenerated: z.boolean().nullable(),
  organizationId: z.string().nullable(),
});

export const purchaseDetailsResultSchema = z.object({
  hasPurchased: z.boolean(),
  purchase: purchaseDetailsSchema.optional(),
  error: z.string().optional(),
  errorType: z.enum(["REFUNDED", "PENDING", "GENERAL"]).optional(),
});

export type PurchaseDetails = z.infer<typeof purchaseDetailsSchema>;
export type PurchaseDetailsResult = z.infer<typeof purchaseDetailsResultSchema>;

// ─────────────────────────────────────
// Payment Router
// ─────────────────────────────────────
export const paymentRouter = createTRPCRouter({
  /**
   * Get detailed purchase information for the authenticated user
   * Returns purchase status, details, and any error states
   */
  getPurchaseDetails: protectedProcedure.query(
    async ({ ctx }): Promise<PurchaseDetailsResult> => {
      try {
        const userPurchases = await ctx.db
          .select()
          .from(one_time_purchase)
          .where(eq(one_time_purchase.userId, ctx.session.user.id));

        if (!userPurchases.length) {
          return { hasPurchased: false };
        }

        // Get the most recent active purchase
        const activePurchase = userPurchases
          .filter((sub) => sub.status === "paid")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )[0];

        if (activePurchase) {
          // Validate that the purchase has valid payment status
          if (!activePurchase.paid) {
            console.warn("Active purchase has invalid payment status:", activePurchase);
            return {
              hasPurchased: false,
              error: "Invalid purchase data",
              errorType: "GENERAL",
            };
          }

          // Normal active purchase
          return {
            hasPurchased: true,
            purchase: {
              id: activePurchase.id,
              productId: activePurchase.productId,
              status: activePurchase.status,
              totalAmount: activePurchase.totalAmount,
              currency: activePurchase.currency,
              paid: activePurchase.paid,
              refundedAmount: activePurchase.refundedAmount,
              refundedTaxAmount: activePurchase.refundedTaxAmount,
              isInvoiceGenerated: activePurchase.isInvoiceGenerated,
              organizationId: null,
            },
          };
        }

        // Fallback: no active purchase, check for latest purchase (refunded/pending)
        const latestPurchase = userPurchases.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        if (latestPurchase) {
          // Validate that the purchase has valid payment status
          if (!latestPurchase.paid) {
            console.warn("Latest purchase has invalid payment status:", latestPurchase);
            return {
              hasPurchased: false,
              error: "Invalid purchase data",
              errorType: "GENERAL",
            };
          }

          const isRefunded = latestPurchase.status === "refunded";

          return {
            hasPurchased: true,
            purchase: {
              id: latestPurchase.id,
              productId: latestPurchase.productId,
              status: latestPurchase.status,
              totalAmount: latestPurchase.totalAmount,
              currency: latestPurchase.currency,
              paid: latestPurchase.paid,
              refundedAmount: latestPurchase.refundedAmount,
              refundedTaxAmount: latestPurchase.refundedTaxAmount,
              isInvoiceGenerated: latestPurchase.isInvoiceGenerated,
              organizationId: null,
            },
            error: isRefunded
              ? "Purchase has been refunded"
              : "Purchase is not active",
            errorType: isRefunded ? "REFUNDED" : "GENERAL",
          };
        }

        return { hasPurchased: false };
      } catch (error) {
        console.error("Error fetching purchase details:", error);
        return {
          hasPurchased: false,
          error: "Failed to load purchase details",
          errorType: "GENERAL",
        };
      }
    }
  ),

  /**
   * Check if user has made a valid purchase
   * Returns boolean indicating active paid purchase
   */
  hasUserPurchased: protectedProcedure.query(async ({ ctx }) => {
    const purchase = await ctx.db.query.one_time_purchase.findFirst({
      where: eq(one_time_purchase.userId, ctx.session.user.id),
    });

    return !!purchase && purchase.paid === true && purchase.status === "paid";
  }),

  /**
   * Check if user has access to a specific product
   * Validates purchase status, payment, and refund state
   */
  hasAccessToProduct: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPurchases = await ctx.db
        .select()
        .from(one_time_purchase)
        .where(eq(one_time_purchase.userId, ctx.session.user.id));

      if (!userPurchases.length) {
        return false;
      }

      const validPurchase = userPurchases.find(
        (purchase) =>
          purchase.paid &&
          purchase.status === "paid" &&
          (purchase.refundedAmount ?? 0) < purchase.totalAmount &&
          purchase.productId === input.productId
      );

      return !!validPurchase;
    }),

  /**
   * Get user's purchase status
   * Returns: "paid" | "refunded" | "pending" | "none"
   */
  getUserPurchaseStatus: protectedProcedure.query(async ({ ctx }) => {
    const userPurchases = await ctx.db
      .select()
      .from(one_time_purchase)
      .where(eq(one_time_purchase.userId, ctx.session.user.id));

    if (!userPurchases.length) {
      return "none" as const;
    }

    // Get the most recent purchase
    const latestPurchase = userPurchases.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    if (!latestPurchase) {
      return "none" as const;
    }

    // Check if paid
    if (latestPurchase.status === "paid" && latestPurchase.paid) {
      return "paid" as const;
    }

    // Check if pending
    if (!latestPurchase.paid || latestPurchase.status === "pending") {
      return "pending" as const;
    }

    // Check if refunded
    if (
      latestPurchase.status === "refunded" ||
      (latestPurchase.refundedAmount ?? 0) >= latestPurchase.totalAmount
    ) {
      return "refunded" as const;
    }

    return "none" as const;
  }),

  /**
   * Get all purchases for the authenticated user
   * Returns array of all purchase records
   */
  getAllPurchases: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.db
      .select()
      .from(one_time_purchase)
      .where(eq(one_time_purchase.userId, ctx.session.user.id))
      .orderBy(one_time_purchase.createdAt);

    return purchases;
  }),

  /**
   * Get the most recent purchase
   * Returns the latest purchase record or null
   */
  getLatestPurchase: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.db
      .select()
      .from(one_time_purchase)
      .where(eq(one_time_purchase.userId, ctx.session.user.id))
      .orderBy(one_time_purchase.createdAt);

    return purchases[purchases.length - 1] ?? null;
  }),
});
