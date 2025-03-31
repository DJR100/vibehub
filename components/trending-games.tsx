"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThumbsUp, Eye, User, Bookmark } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"
import { getSpoofedStats } from "@/lib/utils"

interface Game {
  id: string;
  title: string;
  image?: string;
  creator: string;
  creator_x_url?: string;
  tags?: string[];
}

export default function TrendingGames() {
  const [trendingGames, setTrendingGames] = useState<Game[]>([])
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select(`
            id,
            title,
            image,
            creator_x_url,
            profiles:creator_id (username)
          `)
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) {
          console.error('Error fetching trending games:', error)
          return
        }

        const formattedGames = data.map((game: any) => ({
          id: game.id,
          title: game.title,
          image: game.image || "/placeholder.svg",
          creator: game.profiles?.username || "Unknown Creator",
          creator_x_url: game.creator_x_url
        }))

        setTrendingGames(formattedGames)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchTrendingGames()
  }, [supabase])

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trendingGames.map((game) => {
        const stats = getSpoofedStats(game.id);
        return (
          <Link key={game.id} href={`/game/${game.id}`} className="game-card">
            <Image
              src={game.image || "/placeholder.svg"}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="game-card-content">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="pixel-text mb-2 text-lg font-bold text-white">{game.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-1 text-xs text-white">
                    {game.creator_x_url ? (
                      <div className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-primary">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span>{extractXHandle(game.creator_x_url)}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-white">by {game.creator}</div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <div className="stats-item">
                      <ThumbsUp className="h-3 w-3 text-primary" />
                      <span>{stats.likes.toLocaleString()}</span>
                    </div>
                    <div className="stats-item">
                      <Eye className="h-3 w-3 text-primary" />
                      <span>{stats.plays.toLocaleString()}</span>
                    </div>
                    <div className="stats-item">
                      <Bookmark className="h-3 w-3 text-primary" />
                      <span>{stats.saves.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}

function extractXHandle(url: string) {
  if (!url) return "";
  const match = url.match(/(?:x\.com|twitter\.com)\/([^\/\?]+)/);
  return match ? `@${match[1]}` : "X";
}

