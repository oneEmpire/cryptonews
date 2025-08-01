import { NextResponse } from "next/server"
import { fetchLatestNews } from "@/lib/news-server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://healthnews.guru"

  const latestNews = await fetchLatestNews(50, 1)

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>HealthNews.Guru - Global Health News</title>
    <description>Your trusted source for global health news, medical breakthroughs, and health insights worldwide.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>HealthNews.Guru</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    
${latestNews
  .map((article) => {
    const articleUrl = `${baseUrl}/news/${article.slug}`
    const pubDate = new Date(article.publishedAt || article.createdAt || new Date()).toUTCString()

    return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt || ""}]]></description>
      <content:encoded><![CDATA[${article.content || article.excerpt || ""}]]></content:encoded>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${article.authorName || "HealthNews.Guru Editorial Team"}]]></dc:creator>
      <category><![CDATA[${article.category}]]></category>
      ${article.tags?.map((tag) => `<category><![CDATA[${tag}]]></category>`).join("\n      ") || ""}
      ${
        article.image
          ? `<media:content url="${article.image}" type="image/jpeg" medium="image">
        <media:title><![CDATA[${article.title}]]></media:title>
        <media:description><![CDATA[${article.excerpt || article.title}]]></media:description>
      </media:content>`
          : ""
      }
    </item>`
  })
  .join("\n")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
