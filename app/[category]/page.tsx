import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { CategorySection } from "@/components/category-section"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { NewsGrid } from "@/components/news-grid"
import { fetchNewsByCategory, fetchTrendingNews } from "@/lib/news-server"
import { ErrorBoundary } from "@/components/error-boundary"
import { NewsletterSidebar } from "@/components/newsletter-sidebar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, BarChart3, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Map URL slugs to actual database category names
const categoryMap: Record<string, string> = {
  "new-listings": "New Listings",
  airdrops: "Airdrops",
  defi: "DeFi",
  nfts: "NFTs",
  analysis: "Analysis",
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  altcoins: "Altcoins",
  trading: "Trading",
  blockchain: "Blockchain",
}

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  "New Listings": "Latest cryptocurrency token listings, ICOs, and new project launches across major exchanges.",
  Airdrops: "Free cryptocurrency airdrops, token distributions, and reward opportunities for the crypto community.",
  DeFi: "Decentralized Finance protocols, yield farming opportunities, and DeFi ecosystem developments.",
  NFTs: "Non-Fungible Token collections, marketplace updates, and digital art trends in the crypto space.",
  Analysis: "Technical analysis, market insights, and expert commentary on cryptocurrency trends and price movements.",
  Bitcoin: "Bitcoin network updates, institutional adoption, and BTC market analysis and price predictions.",
  Ethereum: "Ethereum ecosystem news, smart contract developments, and ETH network upgrades and improvements.",
  Altcoins: "Alternative cryptocurrency projects, emerging tokens, and altcoin market analysis and opportunities.",
  Trading: "Cryptocurrency trading strategies, market analysis, and trading platform updates and reviews.",
  Blockchain: "Blockchain technology developments, enterprise adoption, and distributed ledger innovations.",
}

// Category icons
const categoryIcons: Record<string, any> = {
  "New Listings": Zap,
  Airdrops: TrendingUp,
  DeFi: BarChart3,
  NFTs: TrendingUp,
  Analysis: BarChart3,
  Bitcoin: TrendingUp,
  Ethereum: Zap,
  Altcoins: TrendingUp,
  Trading: BarChart3,
  Blockchain: TrendingUp,
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryName = categoryMap[params.category]
  if (!categoryName) {
    return {
      title: "Category Not Found - CryptoFlow",
    }
  }
  return {
    title: `${categoryName} News - CryptoFlow`,
    description:
      categoryDescriptions[categoryName] ||
      `Latest ${categoryName.toLowerCase()} news and updates from the crypto world.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = categoryMap[params.category]
  if (!categoryName) {
    notFound()
  }

  // Fetch data in parallel
  const [categoryNews, trendingNews] = await Promise.all([fetchNewsByCategory(categoryName, 20), fetchTrendingNews(8)])

  const featuredCategoryNews = categoryNews.slice(0, 3)
  const remainingCategoryNews = categoryNews.slice(3)

  // Get related categories (other database categories)
  const allDbCategories = ["New Listings", "Airdrops", "DeFi", "NFTs", "Analysis", "Bitcoin"]
  const relatedCategories = allDbCategories.filter((cat) => cat !== categoryName).slice(0, 2)
  const relatedNews1 = relatedCategories[0] ? await fetchNewsByCategory(relatedCategories[0], 3) : []
  const relatedNews2 = relatedCategories[1] ? await fetchNewsByCategory(relatedCategories[1], 3) : []

  const CategoryIcon = categoryIcons[categoryName] || TrendingUp

  if (categoryNews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="text-center py-16">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CategoryIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
                {categoryName}
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <AlertTriangle className="h-5 w-5 text-slate-500" />
                <p className="text-slate-400">No news articles found in this category yet.</p>
              </div>
              <p className="text-sm text-slate-500">
                Looking for category "{categoryName}" (from slug "{params.category}")
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Category Header */}
        <div className="mb-8 sm:mb-12 relative">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 sm:p-8 relative overflow-hidden">
            {/* Header background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CategoryIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
                    {categoryName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-800/50 text-cyan-400 border border-slate-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {categoryNews.length} articles
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="font-mono">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-4xl">
                {categoryDescriptions[categoryName]}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8 sm:space-y-12">
            {/* Featured Articles in Category */}
            {featuredCategoryNews.length > 0 && (
              <ErrorBoundary>
                <section className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                      Featured {categoryName}
                    </h2>
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                  </div>
                  <NewsGrid news={featuredCategoryNews} columns={3} />
                </section>
              </ErrorBoundary>
            )}

            {/* All Articles in Category */}
            {remainingCategoryNews.length > 0 && (
              <ErrorBoundary>
                <section className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                      Latest {categoryName}
                    </h2>
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                  </div>
                  <NewsGrid news={remainingCategoryNews} columns={3} />
                </section>
              </ErrorBoundary>
            )}

            {/* Related Categories */}
            {relatedNews1.length > 0 && (
              <ErrorBoundary>
                <CategorySection
                  title={`Related: ${relatedCategories[0]}`}
                  subtitle="Discover more crypto insights"
                  news={relatedNews1}
                  layout="horizontal"
                />
              </ErrorBoundary>
            )}

            {relatedNews2.length > 0 && (
              <ErrorBoundary>
                <CategorySection
                  title={`Related: ${relatedCategories[1]}`}
                  subtitle="Expand your crypto knowledge"
                  news={relatedNews2}
                  layout="horizontal"
                />
              </ErrorBoundary>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Sidebar */}
            <ErrorBoundary>
              {trendingNews.length > 0 ? (
                <TrendingSidebar trendingNews={trendingNews} title="🔥 Trending in Crypto" />
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-slate-200">🔥 Trending in Crypto</h3>
                    </div>
                    <p className="text-sm text-slate-400">No trending news available.</p>
                  </div>
                </div>
              )}
            </ErrorBoundary>

            {/* Newsletter Signup */}
            <ErrorBoundary>
              <NewsletterSidebar />
            </ErrorBoundary>

            {/* Advertisement */}
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
