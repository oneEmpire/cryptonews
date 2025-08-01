import { NextResponse } from "next/server"
import { fetchLatestNews } from "@/lib/news-server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://healthnews.guru"

  // Get ALL news articles for full sitemap
  const allNews = await fetchLatestNews(1000, 1)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allNews
  .map((article) => {
    const articleUrl = `${baseUrl}/news/${article.slug}`
    const publishDate = new Date(article.publishedAt || article.createdAt || new Date()).toISOString()

    return `  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${publishDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${
      article.image
        ? `<image:image>
      <image:loc>${article.image}</image:loc>
      <image:title><![CDATA[${article.title}]]></image:title>
      <image:caption><![CDATA[${article.excerpt || article.title}]]></image:caption>
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
}
