"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { ProfileUpdateData } from "@/types"

// Create a Supabase client
const supabaseUrl = "https://ezwrieepubvnyijvcicp.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d3JpZWVwdWJ2bnlpanZjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTcxNTEsImV4cCI6MjA1ODU5MzE1MX0.B-_kZ9Nb-lrlVuMHVFga2AKaO7i6aXO2lnDGUPiQAAU"
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
  const router = useRouter()

  // Mock data for development
  const mockUsers = [
    {
      id: "1",
      email: "player@example.com",
      password: "password",
      role: "creator",
      username: "GameMaster42",
      bio: "Avid gamer and pixel art enthusiast",
      avatar_url: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      email: "creator@example.com",
      password: "password",
      role: "creator",
      username: "PixelWizard",
      bio: "Creating AI-powered games since 2025",
      avatar_url: "/placeholder.svg?height=100&width=100",
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        })
        return { user: null, error }
      }
      
      toast({
        title: "Signed in successfully",
        description: `Welcome back!`,
      })
      
      return { user: data.user, error: null }
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

  // Replace your mock signUp function with this
  const signUp = async (email: string, password: string, username: string, role: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username, 
            role
          }
        }
      })
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
        return { user: null, error }
      }
      
      toast({
        title: "Account created",
        description: `Welcome to VibeHub! Please check your email for confirmation.`,
      })
      
      // Create a profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
          username: username,
          bio: "",
          avatar_url: "",  // Initialize with empty avatar_url
          created_at: new Date().toISOString()
        })
      
      return { user: data.user, error: null }
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

  // Update the signOut function to redirect if on profile page
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      
      // Check if the current path is on a profile page and redirect if needed
      const path = window.location.pathname
      if (path.includes('/profile')) {
        router.push('/')
      }
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

  // Real update profile function
  const updateProfile = async (updates: ProfileUpdateData) => {
    try {
      setLoading(true)
      
      // Update auth metadata if username is included
      if (updates.username) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            username: updates.username,
          }
        })
        
        if (metadataError) throw metadataError
      }
      
      // Update profile data in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          bio: updates.bio,
          avatar_url: updates.avatar_url
        })
        .eq('id', user?.id)
      
      if (profileError) throw profileError
      
      // Refresh user data
      const { data: userData } = await supabase.auth.getUser()
      if (userData && userData.user) {
        setUser(userData.user)
      }
      
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

