"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, Bell, BellOff, Zap, TrendingUp } from "lucide-react"
import { AuthStore } from "@/lib/AuthStore"
import {
  subscribeAuthenticatedUser,
  unsubscribeAuthenticatedUser,
  checkSubscriptionStatus,
} from "@/app/newsletter/actions"
import { useRouter } from "next/navigation"
import Usericon from "./Usericon"

const LOCAL_STORAGE_KEY = "newsletter_subscription_status"

export function NewsletterSidebar() {
  const { isLoggedIn, User } = AuthStore()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  // Check subscription status using localStorage
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
      router.push("/signup")
      return
    }

    setIsActionLoading(true)
    try {
      const result = isSubscribed ? await unsubscribeAuthenticatedUser() : await subscribeAuthenticatedUser()
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

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 p-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Crypto Daily Brief</h3>
            <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Get the latest crypto news, airdrops, and market insights delivered to your inbox every morning
          </p>
          <div className="text-center py-4">
            <Usericon />
            <p className="text-sm text-slate-400 mb-4">Please log in to subscribe to our crypto newsletter</p>
            <Button
              onClick={() => router.push("/signup")}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Sign Up to Subscribe
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Still checking subscription
  if (isLoading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Crypto Daily Brief</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">Checking your subscription status...</p>
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  // Already subscribed
  if (isSubscribed) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 p-6 relative overflow-hidden">
        {/* Success background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-400">You're Subscribed! 🚀</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            You'll receive daily crypto updates, market insights, and exclusive airdrop alerts in your inbox
          </p>
          <Button
            onClick={handleToggleSubscription}
            disabled={isActionLoading}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50 bg-transparent hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
          >
            {isActionLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                Unsubscribing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BellOff className="h-4 w-4" />
                Unsubscribe
              </div>
            )}
          </Button>
          {message && (
            <div className="mt-3 text-xs text-center text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              {message}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Not yet subscribed
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50 p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Crypto Daily Brief</h3>
          <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
        </div>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Get the latest crypto news, airdrops, and market insights delivered to your inbox every morning
        </p>
        <Button
          onClick={handleToggleSubscription}
          disabled={isActionLoading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          {isActionLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Subscribing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Subscribe Free
            </div>
          )}
        </Button>
        {message && (
          <div className="mt-3 text-xs text-center text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
