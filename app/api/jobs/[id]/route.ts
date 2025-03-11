import { type NextRequest, NextResponse } from "next/server"
import { getJobDetails } from "@/lib/job-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const source = request.nextUrl.searchParams.get("source") || "Indeed"

    // Use our web scraper-based job service instead of making API calls
    const job = await getJobDetails(id, source)

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job details:", error)
    return NextResponse.json({ error: "Failed to fetch job details" }, { status: 500 })
  }
}

