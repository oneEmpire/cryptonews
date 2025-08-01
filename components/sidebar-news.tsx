import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"
import { fetchTrendingNews, fetchNewsByCategory } from "@/lib/news-server"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export async function SidebarNews() {
  const trendingNews = await fetchTrendingNews(5)
  const quickReads = await fetchNewsByCategory("Quick Read", 4)

  return (
    <aside className="space-y-8">
      {/* Trending Now */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-red-600" />
          <h3 className="font-bold text-lg">Trending Now</h3>
        </div>
        <div className="space-y-4">
          {trendingNews.map((item, index) => {
            const dateToUse = item.publishedAt || item.createdAt
            const validDate = new Date(dateToUse)
            const timeAgo = !isNaN(validDate.getTime())
              ? formatDistanceToNow(validDate, { addSuffix: true })
              : "Unknown"

            return (
              <Link href={`/news/${item.slug}`} key={item.id}>
                <div className="group cursor-pointer">
                  <div className="flex gap-3">
                    <span className="text-2xl font-bold text-red-600 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-sm leading-tight mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Reads */}
      <div>
        <h3 className="font-bold text-lg mb-4">Quick Reads</h3>
        <div className="space-y-4">
          {quickReads.map((item) => {
            const dateToUse = item.publishedAt || item.createdAt
          const isoDate = dateToUse?.replace(" ", "T")
          const validDate = new Date(isoDate)
          const timeAgo = !isNaN(validDate.getTime())
            ? formatDistanceToNow(validDate, { addSuffix: true })
            : "Unknown"

            return (
              <Link href={`/news/${item.slug}`} key={item.id}>
                <div className="group cursor-pointer">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="text-xs mb-1">
                        {item.category}
                      </Badge>
                      <h4 className="font-medium text-sm leading-tight mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

  
    </aside>
  )
}
