import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Eye, User } from "lucide-react"
import TrendingGames from "@/components/trending-games"

// Featured games data
const featuredGames = [
  {
    id: 1,
    title: "Pixel Dungeon Crawler",
    image: "/placeholder.svg?height=400&width=600",
    creator: "PixelWizard",
    likes: 1243,
    views: 8976,
    tags: ["RPG", "Roguelike", "Pixel Art"],
  },
  {
    id: 2,
    title: "Space Defender 3000",
    image: "/placeholder.svg?height=400&width=600",
    creator: "AIGameDev",
    likes: 892,
    views: 5432,
    tags: ["Shooter", "Arcade", "Space"],
  },
  {
    id: 3,
    title: "Neon Racer",
    image: "/placeholder.svg?height=400&width=600",
    creator: "SynthWave",
    likes: 756,
    views: 4321,
    tags: ["Racing", "Cyberpunk", "Multiplayer"],
  },
]

export default function Home() {
  return (
    <div className="flex flex-col bg-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black"></div>
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="pixel-text mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            <span className="text-primary">The Home for AI-built Web Games</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Discover, play, and share games created with AI tools. Join the vibe-coded gaming revolution on VibeHub.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/explore">
              <Button className="pixel-button text-lg">Explore Games</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="pixel-text mb-8 text-center text-3xl font-bold text-primary">Featured Games</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredGames.map((game) => (
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
                          <span>{game.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Games */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <h2 className="pixel-text mb-8 text-center text-3xl font-bold text-primary">Trending Now</h2>
          <TrendingGames />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="pixel-text mb-6 text-3xl font-bold">
            Ready to <span className="text-primary">Share</span> Your Game?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            Upload your AI-built game and join a community of creators and players passionate about the future of gaming
            on VibeHub.
          </p>
          <Link href="/upload">
            <Button className="pixel-button text-lg">Upload Your Game</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

