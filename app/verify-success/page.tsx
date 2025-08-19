"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function VerifySuccessPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/dashboard"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Email Verified!</CardTitle>
            <p className="text-gray-600">Your email has been successfully verified. Welcome to Wokbeep!</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800 mb-2">🎉 You're all set! Redirecting to your dashboard in</p>
            <p className="text-2xl font-bold text-green-600">{countdown}</p>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Complete Your Profile
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-gray-900">Welcome to Wokbeep</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
