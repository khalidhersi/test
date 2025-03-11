import { DashboardStats } from "@/components/dashboard-stats"
import { ProfileCompletion } from "@/components/profile-completion"
import { JobRecommendations } from "@/components/job-recommendations"
import { ApplicationTimeline } from "@/components/application-timeline"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, BarChart3, Briefcase } from "lucide-react"

export default function DashboardPage() {
  return (
    // Remove default container padding and add full-width styling
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Add internal padding container for content */}
      <div className="px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-dashboard">Dashboard</h1>
          <Link href="/search">
            <Button size="lg" className="w-full sm:w-auto">
              <Search className="mr-2 h-5 w-5" />
              Search Jobs
            </Button>
          </Link>
        </div>

        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2">
          <ProfileCompletion />
          <ApplicationTimeline />
        </div>

        <JobRecommendations />

        {/* Progress Section with buttons */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/applications">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
              >
                <Briefcase className="h-6 w-6" />
                <span>View All Applications</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
              >
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

