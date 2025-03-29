"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Github } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [role] = useState("creator")
  const [loading, setLoading] = useState(false)
  // Comment out social loading state
  // const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const { signUp } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signUp(email, password, username, role)

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        router.push("/")
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Comment out social signup function
  /*
  const handleSocialSignup = async (provider: string) => {
    setSocialLoading(provider)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful signup for demo purposes
      await signUp(
        provider === "github" ? "github-user@example.com" : "social-user@example.com",
        "password",
        provider === "github" ? "GitHubUser" : "SocialUser",
        role,
      )

      router.push("/")

      toast({
        title: "Account created",
        description: `Your account has been created with ${provider}`,
      })
    } catch (error: any) {
      toast({
        title: "Social signup failed",
        description: `Could not create account with ${provider}`,
        variant: "destructive",
      })
    } finally {
      setSocialLoading(null)
    }
  }
  */

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="pixel-text mb-2 text-3xl font-bold">
            Create <span className="text-primary">Account</span>
          </h1>
          <p className="text-gray-400 text-sm">Join VibeHub to create, discover, and play games</p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-card p-5">
          {/* Comment out social signup UI */}
          {/*
          <div className="mb-4 grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center border-gray-700 hover:bg-gray-800 hover:text-white h-10 px-0"
              onClick={() => handleSocialSignup("github")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "github" ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
              ) : (
                <Github className="h-5 w-5" />
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center border-gray-700 hover:bg-gray-800 hover:text-white h-10 px-0"
              onClick={() => handleSocialSignup("discord")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "discord" ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 -28.5 256 256"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  ></path>
                </svg>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center border-gray-700 hover:bg-gray-800 hover:text-white h-10 px-0"
              onClick={() => handleSocialSignup("google")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "google" ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
              ) : (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
            </Button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pixel-input h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="username" className="text-sm">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="coolgamer42"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pixel-input h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pixel-input h-9"
              />
            </div>

            <Button type="submit" className="pixel-button w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

