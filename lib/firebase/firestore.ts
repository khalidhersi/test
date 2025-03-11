import { db } from "./config"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
} from "firebase/firestore"

export const firestoreService = {
  // Jobs
  jobs: {
    search: async (params: {
      query?: string
      location?: string
      type?: string[]
      page?: number
      limit?: number
      lastDoc?: QueryDocumentSnapshot
    }) => {
      const jobsRef = collection(db, "jobs")
      let q = query(jobsRef, orderBy("createdAt", "desc"))

      if (params.query) {
        q = query(q, where("title", ">=", params.query))
      }

      if (params.location) {
        q = query(q, where("location", "==", params.location))
      }

      if (params.type && params.type.length > 0) {
        q = query(q, where("type", "in", params.type))
      }

      if (params.lastDoc) {
        q = query(q, startAfter(params.lastDoc))
      }

      q = query(q, limit(params.limit || 10))

      const snapshot = await getDocs(q)
      const jobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return {
        jobs,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === (params.limit || 10),
      }
    },

    getById: async (id: string) => {
      const docRef = doc(db, "jobs", id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error("Job not found")
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    },

    create: async (data: any) => {
      const docRef = await addDoc(collection(db, "jobs"), {
        ...data,
        createdAt: new Date().toISOString(),
      })
      return docRef.id
    },
  },

  // Applications
  applications: {
    create: async (userId: string, jobId: string, data: any) => {
      const docRef = await addDoc(collection(db, "applications"), {
        userId,
        jobId,
        status: "pending",
        ...data,
        createdAt: new Date().toISOString(),
      })
      return docRef.id
    },

    getUserApplications: async (userId: string) => {
      const applicationsRef = collection(db, "applications")
      const q = query(applicationsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    },

    updateStatus: async (id: string, status: string) => {
      const docRef = doc(db, "applications", id)
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      })
    },
  },

  // User Profiles
  profiles: {
    get: async (userId: string) => {
      const docRef = doc(db, "users", userId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error("Profile not found")
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    },

    update: async (userId: string, data: any) => {
      const docRef = doc(db, "users", userId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      })
    },
  },
}

