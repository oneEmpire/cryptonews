-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AUTHOR', 'READER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContactPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'READER',
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "imageSource" TEXT,
    "category" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "slug" TEXT,
    "location" TEXT,
    "published_at" TIMESTAMP(3) NOT NULL,
    "time_ago" TEXT NOT NULL,
    "tags" TEXT[],
    "is_breaking" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_trending" BOOLEAN NOT NULL DEFAULT false,
    "read_time" INTEGER NOT NULL DEFAULT 5,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airdrops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "slug" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "discord" TEXT,
    "requirements" TEXT,
    "end_date" TIMESTAMP(3),
    "total_value" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airdrops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "slug" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "discord" TEXT,
    "mint_price" TEXT,
    "total_supply" TEXT,
    "mint_date" TIMESTAMP(3),
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defi_protocols" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "slug" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "discord" TEXT,
    "tvl" TEXT,
    "apy" TEXT,
    "blockchain" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "defi_protocols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "slug" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "exchange" TEXT,
    "price" TEXT,
    "market_cap" TEXT,
    "listing_date" TIMESTAMP(3),
    "is_new" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "preferences" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "ContactPriority" NOT NULL DEFAULT 'NORMAL',
    "assigned_to" TEXT,
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "html_content" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "recipient_count" INTEGER NOT NULL DEFAULT 0,
    "open_count" INTEGER NOT NULL DEFAULT 0,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "news_title_key" ON "news"("title");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE INDEX "news_published_at_idx" ON "news"("published_at" DESC);

-- CreateIndex
CREATE INDEX "news_category_idx" ON "news"("category");

-- CreateIndex
CREATE INDEX "news_is_featured_idx" ON "news"("is_featured");

-- CreateIndex
CREATE INDEX "news_is_trending_idx" ON "news"("is_trending");

-- CreateIndex
CREATE INDEX "news_is_breaking_idx" ON "news"("is_breaking");

-- CreateIndex
CREATE INDEX "news_views_idx" ON "news"("views" DESC);

-- CreateIndex
CREATE INDEX "news_author_id_idx" ON "news"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "airdrops_name_key" ON "airdrops"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airdrops_slug_key" ON "airdrops"("slug");

-- CreateIndex
CREATE INDEX "airdrops_category_idx" ON "airdrops"("category");

-- CreateIndex
CREATE INDEX "airdrops_is_active_idx" ON "airdrops"("is_active");

-- CreateIndex
CREATE INDEX "airdrops_is_featured_idx" ON "airdrops"("is_featured");

-- CreateIndex
CREATE INDEX "airdrops_end_date_idx" ON "airdrops"("end_date");

-- CreateIndex
CREATE INDEX "airdrops_created_at_idx" ON "airdrops"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "nfts_name_key" ON "nfts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nfts_slug_key" ON "nfts"("slug");

-- CreateIndex
CREATE INDEX "nfts_category_idx" ON "nfts"("category");

-- CreateIndex
CREATE INDEX "nfts_is_live_idx" ON "nfts"("is_live");

-- CreateIndex
CREATE INDEX "nfts_is_featured_idx" ON "nfts"("is_featured");

-- CreateIndex
CREATE INDEX "nfts_mint_date_idx" ON "nfts"("mint_date");

-- CreateIndex
CREATE INDEX "nfts_created_at_idx" ON "nfts"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "defi_protocols_name_key" ON "defi_protocols"("name");

-- CreateIndex
CREATE UNIQUE INDEX "defi_protocols_slug_key" ON "defi_protocols"("slug");

-- CreateIndex
CREATE INDEX "defi_protocols_category_idx" ON "defi_protocols"("category");

-- CreateIndex
CREATE INDEX "defi_protocols_is_active_idx" ON "defi_protocols"("is_active");

-- CreateIndex
CREATE INDEX "defi_protocols_is_featured_idx" ON "defi_protocols"("is_featured");

-- CreateIndex
CREATE INDEX "defi_protocols_blockchain_idx" ON "defi_protocols"("blockchain");

-- CreateIndex
CREATE INDEX "defi_protocols_created_at_idx" ON "defi_protocols"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "listings_name_key" ON "listings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "listings_slug_key" ON "listings"("slug");

-- CreateIndex
CREATE INDEX "listings_category_idx" ON "listings"("category");

-- CreateIndex
CREATE INDEX "listings_is_new_idx" ON "listings"("is_new");

-- CreateIndex
CREATE INDEX "listings_is_featured_idx" ON "listings"("is_featured");

-- CreateIndex
CREATE INDEX "listings_exchange_idx" ON "listings"("exchange");

-- CreateIndex
CREATE INDEX "listings_listing_date_idx" ON "listings"("listing_date");

-- CreateIndex
CREATE INDEX "listings_created_at_idx" ON "listings"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_is_active_idx" ON "newsletter_subscribers"("is_active");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_subscribed_at_idx" ON "newsletter_subscribers"("subscribed_at" DESC);

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_priority_idx" ON "contact_submissions"("priority");

-- CreateIndex
CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions"("created_at" DESC);

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");

-- CreateIndex
CREATE INDEX "email_campaigns_status_idx" ON "email_campaigns"("status");

-- CreateIndex
CREATE INDEX "email_campaigns_scheduled_at_idx" ON "email_campaigns"("scheduled_at");

-- CreateIndex
CREATE INDEX "email_campaigns_created_at_idx" ON "email_campaigns"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airdrops" ADD CONSTRAINT "airdrops_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defi_protocols" ADD CONSTRAINT "defi_protocols_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
