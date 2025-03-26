"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ThumbsUp, Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for games
const allGames = [
  {
    id: 1,
    title: "Pixel Dungeon Crawler",
    image: "/placeholder.svg?height=400&width=600",
    creator: "PixelWizard",
    likes: 1243,
    views: 8976,
    tags: ["RPG", "Roguelike", "Pixel Art"],
    description: "Explore procedurally generated dungeons in this roguelike adventure.",
  },
  {
    id: 2,
    title: "Space Defender 3000",
    image: "/placeholder.svg?height=400&width=600",
    creator: "AIGameDev",
    likes: 892,
    views: 5432,
    tags: ["Shooter", "Arcade", "Space"],
    description: "Defend your space station against waves of alien invaders.",
  },
  {
    id: 3,
    title: "Neon Racer",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SynthWave",
    likes: 756,
    views: 4321,
    tags: ["Racing", "Cyberpunk", "Multiplayer"],
    description: "Race through cyberpunk cities in this high-speed racing game.",
  },
  {
    id: 4,
    title: "Zombie Survival",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SurvivalGuru",
    likes: 543,
    views: 3210,
    tags: ["Survival", "Horror", "Action"],
    description: "Survive in a world overrun by zombies. Scavenge, craft, and fight to stay alive.",
  },
  {
    id: 5,
    title: "Puzzle Master",
    image: "/placeholder.svg?height=400&width=600",
    creator: "BrainTeaser",
    likes: 421,
    views: 2876,
    tags: ["Puzzle", "Logic", "Casual"],
    description: "Challenge your mind with increasingly difficult puzzles.",
  },
  {
    id: 6,
    title: "Fantasy Quest",
    image: "/placeholder.svg?height=400&width=600",
    creator: "RPGLover",
    likes: 387,
    views: 2543,
    tags: ["RPG", "Fantasy", "Adventure"],
    description: "Embark on an epic quest to save the kingdom from an ancient evil.",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate search delay
    setLoading(true)
    const timer = setTimeout(() => {
      if (query) {
        const searchResults = allGames.filter(
          (game) =>
            game.title.toLowerCase().includes(query.toLowerCase()) ||
            game.creator.toLowerCase().includes(query.toLowerCase()) ||
            game.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
            game.description.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(searchResults)
      } else {
        setResults([])
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="pixel-text mb-8 text-3xl font-bold">
        Search <span className="text-primary">Games</span>
      </h1>

      {/* Search Query Display */}
      <div className="mb-8">
        <p className="text-lg">
          {query ? (
            <>
              Showing results for: <span className="font-medium text-primary">{query}</span>
            </>
          ) : (
            "Search for games or use filters to find what you're looking for"
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-lg border border-gray-800 bg-card p-6">
        <h2 className="pixel-text mb-4 text-xl">Filters</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Genre Filter */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Genre</h3>
            <div className="space-y-2">
              {["RPG", "Shooter", "Racing", "Puzzle", "Strategy", "Card Game"].map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`genre-${genre}`}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`genre-${genre}`} className="text-sm">
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tool Filter */}
          <div>
            <h3 className="mb-3 text-sm font-medium">AI Tool</h3>
            <div className="space-y-2">
              {["GPT-4", "Claude", "Gemini"].map((tool) => (
                <div key={tool} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tool-${tool}`}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`tool-${tool}`} className="text-sm">
                    {tool}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Other</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="multiplayer"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary focus:ring-primary"
                />
                <label htmlFor="multiplayer" className="text-sm">
                  Multiplayer Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newest"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary focus:ring-primary"
                />
                <label htmlFor="newest" className="text-sm">
                  Newest First
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="pixel-button">Apply Filters</Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex h-64 flex-col items-center justify-center">
          <div className="pixel-text mb-4 text-xl">Searching...</div>
          <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-800">
            <div className="animate-pulse h-full w-1/2 bg-primary"></div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="game-card">
                  <Image
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="game-card-content">
                    <div className="flex flex-wrap gap-2">
                      {game.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                      {game.tags.length > 2 && <span className="tag">+{game.tags.length - 2}</span>}
                    </div>
                    <div>
                      <h3 className="pixel-text mb-2 text-lg font-bold">{game.title}</h3>
                      <p className="mb-2 text-sm text-gray-300 line-clamp-2">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <User className="h-3 w-3" />
                          <span>{game.creator}</span>
                        </div>
                        <div className="flex space-x-3">
                          <div className="stats-item">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{game.likes}</span>
                          </div>
                          <div className="stats-item">
                            <Eye className="h-3 w-3" />
                            <span>{game.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            query && (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 p-8 text-center">
                <h3 className="pixel-text mb-2 text-xl">No games found</h3>
                <p className="mb-4 text-gray-400">We couldn't find any games matching "{query}"</p>
                <Link href="/explore">
                  <button className="pixel-button">Explore Games</button>
                </Link>
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

