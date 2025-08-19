import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VerificationGuard } from "@/components/verification-guard"
import { VerificationAwareMenu } from "@/components/verification-aware-menu"

export default function DashboardPage() {
  return (
    <VerificationGuard>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Verification-Aware Hamburger Menu */}
        <VerificationAwareMenu />

        <div className="p-8 pt-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Wokbeep</h1>
                <p className="text-gray-600">Your verified artisan marketplace dashboard</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-semibold text-gray-900">Wokbeep</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-green-800 font-medium">Email Verified</span>
                <span className="text-green-600">You have full access to all features</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Browse Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Discover talented artisans from around the world</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Explore Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track and manage your service bookings</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Bookings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Become an Artisan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Start offering your artisan services</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </VerificationGuard>
  )
}
