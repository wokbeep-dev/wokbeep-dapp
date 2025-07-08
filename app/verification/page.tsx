"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"

export default function VerificationPage() {
  const handleBegin = () => {
    // TODO: Implement verification logic
    console.log("Begin verification process")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2 rounded-md font-medium flex items-center gap-2 mx-auto"
          >
            Begin
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Language selector */}
        <div className="pt-8">
          <Select defaultValue="english">
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
    </div>
  )
}
