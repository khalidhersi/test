import { type NextRequest, NextResponse } from "next/server"
import { searchJobs } from "@/lib/job-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") || ""
    const location = searchParams.get("location") || ""
    const remote = searchParams.get("remote") === "true"
    const jobType = searchParams.get("jobType")?.split(",") || []
    const experienceLevel = searchParams.get("experienceLevel")?.split(",") || []
    const salary = searchParams.get("salary")?.split("-").map(Number) || []
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Use our web scraper-based job service instead of making API calls
    const result = await searchJobs({
      query,
      location,
      remote,
      jobType: jobType.length > 0 ? jobType : undefined,
      experienceLevel: experienceLevel.length > 0 ? experienceLevel : undefined,
      salary: salary.length === 2 ? [salary[0], salary[1]] : undefined,
      page,
      limit,
    })

    return NextResponse.json({
      jobs: result.jobs,
      totalCount: result.totalCount,
    })
  } catch (error) {
    console.error("Error searching jobs:", error)
    return NextResponse.json({ error: "Failed to search jobs", jobs: [], totalCount: 0 }, { status: 500 })
  }
}

