"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/components/ui/use-toast"

// Create a Supabase client
const supabaseUrl = "https://example.supabase.co"
const supabaseKey = "your-anon-key"
const supabase = createClient(supabaseUrl, supabaseKey)

// Create context
const SupabaseContext = createContext<any>(null)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === null) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Mock data for development
  const mockUsers = [
    {
      id: "1",
      email: "player@example.com",
      password: "password",
      role: "creator",
      username: "GameMaster42",
      bio: "Avid gamer and pixel art enthusiast",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      email: "creator@example.com",
      password: "password",
      role: "creator",
      username: "PixelWizard",
      bio: "Creating AI-powered games since 2023",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  useEffect(() => {
    // Check for user on mount
    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      // In a real app, this would use supabase.auth.signInWithPassword
      const mockUser = mockUsers.find((u) => u.email === email && u.password === password)

      if (mockUser) {
        setUser({
          ...mockUser,
          user_metadata: {
            username: mockUser.username,
            role: mockUser.role,
          },
        })
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${mockUser.username}!`,
        })
        return { user: mockUser, error: null }
      } else {
        toast({
          title: "Sign in failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
        return { user: null, error: { message: "Invalid email or password" } }
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
      return { user: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Mock sign up function
  const signUp = async (email: string, password: string, username: string, role: string) => {
    try {
      setLoading(true)
      // In a real app, this would use supabase.auth.signUp
      const newUser = {
        id: String(mockUsers.length + 1),
        email,
        password,
        role,
        username,
        bio: "",
        avatar: "/placeholder.svg?height=100&width=100",
      }

      setUser({
        ...newUser,
        user_metadata: {
          username,
          role,
        },
      })

      toast({
        title: "Account created",
        description: `Welcome to VibeHub, ${username}!`,
      })

      return { user: newUser, error: null }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      })
      return { user: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Mock sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      // In a real app, this would use supabase.auth.signOut
      setUser(null)
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Mock update profile function
  const updateProfile = async (updates: any) => {
    try {
      setLoading(true)
      // In a real app, this would update the user profile in Supabase
      setUser((prev) => ({
        ...prev,
        ...updates,
        user_metadata: {
          ...prev.user_metadata,
          ...updates,
        },
      }))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      return { error: null }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    supabase,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

