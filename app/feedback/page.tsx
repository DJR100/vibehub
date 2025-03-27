"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2 } from "lucide-react"

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
  const { user, supabase } = useSupabase()
  const [feedback, setFeedback] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYouDialog, setShowThankYouDialog] = useState(false)

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

    try {
      // Submit to your existing feedback table
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id || null, // Use user ID if logged in
          content: feedback, // Your content field
          categories: selectedCategories, // Your categories array field
          // created_at will be handled by Supabase default value
        })
      
      if (error) {
        console.error("Error submitting feedback:", error)
        throw error
      }
      
      // Reset form fields
      setFeedback("")
      setSelectedCategories([])
      
      // Show thank you dialog instead of redirecting
      setShowThankYouDialog(true)
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close the thank you dialog
  const closeThankYouDialog = () => {
    setShowThankYouDialog(false)
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

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.push('/')}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="pixel-border"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Thank You Dialog */}
      {showThankYouDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-card border-2 border-primary p-6 rounded-lg max-w-md text-center pixel-border">
            <h2 className="pixel-text text-2xl font-bold mb-4">Thank You!</h2>
            <div className="text-5xl mb-4">🎮</div>
            <p className="mb-6 text-gray-300">
              Your feedback has been received and the VibeHub team is working on it! 
              We appreciate your help in making our platform better.
            </p>
            <Button onClick={closeThankYouDialog} className="pixel-border">
              Keep Exploring
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

