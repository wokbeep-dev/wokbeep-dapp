import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Verification Failed</CardTitle>
            <p className="text-gray-600">There was an issue verifying your email. This could happen if:</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="text-sm text-red-800 space-y-2">
              <li>• The verification link has expired</li>
              <li>• The link has already been used</li>
              <li>• There was a network error</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/verify-email" className="block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Request New Verification Email
              </Button>
            </Link>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <Link href="/support" className="text-orange-600 hover:text-orange-700 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
