import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">Wokbeep</span>
          </div>
          <CardTitle className="text-2xl font-semibold">Reset your password</CardTitle>
          <CardDescription>
            {"Enter your email address and we'll send you a link to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Send Reset Link</Button>

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-orange-500 hover:text-orange-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
