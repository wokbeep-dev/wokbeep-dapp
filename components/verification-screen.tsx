"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Loader2, Mail, RefreshCw, CheckCircle } from "lucide-react"
import { HamburgerMenu } from "./hamburger-menu"
import { supabase } from "@/lib/supabase"
import { resendVerification } from "@/app/actions/auth"

interface VerificationScreenProps {
  onVerificationStart?: () => void
}

export function VerificationScreen({ onVerificationStart }: VerificationScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("english")
  const [step, setStep] = useState<"initial" | "email-sent" | "waiting">("initial")
  const [userEmail, setUserEmail] = useState("")
  const [isResent, setIsResent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Get current user email
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
        // If user exists but not verified, show email waiting step
        if (!user.email_confirmed_at) {
          setStep("waiting")
        }
      }
    }
    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email_confirmed_at) {
        window.location.href = "/dashboard"
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleBegin = async () => {
    setIsLoading(true)

    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStep("email-sent")
      onVerificationStart?.()
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!userEmail) return

    setIsLoading(true)
    const result = await resendVerification(userEmail)

    if (result?.error) {
      console.error(result.error)
    } else {
      setIsResent(true)
      setCountdown(60) // 60 second cooldown
    }
    setIsLoading(false)
  }

  const renderInitialStep = () => (
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
  )

  const renderEmailSentStep = () => (
    <div className="space-y-8">
      {/* Icon */}
      <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
        <Mail className="w-8 h-8 text-orange-600" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-normal text-orange-500 leading-tight">Check your email</h1>

      {/* Description */}
      <div className="space-y-6">
        <p className="text-gray-800 text-base leading-relaxed max-w-md mx-auto font-normal">
          We've sent a verification link to <strong>{userEmail}</strong>. Click the link in your email to complete the
          verification process.
        </p>

        {/* Continue to waiting step */}
        <Button
          onClick={() => setStep("waiting")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium text-base inline-flex items-center gap-2 shadow-sm transition-colors"
        >
          I've sent the email
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  const renderWaitingStep = () => (
    <div className="space-y-8">
      {/* Icon */}
      <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
        <Mail className="w-8 h-8 text-orange-600" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-normal text-orange-500 leading-tight">
        Waiting for
        <br />
        verification
      </h1>

      {/* Description */}
      <div className="space-y-6">
        <p className="text-gray-800 text-base leading-relaxed max-w-md mx-auto font-normal">
          Please check your email and click the verification link. Once verified, you'll automatically be redirected to
          your dashboard.
        </p>

        {/* Email info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>You'll be automatically signed in</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Resend button */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{"Didn't receive the email?"}</p>
          <Button
            onClick={handleResendEmail}
            disabled={isLoading || countdown > 0}
            variant="outline"
            className="bg-white border-orange-300 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-md font-medium text-sm inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Email
              </>
            )}
          </Button>

          {isResent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-sm text-green-800">✓ Verification email sent successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Hamburger Menu */}
      <HamburgerMenu />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg text-center space-y-12">
          {/* Main content container */}
          {step === "initial" && renderInitialStep()}
          {step === "email-sent" && renderEmailSentStep()}
          {step === "waiting" && renderWaitingStep()}

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
