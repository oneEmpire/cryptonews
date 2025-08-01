"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, TrendingUp, Zap, Star, ImageIcon, FileText, Coins, Palette, BarChart3, Globe } from "lucide-react"
import { AuthStore } from "@/lib/AuthStore"
import { useRouter } from "next/navigation"

// Content type definitions
const contentTypes = [
  { value: "news", label: "News Article", icon: FileText },
  { value: "airdrop", label: "Airdrop", icon: Coins },
  { value: "nft", label: "NFT Collection", icon: Palette },
  { value: "defi", label: "DeFi Protocol", icon: BarChart3 },
  { value: "listing", label: "New Listing", icon: TrendingUp },
]

// Categories for each content type
const categoriesByType = {
  news: ["Breaking News", "Market Analysis", "Regulation", "Technology", "Adoption", "Security"],
  airdrop: ["Token Airdrop", "NFT Airdrop", "Testnet Rewards", "Community Rewards", "Staking Rewards"],
  nft: ["Art", "Gaming", "Utility", "PFP", "Music", "Sports", "Metaverse"],
  defi: ["DEX", "Lending", "Yield Farming", "Staking", "Insurance", "Derivatives"],
  listing: ["CEX Listing", "DEX Listing", "New Token", "New Chain", "Partnership"],
}

// Field configurations for each content type
const fieldConfigs = {
  news: {
    required: ["title", "excerpt", "content", "category", "author"],
    optional: ["image", "imageSource", "location", "tags", "readTime"],
    flags: ["isBreaking", "isFeatured", "isTrending"],
  },
  airdrop: {
    required: ["name", "description", "category"],
    optional: ["image", "website", "twitter", "discord", "requirements", "endDate", "totalValue"],
    flags: ["isActive", "isVerified", "isFeatured"],
  },
  nft: {
    required: ["name", "description", "category"],
    optional: ["image", "website", "twitter", "discord", "mintPrice", "totalSupply", "mintDate"],
    flags: ["isLive", "isFeatured", "isVerified"],
  },
  defi: {
    required: ["name", "description", "category"],
    optional: ["image", "website", "twitter", "discord", "tvl", "apy", "blockchain"],
    flags: ["isActive", "isVerified", "isFeatured"],
  },
  listing: {
    required: ["name", "description", "category"],
    optional: ["image", "website", "twitter", "exchange", "price", "marketCap", "listingDate"],
    flags: ["isNew", "isFeatured", "isVerified"],
  },
}

export function AddContentForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [contentType, setContentType] = useState("news")

  // Common fields
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imageSource, setImageSource] = useState("")
  const [category, setCategory] = useState("")
  const [author, setAuthor] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState("")

  // Crypto-specific fields
  const [website, setWebsite] = useState("")
  const [twitter, setTwitter] = useState("")
  const [discord, setDiscord] = useState("")
  const [requirements, setRequirements] = useState("")
  const [endDate, setEndDate] = useState("")
  const [totalValue, setTotalValue] = useState("")
  const [mintPrice, setMintPrice] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [mintDate, setMintDate] = useState("")
  const [tvl, setTvl] = useState("")
  const [apy, setApy] = useState("")
  const [blockchain, setBlockchain] = useState("")
  const [exchange, setExchange] = useState("")
  const [price, setPrice] = useState("")
  const [marketCap, setMarketCap] = useState("")
  const [listingDate, setListingDate] = useState("")
  const [readTime, setReadTime] = useState(5)

  // Flags
  const [isBreaking, setIsBreaking] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const { User } = AuthStore()
  const username = User?.user_metadata.username
  const userRole = AuthStore((state) => state.userRole)
  const router = useRouter()


  
  useEffect(() => {
    if (username) setAuthor(username)
  }, [username])

  // Reset form when content type changes
  useEffect(() => {
    setCategory("")
    // Reset type-specific fields
    setName("")
    setDescription("")
    setWebsite("")
    setTwitter("")
    setDiscord("")
    setRequirements("")
    setEndDate("")
    setTotalValue("")
    setMintPrice("")
    setTotalSupply("")
    setMintDate("")
    setTvl("")
    setApy("")
    setBlockchain("")
    setExchange("")
    setPrice("")
    setMarketCap("")
    setListingDate("")
    // Reset flags
    setIsActive(false)
    setIsVerified(false)
    setIsLive(false)
    setIsNew(false)
  }, [contentType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()

    // Add content type
    formData.append("contentType", contentType)

    // Add common fields based on content type
    const config = fieldConfigs[contentType as keyof typeof fieldConfigs]

    if (config.required.includes("title")) formData.append("title", title)
    if (config.required.includes("name") || config.optional.includes("name")) formData.append("name", name)
    if (config.required.includes("excerpt")) formData.append("excerpt", excerpt)
    if (config.required.includes("description")) formData.append("description", description)
    if (config.required.includes("content")) formData.append("content", content)
    if (image) formData.append("image", image)
    if (imageSource) formData.append("imageSource", imageSource)
    formData.append("category", category)
    if (author) formData.append("author", author)
    if (location) formData.append("location", location)
    if (tags) formData.append("tags", tags)

    // Add crypto-specific fields
    if (website) formData.append("website", website)
    if (twitter) formData.append("twitter", twitter)
    if (discord) formData.append("discord", discord)
    if (requirements) formData.append("requirements", requirements)
    if (endDate) formData.append("endDate", endDate)
    if (totalValue) formData.append("totalValue", totalValue)
    if (mintPrice) formData.append("mintPrice", mintPrice)
    if (totalSupply) formData.append("totalSupply", totalSupply)
    if (mintDate) formData.append("mintDate", mintDate)
    if (tvl) formData.append("tvl", tvl)
    if (apy) formData.append("apy", apy)
    if (blockchain) formData.append("blockchain", blockchain)
    if (exchange) formData.append("exchange", exchange)
    if (price) formData.append("price", price)
    if (marketCap) formData.append("marketCap", marketCap)
    if (listingDate) formData.append("listingDate", listingDate)
    if (readTime) formData.append("readTime", String(readTime))

    // Add flags
    formData.append("isBreaking", String(isBreaking))
    formData.append("isFeatured", String(isFeatured))
    formData.append("isTrending", String(isTrending))
    formData.append("isActive", String(isActive))
    formData.append("isVerified", String(isVerified))
    formData.append("isLive", String(isLive))
    formData.append("isNew", String(isNew))

    try {
      const response = await fetch("/api/add-news", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: `${contentTypes.find((t) => t.value === contentType)?.label} added successfully!`,
        })
        // Reset form
        setTitle("")
        setName("")
        setExcerpt("")
        setDescription("")
        setContent("")
        setImage(null)
        setImageSource("")
        setCategory("")
        setAuthor(username || "")
        setLocation("")
        setTags("")
        // Reset all other fields...
      } else {
        toast({
          title: "Error!",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Error!",
        description: "Failed to submit content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const currentConfig = fieldConfigs[contentType as keyof typeof fieldConfigs]
  const currentCategories = categoriesByType[contentType as keyof typeof categoriesByType]
  const ContentTypeIcon = contentTypes.find((t) => t.value === contentType)?.icon || FileText

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <ContentTypeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Add New {contentTypes.find((t) => t.value === contentType)?.label}
                </h2>
                <p className="text-cyan-100 text-sm">Create and publish crypto content</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Content Type Selector */}
            <div className="space-y-2">
              <Label className="text-slate-200 font-medium">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {contentTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value} className="text-slate-200 focus:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title/Name Field */}
                {(currentConfig.required.includes("title") || currentConfig.required.includes("name")) && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">{contentType === "news" ? "Title" : "Name"} *</Label>
                    <Input
                      value={contentType === "news" ? title : name}
                      onChange={(e) => (contentType === "news" ? setTitle(e.target.value) : setName(e.target.value))}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder={`Enter ${contentType === "news" ? "article title" : "name"}`}
                      required
                    />
                  </div>
                )}

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {currentCategories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-slate-200 focus:bg-slate-700">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Excerpt/Description */}
                {(currentConfig.required.includes("excerpt") || currentConfig.required.includes("description")) && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">
                      {contentType === "news" ? "Excerpt" : "Description"} *
                    </Label>
                    <Textarea
                      value={contentType === "news" ? excerpt : description}
                      onChange={(e) =>
                        contentType === "news" ? setExcerpt(e.target.value) : setDescription(e.target.value)
                      }
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500 min-h-[100px]"
                      placeholder={`Enter ${contentType === "news" ? "excerpt" : "description"}`}
                      required
                    />
                  </div>
                )}

                {/* Content (News only) */}
                {currentConfig.required.includes("content") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Content *</Label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500 min-h-[200px]"
                      placeholder="Enter full article content"
                      required
                    />
                  </div>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500 file:bg-slate-700 file:text-slate-200 file:border-0 file:rounded-md"
                  />
                </div>

                {/* Image Source */}
                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium">Image Source</Label>
                  <Input
                    value={imageSource}
                    onChange={(e) => setImageSource(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                    placeholder="e.g., CoinGecko, Unsplash"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Author (News only) */}
                {currentConfig.required.includes("author") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Author *</Label>
                    <Input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="Author's name"
                      readOnly
                      required
                    />
                  </div>
                )}

                {/* Location (News only) */}
                {currentConfig.optional.includes("location") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Location</Label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., Global, USA, Europe"
                    />
                  </div>
                )}

                {/* Crypto-specific fields */}
                {currentConfig.optional.includes("website") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {currentConfig.optional.includes("twitter") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Twitter</Label>
                    <Input
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="@username"
                    />
                  </div>
                )}

                {currentConfig.optional.includes("discord") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Discord</Label>
                    <Input
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="Discord invite link"
                    />
                  </div>
                )}

                {/* Airdrop specific */}
                {currentConfig.optional.includes("requirements") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Requirements</Label>
                    <Textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="List requirements to participate"
                    />
                  </div>
                )}

                {currentConfig.optional.includes("totalValue") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Total Value</Label>
                    <Input
                      value={totalValue}
                      onChange={(e) => setTotalValue(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., $10,000 USDT"
                    />
                  </div>
                )}

                {/* NFT specific */}
                {currentConfig.optional.includes("mintPrice") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Mint Price</Label>
                    <Input
                      value={mintPrice}
                      onChange={(e) => setMintPrice(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., 0.1 ETH"
                    />
                  </div>
                )}

                {currentConfig.optional.includes("totalSupply") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Total Supply</Label>
                    <Input
                      value={totalSupply}
                      onChange={(e) => setTotalSupply(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., 10,000"
                    />
                  </div>
                )}

                {/* DeFi specific */}
                {currentConfig.optional.includes("tvl") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">TVL</Label>
                    <Input
                      value={tvl}
                      onChange={(e) => setTvl(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., $1.2M"
                    />
                  </div>
                )}

                {currentConfig.optional.includes("apy") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">APY</Label>
                    <Input
                      value={apy}
                      onChange={(e) => setApy(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., 12.5%"
                    />
                  </div>
                )}

                {/* Listing specific */}
                {currentConfig.optional.includes("exchange") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Exchange</Label>
                    <Input
                      value={exchange}
                      onChange={(e) => setExchange(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., Binance, Coinbase"
                    />
                  </div>
                )}

                {currentConfig.optional.includes("price") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Price</Label>
                    <Input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      placeholder="e.g., $0.50"
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium">Tags</Label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                    placeholder="crypto, defi, nft (comma-separated)"
                  />
                </div>

                {/* Read Time (News only) */}
                {currentConfig.optional.includes("readTime") && (
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium">Read Time (min)</Label>
                    <Input
                      type="number"
                      value={readTime}
                      onChange={(e) => setReadTime(Number.parseInt(e.target.value) || 0)}
                      className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-cyan-500"
                      min="1"
                      max="60"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Flags */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-slate-200 font-medium mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-cyan-400" />
                Content Flags
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentConfig.flags.map((flag) => {
                  const flagLabels = {
                    isBreaking: "Breaking News",
                    isFeatured: "Featured",
                    isTrending: "Trending",
                    isActive: "Active",
                    isVerified: "Verified",
                    isLive: "Live",
                    isNew: "New",
                  }

                  // Handle each flag individually to avoid TypeScript issues
                  let checked = false
                  let setChecked: (value: boolean) => void = () => {}

                  switch (flag) {
                    case "isBreaking":
                      checked = isBreaking
                      setChecked = setIsBreaking
                      break
                    case "isFeatured":
                      checked = isFeatured
                      setChecked = setIsFeatured
                      break
                    case "isTrending":
                      checked = isTrending
                      setChecked = setIsTrending
                      break
                    case "isActive":
                      checked = isActive
                      setChecked = setIsActive
                      break
                    case "isVerified":
                      checked = isVerified
                      setChecked = setIsVerified
                      break
                    case "isLive":
                      checked = isLive
                      setChecked = setIsLive
                      break
                    case "isNew":
                      checked = isNew
                      setChecked = setIsNew
                      break
                  }

                  return (
                    <div key={flag} className="flex items-center space-x-2">
                      <Checkbox
                        id={flag}
                        checked={checked}
                        onCheckedChange={(checkedValue) => setChecked(Boolean(checkedValue))}
                        className="border-slate-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                      />
                      <Label htmlFor={flag} className="text-slate-300 text-sm">
                        {flagLabels[flag as keyof typeof flagLabels]}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing {contentTypes.find((t) => t.value === contentType)?.label}...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Publish {contentTypes.find((t) => t.value === contentType)?.label}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
