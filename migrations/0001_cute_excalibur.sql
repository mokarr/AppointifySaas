ALTER TABLE "organization" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "stripe_subscription_current_period_end" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "todo" ADD PRIMARY KEY ("id");