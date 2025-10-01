"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { useSupabase } from "@/lib/supabase"
import Image from "next/image"

export default function LoginPage() {
  const supabase = useSupabase()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // 🔹 check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const profileCompleted = session.user.user_metadata?.profileCompleted
        router.push(profileCompleted ? "/dashboard" : "/profile")
      }
    }
    checkSession()
  }, [router, supabase])

  // ✅ password validation function
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/
    return regex.test(password)
  }

  // 🔹 email/password login
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // ✅ validate password before sending to Supabase
    if (!validatePassword(password)) {
      setError(
        "Password must be 8-15 characters and include at least one lowercase, one uppercase, and one special character."
      )
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.refresh()
    }

    setIsLoading(false)
  }

  // 🔹 Google login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/dashboard" },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <HamburgerMenu />

      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          {/* 🔹 Header with Logo */}
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/images/logo.png"
                alt="Wokbeep Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="ml-2 text-2xl font-bold text-gray-900">Welcome to Wokbeep!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Wokbeep account</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Login Form */}
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

            <Button
              type="submit"
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-6">
            {"Don't have an account?"}{" "}
            <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
