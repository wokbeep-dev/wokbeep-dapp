"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Home,
  User,
  Settings,
  LogOut,
  Search,
  Heart,
  ShoppingBag,
  MessageCircle,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"
import { useSupabase } from "@/lib/supabase"

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
  requiresVerification?: boolean
}

const menuItems: MenuItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", href: "/" },
  { icon: <Search className="w-5 h-5" />, label: "Browse Services", href: "/services", requiresVerification: true },
  { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile", requiresVerification: true },
  { icon: <ShoppingBag className="w-5 h-5" />, label: "My Bookings", href: "/bookings", requiresVerification: true },
  { icon: <Heart className="w-5 h-5" />, label: "Favorites", href: "/favorites", requiresVerification: true },
  { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", href: "/messages", requiresVerification: true },
  { icon: <Mail className="w-5 h-5" />, label: "Email Verification", href: "/verify-email" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/settings" },
]

export function VerificationAwareMenu() {
  const supabase = useSupabase()
  const [isOpen, setIsOpen] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const checkVerification = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || "")
        setIsVerified(!!user.email_confirmed_at)
      }
    }

    checkVerification()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || "")
        setIsVerified(!!session.user.email_confirmed_at)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.requiresVerification && !isVerified) {
      // Redirect to verification if not verified
      window.location.href = "/verify-email"
    } else {
      setIsOpen(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90"
        >
          <Menu className="w-6 h-6 text-gray-700" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle className="text-left text-xl font-semibold text-gray-900">Wokbeep</SheetTitle>
          <p className="text-sm text-gray-600 text-left">Artisan Services Platform</p>

          {/* Verification Status */}
          {userEmail && (
            <div className="mt-3 p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{isVerified ? "Verified" : "Unverified"}</span>
                </div>
                <Badge
                  variant={isVerified ? "default" : "secondary"}
                  className={isVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                >
                  {isVerified ? "✓" : "!"}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">{userEmail}</p>
              {!isVerified && (
                <Link
                  href="/verify-email"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-orange-600 hover:text-orange-700 mt-1 inline-block"
                >
                  Complete verification →
                </Link>
              )}
            </div>
          )}
        </SheetHeader>

        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <Link
                href={item.requiresVerification && !isVerified ? "/verify-email" : item.href}
                onClick={() => handleMenuItemClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  item.requiresVerification && !isVerified
                    ? "text-gray-400 hover:bg-gray-50 cursor-not-allowed"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.requiresVerification && !isVerified && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-orange-100 text-orange-800">
                    Verify
                  </Badge>
                )}
              </Link>
            </div>
          ))}

          <div className="border-t border-gray-200 mt-4 pt-4">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
