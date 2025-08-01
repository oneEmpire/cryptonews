"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { searchNews, fetchTrendingNews } from "@/lib/news-client"
import type { NewsItem } from "@/lib/types"
import { NewsGrid } from "@/components/news-grid"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = useState<NewsItem[]>([])
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        performSearch(query)
      }
      // Always fetch trending news for sidebar
      const trending = await fetchTrendingNews(8)
      setTrendingNews(trending)
    }
    fetchData()
  }, [query])

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      const results = await searchNews(searchTerm, 20, 1)
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Search Content */}
      <div className="lg:col-span-3 space-y-8">
        {/* Search Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Health News</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <Input
              type="search"
              placeholder="Search for health news, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        )}

        {hasSearched && !loading && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchResults.length > 0
                  ? `Found ${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${query}"`
                  : `No results found for "${query}"`}
              </h2>
              {searchResults.length === 0 && (
                <div className="mt-4 text-gray-600">
                  <p>Try searching for:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Different keywords or phrases</li>
                    <li>Health topics like "diabetes", "nutrition", "vaccines"</li>
                    <li>Medical conditions or treatments</li>
                    <li>Country names like "Nigeria", "Ghana", "USA"</li>
                  </ul>
                </div>
              )}
            </div>

            {searchResults.length > 0 && <NewsGrid news={searchResults} columns={3} />}
          </div>
        )}

        {!hasSearched && !query && (
          <div className="text-center py-12">
            <p className="text-gray-600">Enter a search term to find health news articles</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Trending Sidebar */}
        <TrendingSidebar trendingNews={trendingNews} title="🔥 Trending Searches" />

        {/* Search Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-3">💡 Search Tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Use specific medical terms</li>
            <li>• Try country or region names</li>
            <li>• Search for author names</li>
            <li>• Use quotation marks for exact phrases</li>
          </ul>
        </div>

        {/* Advertisement */}
        <div className="bg-gray-100 h-[300px] flex items-center justify-center text-gray-500 rounded-xl">
          <div className="text-center">
            <p className="text-sm">Advertisement</p>
          </div>
        </div>
      </div>
    </div>
  )
}
