ALTER TABLE "csv-viewer-converter_oneTimePurchase" RENAME TO "one_time_purchase";--> statement-breakpoint
ALTER TABLE "csv-viewer-converter_subscription" RENAME TO "subscription";--> statement-breakpoint
ALTER TABLE "one_time_purchase" DROP CONSTRAINT "csv-viewer-converter_oneTimePurchase_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "subscription" DROP CONSTRAINT "csv-viewer-converter_subscription_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "one_time_purchase" ADD CONSTRAINT "one_time_purchase_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;