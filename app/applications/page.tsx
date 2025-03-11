import { ApplicationsList } from "@/components/applications/applications-list"
import { ApplicationFilters } from "@/components/applications/application-filters"
import { ApplicationTimeline } from "@/components/application-timeline"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApplicationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Applications</h1>
        <Link href="/search">
          <Button className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Search Jobs
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ApplicationFilters />
          <div className="mt-6">
            <ApplicationsList />
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <ApplicationTimeline />
        </TabsContent>
      </Tabs>
    </div>
  )
}

