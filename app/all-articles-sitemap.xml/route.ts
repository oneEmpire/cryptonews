import { NextResponse } from "next/server"
import { fetchLatestNews } from "@/lib/news-server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://healthnews.guru"

  try {
    // Fetch recent articles (adjust number as needed)
    const allNews = await fetchLatestNews(100, 1)

   console.log(`Fetched ${allNews.length} articles for all-articles sitemap`)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allNews
  .map((article) => {
    const articleUrl = `${baseUrl}/news/${article.slug}`
    const bestDate = article.publishedAt || article.createdAt || article.updatedAt || new Date().toISOString()
    const publishDate = new Date(bestDate).toISOString()
    const cleanTitle = article.title.trim().replace(/\s+/g, " ")

    return `  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${publishDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating all-articles sitemap:", error)
    return new NextResponse("Error generating sitemap", { status: 500 })
  }
}
