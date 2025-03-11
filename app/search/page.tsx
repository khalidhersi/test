"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { JobSearchFilters } from "@/components/search/job-search-filters"
import { JobSearchResults } from "@/components/search/job-search-results"
import { JobSearchSort } from "@/components/search/job-search-sort"
import { SavedSearches } from "@/components/search/saved-searches"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { searchJobs } from "@/lib/job-service"
import type { Job, JobSearchParams } from "@/lib/job-service"
import { useToast } from "@/components/ui/use-toast"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<JobSearchParams>({})
  const [sortBy, setSortBy] = useState("relevant")
  const { toast } = useToast()

  // Remove the fetchJobs from the dependency array of useEffect to prevent infinite loops
  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await searchJobs({
        query: searchQuery,
        ...filters,
        page: 1,
        limit: 20,
      })

      setJobs(result.jobs || [])
      setTotalJobs(result.totalCount || 0)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setJobs([])
      setTotalJobs(0)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filters, toast])

  // Only run once on initial mount and when search or filters change
  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleFilterChange = (newFilters: JobSearchParams) => {
    setFilters(newFilters)
    // Removed automatic fetch here to prevent double fetching
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)

    if (!jobs || jobs.length === 0) return

    // Sort the jobs based on the selected sort option
    const sortedJobs = [...jobs]

    if (newSortBy === "recent") {
      sortedJobs.sort((a, b) => {
        const aDate = parseRelativeDate(a.posted || "")
        const bDate = parseRelativeDate(b.posted || "")
        return aDate - bDate
      })
    } else if (newSortBy === "salary-high") {
      sortedJobs.sort((a, b) => {
        const aSalary = extractMaxSalary(a.salary || "")
        const bSalary = extractMaxSalary(b.salary || "")
        return bSalary - aSalary
      })
    } else if (newSortBy === "salary-low") {
      sortedJobs.sort((a, b) => {
        const aSalary = extractMinSalary(a.salary || "")
        const bSalary = extractMinSalary(b.salary || "")
        return aSalary - bSalary
      })
    }

    setJobs(sortedJobs)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Job Search</h1>
        <SavedSearches />
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search jobs, skills, companies..."
            className="pl-10 h-12 sm:h-10 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 sm:h-10">
          Search
        </Button>
      </form>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <JobSearchFilters onFilterChange={handleFilterChange} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <JobSearchSort totalJobs={totalJobs} onSortChange={handleSortChange} isLoading={isLoading} />
          <div className="pb-6">
            {" "}
            {/* Added padding at the bottom for mobile */}
            <JobSearchResults jobs={jobs} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to parse relative dates like "2 days ago" into timestamps
function parseRelativeDate(relativeDate: string): number {
  const now = new Date().getTime()

  if (relativeDate.includes("day")) {
    const days = Number.parseInt(relativeDate.split(" ")[0]) || 0
    return now - days * 24 * 60 * 60 * 1000
  } else if (relativeDate.includes("week")) {
    const weeks = Number.parseInt(relativeDate.split(" ")[0]) || 0
    return now - weeks * 7 * 24 * 60 * 60 * 1000
  } else if (relativeDate.includes("month")) {
    const months = Number.parseInt(relativeDate.split(" ")[0]) || 0
    return now - months * 30 * 24 * 60 * 60 * 1000
  }

  return now
}

// Helper function to extract the maximum salary from a salary range
function extractMaxSalary(salaryString: string): number {
  try {
    const matches = salaryString.match(/\$(\d+)k\s*-\s*\$(\d+)k/)
    if (matches && matches.length >= 3) {
      return Number.parseInt(matches[2]) * 1000
    }
    return 0
  } catch (error) {
    return 0
  }
}

// Helper function to extract the minimum salary from a salary range
function extractMinSalary(salaryString: string): number {
  try {
    const matches = salaryString.match(/\$(\d+)k\s*-\s*\$(\d+)k/)
    if (matches && matches.length >= 3) {
      return Number.parseInt(matches[1]) * 1000
    }
    return 0
  } catch (error) {
    return 0
  }
}

