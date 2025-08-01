import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs"; // ensure this runs in Node, not Edge

let prisma: PrismaClient;
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function POST(request: NextRequest) {
  try {
    // validate env
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase env vars:", { supabaseUrl, serviceRoleKey });
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!file || !userId) {
      return NextResponse.json({ error: "File and userId are required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `profiles/profile-${userId}-${Date.now()}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(fileName);

    const prismaClient = getPrismaClient();
    await prismaClient.user.update({
      where: { id: userId },
      data: { profileImage: publicUrl },
    });

    return NextResponse.json({ imageUrl: publicUrl });
  } catch (err) {
    console.error("Error uploading profile image:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
