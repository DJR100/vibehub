"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"

export default function ProfileRedirect() {
  const { user } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push(`/profile/${user.id}`)
    } else {
      router.push("/login")
    }
  }, [user, router])

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="pixel-text mb-4 text-2xl">Loading profile...</div>
        <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-800">
          <div className="animate-pulse h-full w-1/2 bg-primary"></div>
        </div>
      </div>
    </div>
  )
}

