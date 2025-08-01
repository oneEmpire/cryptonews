import { PrismaClient } from "@prisma/client"
import { mockNews } from "../lib/mock-news"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database with mock news data...")

  // Clear existing data
  await prisma.news.deleteMany()

  // Insert mock news data
  for (const newsItem of mockNews) {
    await prisma.news.create({
      data: {
        id: newsItem.id,
        title: newsItem.title,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        image: newsItem.image,
        category: newsItem.category,
        authorId: newsItem.author,
        publishedAt: new Date(newsItem.publishedAt),
        timeAgo: newsItem.timeAgo,
        location: newsItem.location,
        tags: newsItem.tags,
        isBreaking: newsItem.isBreaking,
        isFeatured: newsItem.isFeatured,
        isTrending: newsItem.isTrending,
        readTime: newsItem.readTime,
        views: newsItem.views,
      },
    })
  }

  console.log(`✅ Seeded ${mockNews.length} news articles`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
