"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
} from "lucide-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", href: "/" },
  { icon: <Search className="w-5 h-5" />, label: "Browse Services", href: "/services" },
  { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
  { icon: <ShoppingBag className="w-5 h-5" />, label: "My Bookings", href: "/bookings" },
  { icon: <Heart className="w-5 h-5" />, label: "Favorites", href: "/favorites" },
  { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", href: "/messages" },
  { icon: <Mail className="w-5 h-5" />, label: "Email Verification", href: "/verify-email" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/settings" },
];

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Wokbeep
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700 font-medium">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 border-b border-gray-200">
                  <SheetTitle className="text-left text-xl font-semibold text-gray-900">
                    Wokbeep
                  </SheetTitle>
                  <p className="text-sm text-gray-600 text-left">
                    Artisan Services Platform
                  </p>
                </SheetHeader>

                <nav className="flex flex-col p-4 space-y-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}

                  {!user ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
