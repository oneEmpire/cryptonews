import { createClient } from "./supabase/server"
import type { NewsItem, AirdropItem, NFTItem, DeFiItem, ListingItem } from "./types"

function normalizeNewsItem(item: any): NewsItem {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    image: item.image,
    imageSource: item.imageSource,
    category: item.category,
    authorId: item.author_id,
    authorName: item.author_name,
    authorProfileImage: item.author_profile_image,
    authorRole: item.author_role,
    publishedAt: item.published_at,
    timeAgo: item.time_ago,
    location: item.location,
    tags: item.tags,
    isBreaking: item.is_breaking,
    isFeatured: item.is_featured,
    isTrending: item.is_trending,
    readTime: item.read_time,
    views: item.views,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

function normalizeAirdropItem(item: any): AirdropItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    category: item.category,
    authorId: item.author_id,
    authorName: item.author_name,
    authorProfileImage: item.author_profile_image,
    authorRole: item.author_role,
    website: item.website,
    twitter: item.twitter,
    discord: item.discord,
    requirements: item.requirements,
    endDate: item.end_date,
    totalValue: item.total_value,
    isActive: item.is_active || false,
    isVerified: item.is_verified || false,
    isFeatured: item.is_featured || false,
    views: item.views || 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

function normalizeNFTItem(item: any): NFTItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    category: item.category,
    authorId: item.author_id,
    authorName: item.author_name,
    authorProfileImage: item.author_profile_image,
    authorRole: item.author_role,
    website: item.website,
    twitter: item.twitter,
    discord: item.discord,
    mintPrice: item.mint_price,
    totalSupply: item.total_supply,
    mintDate: item.mint_date,
    isLive: item.is_live || false,
    isFeatured: item.is_featured || false,
    isVerified: item.is_verified || false,
    views: item.views || 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

function normalizeDeFiItem(item: any): DeFiItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    category: item.category,
    authorId: item.author_id,
    authorName: item.author_name,
    authorProfileImage: item.author_profile_image,
    authorRole: item.author_role,
    website: item.website,
    twitter: item.twitter,
    discord: item.discord,
    tvl: item.tvl,
    apy: item.apy,
    blockchain: item.blockchain,
    isActive: item.is_active || false,
    isVerified: item.is_verified || false,
    isFeatured: item.is_featured || false,
    views: item.views || 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

function normalizeListingItem(item: any): ListingItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    category: item.category,
    authorId: item.author_id,
    authorName: item.author_name,
    authorProfileImage: item.author_profile_image,
    authorRole: item.author_role,
    website: item.website,
    twitter: item.twitter,
    exchange: item.exchange,
    price: item.price,
    marketCap: item.market_cap,
    listingDate: item.listing_date,
    isNew: item.is_new || false,
    isFeatured: item.is_featured || false,
    isVerified: item.is_verified || false,
    views: item.views || 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

const authorSelect = "author:author_id (name, role, profileImage)"

// NEWS FUNCTIONS (keeping your existing ones)
export async function fetchLatestNews(limit = 10, page = 1): Promise<NewsItem[]> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .order("published_at", { ascending: false })
    .range(from, to)

  if (error || !data) {
    console.error("Error fetching latest news:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchFeaturedNews(limit = 4): Promise<NewsItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error("Error fetching featured news:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchTrendingNews(limit = 5): Promise<NewsItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .eq("is_trending", true)
    .order("views", { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error("Error fetching trending news:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchBreakingNews(limit = 5): Promise<NewsItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .eq("is_breaking", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error("Error fetching breaking news:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchNewsByTag(tag: string, limit = 10): Promise<NewsItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .contains("tags", [tag])
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error("Error fetching news by tag:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchNewsByMultipleTags(tags: string[], excludeId: string, limit = 10): Promise<NewsItem[]> {
  if (!tags.length) return []
  const supabase = await createClient()

  const query = supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit)

  const orConditions = tags.map((tag) => `tags.cs.["${tag}"]`).join(",")
  const { data, error } = await query.or(orConditions)

  if (error) {
    console.error("Error fetching news by multiple tags:", error)
    const allResults: NewsItem[] = []
    const seenIds = new Set<string>()

    for (const tag of tags) {
      try {
        const tagResults = await fetchNewsByTag(tag, Math.ceil(limit / tags.length))
        tagResults.forEach((article) => {
          if (!seenIds.has(article.id) && article.id !== excludeId) {
            seenIds.add(article.id)
            allResults.push(article)
          }
        })
      } catch (tagError) {
        console.error(`Error fetching tag "${tag}":`, tagError)
      }
    }

    return allResults
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime(),
      )
      .slice(0, limit)
  }

  if (!data) return []
  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchNewsByCategory(category: string, limit = 10, page = 1): Promise<NewsItem[]> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .eq("category", category)
    .order("published_at", { ascending: false })
    .range(from, to)

  if (error || !data) {
    console.error("Error fetching news by category:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function searchNews(query: string, limit = 10, page = 1): Promise<NewsItem[]> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("news")
    .select(`*, ${authorSelect}`)
    .textSearch("title", query, { type: "websearch" })
    .range(from, to)

  if (error || !data) {
    console.error("Error searching news:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNewsItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchArticle(slug: string): Promise<NewsItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").select(`*, ${authorSelect}`).eq("slug", slug).single()

  if (error || !data) {
    console.error("Error fetching article:", error)
    return null
  }

  return normalizeNewsItem({
    ...data,
    author_name: data.author?.name,
    author_role: data.author?.role,
    author_profile_image: data.author?.profileImage,
  })
}

export async function createArticle(article: Partial<NewsItem>): Promise<NewsItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").insert(article).select().single()

  if (error || !data) {
    console.error("Error creating article:", error)
    return null
  }

  return normalizeNewsItem(data)
}

export async function updateArticle(id: string, article: Partial<NewsItem>): Promise<NewsItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("news").update(article).eq("id", id).select().single()

  if (error || !data) {
    console.error("Error updating article:", error)
    return null
  }

  return normalizeNewsItem(data)
}

export async function deleteArticle(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.from("news").delete().eq("id", id)

  if (error) {
    console.error("Error deleting article:", error)
    return false
  }

  return true
}

// NEW CRYPTO CONTENT FUNCTIONS (SERVER-SIDE)
export async function fetchLatestAirdrops(limit = 10, page = 1): Promise<AirdropItem[]> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("airdrops")
    .select(`*, ${authorSelect}`)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error || !data) {
    console.error("Error fetching latest airdrops:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeAirdropItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchFeaturedAirdrops(limit = 4): Promise<AirdropItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("airdrops")
    .select(`*, ${authorSelect}`)
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error("Error fetching featured airdrops:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeAirdropItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchLatestNFTs(limit = 10, page = 1): Promise<NFTItem[]> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("nfts")
    .select(`*, ${authorSelect}`)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error || !data) {
    console.error("Error fetching latest NFTs:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNFTItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchLiveNFTs(limit = 10): Promise<NFTItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("nfts")
    .select(`*, ${authorSelect}`)
    .eq("is_live", true)
    .order("mint_date", { ascending: true })
    .limit(limit)

  if (error || !data) {
    console.error("Error fetching live NFTs:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeNFTItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchLatestDeFi(limit = 10, page = 1): Promise<DeFiItem[]> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("defi_protocols")
    .select(`*, ${authorSelect}`)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error || !data) {
    console.error("Error fetching latest DeFi:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeDeFiItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchLatestListings(limit = 10, page = 1): Promise<ListingItem[]> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("listings")
    .select(`*, ${authorSelect}`)
    .order("listing_date", { ascending: false })
    .range(from, to)

  if (error || !data) {
    console.error("Error fetching latest listings:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeListingItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

export async function fetchNewListings(limit = 10): Promise<ListingItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("listings")
    .select(`*, ${authorSelect}`)
    .eq("is_new", true)
    .order("listing_date", { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error("Error fetching new listings:", error)
    return []
  }

  return data.map((item: any) =>
    normalizeListingItem({
      ...item,
      author_name: item.author?.name,
      author_role: item.author?.role,
      author_profile_image: item.author?.profileImage,
    }),
  )
}

// GENERIC CONTENT CREATION FOR FORM (SERVER-SIDE)
export async function createContent(contentType: string, data: any): Promise<any> {
  const supabase = await createClient()

  const tableMap = {
    news: "news",
    airdrop: "airdrops",
    nft: "nfts",
    defi: "defi_protocols",
    listing: "listings",
  }

  const tableName = tableMap[contentType as keyof typeof tableMap]
  if (!tableName) {
    throw new Error(`Invalid content type: ${contentType}`)
  }

  const { data: result, error } = await supabase.from(tableName).insert(data).select().single()

  if (error) {
    console.error(`Error creating ${contentType}:`, error)
    throw error
  }

  return result
}
