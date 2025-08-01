import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // You'll need to add this env var
)

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "File and userId are required" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Create unique filename for profile images
    const fileExt = file.name.split(".").pop()
    const fileName = `profiles/profile-${userId}-${Date.now()}.${fileExt}`

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage using your existing bucket
    const { data, error } = await supabase.storage.from("news-images").upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: true, // Replace if file already exists
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(fileName)

    // Update user profile image in database
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: publicUrl,
      },
    })

    return NextResponse.json({ imageUrl: publicUrl })
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
