import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { account, one_time_purchase, session, user, verification } from '~/server/db/schema';
import { env } from "~/env";
import { db } from "~/server/db";

function safeParseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: env.NODE_ENV === "production" ? "production" : "sandbox",
});

export const auth = betterAuth({
    trustedOrigins: [
        env.NEXT_PUBLIC_APP_URL
    ],
    allowedDevOrigins: [
        env.NEXT_PUBLIC_APP_URL,
    ],
    cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
    },
    database:drizzleAdapter(db,{
        provider:"pg",
        schema:{
            user,
            session,
            account,
            verification,
            one_time_purchase
        }
    }),
    socialProviders:{
        google:{
            prompt:"select_account",
            clientId:env.AUTH_GOOGLE_ID,
            clientSecret:env.AUTH_GOOGLE_SECRET
        }
    },
    plugins:[
       polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                        productId:
                            env.NEXT_PUBLIC_LIFETIME_ID  ??
                            (() => {
                            throw new Error(
                                "NEXT_PUBLIC_LIFETIME_ID environment variable is required",
                            );
                            })(),
                        slug:
                            env.NEXT_PUBLIC_LIFETIME_SLUG ??
                            (() => {
                            throw new Error(
                                "NEXT_PUBLIC_LIFETIME_SLUG environment variable is required",
                            );
                            })(),
                        },
                    ],
                    successUrl:  `${env.NEXT_PUBLIC_APP_URL}/${env.POLAR_SUCCESS_URL}`,
                    authenticatedUsersOnly: true
                }),
                portal(),
                webhooks({
                    secret:
                        env.POLAR_WEBHOOK_SECRET ??
                        (() => {
                        throw new Error(
                            "POLAR_WEBHOOK_SECRET environment variable is required",
                        );
                        })(),
                onPayload: async ({ data, type }) => {

                    if ( type === "order.created" || type === "order.paid" || type === "order.updated" || type === "order.refunded") {
                    try {
                    if (!data.productId) {
                        console.warn("⚠️ Skipping order without productId:", data.id);
                        return; // Skip processing orders without a product
                    }

                    const userId = data.customer?.externalId;

                    const one_time_purchase_data = {
                    id: data.id,
                    createdAt: new Date(data.createdAt),
                    modifiedAt: safeParseDate(data.modifiedAt),
                    status: data.status,
                    paid: data.paid || false,
                    
                    // Amount fields
                    subtotalAmount: data.subtotalAmount ?? 0,
                    discountAmount: data.discountAmount ?? 0,
                    netAmount: data.netAmount || 0,
                    taxAmount: data.taxAmount || 0,
                    totalAmount: data.totalAmount || 0,
                    refundedAmount: data.refundedAmount || 0,
                    refundedTaxAmount: data.refundedTaxAmount || 0,
                    currency: data.currency,
                    billingReason: data.billingReason || "purchase",
                    billingName: data.billingName,
                    billingAddress: data.billingAddress ? JSON.stringify(data.billingAddress) : null,
                    isInvoiceGenerated: data.isInvoiceGenerated || false,
                    customerId: data.customerId,
                    productId: data.productId, 
                    discountId: data.discountId ?? null,
                    subscriptionId: data.subscriptionId ?? null, 
                    checkoutId: data.checkoutId ?? "",
                    userId: userId,
                    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
                    customFieldData: data.customFieldData ? JSON.stringify(data.customFieldData) : null,
                    };

                    await db
                    .insert(one_time_purchase)
                    .values(one_time_purchase_data)
                    .onConflictDoUpdate({
                        target: one_time_purchase.id,
                        set: {
                        modifiedAt: one_time_purchase_data.modifiedAt ?? new Date(),
                        status: one_time_purchase_data.status,
                        paid: one_time_purchase_data.paid,
                        refundedAmount: one_time_purchase_data.refundedAmount,
                        refundedTaxAmount: one_time_purchase_data.refundedTaxAmount,
                        isInvoiceGenerated: one_time_purchase_data.isInvoiceGenerated,
                        },
                    });
                    
                    // console.log(`✅ Processed ${type} for order: ${data.id}`);

                } catch (error) {
                    console.error(
                    "💥 Error processing one time purchase webhook:",
                    error,
                    );
                    // Don't throw - let webhook succeed to avoid retries
                }
                }
          },
                    
                })
            ],
        }),
    nextCookies()]
});


export type Session = typeof auth.$Infer.Session;
