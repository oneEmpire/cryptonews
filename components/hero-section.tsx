import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, TrendingUp, Zap } from "lucide-react"
import type { NewsItem } from "@/lib/types"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface HeroSectionProps {
  news: NewsItem[]
}

export function HeroSection({ news }: HeroSectionProps) {
  const mainNews = news[0]
  const sideNews = news.slice(1, 4)

  if (!mainNews) return null

  const rawDate = mainNews.publishedAt || mainNews.createdAt || ""
  const isoDate = typeof rawDate === "string" ? rawDate.replace(" ", "T") : ""
  const mainTimeAgo = !isNaN(new Date(isoDate).getTime())
    ? formatDistanceToNow(new Date(isoDate), { addSuffix: true })
    : "Unknown"

  return (
    <section className="py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Story */}
        <div className="lg:col-span-2">
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
            <div className="relative h-[500px] overflow-hidden">
              <Link href={`/news/${mainNews.slug}`}>
                <Image
                  src={mainNews.image || "/placeholder.svg?height=500&width=800&query=crypto news hero"}
                  alt={mainNews.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent" />

                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 text-sm font-bold border-0 shadow-lg">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {mainNews.category}
                    </Badge>
                    {mainNews.isBreaking && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 animate-pulse px-4 py-2 text-sm font-bold border-0 shadow-lg">
                        <Zap className="h-3 w-3 mr-1" />
                        BREAKING
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white drop-shadow-2xl bg-gradient-to-r from-white to-slate-200 bg-clip-text">
                    {mainNews.title}
                  </h1>
                  <p className="text-slate-200 mb-6 line-clamp-2 text-lg leading-relaxed drop-shadow-lg">
                    {mainNews.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-slate-300">
                    <span className="font-medium bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      By {mainNews.authorName}
                    </span>
                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Clock className="h-4 w-4" />
                      <span>{mainTimeAgo}</span>
                    </div>
                    {mainNews.location && (
                      <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{mainNews.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Side Stories */}
        <div className="flex flex-col gap-6">
          {sideNews.map((item, index) => {
            const rawDate = item.publishedAt || item.createdAt || ""
            const isoDate = typeof rawDate === "string" ? rawDate.replace(" ", "T") : ""
            const timeAgo = !isNaN(new Date(isoDate).getTime())
              ? formatDistanceToNow(new Date(isoDate), { addSuffix: true })
              : "Unknown"

            return (
              <Link href={`/news/${item.slug}`} key={item.id}>
                <div className="flex gap-4 group bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-800/50">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700">
                    <Image
                      src={item.image || "/placeholder.svg?height=96&width=128&query=crypto news thumbnail"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
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
                    <h3 className="text-sm font-semibold group-hover:text-cyan-400 leading-tight line-clamp-2 mb-2 text-slate-200 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
