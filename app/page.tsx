"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Eye, User, Bookmark } from "lucide-react"
import TrendingGames from "@/components/trending-games"
import SnakeAnimation from './components/SnakeAnimation'
import { useSupabase } from "@/lib/supabase-provider"
import { useState, useEffect } from "react"

interface Game {
  id: string;
  title: string;
  image?: string;
  creator: string;
  creator_x_url?: string;
  tags?: string[];
  likes?: number;
  play_count?: number;
  favorites_count?: number;
}

// We'll replace this static data with database data
const featuredGameTitles = ["Flight Simulator 2025", "Rotshot", "Vibe Sail"]

function extractXHandle(url: string) {
  if (!url) return "";
  const match = url.match(/(?:x\.com|twitter\.com)\/([^\/\?]+)/);
  return match ? `@${match[1]}` : "X";
}

export default function Home() {
  const { user, supabase } = useSupabase()
  const [featuredGames, setFeaturedGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedGames() {
      try {
        setLoading(true)
        
        // Fetch the specific featured games from the database
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .in('title', featuredGameTitles)
        
        if (error) throw error
        
        // If we found the games, use them
        if (data && data.length > 0) {
          setFeaturedGames(data)
        }
      } catch (error) {
        console.error("Error fetching featured games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedGames()
  }, [supabase])

  return (
    <div className="flex flex-col bg-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-black pb-8">
        <div className="absolute inset-0">
          <SnakeAnimation gridSize={15} speed={120} />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <h1 className="pixel-text mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            <span className="text-primary block">The Home for</span>
            <span className="text-primary block">Vibe-Coded</span>
            <span className="text-primary block">Web Games</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white">
            Discover, play, and share games created with AI tools. Join the vibe-coded gaming revolution on VibeHub.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/explore">
              <Button className="pixel-button text-lg">Explore Games</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="pixel-text mb-10 text-center text-3xl font-bold text-primary">Featured Games</h2>
          
          {loading ? (
            <div className="text-center py-12">Loading featured games...</div>
          ) : featuredGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredGames.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="game-card">
                  <Image
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="game-card-content">
                    <div className="flex flex-wrap gap-2">
                      {game.tags && game.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                      {game.tags && game.tags.length > 2 && <span className="tag">+{game.tags.length - 2}</span>}
                    </div>
                    <div>
                      <h3 className="pixel-text mb-2 text-lg font-bold text-white">{game.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-white">
                          {game.creator_x_url && (
                            <div className="flex items-center space-x-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-primary">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                              <span>{extractXHandle(game.creator_x_url)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <div className="stats-item">
                            <ThumbsUp className="h-3 w-3 text-primary" />
                            <span>{(game.likes || 0).toLocaleString()}</span>
                          </div>
                          <div className="stats-item">
                            <Eye className="h-3 w-3 text-primary" />
                            <span>{(game.play_count || 0).toLocaleString()}</span>
                          </div>
                          <div className="stats-item">
                            <Bookmark className="h-3 w-3 text-primary" />
                            <span>{(game.favorites_count || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>Featured games not found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Games */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="pixel-text mb-10 text-center text-3xl font-bold text-primary">Trending Now</h2>
          <TrendingGames />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="pixel-text mb-6 text-3xl font-bold">
            Ready to <span className="text-primary">Share</span> Your Game?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            Upload your AI-built game and join a community of creators and players passionate about the future of gaming
            on VibeHub.
          </p>
          <Link href={user ? "/upload" : "/login"}>
            <Button className="pixel-button text-lg">
              {user ? "Upload Your Game" : "Sign In to Upload"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

