// Your existing interfaces
export interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string | null
  category: string
  authorId: string
  publishedAt: string
  timeAgo: string
  location: string
  tags: string[]
  isBreaking: boolean
  isFeatured: boolean
  isTrending: boolean
  readTime: number
  views: number
  createdAt: string
  updatedAt: string
  authorName: string
  authorRole: string
  authorProfileImage: string | null
  imageSource?: string
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

// New crypto content interfaces that match your form
export interface AirdropItem {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  category: string
  authorId: string
  website?: string
  twitter?: string
  discord?: string
  requirements?: string
  endDate?: string
  totalValue?: string
  isActive: boolean
  isVerified: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  updatedAt: string
  authorName: string
  authorRole: string
  authorProfileImage: string | null
}

export interface NFTItem {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  category: string
  authorId: string
  website?: string
  twitter?: string
  discord?: string
  mintPrice?: string
  totalSupply?: string
  mintDate?: string
  isLive: boolean
  isFeatured: boolean
  isVerified: boolean
  views: number
  createdAt: string
  updatedAt: string
  authorName: string
  authorRole: string
  authorProfileImage: string | null
}

export interface DeFiItem {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  category: string
  authorId: string
  website?: string
  twitter?: string
  discord?: string
  tvl?: string
  apy?: string
  blockchain?: string
  isActive: boolean
  isVerified: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  updatedAt: string
  authorName: string
  authorRole: string
  authorProfileImage: string | null
}

export interface ListingItem {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  category: string
  authorId: string
  website?: string
  twitter?: string
  exchange?: string
  price?: string
  marketCap?: string
  listingDate?: string
  isNew: boolean
  isFeatured: boolean
  isVerified: boolean
  views: number
  createdAt: string
  updatedAt: string
  authorName: string
  authorRole: string
  authorProfileImage: string | null
}

export type ContentType = "news" | "airdrop" | "nft" | "defi" | "listing"
export type ContentItem = NewsItem | AirdropItem | NFTItem | DeFiItem | ListingItem
