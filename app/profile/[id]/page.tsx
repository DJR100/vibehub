"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThumbsUp, Eye, User, Pencil, Bookmark, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { ProfileData } from "@/types"

// Mock data for user games
const creatorGames = [
  {
    id: 1,
    title: "Pixel Dungeon Crawler",
    image: "/placeholder.svg?height=400&width=600",
    likes: 1243,
    views: 8976,
    tags: ["RPG", "Roguelike", "Pixel Art"],
  },
  {
    id: 2,
    title: "Space Defender 3000",
    image: "/placeholder.svg?height=400&width=600",
    likes: 892,
    views: 5432,
    tags: ["Shooter", "Arcade", "Space"],
  },
]

const favoriteGames = [
  {
    id: 3,
    title: "Neon Racer",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SynthWave",
    likes: 756,
    views: 4321,
    tags: ["Racing", "Cyberpunk", "Multiplayer"],
  },
  {
    id: 4,
    title: "Zombie Survival",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SurvivalGuru",
    likes: 543,
    views: 3210,
    tags: ["Survival", "Horror", "Action"],
  },
]

// Mock user data for profiles
const mockUsers = [
  {
    id: "1",
    email: "player@example.com",
    password: "password",
    role: "creator",
    username: "GameMaster42",
    bio: "Avid gamer and pixel art enthusiast",
    avatar_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    email: "creator@example.com",
    password: "password",
    role: "creator",
    username: "PixelWizard",
    bio: "Creating AI-powered games since 2023",
    avatar_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    email: "aigamedev@example.com",
    password: "password",
    role: "creator",
    username: "AIGameDev",
    bio: "AI enthusiast and game developer",
    avatar_url: "/placeholder.svg?height=100&width=100",
  },
]

// Use the EditProfileDialogProps interface
interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

// Add the type annotation to the function
function EditProfileDialog({ isOpen, onClose, onSave, initialData }: EditProfileDialogProps) {
  const { supabase } = useSupabase()
  const [username, setUsername] = useState(initialData.username || "")
  const [bio, setBio] = useState(initialData.bio || "")
  const [profileImage, setProfileImage] = useState(initialData.avatar_url || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.avatar_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image file should be less than 2MB",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)
    
    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    try {
      let avatarUrl = initialData.avatar_url || "";
      
      // If there's a new image file, upload it
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${initialData.id}/${Date.now()}.${fileExt}`;
        
        console.log("Starting avatar upload...");
        console.log("Using bucket:", 'avatars');
        console.log("File:", imageFile?.name);
        console.log("Path:", fileName);
        
        // Upload to avatars bucket
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
          toast({
            title: "Upload failed",
            description: "Failed to upload profile picture. " + uploadError.message,
            variant: "destructive",
          });
          return;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatarUrl = urlData.publicUrl;
      }
      
      // Continue with the rest of your save logic...
      onSave({
        ...initialData,
        username,
        bio,
        avatar_url: avatarUrl,
      });
      
      onClose();
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Save failed",
        description: "An error occurred while saving your profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-gray-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pixel-text text-xl">Edit Profile</DialogTitle>
        </DialogHeader>
        
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="relative h-24 w-24 rounded-full border-2 border-primary cursor-pointer overflow-hidden"
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-400">
                <Camera className="h-8 w-8" />
              </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          
          <p className="text-xs text-gray-400">
            Click to upload a profile picture
          </p>
        </div>
        
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pixel-input"
          />
        </div>
        
        {/* Bio Field */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="pixel-input"
          />
        </div>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="pixel-button">
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Add this function to any component that needs it
function extractXHandle(url: string) {
  if (!url) return "";
  // Try to extract handle from x.com or twitter.com URLs
  const match = url.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/i);
  return match ? "@" + match[1] : url;
}

export default function ProfilePage() {
  const params = useParams()
  const { id } = params
  const { user, updateProfile, supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [profileUser, setProfileUser] = useState<any>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [userGames, setUserGames] = useState<any[]>([])
  const [favoriteGames, setFavoriteGames] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [playHistory, setPlayHistory] = useState<any[]>([])
  const [profileStats, setProfileStats] = useState({
    gamesPlayed: 0,
    totalPlays: 0,
    favoritesCount: favoriteGames.length,
    gamesCreated: userGames.length
  });

  useEffect(() => {
    if (!user && !id) {
      router.push("/login")
      return
    }

    // If viewing someone else's profile OR your own profile by ID
    if (id) {
      // Always fetch the complete profile from the database
      const fetchProfileData = async () => {
        setLoading(true)
        
        try {
          console.log('Fetching profile data for ID:', id);
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()
          
          if (error || !data) {
            console.error('Error fetching profile or no data:', error);
            // User not found, redirect to explore
            router.push("/explore")
            return
          }
          
          console.log('Profile data fetched:', data);
          
          // Merge auth metadata with profile data for your own profile
          if (user && user.id === id) {
            console.log('Setting own profile data');
            setProfileUser({
              ...user,
              ...data
            })
            setIsOwnProfile(true)
          } else {
            console.log('Setting other user profile data');
            setProfileUser(data)
            setIsOwnProfile(false)
          }

          // Fetch the user's games
          const { data: userGamesData, error: userGamesError } = await supabase
            .from('games')
            .select(`
              id,
              title,
              image,
              likes,
              dislikes,
              views,
              favorites_count,
              genres,
              created_at
            `)
            .eq('creator_id', id)
            .order('created_at', { ascending: false });
          
          if (!userGamesError && userGamesData) {
            // For each game, fetch play count
            const gamesWithPlayCounts = await Promise.all(userGamesData.map(async (game: { id: string }) => {
              const { count: playCount, error: playCountError } = await supabase
                .from('play_history')
                .select('*', { count: 'exact' })
                .eq('game_id', game.id);
              
              return {
                ...game,
                play_count: playCount || 0
              };
            }));
            
            setUserGames(gamesWithPlayCounts || []);
          } else {
            console.error('Error fetching user games:', userGamesError);
            setUserGames([]);
          }

          // Fetch favorite games
          if (user) {
            try {
              console.log(`Fetching favorites for user ${id}`);
              const { data: favoritesData, error: favoritesError } = await supabase
                .from('favorites')
                .select(`
                  game_id,
                  games:game_id (
                    id, 
                    title, 
                    image, 
                    likes, 
                    views, 
                    favorites_count,
                    genres,
                    creator_id,
                    profiles:creator_id (username)
                  )
                `)
                .eq('user_id', id)
              
              if (favoritesError) {
                console.error("Error fetching favorites:", favoritesError);
                toast({
                  title: "Error loading favorites",
                  description: "Could not load favorites at this time",
                  variant: "destructive",
                });
              } else if (favoritesData && favoritesData.length > 0) {
                // Format the favorites data and get play counts
                const formattedFavoritesPromises = favoritesData
                  .filter((item: any) => item.games)
                  .map(async (item: any) => {
                    // Get play count for this game
                    const { count: playCount, error: playCountError } = await supabase
                      .from('play_history')
                      .select('*', { count: 'exact' })
                      .eq('game_id', item.games.id);
                    
                    return {
                      id: item.games.id,
                      title: item.games.title,
                      image: item.games.image || "/placeholder.svg",
                      likes: item.games.likes || 0,
                      play_count: playCount || 0,  // Use play_count instead of views
                      favorites_count: item.games.favorites_count || 0,
                      creator: item.games.profiles?.username || "Unknown Creator",
                      tags: item.games.genres || []
                    };
                  });
                
                const formattedFavorites = await Promise.all(formattedFavoritesPromises);
                setFavoriteGames(formattedFavorites);
                console.log(`Loaded ${formattedFavorites.length} favorites`);
              } else {
                console.log("No favorites found");
                setFavoriteGames([]);
              }
            } catch (error) {
              console.error("Exception when fetching favorites:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
      
      fetchProfileData()
    }

    if (profileUser) {
      setUsername(profileUser.username || profileUser.user_metadata?.username || "")
      setBio(profileUser.bio || "")
    }
  }, [user, router, id, supabase])

  useEffect(() => {
    const fetchPlayStats = async () => {
      if (!profileUser?.id) return;

      try {
        console.log('Fetching play history for user:', profileUser.id);

        // Fetch all play history records
        const { data: playHistoryData } = await supabase
          .from('play_history')
          .select('game_id')
          .eq('user_id', profileUser.id);

        // Process data client-side to count unique games
        const uniqueGameIds = new Set();
        playHistoryData?.forEach((item: { game_id: string | number }) => {
          if (item.game_id) uniqueGameIds.add(item.game_id);
        });

        // The size of the Set gives us the count of unique games
        const uniqueGamesCount = uniqueGameIds.size;

        // Get total play count
        const { count: totalPlays, error: countError } = await supabase
          .from('play_history')
          .select('*', { count: 'exact' })
          .eq('user_id', profileUser.id);

        // Get favorites count
        const { count: favoritesCount, error: favoritesError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact' })
          .eq('user_id', profileUser.id);

        // Get games created count
        const { count: gamesCreated, error: gamesError } = await supabase
          .from('games')
          .select('*', { count: 'exact' })
          .eq('creator_id', profileUser.id);

        if (!countError && !favoritesError && !gamesError) {
          setProfileStats(prev => ({
            ...prev,
            gamesPlayed: uniqueGamesCount,
            totalPlays: totalPlays || 0,
            favoritesCount: favoritesCount || 0,
            gamesCreated: gamesCreated || 0
          }));
        }
        
        // Fetch detailed play history
        const { data: detailedPlayHistory, error: historyError } = await supabase
          .from('play_history')
          .select(`
            id,
            created_at,
            game_id,
            games:game_id (
              id,
              title,
              image,
              profiles:creator_id (username)
            )
          `)
          .eq('user_id', profileUser.id)
          .order('created_at', { ascending: false })
          .limit(10);

        console.log('Play history fetch result:', { detailedPlayHistory, historyError });

        if (!historyError && detailedPlayHistory) {
          // Format the play history data
          const formattedHistory = detailedPlayHistory.map((item: any) => ({
            id: item.id,
            gameId: item.game_id,
            title: item.games?.title || "Unknown Game",
            image: item.games?.image || "/placeholder.svg",
            creator: item.games?.profiles?.username || "Unknown Creator",
            playedAt: item.created_at
          }));
          
          console.log('Formatted play history:', formattedHistory);
          setPlayHistory(formattedHistory);
        } else {
          console.error('Error fetching play history:', historyError);
          setPlayHistory([]);
        }
      } catch (error) {
        console.error('Error fetching play stats:', error);
      }
    };

    fetchPlayStats();
  }, [profileUser?.id, supabase]);

  useEffect(() => {
    console.log('Play history state updated:', playHistory?.length);
  }, [playHistory]);

  const handleSaveProfile = async (profileData: ProfileData) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update user metadata including the avatar
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          username: profileData.username,
          avatar_url: profileData.avatar_url,
        }
      });
      
      if (metadataError) throw metadataError;
      
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Update the profile user state to reflect changes immediately
      setProfileUser({
        ...profileUser,
        username: profileData.username,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Refresh the UI
      router.refresh();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditDialogOpen(true)
  }

  const handlePlayGame = async (gameId: string, gameUrl: string) => {
    if (!user) {
      // If user is not logged in, just open the game
      window.open(gameUrl, '_blank');
      return;
    }

    try {
      // Set play start time in localStorage
      const startTime = Date.now();
      const playSessionKey = `game_play_${gameId}_${user.id}`;
      localStorage.setItem(playSessionKey, startTime.toString());
      
      // Track the play first
      const { data, error } = await supabase
        .from('play_history')
        .insert({
          game_id: gameId,
          user_id: user.id,
          duration_seconds: 0 // Initial duration, will be updated when game closes
        })
        .select()
        .single();

      if (error) {
        console.error('Error tracking game play:', error);
      }
      
      // Save the play_history record ID for later update
      if (data) {
        localStorage.setItem(`${playSessionKey}_record_id`, data.id);
      }
      
      // Open game in new tab
      const gameWindow = window.open(gameUrl, '_blank');
      
      // Set up an event to detect when user returns to this page
      window.addEventListener('focus', function onFocus() {
        updatePlayDuration(playSessionKey);
        window.removeEventListener('focus', onFocus);
      });
    } catch (error) {
      console.error('Error tracking game play:', error);
      // Still open the game even if tracking fails
      window.open(gameUrl, '_blank');
    }
  };

  // Function to update play duration when user returns from game
  const updatePlayDuration = async (playSessionKey: string) => {
    try {
      const startTimeStr = localStorage.getItem(playSessionKey);
      const recordId = localStorage.getItem(`${playSessionKey}_record_id`);
      
      if (!startTimeStr || !recordId) {
        console.error('Missing play session data');
        return;
      }
      
      const startTime = parseInt(startTimeStr);
      const endTime = Date.now();
      const durationSeconds = Math.floor((endTime - startTime) / 1000);
      
      // Only update if the duration is reasonable (more than 5 seconds, less than 6 hours)
      if (durationSeconds > 5 && durationSeconds < 21600) {
        const { error } = await supabase
          .from('play_history')
          .update({ duration_seconds: durationSeconds })
          .eq('id', recordId);
          
        if (error) {
          console.error('Error updating play duration:', error);
        } else {
          console.log(`Updated play duration: ${durationSeconds} seconds`);
        }
      }
      
      // Clean up localStorage
      localStorage.removeItem(playSessionKey);
      localStorage.removeItem(`${playSessionKey}_record_id`);
      
    } catch (error) {
      console.error('Error updating play duration:', error);
    }
  };
  
  // Check for any unfinished play sessions when the page loads
  useEffect(() => {
    if (user && id) {
      // Check for any games started from this profile page
      const keys = Object.keys(localStorage);
      const sessionKeys = keys.filter(key => key.startsWith('game_play_') && key.endsWith(`_${user.id}`));
      
      sessionKeys.forEach((key: string) => {
        if (!key.includes('_record_id')) {
          updatePlayDuration(key);
        }
      });
    }
  }, [user, id]);

  // Helper function to format duration
  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "Unknown";
    
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}min`;
    }
  };

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="pixel-text mb-4 text-2xl">Loading profile...</div>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-800">
              <div className="animate-pulse h-full w-1/2 bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayName = profileUser.username || profileUser.user_metadata?.username || "User"
  const displayBio = profileUser.bio || "No bio yet."

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <div className="rounded-lg border border-gray-800 bg-card p-6 text-center">
              <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src={profileUser.avatar_url || profileUser.avatar || "/placeholder.svg?height=96&width=96"}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <h2 className="pixel-text text-primary mb-2 text-xl font-bold">
                {displayName}
              </h2>
              
              <p className="text-gray-300 mb-4 text-sm">
                {displayBio}
              </p>

              {isOwnProfile && (
                <>
                  <Button onClick={handleEditProfile} className="pixel-button w-full">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  
                  <EditProfileDialog 
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    onSave={(data: ProfileData) => handleSaveProfile(data)}
                    initialData={{
                      id: user?.id || "",
                      username: profileUser?.username || "",
                      bio: profileUser?.bio || "",
                      avatar_url: profileUser?.avatar_url || profileUser?.avatar || ""
                    }}
                  />
                </>
              )}
            </div>

            <div className="rounded-lg border border-gray-800 bg-card p-6">
              <h3 className="pixel-text mb-4 text-lg font-bold text-primary">Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Games Played</span>
                  <span className="font-medium text-white">{profileStats.gamesPlayed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Favorites</span>
                  <span className="font-medium text-white">{profileStats.favoritesCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Games Created</span>
                  <span className="font-medium text-white">{profileStats.gamesCreated}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Plays</span>
                  <span className="font-medium text-white">{profileStats.totalPlays.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="mygames">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger
                value="mygames"
                className="pixel-text text-sm data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-1px_0_0_var(--primary),0_1px_0_0_var(--primary)]"
              >
                {isOwnProfile ? "My Games" : "Their Games"}
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="pixel-text text-sm data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-1px_0_0_var(--primary),0_1px_0_0_var(--primary)]"
              >
                Favorites
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="pixel-text text-sm data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-1px_0_0_var(--primary),0_1px_0_0_var(--primary)]"
              >
                Play History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mygames" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="pixel-text text-xl font-bold">{isOwnProfile ? "My Games" : "Their Games"}</h3>
                {isOwnProfile && (
                  <Link href="/upload">
                    <Button className="pixel-button">Upload New Game</Button>
                  </Link>
                )}
              </div>

              {userGames.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {userGames.map((game: any) => (
                    <Link key={game.id} href={`/game/${game.id}`} className="game-card">
                      <Image
                        src={game.image || "/placeholder.svg"}
                        alt={game.title || "Game"}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="game-card-content">
                        <div className="flex flex-wrap gap-2">
                          {game.tags && Array.isArray(game.tags) && game.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                          {game.tags && Array.isArray(game.tags) && game.tags.length > 2 && (
                            <span className="tag">+{game.tags.length - 2}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="pixel-text mb-2 text-lg font-bold">{game.title || "Untitled Game"}</h3>
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
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-800 bg-card p-8 text-center">
                  <p className="text-gray-400">
                    {isOwnProfile
                      ? "You haven't uploaded any games yet."
                      : "This user hasn't uploaded any games yet."}
                  </p>
                  {isOwnProfile && (
                    <Link href="/upload">
                      <Button variant="outline" className="mt-4">
                        Upload Your First Game
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <h3 className="pixel-text text-xl font-bold">Favorite Games</h3>

              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="pixel-text text-lg">Loading favorites...</div>
                </div>
              ) : favoriteGames.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {favoriteGames.map((game) => (
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
                          <h3 className="pixel-text mb-2 text-lg font-bold text-white">{game.title}</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-xs text-white">
                              <User className="h-3 w-3 text-primary" />
                              <span>{game.creator}</span>
                            </div>
                            {game.creator_x_url && (
                              <a 
                                href={game.creator_x_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-xs text-white hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-primary">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                <span>{extractXHandle(game.creator_x_url)}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 p-8 text-center">
                  <h3 className="pixel-text mb-2 text-xl">No favorites yet</h3>
                  <p className="mb-4 text-gray-400">
                    {isOwnProfile
                      ? "Explore games and add them to your favorites!"
                      : "This user hasn't added any favorites yet."}
                  </p>
                  <Link href="/explore">
                    <Button className="pixel-button">Explore Games</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <h3 className="pixel-text text-xl font-bold">Play History</h3>

              <div className="rounded-lg border border-gray-800 bg-card">
                {playHistory && playHistory.length > 0 ? (
                  <div className="p-4">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex-1 font-medium">Game</div>
                      <div className="w-32 text-center font-medium">Date Played</div>
                    </div>

                    <div className="divide-y divide-gray-800">
                      {playHistory.map((play) => (
                        <Link 
                          key={play.id} 
                          href={`/game/${play.gameId}`} 
                          className="flex items-center justify-between py-4 hover:bg-gray-800/30"
                        >
                          <div className="flex flex-1 items-center space-x-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded">
                              <Image
                                src={play.image}
                                alt={play.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-primary">{play.title}</div>
                              <div className="text-xs text-white">by {play.creator}</div>
                            </div>
                          </div>
                          <div className="w-32 text-center text-sm text-white">
                            {new Date(play.playedAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-lg p-8 text-center">
                    <h3 className="pixel-text mb-2 text-xl">No play history yet</h3>
                    <p className="mb-4 text-gray-400">
                      {isOwnProfile
                        ? "Start playing games to see your history!"
                        : "This user hasn't played any games yet."}
                    </p>
                    <Link href="/explore">
                      <Button className="pixel-button">Explore Games</Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

