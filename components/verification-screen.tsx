"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Loader2 } from "lucide-react"
import { HamburgerMenu } from "./hamburger-menu"

interface VerificationScreenProps {
  onVerificationStart?: () => void
}

export function VerificationScreen({ onVerificationStart }: VerificationScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("english")

  const handleBegin = async () => {
    setIsLoading(true)

    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onVerificationStart?.()
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Hamburger Menu */}
      <HamburgerMenu />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg text-center space-y-12">
          {/* Main content container */}
          <div className="space-y-8">
            {/* Heading */}
            <h1 className="text-3xl font-normal text-orange-500 leading-tight">
              Let's confirm you are
              <br />
              human
            </h1>

            {/* Description */}
            <div className="space-y-6">
              <p className="text-gray-800 text-base leading-relaxed max-w-md mx-auto font-normal">
                Complete the security check before continuing. This step verifies that you are not a bot, which helps to
                protect your account and prevent spam.
              </p>

              {/* Begin button */}
              <Button
                onClick={handleBegin}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-8 py-3 rounded-md font-medium text-base inline-flex items-center gap-2 shadow-sm transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Begin
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Language selector */}
          <div className="pt-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-28 mx-auto bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Español</SelectItem>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="german">Deutsch</SelectItem>
                <SelectItem value="chinese">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
