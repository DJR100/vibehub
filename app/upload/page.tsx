"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { X, Plus, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function UploadPage() {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [iframeUrl, setIframeUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [genres, setGenres] = useState<string[]>([])
  const [aiTools, setAiTools] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isMultiplayer, setIsMultiplayer] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Available options
  const genreOptions = [
    "RPG",
    "Shooter",
    "Racing",
    "Puzzle",
    "Platformer",
    "Strategy",
    "Card Game",
    "Arcade",
    "Survival",
    "Fighting",
  ]

  const aiToolOptions = [
    "GPT-4o",
    "GPT-4 Turbo",
    "GPT-4",
    "GPT-3.5 Turbo",
    "GPT-3.5",
    "GPT-4.5 Preview",
    "o3-mini",
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
  ]

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      console.log("User ID:", user.id);
      
      // Test a direct insert from the browser
      const testInsert = async () => {
        try {
          console.log("Testing direct insert...");
          const { data, error } = await supabase
            .from('games')
            .insert({
              title: "Test Game from Browser",
              description: "This is a test",
              image: "/placeholder.svg",
              creator_id: user.id,
              genres: ["RPG"],
              ai_tools: ["GPT-4"],
              likes: 0,
              dislikes: 0,
              views: 0
            })
            .select();
          
          if (error) {
            console.error("Test insert error:", error);
          } else {
            console.log("Test insert successful:", data);
          }
        } catch (err) {
          console.error("Test insert exception:", err);
        }
      };
      
      // Uncomment this line to run the test
      // testInsert();
    }
  }, [user, supabase]);

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag) && tags.length < 5) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const toggleGenre = (genre: string) => {
    setGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const handleRemoveGenre = (genreToRemove: string) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove))
  }

  const toggleAiTool = (tool: string) => {
    setAiTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]))
  }

  const handleRemoveAiTool = (toolToRemove: string) => {
    setAiTools(aiTools.filter((tool) => tool !== toolToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    if (genres.length === 0) {
      toast({
        title: "Genre required",
        description: "Please select at least one genre for your game",
        variant: "destructive",
      });
      return;
    }

    if (aiTools.length === 0) {
      toast({
        title: "AI Tool required",
        description: "Please select at least one AI tool used to create your game",
        variant: "destructive",
      });
      return;
    }

    // Check for iframe URL
    if (!iframeUrl) {
      toast({
        title: "Game URL required",
        description: "Please provide a URL where your game is hosted",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload game image to storage if provided
      let imageUrl = "/placeholder.svg";
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        try {
          const { error: uploadError, data } = await supabase.storage
            .from('game_images')
            .upload(filePath, imageFile);
          
          if (uploadError) {
            console.error("Image upload error:", uploadError);
            // Continue with placeholder image if upload fails
          } else {
            // Get the public URL for the uploaded image
            const { data: urlData } = supabase.storage
              .from('game_images')
              .getPublicUrl(filePath);
            
            imageUrl = urlData.publicUrl;
          }
        } catch (storageError) {
          console.error("Storage error:", storageError);
          // Continue with placeholder image
        }
      }
      
      // Step 2: Insert game data into games table
      console.log("Inserting game with data:", {
        title,
        description,
        long_description: longDescription,
        image: imageUrl,
        creator_id: user.id,
        iframe_url: iframeUrl, // Make sure this is included!
        github_url: githubUrl || "", // Use empty string if null
        tags,
        genres,
        ai_tools: aiTools,
        is_multiplayer: isMultiplayer,
        likes: 0,
        dislikes: 0,
        views: 0
      });

      const { data: game, error: insertError } = await supabase
        .from('games')
        .insert({
          title,
          description,
          long_description: longDescription || "", // Use empty string if null
          image: imageUrl,
          creator_id: user.id,
          iframe_url: iframeUrl, // This was missing or null
          github_url: githubUrl || "", // Use empty string if null
          tags,
          genres,
          ai_tools: aiTools,
          is_multiplayer: isMultiplayer,
          likes: 0,
          dislikes: 0,
          views: 0
        })
        .select()
        .single();
        
      if (insertError) {
        console.error("Database insert error:", insertError);
        throw insertError;
      }
      
      console.log("Insert successful:", game);
      
      toast({
        title: "Game uploaded successfully",
        description: "Your game has been published to VibeHub",
      });
      
      router.push(`/game/${game.id}`);
    } catch (error: any) {
      console.error("Overall error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    return null // Handled by the useEffect redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="pixel-text mb-8 text-3xl font-bold">
          Upload <span className="text-primary">Game</span>
        </h1>

        <div className="rounded-lg border border-gray-800 bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your game title"
                required
                className="pixel-input"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your game (max 150 characters)"
                maxLength={150}
                required
                className="pixel-input"
              />
              <p className="text-xs text-gray-400">{description.length}/150 characters</p>
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <Label htmlFor="longDescription">Full Description</Label>
              <Textarea
                id="longDescription"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="A detailed description of your game, gameplay, controls, etc."
                className="pixel-input min-h-[150px]"
                required
              />
            </div>

            {/* Game URL */}
            <div className="space-y-2">
              <Label htmlFor="iframeUrl">Game URL</Label>
              <Input
                id="iframeUrl"
                value={iframeUrl}
                onChange={(e) => setIframeUrl(e.target.value)}
                placeholder="https://your-game-url.com"
                type="url"
                required
                className="pixel-input"
              />
              <p className="text-xs text-gray-400">URL where your game is hosted (Vercel, Netlify, etc.)</p>
            </div>

            {/* GitHub URL */}
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername/your-repo"
                type="url"
                className="pixel-input"
              />
            </div>

            {/* Game Image Upload */}
            <div className="mb-4">
              <Label htmlFor="image" className="block">Game Image</Label>
              <div className="mt-1 flex items-center gap-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-md border border-gray-600">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Game preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Upload a thumbnail image for your game (16:9 ratio recommended)</p>
            </div>

            {/* Genres - Dropdown Selection */}
            <div className="space-y-2">
              <Label>Genres (Select all that apply)</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {genres.length > 0 ? `${genres.length} selected` : "Select genres"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
                  {genreOptions.map((genre) => (
                    <DropdownMenuCheckboxItem
                      key={genre}
                      checked={genres.includes(genre)}
                      onCheckedChange={() => toggleGenre(genre)}
                    >
                      {genre}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {genres.map((genre) => (
                    <div
                      key={genre}
                      className="flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs text-white"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genre)}
                        className="ml-2 text-gray-300 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {genre}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Tools - Dropdown Selection */}
            <div className="space-y-2">
              <Label>AI Tools Used (Select all that apply)</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {aiTools.length > 0 ? `${aiTools.length} selected` : "Select AI tools"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
                  {aiToolOptions.map((tool) => (
                    <DropdownMenuCheckboxItem
                      key={tool}
                      checked={aiTools.includes(tool)}
                      onCheckedChange={() => toggleAiTool(tool)}
                    >
                      {tool}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {aiTools.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {aiTools.map((tool) => (
                    <div
                      key={tool}
                      className="flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs text-white"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => handleRemoveAiTool(tool)}
                        className="ml-2 text-gray-300 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tool}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  className="pixel-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  disabled={!currentTag || tags.length >= 5}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs text-white">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-300 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </button>
                  </div>
                ))}
                {tags.length === 0 && (
                  <p className="text-xs text-gray-400">Add up to 5 tags to help players find your game</p>
                )}
              </div>
            </div>

            {/* Multiplayer */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="multiplayer"
                checked={isMultiplayer}
                onChange={(e) => setIsMultiplayer(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary focus:ring-primary"
              />
              <Label htmlFor="multiplayer">This is a multiplayer game</Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="pixel-button w-full" disabled={loading}>
              {loading ? "Uploading..." : "Upload Game"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

