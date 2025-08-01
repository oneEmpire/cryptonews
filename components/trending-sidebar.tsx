import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Zap, FlameIcon as Fire } from "lucide-react"
import type { NewsItem } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface TrendingSidebarProps {
  trendingNews: NewsItem[]
  title?: string
}

export function TrendingSidebar({ trendingNews, title = "🔥 Trending Now" }: TrendingSidebarProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 overflow-hidden relative">
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-50" />

      <div className="relative z-10">
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-4 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />

          <div className="flex items-center gap-2 text-white relative z-10">
            <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
            <Fire className="h-4 w-4 text-orange-300 animate-pulse" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {trendingNews.map((item, index) => {
            const dateToUse = item.publishedAt || item.createdAt
            const isoDate = dateToUse?.replace(" ", "T")
            const validDate = new Date(isoDate)
            const timeAgo = !isNaN(validDate.getTime())
              ? formatDistanceToNow(validDate, { addSuffix: true })
              : "Unknown"

            return (
              <div
                key={item.id}
                className="flex gap-3 group hover:bg-slate-800/50 p-3 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-700/50 relative"
              >
                {/* Ranking number with gradient */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg relative">
                  {index + 1}
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/news/${item.slug}`}>
                    <h4 className="font-semibold text-sm group-hover:text-cyan-400 cursor-pointer mb-2 line-clamp-2 leading-tight text-slate-200 transition-colors">
                      {item.title}
                    </h4>
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      <span>{timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-slate-800 text-cyan-400 border border-slate-700 hover:bg-slate-700">
                      {item.category}
                    </Badge>
                    {item.isBreaking && (
                      <Badge className="text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse border-0">
                        <Zap className="h-2 w-2 mr-1" />
                        LIVE
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )
          })}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
