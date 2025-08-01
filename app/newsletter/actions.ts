"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Define the type for our form state
type FormState = {
  success: boolean
  message: string
} | null

// Define the subscriber data type to match your database schema
type NewsletterSubscriber = {
  id: string
  firstName: string
  lastName: string
  email: string
  preferences: string[]
  isActive: boolean
  subscribedAt: string
  unsubscribedAt: string | null
  createdAt: string
  updatedAt: string
}

export async function subscribeAuthenticatedUser(): Promise<FormState> {
  try {
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to subscribe to the newsletter.",
      }
    }

    // Extract user data from auth
    const email = user.email!
    const firstName = user.user_metadata?.first_name || user.user_metadata?.name?.split(" ")[0] || "User"
    const lastName = user.user_metadata?.last_name || user.user_metadata?.name?.split(" ").slice(1).join(" ") || ""

    // Default preferences for authenticated users
    const preferences = ["daily-digest", "weekly-breakthroughs"]

    // Check if email already exists and is active
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active, unsubscribed_at")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error checking existing subscriber:", checkError)
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      }
    }

    // If subscriber exists and is active
    if (existingSubscriber && existingSubscriber.is_active) {
      return {
        success: false,
        message: "You're already subscribed to our newsletter!",
      }
    }

    // If subscriber exists but is inactive, reactivate them
    if (existingSubscriber && !existingSubscriber.is_active) {
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          first_name: firstName,
          last_name: lastName,
          preferences,
          is_active: true,
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscriber.id)

      if (updateError) {
        console.error("Error reactivating subscriber:", updateError)
        return {
          success: false,
          message: "Something went wrong. Please try again later.",
        }
      }

      return {
        success: true,
        message: `Welcome back ${firstName}! You've been resubscribed to our newsletter.`,
      }
    }

    // Create new subscriber
    const { data: newSubscriber, error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        preferences,
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating subscriber:", insertError)
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      }
    }

    // Log success
    console.log("New subscriber created:", newSubscriber)

    // Revalidate the page to update any cached data
    revalidatePath("/")

    return {
      success: true,
      message: `Welcome ${firstName}! You've successfully subscribed to our newsletter.`,
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export async function unsubscribeAuthenticatedUser(): Promise<FormState> {
  try {
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        message: "You must be logged in to unsubscribe.",
      }
    }

    const email = user.email!

    // Find the subscriber
    const { data: subscriber, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email)
      .single()

    if (findError || !subscriber) {
      return {
        success: false,
        message: "You're not subscribed to our newsletter.",
      }
    }

    if (!subscriber.is_active) {
      return {
        success: false,
        message: "You're already unsubscribed.",
      }
    }

    // Update subscriber to inactive
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id)

    if (updateError) {
      console.error("Error unsubscribing:", updateError)
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      }
    }

    return {
      success: true,
      message: "You've been successfully unsubscribed from our newsletter.",
    }
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}

// Check if current user is subscribed
export async function checkSubscriptionStatus(): Promise<{ isSubscribed: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { isSubscribed: false, error: "Not authenticated" }
    }

    const { data: subscriber, error } = await supabase
      .from("newsletter_subscribers")
      .select("is_active")
      .eq("email", user.email!)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking subscription:", error)
      return { isSubscribed: false, error: "Database error" }
    }

    return { isSubscribed: subscriber?.is_active || false }
  } catch (error) {
    console.error("Error in checkSubscriptionStatus:", error)
    return { isSubscribed: false, error: "Unknown error" }
  }
}

// Keep the existing functions for admin purposes
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("is_active", true)
      .order("subscribed_at", { ascending: false })

    if (error) {
      console.error("Error fetching subscribers:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getActiveSubscribers:", error)
    return []
  }
}

export async function getSubscriberStats() {
  try {
    const supabase = await createClient()

    // Get total active subscribers
    const { count: activeCount, error: activeError } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get total subscribers (including inactive)
    const { count: totalCount, error: totalError } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })

    // Get subscribers from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: recentCount, error: recentError } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .gte("subscribed_at", thirtyDaysAgo.toISOString())

    if (activeError || totalError || recentError) {
      console.error("Error fetching stats:", { activeError, totalError, recentError })
      return {
        activeSubscribers: 0,
        totalSubscribers: 0,
        recentSubscribers: 0,
      }
    }

    return {
      activeSubscribers: activeCount || 0,
      totalSubscribers: totalCount || 0,
      recentSubscribers: recentCount || 0,
    }
  } catch (error) {
    console.error("Error in getSubscriberStats:", error)
    return {
      activeSubscribers: 0,
      totalSubscribers: 0,
      recentSubscribers: 0,
    }
  }
}
