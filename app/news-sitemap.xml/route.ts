import { NextResponse } from "next/server"
import { fetchLatestNews } from "@/lib/news-server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://healthnews.guru"

  try {
    // Get recent news articles
    const recentNews = await fetchLatestNews(50, 1)

    console.log(`Fetched ${recentNews.length} articles for news sitemap`)

    // Only include articles from the past 30 days
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    let newsArticles = recentNews.filter((article) => {
      const articleDateStr = article.publishedAt || article.createdAt || article.updatedAt
      if (!articleDateStr) return false

      const articleDate = new Date(articleDateStr)
      return !isNaN(articleDate.getTime()) && articleDate >= thirtyDaysAgo
    })

    if (newsArticles.length === 0) {
      newsArticles = recentNews.slice(0, 20)
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${newsArticles
  .map((article) => {
    const articleUrl = `${baseUrl}/news/${article.slug}`
    const publishDate = new Date(article.publishedAt || article.createdAt || article.updatedAt || Date.now()).toISOString()
    const cleanTitle = article.title.trim().replace(/\s+/g, " ")

    return `  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${publishDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>HealthNews.Guru</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishDate}</news:publication_date>
      <news:title><![CDATA[${cleanTitle}]]></news:title>
      <news:keywords><![CDATA[${article.tags?.join(", ") || "health news, medical news, global health"}]]></news:keywords>
    </news:news>
    ${
      article.image
        ? `<image:image>
      <image:loc>${article.image}</image:loc>
      <image:title><![CDATA[${cleanTitle}]]></image:title>
      <image:caption><![CDATA[${article.excerpt || cleanTitle}]]></image:caption>
    </image:image>`
        : ""
    }
  </url>`
  })
  .join("\n")}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=1800, s-maxage=1800",
      },
    })
  } catch (error) {
    console.error("Error generating news sitemap:", error)

    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Error: ${error instanceof Error ? error.message : "Unknown error"} -->
</urlset>`

    return new NextResponse(emptySitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    })
  }
}
