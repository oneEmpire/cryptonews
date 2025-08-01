"use client"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Download,
  Check,
  ArrowUp,
  Loader2,
  Globe,
  ExternalLink,
} from "lucide-react"
import { fetchBreakingNews, fetchTrendingNews, fetchNewsByCategory, fetchArticle } from "@/lib/news-client"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { NewsItem, ContentType, ContentItem, AirdropItem, NFTItem, DeFiItem, ListingItem } from "@/lib/types"
import { useState, useCallback, useEffect, useRef } from "react"
import { TrendingSidebar } from "@/components/trending-sidebar"
import Loading from "./loading"
import { Separator } from "@/components/ui/separator"

interface ContentPageProps {
  params: {
    contentType: ContentType
    slug: string
  }
}

// Type guards to check content types
const isNewsItem = (item: ContentItem): item is NewsItem => {
  return "title" in item && "content" in item
}

const isAirdropItem = (item: ContentItem): item is AirdropItem => {
  return "name" in item && "requirements" in item
}

const isNFTItem = (item: ContentItem): item is NFTItem => {
  return "name" in item && "mintPrice" in item
}

const isDeFiItem = (item: ContentItem): item is DeFiItem => {
  return "name" in item && "tvl" in item
}

const isListingItem = (item: ContentItem): item is ListingItem => {
  return "name" in item && "exchange" in item
}

// Helper function to check if item has social links
const hasSocialLinks = (item: ContentItem): item is AirdropItem | NFTItem | DeFiItem => {
  return isAirdropItem(item) || isNFTItem(item) || isDeFiItem(item)
}

export default function ContentPageClient({ params }: ContentPageProps) {
  const [contentItem, setContentItem] = useState<ContentItem | null>(null)
  const [relatedContent, setRelatedContent] = useState<NewsItem[]>([])
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([])
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([])
  const [showFullMainContent, setShowFullMainContent] = useState(false)
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set())
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  const [hasNewUpdates, setHasNewUpdates] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date())
  const [shownArticleIds, setShownArticleIds] = useState<Set<string>>(new Set())
  const [availableArticles, setAvailableArticles] = useState<NewsItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const loadingRef = useRef<HTMLDivElement>(null)
  const articlesPerPage = 5

  const createUniqueArticlePool = useCallback((categoryData: NewsItem[], excludeIds: Set<string>): NewsItem[] => {
    const articlePool = new Map<string, NewsItem>()

    categoryData.forEach((article) => {
      if (!excludeIds.has(article.id)) {
        articlePool.set(article.id, article)
      }
    })

    const uniqueArticles = Array.from(articlePool.values())
    return uniqueArticles.sort(() => Math.random() - 0.5)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      // For now, we'll only handle news content since other content types need different fetch functions
      if (params.contentType !== "news") {
        notFound()
        return
      }

      const contentData = await fetchArticle(params.slug)
      if (!contentData) {
        notFound()
        return
      }

      setContentItem(contentData)
      setLastFetchTime(new Date())

      const initialExcludeIds = new Set([contentData.id])
      setShownArticleIds(initialExcludeIds)

      const [categoryNewsData, breakingNewsData, trendingNewsData] = await Promise.all([
        fetchNewsByCategory(contentData.category, 20),
        fetchBreakingNews(3),
        fetchTrendingNews(8),
      ])

      const uniqueArticles = createUniqueArticlePool(categoryNewsData, initialExcludeIds)
      setAvailableArticles(uniqueArticles)

      const initialArticles = uniqueArticles.slice(0, articlesPerPage)
      setRelatedContent(initialArticles)
      setCurrentIndex(articlesPerPage)

      const newShownIds = new Set(initialExcludeIds)
      initialArticles.forEach((article) => newShownIds.add(article.id))
      setShownArticleIds(newShownIds)

      setBreakingNews(breakingNewsData)
      setTrendingNews(trendingNewsData)
      setHasReachedEnd(uniqueArticles.length <= articlesPerPage)
    }

    fetchData()
  }, [params.slug, params.contentType, createUniqueArticlePool])

  const loadMoreArticles = useCallback(async () => {
    if (isLoadingMore || hasReachedEnd || !contentItem || params.contentType !== "news") return

    setIsLoadingMore(true)
    try {
      if (currentIndex < availableArticles.length) {
        const nextArticles = availableArticles.slice(currentIndex, currentIndex + articlesPerPage)
        if (nextArticles.length > 0) {
          setRelatedContent((prev) => [...prev, ...nextArticles])
          setCurrentIndex((prev) => prev + articlesPerPage)
          const newShownIds = new Set(shownArticleIds)
          nextArticles.forEach((article) => newShownIds.add(article.id))
          setShownArticleIds(newShownIds)
          setIsLoadingMore(false)
          return
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const categoryNewsData = await fetchNewsByCategory(contentItem.category, 30)
      const newUniqueArticles = createUniqueArticlePool(categoryNewsData, shownArticleIds)

      if (newUniqueArticles.length === 0) {
        setHasReachedEnd(true)
        setIsLoadingMore(false)
        return
      }

      setAvailableArticles((prev) => [...prev, ...newUniqueArticles])
      const nextArticles = newUniqueArticles.slice(0, articlesPerPage)
      setRelatedContent((prev) => [...prev, ...nextArticles])

      const newShownIds = new Set(shownArticleIds)
      nextArticles.forEach((article) => newShownIds.add(article.id))
      setShownArticleIds(newShownIds)
      setCurrentIndex(availableArticles.length + nextArticles.length)

      if (nextArticles.length < articlesPerPage) {
        setHasReachedEnd(true)
      }
    } catch (error) {
      console.error("Error loading more articles:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [
    isLoadingMore,
    hasReachedEnd,
    contentItem,
    currentIndex,
    availableArticles,
    shownArticleIds,
    createUniqueArticlePool,
    params.contentType,
  ])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isLoadingMore && !hasReachedEnd) {
          loadMoreArticles()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current)
      }
    }
  }, [loadMoreArticles, isLoadingMore, hasReachedEnd])

  const handleRefreshFeed = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setHasNewUpdates(false)
    setCurrentIndex(0)
    setHasReachedEnd(false)
    setShownArticleIds(new Set([contentItem?.id || ""]))
    setAvailableArticles([])
    setRelatedContent([])
    setLastFetchTime(new Date())
    window.location.reload()
  }

  if (!contentItem) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  const getTimeAgo = (item: ContentItem) => {
    const date = isNewsItem(item) ? item.publishedAt : item.createdAt
    if (!date) return "Recently"
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch (error) {
      return "Recently"
    }
  }

  const SaveUrlButton = ({ item, size = "sm" }: { item: ContentItem; size?: "sm" | "default" }) => {
    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleCopyUrl = useCallback(async () => {
      setIsLoading(true)
      try {
        const contentUrl = `${typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/${params.contentType}/${item.slug}`

        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(contentUrl)
        } else {
          const textArea = document.createElement("textarea")
          textArea.value = contentUrl
          textArea.style.position = "fixed"
          textArea.style.left = "-999999px"
          textArea.style.top = "-999999px"
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
        }

        setIsCopied(true)
        const toast = document.createElement("div")
        toast.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2"
        toast.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          URL copied to clipboard!
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast)
          }
        }, 3000)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      } catch (error) {
        console.error("Error copying URL:", error)
      } finally {
        setIsLoading(false)
      }
    }, [item])

    return (
      <Button
        onClick={handleCopyUrl}
        variant="outline"
        size={size}
        disabled={isLoading}
        className={`gap-1 transition-all duration-200 ${
          isCopied
            ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
            : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy URL"}</span>
      </Button>
    )
  }

  const ContentMetadata = ({ item, isMainContent = false }: { item: ContentItem; isMainContent?: boolean }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMainContent ? "mb-6" : "mb-4"}`}>
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <Avatar className={isMainContent ? "h-10 w-10" : "h-8 w-8"}>
          <AvatarImage
            src={
              item.authorProfileImage ||
              `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(item.authorName || "Author")}`
            }
            alt={item.authorName || "Author"}
          />
          <AvatarFallback>{item.authorName?.charAt(0) || "A"}</AvatarFallback>
        </Avatar>
        <div>
          <p className={`${isMainContent ? "font-semibold text-base" : "font-medium text-sm"}`}>
            {item.authorName}
            <span className="hidden sm:inline-block mx-2 text-slate-400">•</span>
            <span className="sm:hidden block text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-x-2 flex-wrap">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{getTimeAgo(item)}</span>
                </span>
                {isNewsItem(item) && item.publishedAt && <span>({formatDate(item.publishedAt)})</span>}
                {isNewsItem(item) && item.location && (
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{item.location}</span>
                  </span>
                )}
                {isNewsItem(item) && item.readTime && <span>{item.readTime} min read</span>}
              </span>
            </span>
          </p>
          <div className="hidden sm:flex items-center text-xs text-slate-500 gap-x-3">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{getTimeAgo(item)}</span>
            </div>
            {isNewsItem(item) && item.publishedAt && <span>({formatDate(item.publishedAt)})</span>}
            {isNewsItem(item) && item.location && (
              <div className="flex items-center">
                <span className="mx-1">•</span>
                <MapPin className="h-3 w-3 mr-1" />
                <span>{item.location}</span>
              </div>
            )}
            {isNewsItem(item) && item.readTime && (
              <div className="flex items-center">
                <span className="mx-1">•</span>
                <span>{item.readTime} min read</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 sm:mt-0">
        <SaveUrlButton item={item} size={isMainContent ? "default" : "sm"} />
      </div>
    </div>
  )

  const ContentBadges = ({ item }: { item: ContentItem }) => (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <Badge variant="outline" className="bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200">
        {item.category}
      </Badge>
      {isNewsItem(item) && item.isTrending && (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">
          TRENDING
        </Badge>
      )}
      {isNewsItem(item) && item.isBreaking && (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 animate-pulse">
          BREAKING
        </Badge>
      )}
      {isNFTItem(item) && item.isLive && (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 animate-pulse"
        >
          LIVE
        </Badge>
      )}
      {(isAirdropItem(item) || isDeFiItem(item)) && item.isActive && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
          ACTIVE
        </Badge>
      )}
      {(isAirdropItem(item) || isNFTItem(item) || isDeFiItem(item) || isListingItem(item)) && item.isVerified && (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">
          VERIFIED
        </Badge>
      )}
      {isListingItem(item) && item.isNew && (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
          NEW
        </Badge>
      )}
      {item.isFeatured && (
        <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
          FEATURED
        </Badge>
      )}
    </div>
  )

  const ShareButtons = ({ item }: { item: ContentItem }) => {
    const [isCopied, setIsCopied] = useState(false)
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"
    const contentUrl = `${baseUrl}/${params.contentType}/${item.slug}`
    const encodedUrl = encodeURIComponent(contentUrl)
    const title = isNewsItem(item) ? item.title : item.name
    const description = isNewsItem(item) ? item.excerpt : item.description
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description || title)

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=cryptoflownews`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      email: `mailto:?subject=${encodedTitle}&body=I thought you might find this ${params.contentType} interesting:%0A%0A${encodedTitle}%0A%0A${encodedDescription}%0A%0ARead more: ${encodedUrl}`,
    }

    const handleCopyLink = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(contentUrl)
        } else {
          const textArea = document.createElement("textarea")
          textArea.value = contentUrl
          textArea.style.position = "fixed"
          textArea.style.left = "-999999px"
          textArea.style.top = "-999999px"
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
        }
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy link:", error)
      }
    }

    return (
      <div className="flex items-center gap-2 mb-6 border-y border-slate-700/20 py-3">
        <span className="text-sm font-medium text-slate-300 mr-2">Share:</span>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
        >
          <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 bg-sky-500 text-white hover:bg-sky-600 border-sky-500"
        >
          <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 bg-blue-800 text-white hover:bg-blue-900 border-blue-800"
        >
          <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Linkedin className="h-3 w-3" />
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 bg-slate-600 text-white hover:bg-slate-700 border-slate-600"
        >
          <a href={shareUrls.email} target="_blank" rel="noopener noreferrer" aria-label="Share via Email">
            <Mail className="h-4 w-4" />
          </a>
        </Button>
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="icon"
          className={`rounded-full h-8 w-8 transition-colors ${
            isCopied
              ? "bg-green-600 text-white border-green-600"
              : "bg-slate-700 text-slate-200 hover:bg-slate-600 border-slate-600"
          }`}
          aria-label="Copy link"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  const CryptoLinks = ({ item }: { item: ContentItem }) => {
    if (!hasSocialLinks(item)) return null

    const hasAnyLinks = item.website || item.twitter || item.discord

    if (!hasAnyLinks) return null

    return (
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Globe className="h-5 w-5 text-cyan-400" />
          Links & Resources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {item.website && (
            <Button
              asChild
              variant="outline"
              className="justify-start bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
            >
              <a href={item.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Website
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          )}
          {item.twitter && (
            <Button
              asChild
              variant="outline"
              className="justify-start bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
            >
              <a
                href={
                  item.twitter.startsWith("http")
                    ? item.twitter
                    : `https://twitter.com/${item.twitter.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          )}
          {item.discord && (
            <Button
              asChild
              variant="outline"
              className="justify-start bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
            >
              <a href={item.discord} target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Discord
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          )}
        </div>
      </div>
    )
  }

  const CryptoDetails = ({ item }: { item: ContentItem }) => {
    const details: { label: string; value: string }[] = []

    if (isNFTItem(item)) {
      if (item.mintPrice) details.push({ label: "Mint Price", value: item.mintPrice })
      if (item.totalSupply) details.push({ label: "Total Supply", value: item.totalSupply })
      if (item.mintDate) details.push({ label: "Mint Date", value: item.mintDate })
    }

    if (isDeFiItem(item)) {
      if (item.tvl) details.push({ label: "TVL", value: item.tvl })
      if (item.apy) details.push({ label: "APY", value: item.apy })
      if (item.blockchain) details.push({ label: "Blockchain", value: item.blockchain })
    }

    if (isListingItem(item)) {
      if (item.exchange) details.push({ label: "Exchange", value: item.exchange })
      if (item.price) details.push({ label: "Price", value: item.price })
      if (item.marketCap) details.push({ label: "Market Cap", value: item.marketCap })
      if (item.listingDate) details.push({ label: "Listing Date", value: item.listingDate })
    }

    if (isAirdropItem(item)) {
      if (item.totalValue) details.push({ label: "Total Value", value: item.totalValue })
      if (item.endDate) details.push({ label: "End Date", value: item.endDate })
    }

    if (details.length === 0) return null

    return (
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-slate-200 mb-3">Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-3 bg-slate-700/30 rounded-lg">
              <span className="text-slate-400 text-sm">{detail.label}:</span>
              <span className="text-slate-200 font-medium">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const FullContentDisplay = ({ item, isMainContent = false }: { item: ContentItem; isMainContent?: boolean }) => {
    const title = isNewsItem(item) ? item.title : item.name
    const description = isNewsItem(item) ? item.excerpt : item.description
    const content = isNewsItem(item) ? item.content : item.description

    const truncateContent = (content: string, maxLines = 7) => {
      if (!content) return ""
      const words = content.split(" ")
      const wordsPerLine = 12
      const maxWords = maxLines * wordsPerLine
      if (words.length <= maxWords) return content
      return words.slice(0, maxWords).join(" ") + "..."
    }

    const isExpanded = isMainContent ? showFullMainContent : expandedArticles.has(item.id)
    const shouldShowTruncated = !isExpanded
    const displayContent = shouldShowTruncated ? truncateContent(content || "", 7) : content
    const hasMoreContent = (content || "").split(" ").length > 84

    const toggleExpanded = () => {
      if (isMainContent) {
        setShowFullMainContent(!showFullMainContent)
      } else {
        const newExpanded = new Set(expandedArticles)
        if (newExpanded.has(item.id)) {
          newExpanded.delete(item.id)
        } else {
          newExpanded.add(item.id)
        }
        setExpandedArticles(newExpanded)
      }
    }

    return (
      <div
        className={`${isMainContent ? "mb-0" : "mb-0"} p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm ${
          isMainContent ? "rounded-2xl shadow-2xl border border-slate-800/50" : "rounded-xl border border-slate-800/30"
        }`}
      >
        <ContentBadges item={item} />
        <h1
          className={`${
            isMainContent ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl" : "text-xl sm:text-2xl md:text-3xl"
          } font-extrabold mb-4 leading-tight text-slate-100`}
        >
          {title}
        </h1>
        <p
          className={`${isMainContent ? "text-lg sm:text-xl md:text-2xl" : "text-base sm:text-lg"} text-slate-300 font-semibold mb-6`}
        >
          {description}
        </p>
        <ContentMetadata item={item} isMainContent={isMainContent} />
        <ShareButtons item={item} />

        <div
          className={`relative ${isMainContent ? "h-[250px] sm:h-[300px] md:h-[500px]" : "h-[180px] sm:h-[200px] md:h-[350px]"} overflow-hidden mb-6 rounded-xl`}
        >
          <Image
            src={item.image || "/placeholder.svg?height=800&width=1200&query=crypto"}
            alt={title}
            fill
            className="object-cover"
            priority={isMainContent}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {isMainContent && (
          <>
            <CryptoLinks item={item} />
            <CryptoDetails item={item} />
          </>
        )}

        {!isMainContent && (
          <div className="bg-slate-800/30 text-center py-4 mb-4 text-slate-500 text-sm rounded-lg">ADVERTISEMENT</div>
        )}

        <div className="prose max-w-none mb-8">
          <p
            className={`${isMainContent ? "text-base sm:text-lg" : "text-sm sm:text-base"} mb-4 font-medium text-slate-300`}
          >
            {description}
          </p>
          <div className="text-slate-200" dangerouslySetInnerHTML={{ __html: displayContent || "" }} />
          {hasMoreContent && (
            <div className="mt-4">
              <Button
                onClick={toggleExpanded}
                variant="ghost"
                className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-semibold"
              >
                {isExpanded ? "See less" : "See more"}
              </Button>
            </div>
          )}
        </div>

        {isAirdropItem(item) && item.requirements && (
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Requirements</h3>
            <div className="text-slate-300" dangerouslySetInnerHTML={{ __html: item.requirements }} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />

      {hasNewUpdates && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <Button
            onClick={handleRefreshFeed}
            className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg rounded-full px-6 py-3 flex items-center gap-2"
          >
            <ArrowUp className="h-4 w-4" />
            New updates available
          </Button>
        </div>
      )}

      <div className="container mx-auto py-4 px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <FullContentDisplay item={contentItem} isMainContent={true} />

            <div className="bg-slate-800/30 text-center py-6 mb-6 text-slate-500 rounded-xl">ADVERTISEMENT</div>

            {relatedContent.length > 0 && params.contentType === "news" && (
              <div className="space-y-0">
                {relatedContent.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && (
                      <div className="my-8">
                        <Separator className="bg-slate-700" />
                      </div>
                    )}
                    <FullContentDisplay item={item} isMainContent={false} />
                  </div>
                ))}
              </div>
            )}

            <div ref={loadingRef} className="py-8">
              {isLoadingMore && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  <p className="text-slate-400 font-medium">Loading more content...</p>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {hasReachedEnd && !isLoadingMore && (
              <div className="py-12 text-center">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border-2 border-dashed border-slate-700">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-slate-200 mb-2">You're all caught up!</h3>
                  <p className="text-slate-400 mb-4">You've explored all the latest content in this category.</p>
                  <p className="text-sm text-slate-500">
                    Check back later for more updates, or explore other crypto categories.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      variant="outline"
                      className="mr-3 border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Back to Top
                    </Button>
                    <Button onClick={() => (window.location.href = "/")} className="bg-cyan-600 hover:bg-cyan-700">
                      Explore More
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-5 space-y-6 sticky top-4 self-start max-h-screen overflow-y-auto">
            <TrendingSidebar trendingNews={trendingNews} title="🔥 Trending Now" />

            {breakingNews.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                  <h3 className="text-lg font-bold text-white">🚨 Breaking News</h3>
                </div>
                <div className="p-4 space-y-4">
                  {breakingNews.map((item) => (
                    <Link href={`/news/${item.slug}`} key={item.id} className="flex gap-3 group">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=80&width=80&query=crypto news"}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-400 cursor-pointer mb-2 text-slate-200">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">{getTimeAgo(item)}</p>
                          <SaveUrlButton item={item} size="sm" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-800/30 h-[250px] flex items-center justify-center text-slate-500 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm">Advertisement</p>
                <p className="text-xs mt-1">250x250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
