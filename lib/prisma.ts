// lib/prisma.ts (Conceptual - modify your actual file)
import { PrismaClient } from "@prisma/client"
import type { NewsItem } from "./types" // Adjust path as needed

// Initialize Prisma Client
export const prisma = new PrismaClient()

// Helper function to convert Prisma News model to NewsItem interface
// This function needs to accept the Prisma 'News' type which now might include 'author'
// If you have specific Prisma types for News with includes, use those.


 export function convertToNewsItem(news: any): NewsItem {

  return {
    id: news.id,
    slug: news.slug,
    title: news.title,
    excerpt: news.excerpt,
    content: news.content,
    image: news.image,
    imageSource: news.imageSource || null,
    category: news.category,
    authorId: news.authorId,
    authorName: news.author?.name || "Unknown Author",
    authorRole: news.author?.role || "READER",
    authorProfileImage: news.author?.profileImage || null, // ✅ Add this line
    publishedAt: news.publishedAt,
    timeAgo: news.timeAgo,
    location: news.location,
    tags: news.tags,
    isBreaking: news.isBreaking,
    isFeatured: news.isFeatured,
    isTrending: news.isTrending,
    readTime: news.readTime,
    views: news.views,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
  };
}



// Helper function to convert NewsItem to Prisma News create/update data
// (No changes needed here for author name, as it's not directly written back to News model)
export function convertToPrismaData(newsItem: Partial<NewsItem>): any {
  const data: any = {
    title: newsItem.title,
    excerpt: newsItem.excerpt,
    content: newsItem.content,
    image: newsItem.image,
    slug: newsItem.slug,
    imageSource: newsItem.imageSource,
    category: newsItem.category,
    authorId: newsItem.authorId, // Ensure authorId is always provided on creation/update
    // These fields should correspond to your Prisma model's @map names if different
    publishedAt: newsItem.publishedAt,
    timeAgo: newsItem.timeAgo,
    location: newsItem.location,
    tags: newsItem.tags,
    isBreaking: newsItem.isBreaking,
    isFeatured: newsItem.isFeatured,
    isTrending: newsItem.isTrending,
    readTime: newsItem.readTime,
    views: newsItem.views,
    createdAt: newsItem.createdAt,
    updatedAt: newsItem.updatedAt,
  };

  // Remove undefined values to avoid Prisma errors on partial updates
  Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

  return data;
}