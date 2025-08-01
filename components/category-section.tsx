import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Zap, ArrowUpRight } from "lucide-react"
import type { NewsItem } from "@/lib/types"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface CategorySectionProps {
  title: string
  subtitle?: string
  news: NewsItem[]
  layout?: "grid" | "horizontal"
}

export function CategorySection({ title, subtitle, news, layout = "grid" }: CategorySectionProps) {
  if (news.length === 0) return null

  return (
    <section className="py-8 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                {title}
              </h2>
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
            </div>
            {subtitle && <p className="text-slate-400 text-sm sm:text-base ml-4 sm:ml-7 font-mono">{subtitle}</p>}
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-500 self-start sm:self-center" />
        </div>

        {/* Content Grid */}
        {layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <div key={item.id} className={index === 0 ? "md:col-span-2 xl:col-span-2" : ""}>
                <NewsCard news={item} large={index === 0} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {news.map((item) => (
              <HorizontalNewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function NewsCard({ news, large = false }: { news: NewsItem; large?: boolean }) {
  const timeAgo =
    news.publishedAt && !isNaN(new Date(news.publishedAt).getTime())
      ? formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })
      : "Unknown"

  return (
    <Link href={`/news/${news.slug}`}>
      <article className="group cursor-pointer relative h-full">
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800/50 group-hover:border-cyan-500/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl h-full flex flex-col">
          {/* IMAGE */}
          <div className={`relative ${large ? "h-64 sm:h-80" : "h-48"} overflow-hidden flex-shrink-0`}>
            <Image
              src={news.image || "/placeholder.svg?height=320&width=600&query=news"}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <Badge className="bg-slate-800/90 text-cyan-400 backdrop-blur-sm border border-slate-700 hover:bg-slate-700 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {news.category}
              </Badge>
              {news.isBreaking && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 animate-pulse border-0 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              )}
            </div>
          </div>

          {/* TEXT */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <h3
              className={`font-bold ${
                large ? "text-xl sm:text-2xl leading-tight mb-3 sm:mb-4" : "text-lg mb-3"
              } group-hover:text-cyan-400 transition-colors text-slate-100 line-clamp-3`}
            >
              {news.title}
            </h3>

            <p
              className={`text-slate-400 ${
                large ? "text-sm sm:text-base mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-4" : "text-sm mb-4 line-clamp-2"
              } leading-relaxed flex-1`}
            >
              {news.excerpt}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
              <div className="flex items-center gap-2 bg-slate-800/50 px-2 sm:px-3 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                <span className="font-mono">{timeAgo}</span>
              </div>
              {news.location && (
                <span className="bg-slate-800/50 px-2 sm:px-3 py-1 rounded-full font-mono text-xs truncate max-w-[120px]">
                  {news.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

function HorizontalNewsCard({ news }: { news: NewsItem }) {
  const timeAgo =
    news.publishedAt && !isNaN(new Date(news.publishedAt).getTime())
      ? formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })
      : "Unknown"

  return (
    <Link href={`/news/${news.slug}`}>
      <article className="group cursor-pointer relative">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-800/50 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex gap-4 relative z-10">
            {/* Image */}
            <div className="relative w-24 h-20 sm:w-32 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700">
              <Image
                src={news.image || "/placeholder.svg?height=96&width=128&query=news thumbnail"}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="text-xs bg-slate-800 text-cyan-400 border border-slate-700 hover:bg-slate-700">
                  {news.category}
                </Badge>
                {news.isBreaking && (
                  <Badge className="text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse border-0">
                    <Zap className="h-2 w-2 mr-1" />
                    LIVE
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm sm:text-base leading-tight mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2 text-slate-200">
                {news.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono">{timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
