"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThumbsUp, ThumbsDown, Eye, User, Calendar, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"

// Mock game data
const gamesData = [
  {
    id: "1",
    title: "Pixel Dungeon Crawler",
    description:
      "Explore procedurally generated dungeons in this roguelike adventure. Fight monsters, collect loot, and try to survive as long as possible in this challenging pixel art dungeon crawler.",
    longDescription:
      "Pixel Dungeon Crawler is a challenging roguelike game where you explore procedurally generated dungeons filled with dangerous monsters and valuable treasures. Each run is unique, with different layouts, enemies, and items to discover. The game features permadeath, meaning once your character dies, you'll need to start a new adventure from the beginning. With dozens of different weapons, armor pieces, and magical items to find, no two runs will ever be the same. Can you reach the bottom of the dungeon and defeat the final boss?",
    image: "/placeholder.svg?height=600&width=800",
    creator: "PixelWizard",
    creatorId: "2",
    likes: 1243,
    dislikes: 87,
    views: 8976,
    tags: ["RPG", "Roguelike", "Pixel Art"],
    releaseDate: "2023-11-15",
    githubUrl: "https://github.com/pixelwizard/dungeon-crawler",
    iframeUrl: "https://example.com/games/dungeon-crawler",
  },
  {
    id: "2",
    title: "Space Defender 3000",
    description: "Defend your space station against waves of alien invaders in this fast-paced arcade shooter.",
    longDescription:
      "Space Defender 3000 puts you in control of the last line of defense for humanity's most important space station. Waves of increasingly difficult alien ships will attack from all directions, and it's up to you to destroy them before they can breach your defenses. Earn points for each enemy destroyed, and use those points to upgrade your weapons, shields, and special abilities between waves. The game features multiple difficulty levels, online leaderboards, and unlockable ship skins. How long can you hold out against the alien onslaught?",
    image: "/placeholder.svg?height=600&width=800",
    creator: "AIGameDev",
    creatorId: "3",
    likes: 892,
    dislikes: 64,
    views: 5432,
    tags: ["Shooter", "Arcade", "Space"],
    releaseDate: "2023-12-03",
    githubUrl: "https://github.com/aigamedev/space-defender",
    iframeUrl: "https://example.com/games/space-defender",
  },
]

export default function GamePage() {
  const params = useParams()
  const { id } = params
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState<"up" | "down" | null>(null)
  const { user } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    const foundGame = gamesData.find((g) => g.id === id)
    setGame(foundGame)
    setLoading(false)
  }, [id])

  const handleVote = (type: "up" | "down") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on games",
        variant: "destructive",
      })
      return
    }

    if (voted === type) {
      // Undo vote
      setVoted(null)
      if (type === "up") {
        setGame((prev) => ({ ...prev, likes: prev.likes - 1 }))
      } else {
        setGame((prev) => ({ ...prev, dislikes: prev.dislikes - 1 }))
      }
    } else {
      // If changing vote
      if (voted === "up" && type === "down") {
        setGame((prev) => ({
          ...prev,
          likes: prev.likes - 1,
          dislikes: prev.dislikes + 1,
        }))
      } else if (voted === "down" && type === "up") {
        setGame((prev) => ({
          ...prev,
          likes: prev.likes + 1,
          dislikes: prev.dislikes - 1,
        }))
      } else {
        // New vote
        if (type === "up") {
          setGame((prev) => ({ ...prev, likes: prev.likes + 1 }))
        } else {
          setGame((prev) => ({ ...prev, dislikes: prev.dislikes + 1 }))
        }
      }
      setVoted(type)
    }

    toast({
      title: type === "up" ? "Upvoted!" : "Downvoted",
      description: `You ${voted === type ? "removed your" : ""} ${type === "up" ? "upvote" : "downvote"} for ${game.title}`,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="pixel-text mb-4 text-2xl">Loading game...</div>
          <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-800">
            <div className="animate-pulse h-full w-1/2 bg-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="pixel-text mb-4 text-3xl">Game Not Found</h1>
          <p className="mb-6 text-gray-400">The game you're looking for doesn't exist or has been removed.</p>
          <Link href="/explore">
            <Button className="pixel-button">Explore Games</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Game Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
            </div>

            <div className="space-y-4">
              <h1 className="pixel-text text-2xl font-bold text-primary">{game.title}</h1>

              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag: string) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-white">{game.description}</p>

              <div className="flex items-center space-x-4">
                <Link
                  href={`/profile/${game.creatorId}`}
                  className="flex items-center space-x-2 text-sm text-white hover:underline"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span>{game.creator}</span>
                </Link>

                <div className="flex items-center space-x-1 text-sm text-white">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote("up")}
                    className={`flex items-center space-x-1 ${voted === "up" ? "text-primary" : "hover:text-primary"}`}
                  >
                    <ThumbsUp className="h-5 w-5 text-primary" />
                    <span className="text-white">{game.likes.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={() => handleVote("down")}
                    className={`flex items-center space-x-1 ${voted === "down" ? "text-destructive" : "hover:text-destructive"}`}
                  >
                    <ThumbsDown className="h-5 w-5 text-primary" />
                    <span className="text-white">{game.dislikes.toLocaleString()}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1 text-white">
                  <Eye className="h-5 w-5 text-primary" />
                  <span>{game.views.toLocaleString()}</span>
                </div>
              </div>

              {game.githubUrl && (
                <Link
                  href={game.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-white hover:text-primary"
                >
                  <Github className="h-4 w-4 text-primary" />
                  <span>View Source Code</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="play">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger
                value="play"
                className="pixel-text text-sm data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-1px_0_0_var(--primary),0_1px_0_0_var(--primary)]"
              >
                Play Game
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="pixel-text text-sm data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-1px_0_0_var(--primary),0_1px_0_0_var(--primary)]"
              >
                About Game
              </TabsTrigger>
            </TabsList>

            <TabsContent value="play" className="space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-gray-800 bg-black">
                <iframe
                  src={game.iframeUrl}
                  title={game.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="rounded-lg border border-gray-800 bg-card p-4">
                <h3 className="pixel-text mb-2 text-lg text-primary">How to Play</h3>
                <p className="text-white">
                  Use WASD or arrow keys to move. Mouse to aim and left-click to shoot. Press Space to jump and E to
                  interact with objects.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <div className="rounded-lg border border-gray-800 bg-card p-6">
                <h3 className="pixel-text mb-4 text-xl text-primary">About This Game</h3>
                <p className="whitespace-pre-line text-white">{game.longDescription}</p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-card p-6">
                <h3 className="pixel-text mb-4 text-xl text-primary">Creator</h3>
                <Link href={`/profile/${game.creatorId}`} className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image src="/placeholder.svg?height=64&width=64" alt={game.creator} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-primary">{game.creator}</h4>
                    <p className="text-sm text-white">Game Developer</p>
                  </div>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

