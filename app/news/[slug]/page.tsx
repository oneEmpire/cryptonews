import type { Metadata } from "next"
import { fetchArticle } from "@/lib/news-server"
import ContentPageClient from "./NewsPageClient"
import { notFound } from "next/navigation"
import type { ContentType, NewsItem } from "@/lib/types"

interface ContentPageProps {
  params: Promise<{
    contentType: ContentType
    slug: string
  }>
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug, contentType } = await params

  // For now, only handle news content since other content types need different fetch functions
  if (contentType !== "news") {
    return {
      title: "Content Not Found - CryptoFlow",
      description: "This content type is not yet supported.",
    }
  }

  const contentItem = await fetchArticle(slug)

  if (!contentItem) {
    return {
      title: "Content Not Found - CryptoFlow",
      description: "The requested content could not be found.",
    }
  }

  // Since we know this is a news item (contentType === "news" and fetchArticle returns NewsItem)
  const newsItem = contentItem as NewsItem

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"
  const contentUrl = `${baseUrl}/${contentType}/${newsItem.slug}`
  const imageUrl = newsItem.image || `${baseUrl}/crypto-og-image.jpg`
  const title = newsItem.title
  const description = newsItem.excerpt

  return {
    title: `${title} - CryptoFlow`,
    description: description || title,
    openGraph: {
      title,
      description: description || title,
      url: contentUrl,
      siteName: "CryptoFlow",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: newsItem.publishedAt || newsItem.createdAt,
      authors: [newsItem.authorName || "CryptoFlow"],
      section: newsItem.category,
      tags: newsItem.tags || [newsItem.category],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || title,
      images: imageUrl,
      creator: "@cryptoflownews",
      site: "@cryptoflownews",
    },
    alternates: {
      canonical: contentUrl,
    },
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug, contentType } = await params

  // Validate content type
  if (!["news", "airdrop", "nft", "defi", "listing"].includes(contentType)) {
    notFound()
  }

  return <ContentPageClient params={{ contentType, slug }} />
}
