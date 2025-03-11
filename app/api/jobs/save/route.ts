import { type NextRequest, NextResponse } from "next/server"
import { saveJob } from "@/lib/job-service"

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json()

    // Use our web scraper-based job service instead of making API calls
    await saveJob(jobId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving job:", error)
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 })
  }
}

