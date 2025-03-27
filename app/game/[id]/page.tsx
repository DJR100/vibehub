"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThumbsUp, ThumbsDown, Eye, User, Calendar, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"

export default function GamePage() {
  const params = useParams()
  const { id } = params
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState<"up" | "down" | null>(null)
  const { user, supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true)
      try {
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select(`
            *,
            profiles:creator_id (username, id)
          `)
          .eq('id', id)
          .single()
        
        if (gameError || !gameData) {
          toast({
            title: "Error",
            description: "Game not found",
            variant: "destructive",
          })
          router.push('/explore')
          return
        }
        
        // Format the game data to match the expected structure
        const formattedGame = {
          ...gameData,
          creator: gameData.profiles.username,
          creator_id: gameData.creator_id
        }
        
        setGame(formattedGame)
        
        // Check if user has voted on this game
        if (user) {
          try {
            console.log("Checking vote status for game:", id, "user:", user.id);
            console.log("Game ID type:", typeof id, "value:", id);
            console.log("User ID type:", typeof user.id, "value:", user.id);
            
            const { data: voteData, error: voteError } = await supabase
              .from('votes')
              .select('vote_type')
              .eq('game_id', id)
              .eq('user_id', user.id)
              .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no vote exists
            
            if (voteError) {
              console.error("Error fetching vote data:", voteError);
            } else if (voteData) {
              setVoted(voteData.vote_type as "up" | "down");
              console.log("User has voted:", voteData.vote_type);
            } else {
              console.log("User has not voted yet");
            }
          } catch (error) {
            console.error("Exception when checking vote status:", error);
          }
        }
        
        // Record the view
        if (user) {
          await recordView()
        }
      } catch (error) {
        console.error("Error fetching game:", error)
      } finally {
        setLoading(false)
      }
    }
    
    // Function to record the view
    const recordView = async () => {
      try {
        // Check if this game was viewed recently by this user
        const lastViewedKey = `game_${id}_last_viewed`;
        const lastViewed = localStorage.getItem(lastViewedKey);
        const now = Date.now();
        
        // Only count a view if it's been more than 30 minutes since last view
        // or if there's no record of a previous view
        if (!lastViewed || (now - parseInt(lastViewed)) > 30 * 60 * 1000) {
          await supabase.rpc('increment_view_count', { game_id: id });
          localStorage.setItem(lastViewedKey, now.toString());
        }
      } catch (error) {
        console.error("Error recording view:", error);
      }
    }
    
    if (id) {
      fetchGame()
    }
  }, [id, user, supabase, router])

  const handleVote = async (type: "up" | "down") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on games",
        variant: "destructive",
      })
      return
    }

    try {
      if (voted === type) {
        // Undo vote (delete)
        await supabase
          .from('votes')
          .delete()
          .eq('game_id', id)
          .eq('user_id', user.id)
        
        setVoted(null)
      } else if (voted) {
        // Change vote (update)
        await supabase
          .from('votes')
          .update({ vote_type: type })
          .eq('game_id', id)
          .eq('user_id', user.id)
        
        setVoted(type)
      } else {
        // New vote (insert)
        await supabase
          .from('votes')
          .insert({
            game_id: id,
            user_id: user.id,
            vote_type: type
          })
        
        setVoted(type)
      }
      
      // Fetch updated game with new vote counts
      const { data } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        setGame((prev: any) => ({ ...prev, likes: data.likes, dislikes: data.dislikes }))
      }

      toast({
        title: type === "up" ? "Upvoted!" : "Downvoted",
        description: `You ${voted === type ? "removed your" : ""} ${type === "up" ? "upvote" : "downvote"} for ${game.title}`,
      })
    } catch (error: any) {
      toast({
        title: "Vote failed",
        description: error.message,
        variant: "destructive",
      })
    }
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

