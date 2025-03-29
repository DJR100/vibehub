"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThumbsUp, Eye, User, Bookmark } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"

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

export default function TrendingGames() {
  const [trendingGames, setTrendingGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useSupabase()

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true)
        // Fetch all games from your database
        const { data, error } = await supabase
          .from('games')
          .select('*')
        
        if (error) throw error
        
        // Randomly select 6 games if there are enough
        if (data && data.length > 6) {
          // Shuffle array
          const shuffled = [...data].sort(() => 0.5 - Math.random())
          // Get first 6 items
          setTrendingGames(shuffled.slice(0, 6))
        } else {
          // Use all games if less than 6
          setTrendingGames(data || [])
        }
      } catch (error) {
        console.error("Error fetching trending games:", error)
        setTrendingGames([])
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [supabase])

  if (loading) {
    return <div className="text-center py-12">Loading trending games...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trendingGames.map((game) => (
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
  )
}

function extractXHandle(url: string) {
  if (!url) return "";
  const match = url.match(/(?:x\.com|twitter\.com)\/([^\/\?]+)/);
  return match ? `@${match[1]}` : "X";
}

