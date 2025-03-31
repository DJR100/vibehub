"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThumbsUp, Eye, User, Filter, Search, Bookmark, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useSupabase } from "@/lib/supabase-provider"
import { getSpoofedStats } from "@/lib/utils"

interface Game {
  id: string;
  title: string;
  image?: string;
  creator: string;
  creator_x_url?: string;
  tags?: string[];
  genres?: string[];
  ai_tools?: string[];
  is_multiplayer?: boolean;
  created_at?: string;
}

// Add this constant at the top of the file, after the imports
const AI_TOOLS = [
  "GPT-4",
  "GPT-4 Turbo",
  "GPT-3.5 Turbo",
  "GPT-3.5",
  "GPT-4.5 Preview",
  "Claude 3.5 Sonnet",
  "Claude 3.5 Haiku",
  "Claude 3.5 Opus",
  "Claude 3 Haiku",
  "Claude 3 Sonnet",
  "Claude 3 Opus",
  "DeepSeek-V3-0324",
  "DeepSeek-Coder-V2",
  "DeepSeek-V2",
  "DeepSeek-RL",
  "LLaMA 3.3",
  "LLaMA 3.2",
  "LLaMA 3.1",
  "Gemini 1",
  "Gemini 1.5",
  "Gemini 1.5 Pro",
  "Gemini 1.5 Flash",
  "Gemini 1 Pro",
  "Gemini 1 Ultra",
  "o3-mini"
];

export default function ExplorePage() {
  const { supabase } = useSupabase()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedAiTools, setSelectedAiTools] = useState<string[]>([])
  const [multiplayerOnly, setMultiplayerOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedGenres, setExpandedGenres] = useState(false)
  const [expandedAITools, setExpandedAITools] = useState(false)

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching games:', error)
          return
        }

        setGames(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [supabase])

  // Get unique genres from actual games
  const availableGenres = Array.from(new Set(games.flatMap(game => game.genres || [])))

  const toggleGenreExpand = () => setExpandedGenres(!expandedGenres)
  const toggleAIToolsExpand = () => setExpandedAITools(!expandedAITools)

  const resetFilters = () => {
    setSelectedGenres([])
    setSelectedAiTools([])
    setMultiplayerOnly(false)
    setSortBy("newest")
    setSearchQuery("")
  }

  // Filter and sort games
  const filteredAndSortedGames = games
    .filter(game => {
      const matchesSearch = !searchQuery || 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesGenres = selectedGenres.length === 0 || 
        (game.genres && game.genres.some(genre => selectedGenres.includes(genre)))
    
      const matchesAiTools = selectedAiTools.length === 0 || 
        (game.ai_tools && game.ai_tools.some(tool => selectedAiTools.includes(tool)))
    
      return matchesSearch && matchesGenres && matchesAiTools
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Most Popular":
          return (b.likes || 0) - (a.likes || 0)
        case "Most Played":
          return (b.play_count || 0) - (a.play_count || 0)
        case "Newest":
          return new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <h1 className="pixel-text text-3xl font-bold">
          Explore <span className="text-primary">Games</span>
        </h1>

        <div className="flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0">
          {/* Search Bar */}
          <form onSubmit={(e) => { e.preventDefault(); resetFilters(); }} className="flex w-full md:w-auto">
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
              setSortBy(value);
              resetFilters();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Most Popular">Most Popular</SelectItem>
              <SelectItem value="Most Played">Most Played</SelectItem>
              <SelectItem value="Newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters Panel */}
        <div className="col-span-12 md:col-span-3">
          <div className="rounded-lg border border-gray-800 bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 text-xs">
                Reset
              </Button>
            </div>

            {/* Genre Filter - Now Expandable */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3" 
                onClick={toggleGenreExpand}
              >
                <h4 className="text-sm font-medium">Genre</h4>
                {expandedGenres ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
              
              {expandedGenres ? (
                <div className="space-y-2">
                  {availableGenres.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedGenres([...selectedGenres, genre])
                          } else {
                            setSelectedGenres(selectedGenres.filter((g) => g !== genre))
                          }
                        }}
                      />
                      <Label htmlFor={`genre-${genre}`} className="text-sm font-normal">
                        {genre}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedGenres.length > 0 ? (
                    <div className="text-sm text-gray-400">
                      {selectedGenres.length} selected
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      Click to select genres
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Tool Filter - Now with Checkboxes */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3" 
                onClick={toggleAIToolsExpand}
              >
                <h4 className="text-sm font-medium">AI Tool</h4>
                {expandedAITools ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
              
              {expandedAITools ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {AI_TOOLS.map((tool) => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tool-${tool}`}
                        checked={selectedAiTools.includes(tool)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAiTools([...selectedAiTools, tool])
                          } else {
                            setSelectedAiTools(selectedAiTools.filter((t) => t !== tool))
                          }
                        }}
                      />
                      <Label htmlFor={`tool-${tool}`} className="text-sm font-normal">
                        {tool}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedAiTools.length > 0 ? (
                    <div className="text-sm text-gray-400">
                      {selectedAiTools.length} selected
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      Click to select AI tools
                    </div>
                  )}
                </div>
              )}
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

            {/* Apply Button with pixel styling */}
            <Button onClick={resetFilters} className="w-full pixel-button">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="col-span-12 md:col-span-9">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading games...</p>
            </div>
          ) : filteredAndSortedGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedGames.map((game) => {
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
                      <div className="flex flex-wrap gap-2">
                        {game.genres && game.genres.slice(0, 2).map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                        {game.genres && game.genres.length > 2 && (
                          <span className="tag">+{game.genres.length - 2}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="pixel-text mb-2 text-lg font-bold">{game.title}</h3>
                        <div className="flex items-center justify-between">
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
          ) : (
            <div className="text-center py-12">
              <p>No games found matching the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function extractXHandle(url: string) {
  if (!url) return "";
  // Extract username from X URL (supports both x.com and twitter.com)
  const match = url.match(/(?:x\.com|twitter\.com)\/([^\/\?]+)/);
  return match ? `@${match[1]}` : "X";
}

