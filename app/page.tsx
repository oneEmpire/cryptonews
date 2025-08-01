import { HeroSection } from "@/components/hero-section"
import { NewsGrid } from "@/components/news-grid"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { CategorySection } from "@/components/category-section"
import { Footer } from "@/components/footer"
import { NewsletterSidebar } from "@/components/newsletter-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { formatDistanceToNow } from "date-fns"
import { TrendingUp, Zap, AlertTriangle, BarChart3 } from "lucide-react"
import {
  fetchFeaturedNews,
  fetchLatestNews,
  fetchTrendingNews,
  fetchBreakingNews,
  fetchNewsByCategory,
} from "@/lib/news-server"

export default async function HomePage() {
  // Fetch all data in parallel with error handling - updated for crypto categories
  const [featuredNews, latestNews, trendingNews, breakingNews, defiNews, nftNews] = await Promise.allSettled([
    fetchFeaturedNews(4),
    fetchLatestNews(6, 1),
    fetchTrendingNews(8),
    fetchBreakingNews(4),
    fetchNewsByCategory("DeFi", 6), // Changed from Healthcare
    fetchNewsByCategory("NFTs", 6), // Changed from Research
  ])

  // Extract successful results or use empty arrays
  const featured = featuredNews.status === "fulfilled" ? featuredNews.value : []
  const latest = latestNews.status === "fulfilled" ? latestNews.value : []
  const trending = trendingNews.status === "fulfilled" ? trendingNews.value : []
  const breaking = breakingNews.status === "fulfilled" ? breakingNews.value : []
  const defi = defiNews.status === "fulfilled" ? defiNews.value : []
  const nft = nftNews.status === "fulfilled" ? nftNews.value : []

  // Log any failures
  if (featuredNews.status === "rejected") console.error("Featured news failed:", featuredNews.reason)
  if (latestNews.status === "rejected") console.error("Latest news failed:", latestNews.reason)
  if (trendingNews.status === "rejected") console.error("Trending news failed:", trendingNews.reason)
  if (breakingNews.status === "rejected") console.error("Breaking news failed:", breakingNews.reason)
  if (defiNews.status === "rejected") console.error("DeFi news failed:", defiNews.reason)
  if (nftNews.status === "rejected") console.error("NFT news failed:", nftNews.reason)

  // Process featured news with proper time formatting
  const processedFeatured = featured.map((item) => {
    const publishedDate = item.publishedAt ? new Date(item.publishedAt) : new Date(item.createdAt || Date.now())
    const validDate = !isNaN(publishedDate.getTime()) ? publishedDate : new Date()
    const timeAgo = formatDistanceToNow(validDate, { addSuffix: true })
    return {
      ...item,
      timeAgo,
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <ErrorBoundary>
          <HeroSection news={breaking} />
        </ErrorBoundary>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-12">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-12">
            {/* Latest News */}
            <ErrorBoundary>
              <section className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                      Latest Crypto News
                    </h3>
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-mono">LIVE</span>
                  </div>
                </div>
                {latest.length > 0 ? (
                  <NewsGrid news={latest} columns={3} />
                ) : (
                  <div className="text-center py-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50">
                    <AlertTriangle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No latest crypto news available at the moment.</p>
                    <p className="text-slate-500 text-sm mt-2">Check back soon for updates</p>
                  </div>
                )}
              </section>
            </ErrorBoundary>

            {/* DeFi Section */}
            {defi.length > 0 && (
              <ErrorBoundary>
                <CategorySection
                  title="🔥 DeFi Protocols"
                  subtitle="Decentralized Finance Updates & Yield Opportunities"
                  news={defi}
                  layout="grid"
                />
              </ErrorBoundary>
            )}

            {/* NFT Section */}
            {nft.length > 0 && (
              <ErrorBoundary>
                <CategorySection
                  title="🎨 NFT Collections"
                  subtitle="Latest Drops, Marketplace Trends & Digital Art"
                  news={nft}
                  layout="grid"
                />
              </ErrorBoundary>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Trending Sidebar */}
            <ErrorBoundary>
              {trending.length > 0 ? (
                <TrendingSidebar trendingNews={trending} title="🔥 Trending Now" />
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-slate-200">🔥 Trending Now</h3>
                    </div>
                    <p className="text-sm text-slate-400">No trending crypto news available.</p>
                  </div>
                </div>
              )}
            </ErrorBoundary>

            {/* Newsletter Signup */}
            <ErrorBoundary>
              <NewsletterSidebar />
            </ErrorBoundary>

            {/* Breaking News */}
            {processedFeatured.length > 0 && (
              <ErrorBoundary>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 overflow-hidden relative">
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl" />

                  <div className="relative z-10">
                    <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 p-4 relative overflow-hidden">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />

                      <div className="flex items-center gap-2 text-white relative z-10">
                        <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Zap className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold">🚨 Breaking News</h3>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {processedFeatured.map((item, index) => (
                        <div
                          key={item.id}
                          className="border-b border-slate-700/50 last:border-b-0 pb-3 last:pb-0 group hover:bg-slate-800/30 p-2 rounded-lg transition-all duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm group-hover:text-cyan-400 cursor-pointer mb-2 line-clamp-2 text-slate-200 transition-colors">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-1 h-1 bg-slate-500 rounded-full" />
                                <span className="font-mono">{item.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            )}

            {/* Market Data Widget */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 p-6 relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-bold text-slate-200">Market Overview</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ₿
                      </div>
                      <span className="text-slate-300 font-medium">Bitcoin</span>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-200 font-mono">$43,250</div>
                      <div className="text-green-400 text-xs font-mono">+2.4%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        Ξ
                      </div>
                      <span className="text-slate-300 font-medium">Ethereum</span>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-200 font-mono">$2,580</div>
                      <div className="text-red-400 text-xs font-mono">-1.2%</div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 font-mono">Last updated: 2 min ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advertisement Placeholder */}
            <div className="bg-slate-900/30 backdrop-blur-sm border-2 border-dashed border-slate-700 h-[300px] flex items-center justify-center text-slate-500 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-700/20" />
              <div className="text-center relative z-10">
                <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-mono">Crypto Advertisement</p>
                <p className="text-xs text-slate-600 mt-1">Premium placement available</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
