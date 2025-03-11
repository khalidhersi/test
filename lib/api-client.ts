import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add JWT token to requests if available
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface User {
  id: string
  email: string
  fullName: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: string
  description: string
  requirements: string[]
  postedDate: string
  remote: boolean
  source: string
  logo?: string
}

export interface JobApplication {
  id: string
  jobId: string
  userId: string
  status: string
  appliedAt: string
  job: Job
}

export const api = {
  auth: {
    login: async (data: LoginRequest) => {
      const response = await apiClient.post<{ token: string; user: User }>("/api/v1/auth/login", data)
      return response.data
    },
    register: async (data: RegisterRequest) => {
      const response = await apiClient.post<{ token: string; user: User }>("/api/v1/auth/register", data)
      return response.data
    },
    getCurrentUser: async () => {
      const response = await apiClient.get<User>("/api/v1/auth/me")
      return response.data
    },
  },
  jobs: {
    search: async (params: any) => {
      const response = await apiClient.get<{ items: Job[]; total: number }>("/api/v1/jobs/search", { params })
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get<Job>(`/api/v1/jobs/${id}`)
      return response.data
    },
    save: async (id: string) => {
      const response = await apiClient.post(`/api/v1/jobs/${id}/save`)
      return response.data
    },
  },
  applications: {
    getAll: async () => {
      const response = await apiClient.get<JobApplication[]>("/api/v1/applications")
      return response.data
    },
    create: async (data: any) => {
      const response = await apiClient.post<JobApplication>("/api/v1/applications", data)
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get<JobApplication>(`/api/v1/applications/${id}`)
      return response.data
    },
    update: async (id: string, data: any) => {
      const response = await apiClient.put<JobApplication>(`/api/v1/applications/${id}`, data)
      return response.data
    },
  },
  profile: {
    get: async () => {
      const response = await apiClient.get("/api/v1/users/profile")
      return response.data
    },
    update: async (data: any) => {
      const response = await apiClient.put("/api/v1/users/profile", data)
      return response.data
    },
    uploadResume: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const response = await apiClient.post("/api/v1/users/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
  },
}

export default api

