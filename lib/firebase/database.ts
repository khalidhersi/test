import { getDatabase, ref, set, get, push, update, query, orderByChild, equalTo } from "firebase/database"
import { app } from "./config"

const database = getDatabase(app)

export const databaseService = {
  // Jobs
  jobs: {
    search: async (params: {
      query?: string
      location?: string
      type?: string[]
      page?: number
      limit?: number
    }) => {
      const jobsRef = ref(database, "jobs")
      const snapshot = await get(jobsRef)

      if (!snapshot.exists()) {
        return { jobs: [], total: 0 }
      }

      let jobs = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...(data as any),
      }))

      // Filter jobs based on params
      if (params.query) {
        jobs = jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(params.query!.toLowerCase()) ||
            job.company.toLowerCase().includes(params.query!.toLowerCase()),
        )
      }

      if (params.location) {
        jobs = jobs.filter((job) => job.location.toLowerCase().includes(params.location!.toLowerCase()))
      }

      if (params.type && params.type.length > 0) {
        jobs = jobs.filter((job) => params.type!.includes(job.type))
      }

      // Sort by date
      jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // Pagination
      const startIndex = (params.page || 0) * (params.limit || 10)
      const paginatedJobs = jobs.slice(startIndex, startIndex + (params.limit || 10))

      return {
        jobs: paginatedJobs,
        total: jobs.length,
      }
    },

    getById: async (id: string) => {
      const jobRef = ref(database, `jobs/${id}`)
      const snapshot = await get(jobRef)

      if (!snapshot.exists()) {
        throw new Error("Job not found")
      }

      return {
        id,
        ...snapshot.val(),
      }
    },

    create: async (data: any) => {
      const jobsRef = ref(database, "jobs")
      const newJobRef = push(jobsRef)

      await set(newJobRef, {
        ...data,
        createdAt: new Date().toISOString(),
      })

      return newJobRef.key
    },
  },

  // Applications
  applications: {
    create: async (userId: string, jobId: string, data: any) => {
      const applicationsRef = ref(database, "applications")
      const newApplicationRef = push(applicationsRef)

      await set(newApplicationRef, {
        userId,
        jobId,
        status: "pending",
        ...data,
        createdAt: new Date().toISOString(),
      })

      return newApplicationRef.key
    },

    getUserApplications: async (userId: string) => {
      const applicationsRef = ref(database, "applications")
      const userApplicationsQuery = query(applicationsRef, orderByChild("userId"), equalTo(userId))
      const snapshot = await get(userApplicationsQuery)

      if (!snapshot.exists()) {
        return []
      }

      return Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...(data as any),
      }))
    },

    updateStatus: async (id: string, status: string) => {
      const applicationRef = ref(database, `applications/${id}`)
      await update(applicationRef, {
        status,
        updatedAt: new Date().toISOString(),
      })
    },
  },

  // User Profiles
  profiles: {
    get: async (userId: string) => {
      const profileRef = ref(database, `users/${userId}`)
      const snapshot = await get(profileRef)

      if (!snapshot.exists()) {
        throw new Error("Profile not found")
      }

      return {
        id: userId,
        ...snapshot.val(),
      }
    },

    update: async (userId: string, data: any) => {
      const profileRef = ref(database, `users/${userId}`)
      await update(profileRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      })
    },

    // Helper methods for array operations in Realtime DB
    arrayUnion: (field: string, value: any) => {
      return async (userId: string) => {
        const profileRef = ref(database, `users/${userId}`)
        const snapshot = await get(profileRef)

        if (!snapshot.exists()) {
          throw new Error("Profile not found")
        }

        const profile = snapshot.val()
        const array = profile[field] || []

        if (!array.includes(value)) {
          array.push(value)
          await update(profileRef, { [field]: array })
        }
      }
    },

    arrayRemove: (field: string, value: any) => {
      return async (userId: string) => {
        const profileRef = ref(database, `users/${userId}`)
        const snapshot = await get(profileRef)

        if (!snapshot.exists()) {
          throw new Error("Profile not found")
        }

        const profile = snapshot.val()
        const array = profile[field] || []
        const index = array.indexOf(value)

        if (index !== -1) {
          array.splice(index, 1)
          await update(profileRef, { [field]: array })
        }
      }
    },
  },
}

