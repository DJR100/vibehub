"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { X, Plus, ChevronDown, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Papa from 'papaparse'
import fs from 'fs/promises'
import path from 'path'

// Comment out the GameCsvRow interface
/*
interface GameCsvRow {
  title: string;
  description: string;
  long_description?: string;
  how_to_play?: string;
  image?: string;
  iframe_url: string;
  github_url?: string;
  tags?: string;
  genres: string;
  ai_tools: string;
  is_multiplayer?: string;
  creator_x_url: string;
}
*/

export default function UploadPage() {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [howToPlay, setHowToPlay] = useState("")
  const [iframeUrl, setIframeUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [genres, setGenres] = useState<string[]>([])
  const [aiTools, setAiTools] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [currentTag, setCurrentTag] = useState("")
  const [isMultiplayer, setIsMultiplayer] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [creatorXUrl, setCreatorXUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  
  // Comment out bulk upload state
  /*
  const [bulkUploadResults, setBulkUploadResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  }>({ successful: 0, failed: 0, errors: [] });
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  */

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
    
    // Validation checks
    const requiredFields = {
      title: title.trim(),
      description: description.trim(),
      longDescription: longDescription.trim(),
      howToPlay: howToPlay.trim(),
      iframeUrl: iframeUrl.trim(),
      imageFile: imageFile,
      genres: genres,
      aiTools: aiTools
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return !value;
      })
      .map(([key]) => key);

    if (missingFields.length > 0) {
      // Use a friendly field name mapping
      const fieldNames = {
        title: "Title",
        description: "Short Description",
        longDescription: "About This Game",
        howToPlay: "How to Play",
        iframeUrl: "Game URL",
        imageFile: "Game Image",
        genres: "Genres",
        aiTools: "AI Tools"
      };
      
      // Single toast notification for all missing fields
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields marked with an asterisk (*) before uploading.",
        variant: "destructive",
      });
      
      return;
    }

    if (!creatorXUrl) {
      setError("Creator's X URL is required");
      return;
    }

    if (!creatorXUrl.includes('x.com/') && !creatorXUrl.includes('twitter.com/')) {
      setError("Please enter a valid X (Twitter) URL");
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
        how_to_play: howToPlay,
        image: imageUrl,
        creator_id: user.id,
        iframe_url: iframeUrl,
        github_url: githubUrl || "",
        tags,
        genres,
        ai_tools: aiTools,
        is_multiplayer: isMultiplayer,
        likes: 0,
        dislikes: 0,
        views: 0,
        favorites_count: 0,
        creator_x_url: creatorXUrl
      });

      const { data: game, error: insertError } = await supabase
        .from('games')
        .insert({
          title,
          description,
          long_description: longDescription,
          how_to_play: howToPlay,
          image: imageUrl,
          creator_id: user.id,
          iframe_url: iframeUrl,
          github_url: githubUrl || "",
          tags,
          genres,
          ai_tools: aiTools,
          is_multiplayer: isMultiplayer,
          likes: 0,
          dislikes: 0,
          views: 0,
          favorites_count: 0,
          creator_x_url: creatorXUrl
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

  // Comment out bulk upload related functions
  /*
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast({
        title: "No CSV file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsBulkUploading(true);
    const results = { successful: 0, failed: 0, errors: [] as string[] };

    try {
      const text = await csvFile.text();
      const { data } = Papa.parse(text, { header: true });

      for (const row of data as GameCsvRow[]) {
        try {
          // Process each row and upload to Supabase
          const { error } = await supabase.from('games').insert({
            title: row.title,
            description: row.description,
            long_description: row.long_description,
            how_to_play: row.how_to_play,
            image: row.image || "/placeholder.svg",
            creator_id: user?.id,
            iframe_url: row.iframe_url,
            github_url: row.github_url,
            tags: row.tags?.split(',').map(tag => tag.trim()),
            genres: row.genres.split(',').map(genre => genre.trim()),
            ai_tools: row.ai_tools.split(',').map(tool => tool.trim()),
            is_multiplayer: row.is_multiplayer === 'true',
            creator_x_url: row.creator_x_url,
            likes: 0,
            dislikes: 0,
            views: 0,
            favorites_count: 0
          });

          if (error) throw error;
          results.successful++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`Error uploading ${row.title}: ${error.message}`);
        }
      }

      setBulkUploadResults(results);
      toast({
        title: "Bulk upload completed",
        description: `Successfully uploaded ${results.successful} games. Failed: ${results.failed}`,
        variant: results.failed > 0 ? "destructive" : "default",
      });
    } catch (error: any) {
      toast({
        title: "Bulk upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsBulkUploading(false);
    }
  };
  */

  if (!user) {
    return null // Handled by the useEffect redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="pixel-text mb-4 text-3xl font-bold">
          Upload <span className="text-primary">Game</span>
        </h1>

        {/* Required fields notice */}
        <p className="mb-4 text-sm text-gray-400">
          Fields marked with an asterisk (*) are required
        </p>

        <div className="rounded-lg border border-gray-800 bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-primary">*</span>
              </Label>
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
              <Label htmlFor="description">
                Short Description <span className="text-primary">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your game (displayed in search results)"
                className="min-h-[80px]"
                required
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <Label htmlFor="longDescription">
                About This Game <span className="text-primary">*</span>
              </Label>
              <p className="text-sm text-gray-400 mb-2">
                Tell players about your game's story, features, and what makes it special.
              </p>
              <Textarea
                id="longDescription"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Provide detailed information about your game, its story, main features, and what makes it unique."
                className="min-h-[150px]"
                required
              />
            </div>

            {/* How to Play */}
            <div className="space-y-2">
              <Label htmlFor="howToPlay">
                How to Play <span className="text-primary">*</span>
              </Label>
              <p className="text-sm text-gray-400 mb-2">
                Explain the controls and basic instructions for playing your game.
              </p>
              <Textarea
                id="howToPlay"
                value={howToPlay}
                onChange={(e) => setHowToPlay(e.target.value)}
                placeholder="Explain game controls, objectives, and any tips for players (e.g., 'Use WASD to move, Space to jump, Click to interact')"
                className="min-h-[150px]"
                required
              />
            </div>

            {/* Game URL */}
            <div className="space-y-2">
              <Label htmlFor="iframeUrl">
                Game URL <span className="text-primary">*</span>
              </Label>
              <p className="text-sm text-gray-400 mb-2">
                Enter the URL where your game is hosted. This is where players will play your game.
              </p>
              <Input
                id="iframeUrl"
                value={iframeUrl}
                onChange={(e) => setIframeUrl(e.target.value)}
                placeholder="https://your-game-url.com"
                className="w-full"
                required
              />
            </div>

            {/* GitHub URL */}
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
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
              <Label htmlFor="image" className="block">
                Game Image <span className="text-primary">*</span>
              </Label>
              <div className="mt-1 flex items-start gap-4">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-600">
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
                <div className="flex flex-col space-y-2 flex-grow w-full">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-red-400">Upload a thumbnail image for your game (16:9 ratio recommended)</p>
                </div>
              </div>
            </div>

            {/* Genres - Dropdown Selection */}
            <div className="space-y-2">
              <Label>
                Genres <span className="text-primary">*</span>
              </Label>
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
              {/* Selected genres display */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {genre}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-primary"
                        onClick={() => handleRemoveGenre(genre)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* AI Tools - Dropdown Selection */}
            <div className="space-y-2">
              <Label>
                AI Tools Used <span className="text-primary">*</span>
              </Label>
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
              {/* Selected AI tools display */}
              {aiTools.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {aiTools.map((tool) => (
                    <Badge key={tool} variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {tool}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-primary"
                        onClick={() => handleRemoveAiTool(tool)}
                      />
                    </Badge>
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

            {/* Creator's X URL */}
            <div className="mb-4">
              <Label htmlFor="creatorXUrl" className="block text-sm font-medium text-gray-200 mb-1">
                Creator's X URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="creatorXUrl"
                type="text"
                placeholder="https://x.com/username"
                value={creatorXUrl}
                onChange={(e) => setCreatorXUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the X account URL of the original creator (even if you're uploading on their behalf)
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button type="submit" className="pixel-button" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Game"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Comment out bulk upload UI section */}
        {/*
        <div className="mt-10 rounded-lg border border-gray-800 bg-card p-6">
          <h2 className="pixel-text mb-4 text-2xl font-bold">Bulk Upload Games</h2>
          <p className="mb-4 text-sm text-gray-400">
            Upload multiple games at once using a CSV file.
          </p>
          
          <form onSubmit={handleBulkUpload} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="csvFile">Select CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-400">
                Required columns: title, description, iframe_url, genres, ai_tools, creator_x_url
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="pixel-button w-full" 
              disabled={isBulkUploading || !csvFile}
            >
              {isBulkUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Start Bulk Upload"
              )}
            </Button>
          </form>
          
          {isBulkUploading && (
            <div className="mt-4 bg-gray-900 p-4 rounded-md">
              <p className="text-center">Processing CSV file, please wait...</p>
            </div>
          )}
          
          {bulkUploadResults.successful > 0 && (
            <div className="mt-4 bg-green-900/30 p-4 rounded-md">
              <p>Successfully uploaded {bulkUploadResults.successful} games</p>
            </div>
          )}
          
          {bulkUploadResults.errors.length > 0 && (
            <div className="mt-4 bg-red-900/30 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Errors ({bulkUploadResults.failed}):</h3>
              <div className="max-h-60 overflow-y-auto">
                <ul className="list-disc pl-5 text-sm text-red-300 space-y-1">
                  {bulkUploadResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        */}
      </div>
    </div>
  )
}

