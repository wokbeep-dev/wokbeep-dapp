"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { signUp, signInWithGoogle } from "../actions/auth"
import { HamburgerMenu } from "@/components/hamburger-menu"
import Image from "next/image"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,15}$/;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 8-15 characters, include at least 1 lowercase, 1 uppercase, and 1 special character."
      )
      setIsLoading(false)
      return
    }

    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Hamburger Menu */}
      <HamburgerMenu />

      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          {/* 🔹 Header with updated logo */}
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center mb-4">
              {/* Example: replace with WB logo */}
              <div className="w-10 h-10 bg-black-600 rounded-lg flex items-center justify-center">
                <Image
  src="/images/logo.png"
  alt="Wokbeep Logo"
  width={40}
  height={40}
  className="rounded-lg"
/>

                {/* OR replace with an image logo */}
                {/* <img src="" alt="Wokbeep Logo" className="h-8" /> */}
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Wokbeep
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600">Join thousands of artisans on Wokbeep</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => signInWithGoogle()}
            >
              {/* Google Icon */}
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

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            {/* ... Name + Email Fields unchanged ... */}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {/* 🔹 Password Instructions */}
              <p className="text-xs text-gray-500 mt-1">
                Password must be 8–15 characters, include at least:
                <br /> • 1 lowercase letter  
                <br /> • 1 uppercase letter  
                <br /> • 1 special character (!, @, #, etc.)
              </p>
            </div>

            {/* Confirm Password Field unchanged */}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
