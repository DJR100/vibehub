"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Rocket, Trophy, DollarSign } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="pixel-text mb-8 text-center text-4xl font-bold">
          About <span className="text-primary">Vibe</span>
          <span className="text-secondary">Hub</span>
        </h1>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="rounded-lg border border-gray-800 bg-card p-8">
            <h2 className="pixel-text mb-6 text-2xl font-bold">Our Mission</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <p className="mb-4 text-white">
                  VibeHub is the home for AI-built web games, creating a vibrant community where players can discover
                  and enjoy games created with AI tools, and where creators can showcase their work to a passionate
                  audience.
                </p>
                <p className="mb-4 text-white">
                  We believe that AI-powered game development is democratizing game creation, allowing more people than
                  ever to bring their creative visions to life. Our platform celebrates this new wave of creativity by
                  providing a dedicated space for these games to thrive.
                </p>
                <p className="text-white">
                  Whether you're a player looking for unique gaming experiences or a creator wanting to share your
                  AI-built games with the world, VibeHub is the platform for you.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg flex items-center justify-center bg-black">
                <Image
                  src="/brain01.png"
                  alt="AI Brain Circuit - VibeHub Mission"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="pixel-text mb-6 text-center text-2xl font-bold text-primary">How It Works</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* For Players */}
            <div className="rounded-lg border border-gray-800 bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="pixel-text text-2xl">1</span>
              </div>
              <h3 className="pixel-text mb-3 text-xl">For Players</h3>
              <p className="text-white">
                Browse our collection of AI-built games, play them directly in your browser, and rate your favorites to
                help other players discover great games.
              </p>
            </div>

            {/* For Creators */}
            <div className="rounded-lg border border-gray-800 bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="pixel-text text-2xl">2</span>
              </div>
              <h3 className="pixel-text mb-3 text-xl">For Creators</h3>
              <p className="text-white">
                Upload your AI-built games to our platform, reach a dedicated audience, and get valuable feedback from
                players who appreciate your work.
              </p>
            </div>

            {/* For the Community */}
            <div className="rounded-lg border border-gray-800 bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="pixel-text text-2xl">3</span>
              </div>
              <h3 className="pixel-text mb-3 text-xl">For the Community</h3>
              <p className="text-white">
                Join a growing community of players and creators who are passionate about AI-built games, share
                experiences, and celebrate this new frontier in game development.
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="mb-16">
          <h2 className="pixel-text mb-6 text-center text-2xl font-bold text-primary">Roadmap</h2>

          <div className="rounded-lg border border-gray-800 bg-card p-8">
            <div className="flex flex-col space-y-8 md:flex-row md:space-x-6 md:space-y-0">
              {/* Launch Phase */}
              <div className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <Rocket className="h-8 w-8" />
                </div>
                <div className="mt-4 h-full rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                  <h3 className="pixel-text mb-2 text-xl">Launch</h3>
                  <p className="text-white">Core platform with game discovery, publishing, and user profiles.</p>
                </div>
              </div>

              {/* Tournaments Phase */}
              <div className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-white">
                  <Trophy className="h-8 w-8" />
                </div>
                <div className="mt-4 h-full rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                  <h3 className="pixel-text mb-2 text-xl">Tournaments</h3>
                  <p className="text-white">
                    Tournament creation, leaderboards, rankings, and live streaming integration.
                  </p>
                </div>
              </div>

              {/* Monetization Phase */}
              <div className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-white">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div className="mt-4 h-full rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                  <h3 className="pixel-text mb-2 text-xl">Monetization</h3>
                  <p className="text-white">Creator revenue sharing, premium memberships, and game marketplace.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="pixel-text mb-6 text-center text-2xl font-bold text-primary">FAQs</h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="rounded-lg border border-gray-800 bg-card px-6">
              <AccordionTrigger className="pixel-text text-lg font-medium">What are AI-built games?</AccordionTrigger>
              <AccordionContent className="text-white pt-2 pb-4">
                AI-built games (also known as "vibe-coded" games) are games created with the assistance of AI tools like
                GPT-4, Claude, or other large language models. These tools help developers with code generation, game
                design, asset creation, and more.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="rounded-lg border border-gray-800 bg-card px-6">
              <AccordionTrigger className="pixel-text text-lg font-medium">
                How do I play games on VibeHub?
              </AccordionTrigger>
              <AccordionContent className="text-white pt-2 pb-4">
                All games on VibeHub can be played directly in your browser. Simply browse the game library, click on a
                game that interests you, and start playing immediately. No downloads or installations required!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="rounded-lg border border-gray-800 bg-card px-6">
              <AccordionTrigger className="pixel-text text-lg font-medium">
                How can I upload my own game?
              </AccordionTrigger>
              <AccordionContent className="text-white pt-2 pb-4">
                To upload a game, you need to create a creator account. Once registered, you can use our simple upload
                form to submit your game. We support games hosted on platforms like Vercel, Netlify, or any other web
                hosting service.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="rounded-lg border border-gray-800 bg-card px-6">
              <AccordionTrigger className="pixel-text text-lg font-medium">Is VibeHub free to use?</AccordionTrigger>
              <AccordionContent className="text-white pt-2 pb-4">
                Yes! VibeHub is completely free for both players and creators. We believe in supporting the AI game
                development community and making these games accessible to everyone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="rounded-lg border border-gray-800 bg-card px-6">
              <AccordionTrigger className="pixel-text text-lg font-medium">
                What types of games are allowed on VibeHub?
              </AccordionTrigger>
              <AccordionContent className="text-white pt-2 pb-4">
                We welcome all types of web-based games created with AI assistance. This includes platformers, puzzles,
                RPGs, strategy games, card games, and more. The only requirement is that they must be playable in a web
                browser and created with some level of AI assistance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="rounded-lg border border-gray-800 bg-card px-6">
              <AccordionTrigger className="pixel-text text-lg font-medium">How do tournaments work?</AccordionTrigger>
              <AccordionContent className="text-white pt-2 pb-4">
                Tournaments are coming in a future update! Soon, creators will be able to host tournaments for their
                multiplayer games, and players will be able to compete for rankings and prizes. Stay tuned for more
                details as we approach our tournament feature release.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="pixel-text mb-6 text-2xl font-bold">
            Ready to <span className="text-primary">Join</span> the Community?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-white">
            Whether you want to play the latest AI-built games or share your own creations, VibeHub is the place to be.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/explore">
              <Button className="pixel-button">Explore Games</Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-2 border-primary bg-transparent text-primary hover:bg-primary/10"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

