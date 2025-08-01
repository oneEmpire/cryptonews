"use client"

import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { create } from "zustand"
import { createClient } from "@/app/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

// ✅ Match your actual role types
export type Role = "ADMIN" | "AUTHOR" | "READER" | null

interface AuthState {
  User: User | null
  isLoggedIn: boolean
  pageisLoading: boolean
  userRole: Role
  username: string | null
  initialize: () => Promise<void>
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
  cleanup: () => void
}

export const AuthStore = create<AuthState>((set, get) => {
  const supabase = createClient()
  let unsubscribe: () => void = () => {}

  // ✅ Fetch user role from your backend API
  const fetchUserRole = async (userId: string): Promise<Role> => {
    try {
      const res = await fetch(`/api/users/${userId}/role`)
      if (!res.ok) throw new Error("Failed to fetch role")
      const data = await res.json()
      return data.role as Role
    } catch (err) {
      console.error("fetchUserRole error:", err)
      return null
    }
  }

  // ✅ Set up Supabase auth listener
  const setupAuthListener = () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event: AuthChangeEvent, session: Session | null) => {

        if (session?.user) {
          const user = session.user
          const userRole = await fetchUserRole(user.id)
          const username = user.user_metadata?.username ?? null

          set({
            User: user,
            isLoggedIn: true,
            pageisLoading: false,
            userRole,
            username,
          })
        } else {
          set({
            User: null,
            isLoggedIn: false,
            pageisLoading: false,
            userRole: null,
            username: null,
          })
        }
      }
    )

    unsubscribe = () => subscription.unsubscribe()
  }

  return {
    User: null,
    isLoggedIn: false,
    pageisLoading: true,
    userRole: null,
    username: null,

    initialize: async () => {
      set({ pageisLoading: true })
      setupAuthListener()

      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user ?? null
        const isLoggedIn = !!user
        const userRole = user ? await fetchUserRole(user.id) : null
        const username = user?.user_metadata?.username ?? null

        set({ User: user, isLoggedIn, userRole, username })
      } catch (err) {
        console.error("Auth initialize error:", err)
        set({ User: null, isLoggedIn: false, userRole: null, username: null })
      } finally {
        set({ pageisLoading: false })
      }
    },

    checkAuth: async () => {
      set({ pageisLoading: true })
      try {
        const { data } = await supabase.auth.getUser()
        const user = data?.user ?? null
        const isLoggedIn = !!user
        const userRole = user ? await fetchUserRole(user.id) : null
        const username = user?.user_metadata?.username ?? null

        set({ User: user, isLoggedIn, userRole, username })
      } catch (err) {
        console.error("checkAuth error:", err)
        set({ User: null, isLoggedIn: false, userRole: null, username: null })
      } finally {
        set({ pageisLoading: false })
      }
    },

    logout: async () => {
      set({ pageisLoading: true })
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        set({ User: null, isLoggedIn: false, userRole: null, username: null })
      } catch (err) {
        console.error("Logout error:", err)
      } finally {
        set({ pageisLoading: false })
      }
    },

    cleanup: () => {
      if (unsubscribe) unsubscribe()
    },
  }
})
