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
  authorProfileImage: string
}
