import { database, storage, auth } from "./firebase"
import { ref as dbRef, get, set, update } from "firebase/database"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

// Types for user profile data
export interface UserProfile {
  fullName: string
  email: string
  phone: string
  location: string
  bio?: string
  title?: string
  linkedin?: string
  github?: string
  portfolio?: string
  currentSalary?: string
  expectedSalaryMin?: string
  expectedSalaryMax?: string
  skills: string[]
  experience: string
  resumeUrl?: string
  education?: {
    degree?: string
    school?: string
    year?: string
  }
}

// Function to save profile data to Firebase
export async function saveProfile(profile: UserProfile): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("User not authenticated")
    }

    const profileRef = dbRef(database, `profiles/${user.uid}`)
    await set(profileRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error saving profile:", error)
    throw error
  }
}

// Function to get profile data from Firebase
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }

    const profileRef = dbRef(database, `profiles/${user.uid}`)
    const snapshot = await get(profileRef)

    if (!snapshot.exists()) {
      // Create a default profile if none exists
      const defaultProfile: UserProfile = {
        fullName: user.displayName || "",
        email: user.email || "",
        phone: "",
        location: "",
        skills: [],
        experience: "",
      }

      await saveProfile(defaultProfile)
      return defaultProfile
    }

    return snapshot.val() as UserProfile
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}

// Function to update specific profile fields
export async function updateProfile(updates: Partial<UserProfile>): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("User not authenticated")
    }

    const profileRef = dbRef(database, `profiles/${user.uid}`)
    await update(profileRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

// Function to upload resume
export async function uploadResume(file: File): Promise<string> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("User not authenticated")
    }

    const fileRef = storageRef(storage, `resumes/${user.uid}/${file.name}`)
    await uploadBytes(fileRef, file)

    const downloadUrl = await getDownloadURL(fileRef)

    // Update profile with resume URL
    await updateProfile({ resumeUrl: downloadUrl })

    return downloadUrl
  } catch (error) {
    console.error("Error uploading resume:", error)
    throw error
  }
}

