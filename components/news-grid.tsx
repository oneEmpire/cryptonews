import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, MapPin, Zap, Star, Eye } from "lucide-react"
import type { NewsItem } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NewsGridProps {
  news: NewsItem[]
  columns?: 2 | 3 | 4
  showExcerpt?: boolean
  showAuthor?: boolean
}

export function NewsGrid({ news, columns = 3, showExcerpt = true, showAuthor = true }: NewsGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6 lg:gap-8`}>
      {news.map((item, index) => {
        const dateToUse = item.publishedAt || item.createdAt
        const isoDate = dateToUse?.replace(" ", "T")
        const validDate = new Date(isoDate)
        const timeAgo = !isNaN(validDate.getTime()) ? formatDistanceToNow(validDate, { addSuffix: true }) : "Unknown"

        return (
          <article
            key={item.id}
            className="group bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-800/50 relative h-full flex flex-col"
          >
            {/* Glowing effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl" />

            <Link href={`/news/${item.slug}`} className="flex flex-col h-full">
              {/* Image Container */}
              <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg?height=200&width=400&query=news"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-4rem)]">
                  <Badge className="bg-slate-800/95 text-cyan-400 backdrop-blur-sm border border-slate-700 hover:bg-slate-700 text-xs px-2 py-1">
                    <TrendingUp className="h-2.5 w-2.5 mr-1" />
                    <span className="truncate">{item.category}</span>
                  </Badge>
                  {item.isBreaking && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 animate-pulse border-0 text-xs px-2 py-1">
                      <Zap className="h-2.5 w-2.5 mr-1" />
                      LIVE
                    </Badge>
                  )}
                  {item.isFeatured && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-xs px-2 py-1">
                      <Star className="h-2.5 w-2.5 mr-1" />
                      HOT
                    </Badge>
                  )}
                </div>

                {/* Ranking Badge */}
                {index < 3 && (
                  <div className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg border-2 border-white/20">
                    {index + 1}
                  </div>
                )}

                {/* Reading indicator */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-slate-300">
                  <Eye className="h-3 w-3" />
                  <span className="font-mono">2 min</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4 sm:p-5 lg:p-6 relative z-10 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight text-slate-100">
                  {item.title}
                </h3>

                {/* Excerpt */}
                {showExcerpt && (
                  <p className="text-slate-400 text-sm line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 leading-relaxed flex-1">
                    {item.excerpt}
                  </p>
                )}

                {/* Author Section */}
                {showAuthor && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700/50">
                    <Avatar className="h-6 w-6 border border-slate-700">
                      <AvatarImage
                        src={
                          item.authorProfileImage ||
                          `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                            item.authorName || "Author",
                          )}&backgroundColor=0f172a&textColor=06b6d4`
                        }
                      />
                      <AvatarFallback className="text-xs bg-slate-800 text-cyan-400 border border-slate-700">
                        {item.authorName?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-300 text-xs truncate block">
                        {item.authorName || "Anonymous"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                  <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{timeAgo}</span>
                  </div>

                  {item.location && (
                    <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-full max-w-[120px]">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="font-mono truncate text-xs">{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Hover Action Indicator */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                </div>
              </div>
            </Link>
          </article>
        )
      })}
    </div>
  )
}
