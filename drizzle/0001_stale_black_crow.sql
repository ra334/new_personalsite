CREATE TABLE "article_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "groupId" uuid;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_groupId_article_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."article_groups"("id") ON DELETE cascade ON UPDATE no action;