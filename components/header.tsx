"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Search, Menu, X, Bell, BellOff, UserIcon, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NewsletterButton } from "@/components/newsletter-button"
import { AuthStore } from "@/lib/AuthStore"
import {
  subscribeAuthenticatedUser,
  unsubscribeAuthenticatedUser,
  checkSubscriptionStatus,
} from "@/app/newsletter/actions"

function MobileNewsletterButton() {
  const { isLoggedIn, User } = AuthStore()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const router = useRouter()

  const checkAndToggleSubscription = async () => {
    if (!isLoggedIn) {
      router.push("/signup")
      return
    }
    setIsActionLoading(true)
    try {
      if (!hasChecked) {
        const { isSubscribed: currentStatus } = await checkSubscriptionStatus()
        setIsSubscribed(currentStatus)
        setHasChecked(true)
      }
      const result = isSubscribed ? await unsubscribeAuthenticatedUser() : await subscribeAuthenticatedUser()
      if (result?.success) {
        setIsSubscribed(!isSubscribed)
      }
    } catch (error) {
      console.error("Newsletter action error:", error)
    } finally {
      setIsActionLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setIsSubscribed(false)
      setHasChecked(false)
    }
  }, [isLoggedIn])

  return (
    <Button
      size="sm"
      variant="ghost"
      className="inline-flex lg:hidden hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400"
      onClick={checkAndToggleSubscription}
      disabled={isActionLoading}
    >
      {isActionLoading ? (
        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      ) : isSubscribed ? (
        <BellOff className="h-4 w-4" />
      ) : (
        <Bell className="h-4 w-4" />
      )}
    </Button>
  )
}

function UserAuthButton() {
  const { isLoggedIn, User, logout } = AuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const username = User?.user_metadata.username

  const handleAuthAction = async () => {
    if (!isLoggedIn) {
      setIsLoading(true)
      setTimeout(() => {
        router.push("/signup")
        setIsLoading(false)
      }, 500)
    } else {
      setShowDropdown(!showDropdown)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setShowDropdown(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoggedIn && User) {
    return (
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAuthAction}
          disabled={isLoading}
          className="flex items-center gap-2 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {username?.charAt(0).toUpperCase() || User.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden lg:inline text-sm font-medium">{username || "User"}</span>
            </>
          )}
        </Button>
        {showDropdown && !isLoading && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 rounded-lg shadow-2xl border border-slate-700 py-2 z-50 hidden lg:block">
            <div className="px-4 py-2 border-b border-slate-700">
              <p className="text-sm font-medium text-slate-100">{username || "User"}</p>
              <p className="text-xs text-slate-400">{User.email}</p>
            </div>
            <button
              onClick={() => {
                router.push("/profile")
                setShowDropdown(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
            >
              Profile
            </button>
            <button
              onClick={() => {
                router.push("/settings")
                setShowDropdown(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
            >
              Settings
            </button>
            <hr className="my-1 border-slate-700" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
            >
              Sign Out
            </button>
          </div>
        )}
        {showDropdown && <div className="fixed inset-0 z-40 lg:block hidden" onClick={() => setShowDropdown(false)} />}
      </div>
    )
  }

  return (
    <Button
      onClick={handleAuthAction}
      size="sm"
      variant="ghost"
      disabled={isLoading}
      className="flex items-center gap-2 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm hidden sm:inline">Loading...</span>
        </div>
      ) : (
        <>
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Sign Up</span>
        </>
      )}
    </Button>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { isLoggedIn, User, logout } = AuthStore()
  const username = User?.user_metadata.username

  const navItems = [
    { name: "Latest", href: "/", icon: TrendingUp },
    { name: "New Listings", href: "/new-listings", icon: Zap },
    { name: "Airdrops", href: "/airdrops", icon: Bell },
    { name: "DeFi", href: "/defi", icon: TrendingUp },
    { name: "NFTs", href: "/nfts", icon: Zap },
    { name: "Analysis", href: "/analysis", icon: TrendingUp },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isMenuOpen) setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // This will be handled by the UserAuthButton component
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 py-2 shadow-lg border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    LIVE: Real-time crypto market updates & breaking news
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <span className="text-green-400 font-mono">BTC: $43,250</span>
                  <span className="text-blue-400 font-mono">ETH: $2,580</span>
                </div>
              </div>
              <div className="hidden lg:flex items-center space-x-4 relative">
                <NewsletterButton />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-slate-950 shadow-lg border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center flex-shrink-0 group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-300 transition-all">
                        CryptoFlow
                      </h1>
                      <span className="text-xs text-slate-400 font-mono tracking-wider">BETA</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200 relative group rounded-lg hover:bg-slate-800/50"
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-200"></span>
                    </Link>
                  )
                })}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative flex items-center">
                  {!isSearchOpen && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleSearch}
                        className="hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      <MobileNewsletterButton />
                      <UserAuthButton />
                    </>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="lg:hidden hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-slate-800 py-4 bg-slate-900/50">
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 font-medium transition-colors px-2 py-2 rounded-lg hover:bg-slate-800/50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}

                  {isLoggedIn && User && (
                    <>
                      <hr className="border-slate-700 my-2" />
                      <div className="px-2 py-2">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {username?.charAt(0).toUpperCase() || User.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100">{username || "User"}</p>
                            <p className="text-xs text-slate-400">{User.email}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <NewsletterButton />
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              router.push("/profile")
                              setIsMenuOpen(false)
                            }}
                            className="w-full text-left text-slate-300 hover:text-cyan-400 font-medium transition-colors py-1"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              router.push("/settings")
                              setIsMenuOpen(false)
                            }}
                            className="w-full text-left text-slate-300 hover:text-cyan-400 font-medium transition-colors py-1"
                          >
                            Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left text-red-400 hover:text-red-300 font-medium transition-colors py-1"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {!isLoggedIn && (
                    <>
                      <hr className="border-slate-700 my-2" />
                      <div className="px-2">
                        <NewsletterButton />
                      </div>
                    </>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Search Overlay */}
      {isSearchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-all duration-300"
            onClick={toggleSearch}
          />
          <div className="fixed top-0 left-0 right-0 z-[70] animate-in slide-in-from-top-2 duration-300">
            <div className="bg-slate-900 shadow-2xl border-b border-slate-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <form onSubmit={handleSearch} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      type="search"
                      placeholder="Search crypto news, tokens, projects..."
                      className="w-full pl-10 pr-4 py-3 text-lg bg-slate-800 border-2 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg text-slate-100 placeholder-slate-400"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                  >
                    Search
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={toggleSearch}
                    className="p-3 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
