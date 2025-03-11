import { db } from "./firebase"
import { ref, get, set, update } from "firebase/database"

export interface UserProfile {
  uid: string
  displayName?: string
  email?: string
  photoURL?: string
  bio?: string
  location?: string
  skills?: string[]
  experience?: Experience[]
  education?: Education[]
  resumeURL?: string
  isEmployer?: boolean
  createdAt?: number
  updatedAt?: number
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate?: string
  current?: boolean
  description?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current?: boolean
  description?: string
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = ref(db, `users/${uid}`)
    const snapshot = await get(userRef)

    if (snapshot.exists()) {
      return snapshot.val() as UserProfile
    }

    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  try {
    const { uid } = profile
    const userRef = ref(db, `users/${uid}`)

    // Add timestamps
    const now = Date.now()
    profile.createdAt = now
    profile.updatedAt = now

    await set(userRef, profile)
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = ref(db, `users/${uid}`)

    // Add updated timestamp
    updates.updatedAt = Date.now()

    await update(userRef, updates)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export async function setEmployerStatus(uid: string, isEmployer: boolean): Promise<void> {
  try {
    const userRef = ref(db, `users/${uid}`)

    await update(userRef, {
      isEmployer,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error("Error setting employer status:", error)
    throw error
  }
}

