import Link from "next/link"
import { BarChart3, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Simplified Job Recommendations */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Recommended Jobs</h2>
            <p className="text-muted-foreground">No job recommendations available at the moment.</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="mb-8">
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

