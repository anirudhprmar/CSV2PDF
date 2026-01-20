import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  pgTableCreator,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `csv-viewer-converter_${name}`);


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const oneTimePurchase = createTable("oneTimePurchase", (d) => ({
  // Primary order fields
  id: d.text("id").primaryKey(),
  createdAt: d.timestamp("createdAt").notNull(),
  modifiedAt: d.timestamp("modifiedAt"),
  status: d.text("status").notNull(), // "paid", "pending", "failed", etc.
  paid: d.boolean("paid").notNull().default(false),

  // Amount breakdown fields
  subtotalAmount: d.integer("subtotalAmount").notNull(),
  discountAmount: d.integer("discountAmount").default(0),
  netAmount: d.integer("netAmount").notNull(),
  taxAmount: d.integer("taxAmount").default(0),
  totalAmount: d.integer("totalAmount").notNull(),
  refundedAmount: d.integer("refundedAmount").default(0),
  refundedTaxAmount: d.integer("refundedTaxAmount").default(0),
  currency: d.text("currency").notNull(),
  
  // Billing information
  billingReason: d.text("billingReason").default("purchase"),
  billingName: d.text("billingName"),
  billingAddress: d.text("billingAddress"), // JSON string for address object
  isInvoiceGenerated: d.boolean("isInvoiceGenerated").default(false),
  
  // Relationship fields
  customerId: d.text("customerId").notNull(),
  productId: d.text("productId").notNull(),
  discountId: d.text("discountId"),
  subscriptionId: d.text("subscriptionId"), // Can be null for one-time purchases
  checkoutId: d.text("checkoutId").notNull(),
  userId: d.text("userId").references(() => user.id),
  
  // Additional data
  metadata: d.text("metadata"), // JSON string
  customFieldData: d.text("customFieldData"), // JSON string
}));

export const subscription = createTable("subscription",(d) =>({
  id: d.text("id").primaryKey(),
  createdAt: d.timestamp("createdAt").notNull(),
  modifiedAt: d.timestamp("modifiedAt"),
  amount: d.integer("amount").notNull(),
  currency: d.text("currency").notNull(),
  recurringInterval: d.text("recurringInterval").notNull(),
  status: d.text("status").notNull(),
  currentPeriodStart: d.timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: d.timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: d.boolean("cancelAtPeriodEnd").notNull().default(false),
  canceledAt: d.timestamp("canceledAt"),
  startedAt: d.timestamp("startedAt").notNull(),
  endsAt: d.timestamp("endsAt"),
  endedAt: d.timestamp("endedAt"),
  customerId: d.text("customerId").notNull(),
  productId: d.text("productId").notNull(),
  discountId: d.text("discountId"),
  checkoutId: d.text("checkoutId").notNull(),
  customerCancellationReason: d.text("customerCancellationReason"),
  customerCancellationComment: d.text("customerCancellationComment"),
  metadata: d.text("metadata"), // JSON string
  customFieldData: d.text("customFieldData"), // JSON string
  userId: d.text("userId").references(() => user.id),
}));

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));
