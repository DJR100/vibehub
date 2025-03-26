"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThumbsUp, Eye, User, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
    genre: "RPG",
    multiplayer: false,
    aiTool: "GPT-4",
  },
  {
    id: 2,
    title: "Space Defender 3000",
    image: "/placeholder.svg?height=400&width=600",
    creator: "AIGameDev",
    likes: 892,
    views: 5432,
    tags: ["Shooter", "Arcade", "Space"],
    genre: "Shooter",
    multiplayer: true,
    aiTool: "Claude",
  },
  {
    id: 3,
    title: "Neon Racer",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SynthWave",
    likes: 756,
    views: 4321,
    tags: ["Racing", "Cyberpunk", "Multiplayer"],
    genre: "Racing",
    multiplayer: true,
    aiTool: "GPT-4",
  },
  {
    id: 4,
    title: "Zombie Survival",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SurvivalGuru",
    likes: 543,
    views: 3210,
    tags: ["Survival", "Horror", "Action"],
    genre: "Survival",
    multiplayer: true,
    aiTool: "Claude",
  },
  {
    id: 5,
    title: "Puzzle Master",
    image: "/placeholder.svg?height=400&width=600",
    creator: "BrainTeaser",
    likes: 421,
    views: 2876,
    tags: ["Puzzle", "Logic", "Casual"],
    genre: "Puzzle",
    multiplayer: false,
    aiTool: "GPT-4",
  },
  {
    id: 6,
    title: "Fantasy Quest",
    image: "/placeholder.svg?height=400&width=600",
    creator: "RPGLover",
    likes: 387,
    views: 2543,
    tags: ["RPG", "Fantasy", "Adventure"],
    genre: "RPG",
    multiplayer: false,
    aiTool: "Claude",
  },
  {
    id: 7,
    title: "Retro Platformer",
    image: "/placeholder.svg?height=400&width=600",
    creator: "OldSchoolDev",
    likes: 356,
    views: 2321,
    tags: ["Platformer", "Retro", "2D"],
    genre: "Platformer",
    multiplayer: false,
    aiTool: "GPT-4",
  },
  {
    id: 8,
    title: "Strategy Empire",
    image: "/placeholder.svg?height=400&width=600",
    creator: "MindMaster",
    likes: 312,
    views: 1987,
    tags: ["Strategy", "Simulation", "Building"],
    genre: "Strategy",
    multiplayer: true,
    aiTool: "Claude",
  },
  {
    id: 9,
    title: "Card Battler",
    image: "/placeholder.svg?height=400&width=600",
    creator: "DeckBuilder",
    likes: 298,
    views: 1765,
    tags: ["Card Game", "Strategy", "PvP"],
    genre: "Card Game",
    multiplayer: true,
    aiTool: "GPT-4",
  },
  {
    id: 10,
    title: "Endless Runner",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SpeedDemon",
    likes: 276,
    views: 1654,
    tags: ["Runner", "Arcade", "Casual"],
    genre: "Arcade",
    multiplayer: false,
    aiTool: "Claude",
  },
  {
    id: 11,
    title: "Tower Defense",
    image: "/placeholder.svg?height=400&width=600",
    creator: "StrategyKing",
    likes: 254,
    views: 1543,
    tags: ["Strategy", "Tower Defense", "Action"],
    genre: "Strategy",
    multiplayer: false,
    aiTool: "GPT-4",
  },
  {
    id: 12,
    title: "Pixel Fighter",
    image: "/placeholder.svg?height=400&width=600",
    creator: "FightMaster",
    likes: 243,
    views: 1432,
    tags: ["Fighting", "Pixel Art", "PvP"],
    genre: "Fighting",
    multiplayer: true,
    aiTool: "Claude",
  },
]

// Available filters
const genres = [
  "RPG",
  "Shooter",
  "Racing",
  "Survival",
  "Puzzle",
  "Platformer",
  "Strategy",
  "Card Game",
  "Arcade",
  "Fighting",
]
const aiTools = ["GPT-4", "Claude"]
const sortOptions = ["Most Popular", "Newest", "Most Played"]

export default function ExplorePage() {
  const [games, setGames] = useState(allGames)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedAITools, setSelectedAITools] = useState<string[]>([])
  const [multiplayerOnly, setMultiplayerOnly] = useState(false)
  const [sortBy, setSortBy] = useState("Most Popular")
  const [searchQuery, setSearchQuery] = useState("")

  const applyFilters = () => {
    let filteredGames = [...allGames]

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filteredGames = filteredGames.filter((game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filter by genre
    if (selectedGenres.length > 0) {
      filteredGames = filteredGames.filter((game) => selectedGenres.includes(game.genre))
    }

    // Filter by AI tool
    if (selectedAITools.length > 0) {
      filteredGames = filteredGames.filter((game) => selectedAITools.includes(game.aiTool))
    }

    // Filter by multiplayer
    if (multiplayerOnly) {
      filteredGames = filteredGames.filter((game) => game.multiplayer)
    }

    // Sort games
    if (sortBy === "Most Popular") {
      filteredGames.sort((a, b) => b.likes - a.likes)
    } else if (sortBy === "Most Played") {
      filteredGames.sort((a, b) => b.views - a.views)
    }
    // For 'Newest', we would normally sort by date, but our mock data doesn't have dates

    setGames(filteredGames)
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const toggleAITool = (tool: string) => {
    setSelectedAITools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]))
  }

  const resetFilters = () => {
    setSelectedGenres([])
    setSelectedAITools([])
    setMultiplayerOnly(false)
    setSortBy("Most Popular")
    setSearchQuery("")
    setGames(allGames)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <h1 className="pixel-text text-3xl font-bold">
          Explore <span className="text-primary">Games</span>
        </h1>

        <div className="flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="ml-2 pixel-button">
              Search
            </Button>
          </form>

          {/* Sort Dropdown */}
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value)
              setTimeout(applyFilters, 0)
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Button (Mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="pixel-text">Filters</SheetTitle>
                <SheetDescription>Narrow down games by genre, features, and more.</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Genre Filter */}
                <div>
                  <h3 className="mb-3 font-medium">Genre</h3>
                  <div className="space-y-2">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-genre-${genre}`}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => toggleGenre(genre)}
                        />
                        <Label htmlFor={`mobile-genre-${genre}`} className="text-sm font-normal">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Tool Filter */}
                <div>
                  <h3 className="mb-3 font-medium">AI Tool</h3>
                  <div className="space-y-2">
                    {aiTools.map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-tool-${tool}`}
                          checked={selectedAITools.includes(tool)}
                          onCheckedChange={() => toggleAITool(tool)}
                        />
                        <Label htmlFor={`mobile-tool-${tool}`} className="text-sm font-normal">
                          {tool}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multiplayer Filter */}
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-multiplayer"
                      checked={multiplayerOnly}
                      onCheckedChange={(checked) => setMultiplayerOnly(!!checked)}
                    />
                    <Label htmlFor="mobile-multiplayer" className="text-sm font-normal">
                      Multiplayer Only
                    </Label>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => {
                      applyFilters()
                    }}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    Reset
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:col-span-3 md:block">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 text-xs">
                Reset
              </Button>
            </div>

            {/* Genre Filter */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">Genre</h4>
              <div className="space-y-2">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => toggleGenre(genre)}
                    />
                    <Label htmlFor={`genre-${genre}`} className="text-sm font-normal">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tool Filter */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">AI Tool</h4>
              <div className="space-y-2">
                {aiTools.map((tool) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tool-${tool}`}
                      checked={selectedAITools.includes(tool)}
                      onCheckedChange={() => toggleAITool(tool)}
                    />
                    <Label htmlFor={`tool-${tool}`} className="text-sm font-normal">
                      {tool}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Multiplayer Filter */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multiplayer"
                  checked={multiplayerOnly}
                  onCheckedChange={(checked) => setMultiplayerOnly(!!checked)}
                />
                <Label htmlFor="multiplayer" className="text-sm font-normal">
                  Multiplayer Only
                </Label>
              </div>
            </div>

            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="col-span-12 md:col-span-9">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
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
                    <h3 className="pixel-text mb-2 text-lg font-bold">{game.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{game.creator}</span>
                      </div>
                      <div className="flex space-x-3">
                        <div className="stats-item">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{game.likes.toLocaleString()}</span>
                        </div>
                        <div className="stats-item">
                          <Eye className="h-3 w-3" />
                          <span>{game.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {games.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 p-8 text-center">
              <h3 className="pixel-text mb-2 text-xl">No games found</h3>
              <p className="mb-4 text-gray-400">Try adjusting your search or filters to find more games.</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

