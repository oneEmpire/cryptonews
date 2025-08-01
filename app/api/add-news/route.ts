import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // replace spaces and non-word chars with dashes
    .replace(/^-+|-+$/g, "") // remove starting/ending dashes
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Get content type to determine which table to use
    const contentType = formData.get("contentType") as string

    if (!contentType || !["news", "airdrop", "nft", "defi", "listing"].includes(contentType)) {
      return NextResponse.json({ message: "Invalid or missing content type" }, { status: 400 })
    }

    // Common fields
    const authorUsername = formData.get("author") as string
    const category = formData.get("category") as string
    const imageFile = formData.get("image") as File | null
    const imageSource = formData.get("imageSource") as string
    const tags = formData.get("tags") as string

    if (!authorUsername || !category) {
      return NextResponse.json({ message: "Author and category are required" }, { status: 400 })
    }

    // 🔎 Find the author by username to get their ID
    const { data: author, error: authorError } = await supabase
      .from("author")
      .select("id")
      .eq("name", authorUsername)
      .single()

    if (authorError || !author) {
      return NextResponse.json({ message: "Author not found" }, { status: 404 })
    }

    // Handle image upload if provided
    let imageUrl: string | null = null
    if (imageFile) {
      const filename = `${contentType}/${Date.now()}-${imageFile.name}`
      const { data, error } = await supabase.storage.from("content-images").upload(filename, imageFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: imageFile.type,
      })

      if (error) {
        console.error("Supabase Storage Upload Error:", error)
        return NextResponse.json({ message: "Failed to upload image", error: error.message }, { status: 500 })
      }

      const { data: publicUrlData } = supabase.storage.from("content-images").getPublicUrl(filename)
      imageUrl = publicUrlData.publicUrl
    }

    const now = new Date().toISOString()
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    // Handle different content types
    switch (contentType) {
      case "news": {
        const title = formData.get("title") as string
        const excerpt = formData.get("excerpt") as string
        const content = formData.get("content") as string
        const location = formData.get("location") as string
        const isBreaking = formData.get("isBreaking") === "true"
        const isFeatured = formData.get("isFeatured") === "true"
        const isTrending = formData.get("isTrending") === "true"
        const readTime = Number.parseInt(formData.get("readTime") as string) || 5

        if (!title || !excerpt || !content) {
          return NextResponse.json({ message: "Title, excerpt, and content are required for news" }, { status: 400 })
        }

        const slug = slugify(title)

        const { data: newNews, error } = await supabase
          .from("news")
          .insert({
            title,
            slug,
            excerpt,
            content,
            image: imageUrl,
            imageSource,
            category,
            author_id: author.id,
            published_at: now,
            time_ago: "Just now",
            location: location || "",
            tags: tagsArray,
            is_breaking: isBreaking,
            is_featured: isFeatured,
            is_trending: isTrending,
            read_time: readTime,
            views: 0,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating news:", error)
          return NextResponse.json({ message: "Failed to create news", error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: "News added successfully", content: newNews }, { status: 201 })
      }

      case "airdrop": {
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const website = formData.get("website") as string
        const twitter = formData.get("twitter") as string
        const discord = formData.get("discord") as string
        const requirements = formData.get("requirements") as string
        const endDate = formData.get("endDate") as string
        const totalValue = formData.get("totalValue") as string
        const isActive = formData.get("isActive") === "true"
        const isVerified = formData.get("isVerified") === "true"
        const isFeatured = formData.get("isFeatured") === "true"

        if (!name || !description) {
          return NextResponse.json({ message: "Name and description are required for airdrops" }, { status: 400 })
        }

        const slug = slugify(name)

        const { data: newAirdrop, error } = await supabase
          .from("airdrops")
          .insert({
            name,
            slug,
            description,
            image: imageUrl,
            category,
            author_id: author.id,
            website: website || null,
            twitter: twitter || null,
            discord: discord || null,
            requirements: requirements || null,
            end_date: endDate || null,
            total_value: totalValue || null,
            is_active: isActive,
            is_verified: isVerified,
            is_featured: isFeatured,
            views: 0,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating airdrop:", error)
          return NextResponse.json({ message: "Failed to create airdrop", error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: "Airdrop added successfully", content: newAirdrop }, { status: 201 })
      }

      case "nft": {
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const website = formData.get("website") as string
        const twitter = formData.get("twitter") as string
        const discord = formData.get("discord") as string
        const mintPrice = formData.get("mintPrice") as string
        const totalSupply = formData.get("totalSupply") as string
        const mintDate = formData.get("mintDate") as string
        const isLive = formData.get("isLive") === "true"
        const isFeatured = formData.get("isFeatured") === "true"
        const isVerified = formData.get("isVerified") === "true"

        if (!name || !description) {
          return NextResponse.json({ message: "Name and description are required for NFTs" }, { status: 400 })
        }

        const slug = slugify(name)

        const { data: newNFT, error } = await supabase
          .from("nfts")
          .insert({
            name,
            slug,
            description,
            image: imageUrl,
            category,
            author_id: author.id,
            website: website || null,
            twitter: twitter || null,
            discord: discord || null,
            mint_price: mintPrice || null,
            total_supply: totalSupply || null,
            mint_date: mintDate || null,
            is_live: isLive,
            is_featured: isFeatured,
            is_verified: isVerified,
            views: 0,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating NFT:", error)
          return NextResponse.json({ message: "Failed to create NFT", error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: "NFT added successfully", content: newNFT }, { status: 201 })
      }

      case "defi": {
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const website = formData.get("website") as string
        const twitter = formData.get("twitter") as string
        const discord = formData.get("discord") as string
        const tvl = formData.get("tvl") as string
        const apy = formData.get("apy") as string
        const blockchain = formData.get("blockchain") as string
        const isActive = formData.get("isActive") === "true"
        const isVerified = formData.get("isVerified") === "true"
        const isFeatured = formData.get("isFeatured") === "true"

        if (!name || !description) {
          return NextResponse.json({ message: "Name and description are required for DeFi protocols" }, { status: 400 })
        }

        const slug = slugify(name)

        const { data: newDeFi, error } = await supabase
          .from("defi_protocols")
          .insert({
            name,
            slug,
            description,
            image: imageUrl,
            category,
            author_id: author.id,
            website: website || null,
            twitter: twitter || null,
            discord: discord || null,
            tvl: tvl || null,
            apy: apy || null,
            blockchain: blockchain || null,
            is_active: isActive,
            is_verified: isVerified,
            is_featured: isFeatured,
            views: 0,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating DeFi protocol:", error)
          return NextResponse.json({ message: "Failed to create DeFi protocol", error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: "DeFi protocol added successfully", content: newDeFi }, { status: 201 })
      }

      case "listing": {
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const website = formData.get("website") as string
        const twitter = formData.get("twitter") as string
        const exchange = formData.get("exchange") as string
        const price = formData.get("price") as string
        const marketCap = formData.get("marketCap") as string
        const listingDate = formData.get("listingDate") as string
        const isNew = formData.get("isNew") === "true"
        const isFeatured = formData.get("isFeatured") === "true"
        const isVerified = formData.get("isVerified") === "true"

        if (!name || !description) {
          return NextResponse.json({ message: "Name and description are required for listings" }, { status: 400 })
        }

        const slug = slugify(name)

        const { data: newListing, error } = await supabase
          .from("listings")
          .insert({
            name,
            slug,
            description,
            image: imageUrl,
            category,
            author_id: author.id,
            website: website || null,
            twitter: twitter || null,
            exchange: exchange || null,
            price: price || null,
            market_cap: marketCap || null,
            listing_date: listingDate || null,
            is_new: isNew,
            is_featured: isFeatured,
            is_verified: isVerified,
            views: 0,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating listing:", error)
          return NextResponse.json({ message: "Failed to create listing", error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: "Listing added successfully", content: newListing }, { status: 201 })
      }

      default:
        return NextResponse.json({ message: "Invalid content type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error adding content:", error)
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 })
  }
}
