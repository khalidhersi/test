import { db } from "./firebase"
import { ref, get, set, update, remove, query, orderByChild, equalTo } from "firebase/database"
import { v4 as uuidv4 } from "uuid"

// Company Profile Types
export interface CompanyProfile {
  id: string
  userId: string
  name: string
  logo?: string
  website?: string
  industry?: string
  size?: string
  founded?: string
  description?: string
  location?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  createdAt: number
  updatedAt: number
}

// Job Types
export interface Job {
  id: string
  userId: string
  companyId: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  description: string
  requirements?: string
  responsibilities?: string
  benefits?: string
  isRemote: boolean
  isActive: boolean
  applicationCount: number
  createdAt: number
  updatedAt: number
  expiresAt?: number
}

// Application Types
export interface JobApplication {
  id: string
  jobId: string
  userId: string
  name: string
  email: string
  phone?: string
  resumeUrl?: string
  coverLetter?: string
  status: ApplicationStatus
  notes?: string
  createdAt: number
  updatedAt: number
}

export type ApplicationStatus = "new" | "reviewed" | "interviewing" | "offered" | "rejected" | "hired"

// Company Profile Functions
export async function getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
  try {
    const companiesRef = ref(db, "companies")
    const userCompanyQuery = query(companiesRef, orderByChild("userId"), equalTo(userId))
    const snapshot = await get(userCompanyQuery)

    if (snapshot.exists()) {
      // Get the first company associated with this user
      const companies = snapshot.val()
      const companyId = Object.keys(companies)[0]
      return { id: companyId, ...companies[companyId] } as CompanyProfile
    }

    return null
  } catch (error) {
    console.error("Error getting company profile:", error)
    throw error
  }
}

export async function createCompanyProfile(
  profile: Omit<CompanyProfile, "id" | "createdAt" | "updatedAt">,
): Promise<CompanyProfile> {
  try {
    const companyId = uuidv4()
    const companyRef = ref(db, `companies/${companyId}`)

    const now = Date.now()
    const newCompany: CompanyProfile = {
      id: companyId,
      ...profile,
      createdAt: now,
      updatedAt: now,
    }

    await set(companyRef, newCompany)
    return newCompany
  } catch (error) {
    console.error("Error creating company profile:", error)
    throw error
  }
}

export async function updateCompanyProfile(companyId: string, updates: Partial<CompanyProfile>): Promise<void> {
  try {
    const companyRef = ref(db, `companies/${companyId}`)

    // Add updated timestamp
    updates.updatedAt = Date.now()

    await update(companyRef, updates)
  } catch (error) {
    console.error("Error updating company profile:", error)
    throw error
  }
}

// Job Functions
export async function getJobs(userId: string): Promise<Job[]> {
  try {
    const jobsRef = ref(db, "jobs")
    const userJobsQuery = query(jobsRef, orderByChild("userId"), equalTo(userId))
    const snapshot = await get(userJobsQuery)

    if (snapshot.exists()) {
      const jobs = snapshot.val()
      return Object.keys(jobs).map((key) => ({
        id: key,
        ...jobs[key],
      })) as Job[]
    }

    return []
  } catch (error) {
    console.error("Error getting jobs:", error)
    throw error
  }
}

export async function getJob(jobId: string): Promise<Job | null> {
  try {
    const jobRef = ref(db, `jobs/${jobId}`)
    const snapshot = await get(jobRef)

    if (snapshot.exists()) {
      return { id: jobId, ...snapshot.val() } as Job
    }

    return null
  } catch (error) {
    console.error("Error getting job:", error)
    throw error
  }
}

export async function createJob(job: Omit<Job, "id" | "applicationCount" | "createdAt" | "updatedAt">): Promise<Job> {
  try {
    const jobId = uuidv4()
    const jobRef = ref(db, `jobs/${jobId}`)

    const now = Date.now()
    const newJob: Job = {
      id: jobId,
      ...job,
      applicationCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    await set(jobRef, newJob)
    return newJob
  } catch (error) {
    console.error("Error creating job:", error)
    throw error
  }
}

export async function updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
  try {
    const jobRef = ref(db, `jobs/${jobId}`)

    // Add updated timestamp
    updates.updatedAt = Date.now()

    await update(jobRef, updates)
  } catch (error) {
    console.error("Error updating job:", error)
    throw error
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  try {
    const jobRef = ref(db, `jobs/${jobId}`)
    await remove(jobRef)
  } catch (error) {
    console.error("Error deleting job:", error)
    throw error
  }
}

// Application Functions
export async function getApplicationsForJob(jobId: string): Promise<JobApplication[]> {
  try {
    const applicationsRef = ref(db, "applications")
    const jobApplicationsQuery = query(applicationsRef, orderByChild("jobId"), equalTo(jobId))
    const snapshot = await get(jobApplicationsQuery)

    if (snapshot.exists()) {
      const applications = snapshot.val()
      return Object.keys(applications).map((key) => ({
        id: key,
        ...applications[key],
      })) as JobApplication[]
    }

    return []
  } catch (error) {
    console.error("Error getting applications:", error)
    throw error
  }
}

export async function getApplicationsForEmployer(userId: string): Promise<JobApplication[]> {
  try {
    // First get all jobs for this employer
    const jobs = await getJobs(userId)
    const jobIds = jobs.map((job) => job.id)

    if (jobIds.length === 0) {
      return []
    }

    // Then get all applications for these jobs
    const applications: JobApplication[] = []

    for (const jobId of jobIds) {
      const jobApplications = await getApplicationsForJob(jobId)
      applications.push(...jobApplications)
    }

    return applications
  } catch (error) {
    console.error("Error getting applications for employer:", error)
    throw error
  }
}

export async function getApplication(applicationId: string): Promise<JobApplication | null> {
  try {
    const applicationRef = ref(db, `applications/${applicationId}`)
    const snapshot = await get(applicationRef)

    if (snapshot.exists()) {
      return { id: applicationId, ...snapshot.val() } as JobApplication
    }

    return null
  } catch (error) {
    console.error("Error getting application:", error)
    throw error
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  notes?: string,
): Promise<void> {
  try {
    const applicationRef = ref(db, `applications/${applicationId}`)

    const updates: Record<string, any> = {
      status,
      updatedAt: Date.now(),
    }

    if (notes !== undefined) {
      updates.notes = notes
    }

    await update(applicationRef, updates)
  } catch (error) {
    console.error("Error updating application status:", error)
    throw error
  }
}

