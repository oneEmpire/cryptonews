import { NextResponse } from "next/server"
import { fetchLatestNews } from "@/lib/news-server"

export async function GET() {
  try {
    const recentNews = await fetchLatestNews(10, 1)

    const debugInfo = {
      totalArticles: recentNews.length,
      articles: recentNews.map((article, index) => ({
        index: index + 1,
        title: article.title,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        category: article.category,
        tags: article.tags,
        hasImage: !!article.image,
      })),
      currentTime: new Date().toISOString(),
      sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json(debugInfo, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      {
        status: 500,
      },
    )
  }
}
