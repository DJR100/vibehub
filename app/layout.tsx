import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/lib/supabase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeHub",
  description: "Home for AI-built web games",
  icons: {
    icon: '/Favicon.ico',
    shortcut: '/Favicon.ico',
    apple: '/Favicon.ico',
    other: {
      rel: 'apple-touch-icon',
      url: '/Favicon.ico',
    },
  },
  generator: 'v0.dev'
}

// Function to generate random game stats with plays always being highest
const generateSpoofedStats = () => {
  // Generate random numbers
  const likes = Math.floor(Math.random() * 259) + 1; // Random between 1-259
  const saves = Math.floor(Math.random() * 259) + 1; // Random between 1-259
  
  // Make plays higher than both likes and saves
  const maxOfOthers = Math.max(likes, saves);
  const plays = maxOfOthers + Math.floor(Math.random() * (259 - maxOfOthers)) + 1;
  
  return { likes, saves, plays };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SupabaseProvider>
            <div className="flex min-h-screen flex-col bg-black text-white">
              <Navigation />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-gray-800 py-6 text-center">
                <div className="container mx-auto px-4">
                  <p className="pixel-text text-xs">© 2025 VibeHub. All rights reserved.</p>
                </div>
              </footer>
            </div>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'