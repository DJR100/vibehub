"use client"

import Link from "next/link"
import Image from "next/image"
import { ThumbsUp, Eye, User, Bookmark } from "lucide-react"

type Game = {
  id: number;
  title: string;
  image: string;
  likes: number;
  play_count: number;
  creator: string;
  tags: string[];
  favorites_count?: number;
}

const trendingGames = [
  {
    id: 4,
    title: "Zombie Survival",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SurvivalGuru",
    likes: 543,
    play_count: 3210,
    tags: ["Survival", "Horror", "Action"],
  },
  {
    id: 5,
    title: "Puzzle Master",
    image: "/placeholder.svg?height=400&width=600",
    creator: "BrainTeaser",
    likes: 421,
    play_count: 2876,
    tags: ["Puzzle", "Logic", "Casual"],
  },
  {
    id: 6,
    title: "Fantasy Quest",
    image: "/placeholder.svg?height=400&width=600",
    creator: "RPGLover",
    likes: 387,
    play_count: 2543,
    tags: ["RPG", "Fantasy", "Adventure"],
  },
  {
    id: 7,
    title: "Retro Platformer",
    image: "/placeholder.svg?height=400&width=600",
    creator: "OldSchoolDev",
    likes: 356,
    play_count: 2321,
    tags: ["Platformer", "Retro", "2D"],
  },
  {
    id: 8,
    title: "Strategy Empire",
    image: "/placeholder.svg?height=400&width=600",
    creator: "MindMaster",
    likes: 312,
    play_count: 1987,
    tags: ["Strategy", "Simulation", "Building"],
  },
  {
    id: 9,
    title: "Card Battler",
    image: "/placeholder.svg?height=400&width=600",
    creator: "DeckBuilder",
    likes: 298,
    play_count: 1765,
    tags: ["Card Game", "Strategy", "PvP"],
  },
]

export default function TrendingGames() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trendingGames.map((game: Game) => (
        <Link key={game.id} href={`/game/${game.id}`} className="game-card">
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="game-card-content">
            <div className="flex flex-wrap gap-2">
              {game.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
              {game.tags.length > 2 && <span className="tag">+{game.tags.length - 2}</span>}
            </div>
            <div>
              <h3 className="pixel-text mb-2 text-lg font-bold text-white">{game.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-white">
                  <User className="h-3 w-3 text-primary" />
                  <span>{game.creator}</span>
                </div>
                <div className="flex space-x-3">
                  <div className="stats-item">
                    <ThumbsUp className="h-3 w-3 text-primary" />
                    <span>{game.likes.toLocaleString()}</span>
                  </div>
                  <div className="stats-item">
                    <Eye className="h-3 w-3 text-primary" />
                    <span>{game.play_count?.toLocaleString() || 0} plays</span>
                  </div>
                  <div className="stats-item">
                    <Bookmark className="h-3 w-3 text-primary" />
                    <span>{game.favorites_count?.toLocaleString() || 0}</span>
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

