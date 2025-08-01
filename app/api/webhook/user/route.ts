import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Incoming webhook request...");

    // Ensure the content type is JSON
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("❌ Invalid Content-Type:", contentType);
      return NextResponse.json({ error: "Invalid Content-Type" }, { status: 400 });
    }

    // Parse the JSON payload
    const body = await request.json();
    if (!body || typeof body !== "object") {
      console.error("❌ Invalid payload received:", body);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    console.log("✅ Webhook Data Received:", JSON.stringify(body, null, 2));

    const { type, table, record, old_record } = body;

    // Only process user-related events
    if (table !== "users") {
      console.warn("⚠️ Ignoring event for table:", table);
      return NextResponse.json({ message: "Not a users event" }, { status: 200 });
    }

    if (type === "DELETE") {
      console.log("🗑️ Handling DELETE event...");
      const userId = old_record?.id;
      const userEmail = old_record?.email;

      if (!userId && !userEmail) {
        console.error("❌ Missing user identifier in old_record");
        return NextResponse.json({ error: "Invalid old record" }, { status: 400 });
      }

      const whereClause = userId ? { id: userId } : { email: userEmail };
      const userExists = await prisma.user.findUnique({ where: whereClause });

      if (!userExists) {
        console.warn(`⚠️ User not found, skipping deletion: ${userId || userEmail}`);
        return NextResponse.json({ message: "User not found" }, { status: 200 });
      }

      await prisma.user.delete({ where: { id: userExists.id } });
      console.log("✅ User deleted successfully:", userExists.email);
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    }

    if (!record) {
      console.error("❌ Missing record data for event type:", type);
      return NextResponse.json({ error: "Invalid record" }, { status: 400 });
    }

    const userData = {
      id: record.id,
      email: record.email,
      name: record.raw_user_meta_data?.username || "Unknown",
    };

    if (!userData.id || !userData.email) {
      console.error("❌ Missing required user data:", userData);
      return NextResponse.json({ error: "Missing user ID or email" }, { status: 400 });
    }

    console.log("📝 Processing user data:", JSON.stringify(userData, null, 2));

    // Find existing user by ID or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ id: userData.id }, { email: userData.email }],
      },
    });

    let user;
    if (existingUser) {
      console.log("🔄 Updating existing user:", existingUser.email);
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: userData.email,
          name: userData.name || undefined, // Avoid empty strings
        },
      });
    } else {
      console.log("➕ Creating new user:", userData.email);
     user = await prisma.user.create({
  data: {
    id: userData.id,
    email: userData.email,
    name: userData.name || undefined,
    role: 'READER', // ✅ set default role
  },
});

    }

    console.log("✅ User record processed successfully:", user);
    return NextResponse.json({ success: true, data: user }, { status: 200 });

  } catch (error: unknown) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An internal error occurred", 
        error: (error as Error).message,
        stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
      },
      { status: 500 }
    );
  }
}
