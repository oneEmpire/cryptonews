"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { AuthStore } from "@/lib/AuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, Mail, Calendar, Edit2, Save, X, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { User, isLoggedIn, userRole, username, pageisLoading } = AuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profileImage: "",
  })
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Use refs to prevent multiple calls
  const hasFetched = useRef(false)
  const currentUserId = useRef<string | null>(null)

  // Memoized fetch function
  const fetchUserProfile = useCallback(async (userId: string) => {
    // Prevent multiple calls for the same user
    if (hasFetched.current && currentUserId.current === userId) {
      console.log("⏭️ Skipping fetch - already fetched for this user")
      return
    }

    console.log("🔍 Fetching profile for user:", userId)
    setIsLoading(true)
    setError(null)
    hasFetched.current = true
    currentUserId.current = userId

    try {
      const response = await fetch(`/api/users/${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`)
      }

      const userData = await response.json()
      console.log("✅ Profile data received:", userData)

      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        profileImage: userData.profileImage || "",
      })

      setEditData({
        name: userData.name || "",
        email: userData.email || "",
      })
    } catch (err) {
      console.error("❌ Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "Failed to load profile")
      // Reset flags on error so user can retry
      hasFetched.current = false
      currentUserId.current = null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Effect for fetching profile data
  useEffect(() => {
    if (User?.id && !hasFetched.current) {
      console.log("🚀 Triggering profile fetch for user:", User.id)
      fetchUserProfile(User.id)
    }
  }, [User?.id, fetchUserProfile])

  // Separate effect for handling redirects
  useEffect(() => {
    if (!pageisLoading && !isLoggedIn) {
      console.log("🚪 Redirecting to login")
      router.push("/login")
    }
  }, [pageisLoading, isLoggedIn, router])

  // Reset fetch flag when user changes
  useEffect(() => {
    if (User?.id && currentUserId.current && currentUserId.current !== User.id) {
      console.log("👤 User changed, resetting fetch flag")
      hasFetched.current = false
      currentUserId.current = null
    }
  }, [User?.id])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !User) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", User.id)

    try {
      const response = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        setProfileData((prev) => ({ ...prev, profileImage: result.imageUrl }))
        console.log("Profile image updated successfully!")
      } else {
        console.error("Upload failed:", result.error)
        alert(result.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("An error occurred while uploading the image")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  const handleSaveProfile = async () => {
    if (!User) return

    try {
      const response = await fetch(`/api/users/${User.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setProfileData((prev) => ({
          ...prev,
          name: updatedData.name || editData.name,
          email: updatedData.email || editData.email,
        }))
        setIsEditing(false)
      } else {
        console.error("Failed to update profile")
        alert("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("An error occurred while updating profile")
    }
  }

  const handleRetry = () => {
    hasFetched.current = false
    currentUserId.current = null
    if (User?.id) {
      fetchUserProfile(User.id)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800"
      case "AUTHOR":
        return "bg-blue-100 text-blue-800"
      case "READER":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Show loading spinner while page is loading
  if (pageisLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // Redirect if not logged in
  if (!isLoggedIn || !User) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-red-600">{error}</p>
                <Button onClick={handleRetry} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" disabled={isLoading}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  setEditData({
                    name: profileData.name,
                    email: profileData.email,
                  })
                }}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt={profileData.name} />
                  <AvatarFallback className="text-lg">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{isLoading ? "Loading..." : profileData.name || "User"}</CardTitle>
                  {userRole && <Badge className={getRoleColor(userRole)}>{userRole}</Badge>}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {isLoading ? "Loading..." : profileData.email || "No email provided"}
                </CardDescription>
                <CardDescription className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />@{username || "Loading..."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">
                      {isLoading ? "Loading..." : profileData.name || "Not provided"}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">
                      {isLoading ? "Loading..." : profileData.email || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <div className="p-2 bg-muted rounded-md font-mono text-sm">{User.id}</div>
                </div>
                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {User.created_at ? new Date(User.created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
