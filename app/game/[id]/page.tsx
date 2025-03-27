"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThumbsUp, ThumbsDown, Eye, User, Calendar, Github, Bookmark } from "lucide-react"
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
  const [isFavorite, setIsFavorite] = useState(false)
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
        
        // Fetch play count for this game
        const { count: playCount, error: playCountError } = await supabase
          .from('play_history')
          .select('*', { count: 'exact' })
          .eq('game_id', id);

        if (!playCountError) {
          // Add play count to game data
          gameData.play_count = playCount || 0;
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
        
        // Check if game is favorited
        if (user) {
          const { data: favoriteData, error: favoriteError } = await supabase
            .from('favorites')
            .select('id')
            .eq('game_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (favoriteError) {
            console.error("Error fetching favorite status:", favoriteError);
          } else {
            setIsFavorite(!!favoriteData);
            console.log("Favorite status:", !!favoriteData);
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

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to favorite games",
        variant: "destructive",
      })
      return
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        console.log(`Removing game ${id} from favorites for user ${user.id}`);
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('game_id', id)
          .eq('user_id', user.id)
        
        if (error) {
          console.error("Error removing favorite:", error);
          throw error;
        }
        
        console.log("Successfully removed from favorites");
        setIsFavorite((prevState) => {
          console.log("Setting isFavorite to:", !prevState);
          return !prevState;
        });
        toast({
          title: "Removed from favorites",
          description: `${game.title} has been removed from your favorites`,
        })

        // Update the UI with the new favorites count
        setGame((prev: any) => ({ 
          ...prev, 
          favorites_count: (prev.favorites_count || 0) - 1  // Remove favorite
        }));
      } else {
        // Add to favorites
        console.log(`Adding game ${id} to favorites for user ${user.id}`);
        const { error } = await supabase
          .from('favorites')
          .insert({
            game_id: id,
            user_id: user.id
          })
        
        if (error) {
          console.error("Error adding favorite:", error);
          throw error;
        }
        
        console.log("Successfully added to favorites");
        setIsFavorite((prevState) => {
          console.log("Setting isFavorite to:", !prevState);
          return !prevState;
        });
        toast({
          title: "Added to favorites",
          description: `${game.title} has been added to your favorites`,
        })

        // Update the UI with the new favorites count
        setGame((prev: any) => ({ 
          ...prev, 
          favorites_count: (prev.favorites_count || 0) + 1  // Add favorite
        }));
      }
    } catch (error: any) {
      toast({
        title: "Failed to update favorites",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handlePlayGame = async () => {
    if (!user) {
      // If user is not logged in, just open the game
      window.open(game.iframe_url, '_blank');
      return;
    }

    try {
      // Track the play first
      const { error } = await supabase
        .from('play_history')
        .insert({
          game_id: id,
          user_id: user.id
        });

      if (error) {
        console.error('Error tracking game play:', error);
      }
      
      // Open game in new tab
      window.open(game.iframe_url, '_blank');
    } catch (error) {
      console.error('Error tracking game play:', error);
      // Still open the game even if tracking fails
      window.open(game.iframe_url, '_blank');
    }
  };

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
                
                <div className="flex items-center space-x-2 text-sm text-white">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{new Date(game.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {game.github_url && (
                <Link
                  href={game.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-white hover:text-primary"
                >
                  <Github className="h-4 w-4 text-primary" />
                  <span>View Source</span>
                </Link>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleVote("up")}
                    variant="ghost"
                    className="flex h-auto items-center gap-1 p-0 hover:text-gray-300"
                    title="Upvote"
                  >
                    <ThumbsUp className={voted === "up" ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5 text-primary"} />
                    <span className="text-white">{game.likes || 0}</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleVote("down")}
                    variant="ghost"
                    className="flex h-auto items-center gap-1 p-0 hover:text-gray-300"
                    title="Downvote"
                  >
                    <ThumbsDown className={voted === "down" ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5 text-primary"} />
                    <span className="text-white">{game.dislikes || 0}</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <span className="text-white">{game.play_count || 0}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleFavorite}
                    variant="ghost"
                    className="flex h-auto items-center gap-1 p-0 hover:text-gray-300"
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Bookmark 
                      className={isFavorite ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5 text-primary"} 
                    />
                    <span className="text-white">{game.favorites_count || 0}</span>
                  </Button>
                </div>
              </div>
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

            <TabsContent value="play" className="space-y-6">
              {game.iframe_url ? (
                <div className="flex flex-col space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-800">
                    <iframe
                      src={game.iframe_url}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={game.title}
                    ></iframe>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={handlePlayGame} className="pixel-button">
                      Play in New Tab
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 p-8 text-center">
                  <p className="mb-4 text-gray-400">This game doesn't have a playable URL.</p>
                </div>
              )}
              
              <div className="rounded-lg border border-gray-800 bg-card p-6">
                <h3 className="pixel-text mb-4 text-lg font-bold text-primary">How to Play</h3>
                {game.how_to_play ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300">{game.how_to_play}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">No play instructions provided for this game.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <div className="rounded-lg border border-gray-800 bg-card p-6">
                <h3 className="pixel-text mb-4 text-lg font-bold text-primary">About This Game</h3>
                {game.long_description ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300">{game.long_description}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">No detailed description provided for this game.</p>
                )}
              </div>
              
              <div className="rounded-lg border border-gray-800 bg-card p-6">
                <h3 className="pixel-text mb-4 text-lg font-bold text-primary">Game Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-400">Genre</span>
                    <div className="flex flex-wrap gap-2">
                      {game.genres?.map((genre: string) => (
                        <span key={genre} className="tag">{genre}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-400">Built With</span>
                    <div className="flex flex-wrap gap-2">
                      {game.ai_tools?.map((tool: string) => (
                        <span key={tool} className="tag">{tool}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-400">Multiplayer</span>
                    <span>{game.is_multiplayer ? "Yes" : "No"}</span>
                  </div>
                  
                  {game.github_url && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-400">Source Code</span>
                      <Link 
                        href={game.github_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View on GitHub
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

