"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Loader2 } from "lucide-react"

interface VerificationFormProps {
  onVerificationStart?: () => void
}

export function VerificationForm({ onVerificationStart }: VerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("english")

  const handleBegin = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would get the user ID from authentication
      const userId = "temp-user-id" // Replace with actual user ID

      const response = await fetch("/api/verification/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          verificationType: "human_verification",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Verification session started:", data)
        onVerificationStart?.()
      } else {
        console.error("Failed to start verification")
      }
    } catch (error) {
      console.error("Error starting verification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 text-center">
      {/* Main heading */}
      <div className="space-y-4">
        <h1 className="text-2xl font-medium text-amber-600">Let's confirm you are human</h1>

        {/* Description text */}
        <p className="text-gray-700 text-sm leading-relaxed max-w-sm mx-auto">
          Complete the security check before continuing. This step verifies that you are not a bot, which helps to
          protect your account and prevent spam.
        </p>
      </div>

      {/* Begin button */}
      <div className="pt-4">
        <Button
          onClick={handleBegin}
          disabled={isLoading}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2 rounded-md font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Begin
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Language selector */}
      <div className="pt-8">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32 mx-auto border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Español</SelectItem>
            <SelectItem value="french">Français</SelectItem>
            <SelectItem value="german">Deutsch</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
