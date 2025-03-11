import { ArrowRight, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// Fix the import path to match the file name
import HeroBackground from "@/components/hero-background"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentApplications } from "@/components/recent-applications"
import { ProfileCompletion } from "@/components/profile-completion"
import { JobRecommendations } from "@/components/job-recommendations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, BarChart3 } from "lucide-react"
// Add the Footer component to the imports
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div>
      <div className="relative pt-20 pb-32 mb-12 overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background"></div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block animate-float">
              <div className="flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-full glass">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-primary">AI-Powered Job Search</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Your Dream Job
              </span>
              <br />
              <span className="text-foreground">Starts Here</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              Let AI help you find and apply to the perfect job opportunities tailored just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 gradient-bg">
                  <Search className="mr-2 h-5 w-5" />
                  Start Job Search
                </Button>
              </Link>
              <Link href="/profile">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8 glass glow">
                  Complete Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-8 pb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-purple-500/5 dark:from-primary/10 dark:via-accent/10 dark:to-purple-500/10 blur-3xl" />
          <DashboardStats />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
          <div>
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
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <RecentApplications />
          <ProfileCompletion />
        </div>

        <JobRecommendations />

  

        <Footer />
      </div>
    </div>
  )
}

