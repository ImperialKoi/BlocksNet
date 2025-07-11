"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  _id: string
  username: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...")
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for cookies
        })

        if (res.ok) {
          const data = await res.json()
          console.log("User authenticated:", data.user)
          setUser(data.user)
        } else {
          console.log("User not authenticated")
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      })

      const data = await res.json()

      if (!res.ok) {
        console.log("Sign in failed:", data.error)
        return { error: data.error || "Failed to sign in" }
      }

      console.log("Sign in successful:", data.user)
      setUser(data.user)
      router.push("/dashboard")
      router.refresh()
      return {}
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log("Signing up user:", email)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
        credentials: "include", // Important for cookies
      })

      const data = await res.json()

      if (!res.ok) {
        console.log("Sign up failed:", data.error)
        return { error: data.error || "Failed to sign up" }
      }

      console.log("Sign up successful, now signing in")
      // After registration, sign in
      return signIn(email, password)
    } catch (error) {
      console.error("Sign up error:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out user")
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      })
      setUser(null)
      router.push("/")
      router.refresh()
      console.log("Sign out successful")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}