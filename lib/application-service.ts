import { databaseService } from "./firebase/database-service"

export interface Application {
  id: string
  userId: string
  jobId: string
  status: "pending" | "reviewing" | "interview" | "offer" | "rejected" | "accepted"
  resumeUrl?: string
  coverLetter?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export const applicationService = {
  createApplication: async (application: Omit<Application, "id" | "createdAt">) => {
    return databaseService.create("applications", application)
  },

  getApplicationById: async (id: string) => {
    return databaseService.getById("applications", id)
  },

  updateApplication: async (id: string, data: Partial<Application>) => {
    await databaseService.update("applications", id, data)
  },

  deleteApplication: async (id: string) => {
    await databaseService.delete("applications", id)
  },

  getUserApplications: async (userId: string) => {
    return databaseService.query("applications", {
      orderBy: "userId",
      equalTo: userId,
    })
  },

  getApplicationsForJob: async (jobId: string) => {
    return databaseService.query("applications", {
      orderBy: "jobId",
      equalTo: jobId,
    })
  },
}

