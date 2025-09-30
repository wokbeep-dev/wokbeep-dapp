"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface VerificationGuardProps {
  children: React.ReactNode
}

export function VerificationGuard({ children }: VerificationGuardProps) {
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkVerification = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      if (!user.email_confirmed_at) {
        router.push("/verify-email")
        return
      }

      setIsVerified(true)
      setIsLoading(false)
    }

    checkVerification()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login")
      } else if (session?.user?.email_confirmed_at) {
        setIsVerified(true)
        setIsLoading(false)
      } else if (session?.user && !session.user.email_confirmed_at) {
        router.push("/verify-email")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!isVerified) {
    return null
  }

  return <>{children}</>
}
