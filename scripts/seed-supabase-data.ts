import { supabaseAdmin, convertToDatabaseItem } from "../lib/supabase-client"
import { mockNews } from "../lib/mock-news"

async function seedSupabaseData() {
  console.log("🌱 Starting Supabase seeding with real images...")

  try {
    // Clear existing data
    const { error: deleteError } = await supabaseAdmin.from("news").delete().neq("id", "impossible-id") // Delete all records

    if (deleteError) {
      console.error("Error clearing data:", deleteError)
      return
    }

    console.log("🗑️ Cleared existing data")

    // Insert mock news data in batches (Supabase has limits)
    const batchSize = 50
    for (let i = 0; i < mockNews.length; i += batchSize) {
      const batch = mockNews.slice(i, i + batchSize)

      const supabaseData = batch.map((item) => convertToDatabaseItem(item))

      const { error: insertError } = await supabaseAdmin.from("news").insert(supabaseData)

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError)
        return
      }

      console.log(`✅ Inserted batch ${i / batchSize + 1}/${Math.ceil(mockNews.length / batchSize)}`)
    }

    console.log(`🎉 Successfully seeded ${mockNews.length} articles with real images!`)

    // Verify the data
    const { count } = await supabaseAdmin.from("news").select("*", { count: "exact", head: true })

    console.log(`📊 Total articles in database: ${count}`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  }
}

// Run the seeding
seedSupabaseData()
