"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { AuthStore } from "@/lib/AuthStore"
import {
  subscribeAuthenticatedUser,
  unsubscribeAuthenticatedUser,
  checkSubscriptionStatus,
} from "@/app/newsletter/actions"

const LOCAL_STORAGE_KEY = "newsletter_subscription_status"

export function NewsletterButton() {
  const { isLoggedIn, User } = AuthStore()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Load from cache or check from server
  useEffect(() => {
    if (isLoggedIn && User) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY)

      if (cached !== null) {
        setIsSubscribed(cached === "true")
        setIsLoading(false)
      } else {
        setIsLoading(true)
        checkSubscriptionStatus().then(({ isSubscribed }) => {
          setIsSubscribed(isSubscribed)
          localStorage.setItem(LOCAL_STORAGE_KEY, isSubscribed.toString())
          setIsLoading(false)
        })
      }
    } else {
      setIsSubscribed(false)
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      setIsLoading(false)
    }
  }, [isLoggedIn, User])

  const handleToggleSubscription = async () => {
    if (!isLoggedIn) {
      setMessage("Please log in to subscribe to our newsletter")
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setIsActionLoading(true)
    try {
      const result = isSubscribed
        ? await unsubscribeAuthenticatedUser()
        : await subscribeAuthenticatedUser()

      if (result?.success) {
        const newStatus = !isSubscribed
        setIsSubscribed(newStatus)
        localStorage.setItem(LOCAL_STORAGE_KEY, newStatus.toString())
        setMessage(result.message)
      } else {
        setMessage(result?.message || "Something went wrong")
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.")
    } finally {
      setIsActionLoading(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm">Subscribe to our newsletter</span>
        <Button
          size="sm"
          variant="outline"
          className="text-white border-white/50 bg-transparent hover:bg-white hover:text-red-600 transition-all duration-200"
          onClick={() => setMessage("Please log in to subscribe")}
        >
          Subscribe
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm">Checking subscription...</span>
        <Button size="sm" variant="outline" disabled className="text-white border-white/50 bg-transparent">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4 relative">
      <span className="text-sm">{isSubscribed ? "You're subscribed!" : "Subscribe to our newsletter"}</span>
      <Button
        onClick={handleToggleSubscription}
        disabled={isActionLoading}
        size="sm"
        variant="outline"
        className={`transition-all duration-200 ${
          isSubscribed
            ? "text-green-600 border-green-500 bg-green-50 hover:bg-green-100"
            : "text-white border-white/50 bg-transparent hover:bg-white hover:text-red-600"
        }`}
      >
        {isActionLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {isSubscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </div>
        )}
      </Button>
      {message && (
        <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg border text-sm whitespace-nowrap z-50">
          {message}
        </div>
      )}
    </div>
  )
}
