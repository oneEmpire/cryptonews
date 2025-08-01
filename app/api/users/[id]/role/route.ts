import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await Promise.resolve(context.params)

    console.log("🔍 [ROLE API] Fetching role for user ID:", params.id) // Changed from userId to id
    console.log("🔍 [ROLE API] Full params object:", params)

    if (!params.id) {
      // Changed from userId to id
      console.error("❌ [ROLE API] No id provided in params")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id, // Changed from userId to id
      },
      select: {
        role: true,
      },
    })

    if (!user) {
      console.log("❌ [ROLE API] User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("✅ [ROLE API] Returning role:", user.role)
    return NextResponse.json({ role: user.role })
  } catch (error) {
    console.error("❌ [ROLE API] Error fetching user role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
