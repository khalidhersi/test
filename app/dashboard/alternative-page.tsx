import Link from "next/link"
import { BarChart3, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AlternativeDashboardPage() {
  // This is a minimal version to test if the Progress section renders
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard (Alternative)</h1>

      {/* Minimal Job Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">No job recommendations available at the moment.</div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 border-t pt-8">Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/applications" className="block">
            <Card className="hover:border-primary transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6 h-32">
                <Briefcase className="h-10 w-10 mb-4 text-primary" />
                <span className="text-xl font-medium">Applications</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/analytics" className="block">
            <Card className="hover:border-primary transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6 h-32">
                <BarChart3 className="h-10 w-10 mb-4 text-primary" />
                <span className="text-xl font-medium">Analytics</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

