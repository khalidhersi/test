// Types for job data
export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary?: string
  type: string
  requirements: string[]
  url: string
  posted: string
  remote: boolean
  source: string
  logo?: string
}

// Normalized job search params
export interface JobSearchParams {
  query?: string
  location?: string
  remote?: boolean
  jobType?: string[]
  experienceLevel?: string[]
  salary?: [number, number]
  page?: number
  limit?: number
}

// Function to get demo jobs - moved to the top for easier access
function getDemoJobs(): Job[] {
  return [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      description:
        "We are seeking a talented Senior Software Engineer to join our engineering team. You will be responsible for developing and maintaining high-quality software solutions.",
      salary: "$150k - $200k",
      type: "Full-time",
      requirements: ["5+ years experience", "React", "Node.js", "AWS"],
      url: "https://example.com/jobs/1",
      posted: "2 days ago",
      remote: true,
      source: "Internal",
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "StartupCo",
      location: "New York, NY",
      description:
        "Join our fast-growing startup as a Full Stack Developer. Work on cutting-edge technologies and help shape our product roadmap.",
      salary: "$120k - $160k",
      type: "Full-time",
      requirements: ["3+ years experience", "JavaScript", "Python", "MongoDB"],
      url: "https://example.com/jobs/2",
      posted: "1 day ago",
      remote: true,
      source: "LinkedIn",
    },
    {
      id: "3",
      title: "Frontend Developer",
      company: "DesignLabs",
      location: "Remote",
      description:
        "Looking for a Frontend Developer to create beautiful and responsive web applications. Focus on user experience and modern design principles.",
      salary: "$100k - $130k",
      type: "Full-time",
      requirements: ["React", "TypeScript", "CSS", "UI/UX"],
      url: "https://example.com/jobs/3",
      posted: "3 days ago",
      remote: true,
      source: "Indeed",
    },
    {
      id: "4",
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Seattle, WA",
      description:
        "Join our DevOps team to build and maintain our cloud infrastructure. Experience with AWS and automation required.",
      salary: "$130k - $180k",
      type: "Full-time",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      url: "https://example.com/jobs/4",
      posted: "1 week ago",
      remote: false,
      source: "Internal",
    },
    {
      id: "5",
      title: "Product Manager",
      company: "ProductLabs",
      location: "Austin, TX",
      description:
        "Seeking an experienced Product Manager to lead our product development initiatives and work closely with engineering teams.",
      salary: "$140k - $180k",
      type: "Full-time",
      requirements: ["5+ years PM experience", "Agile", "Technical background"],
      url: "https://example.com/jobs/5",
      posted: "4 days ago",
      remote: true,
      source: "LinkedIn",
    },
  ]
}

export async function searchJobs(params: JobSearchParams): Promise<{
  jobs: Job[]
  totalCount: number
}> {
  try {
    // For demo purposes, always return demo jobs
    // This ensures jobs are displayed even if Firebase is not properly configured
    const demoJobs = getDemoJobs()

    // Apply filters
    let filteredJobs = [...demoJobs]

    if (params.query) {
      const query = params.query.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query),
      )
    }

    if (params.location) {
      const location = params.location.toLowerCase()
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(location))
    }

    if (params.remote === true) {
      filteredJobs = filteredJobs.filter((job) => job.remote === true)
    }

    if (params.jobType && params.jobType.length > 0) {
      filteredJobs = filteredJobs.filter((job) => params.jobType?.includes(job.type))
    }

    // Apply pagination
    const startIndex = ((params.page || 1) - 1) * (params.limit || 10)
    const endIndex = startIndex + (params.limit || 10)
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

    return {
      jobs: paginatedJobs,
      totalCount: filteredJobs.length,
    }
  } catch (error) {
    console.error("Error searching jobs:", error)
    // Return demo jobs as fallback
    const demoJobs = getDemoJobs()
    return {
      jobs: demoJobs,
      totalCount: demoJobs.length,
    }
  }
}

export async function getJobDetails(id: string): Promise<Job> {
  try {
    // For demo purposes, find the job in demo jobs
    const demoJob = getDemoJobs().find((job) => job.id === id)
    if (demoJob) {
      return demoJob
    }
    throw new Error("Job not found")
  } catch (error) {
    console.error("Error getting job details:", error)
    throw error
  }
}

export async function saveJob(jobId: string): Promise<void> {
  console.log("Job saved:", jobId)
  return Promise.resolve()
}

export async function seedJobs(): Promise<void> {
  // For demo purposes, we'll just log that jobs are seeded
  console.log("Demo jobs ready")
  return Promise.resolve()
}

