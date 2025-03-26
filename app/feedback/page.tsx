"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"

// Feedback categories with icons
const feedbackCategories = [
  { id: "game-discovery", label: "Game Discovery", icon: "🎮" },
  { id: "game-performance", label: "Game Performance", icon: "⚡" },
  { id: "user-interface", label: "User Interface", icon: "🖥️" },
  { id: "profile-features", label: "Profile Features", icon: "👤" },
  { id: "creator-tools", label: "Creator Tools", icon: "🛠️" },
  { id: "community", label: "Community", icon: "💬" },
  { id: "search", label: "Search", icon: "🔍" },
  { id: "trending-games", label: "Trending Games", icon: "📈" },
  { id: "bookmarks", label: "Favorites", icon: "⭐" },
  { id: "upload-process", label: "Upload Process", icon: "📤" },
  { id: "mobile-experience", label: "Mobile Experience", icon: "📱" },
  { id: "other", label: "Other", icon: "⚙️" },
]

export default function FeedbackPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSupabase()
  const [feedback, setFeedback] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please tell us what's on your mind before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Feedback submitted",
      description: "Thank you for helping us improve VibeHub!",
    })

    setIsSubmitting(false)
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="pixel-text mb-8 text-3xl font-bold">
          Share Your <span className="text-primary">Feedback</span>
        </h1>

        <div className="rounded-lg border border-gray-800 bg-card p-6 space-y-6">
          <div>
            <h2 className="pixel-text mb-4 text-2xl font-bold">
              Tell us <span className="text-primary">everything</span>
            </h2>
            <p className="mb-4 text-gray-300">
              We love to hear about specific things as they happen. Your feedback helps us make VibeHub better for
              everyone.
            </p>

            <Textarea
              placeholder="What's on your mind?"
              className="mb-6 h-32 bg-background border-gray-700 focus:border-primary text-foreground"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div>
            <h3 className="pixel-text mb-4 text-lg font-bold">Any of these apply?</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {feedbackCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`flex items-center justify-center rounded-md border px-3 py-3 text-sm transition-colors pixel-border ${
                    selectedCategories.includes(category.id)
                      ? "border-primary bg-primary/20 text-white"
                      : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <span className="mr-2 text-lg">{category.icon}</span>
                  <span className="text-xs">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-6">
              Information you provide will be linked to your account in accordance with our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="pixel-button">
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

