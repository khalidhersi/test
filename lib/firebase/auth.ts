import { auth } from "./config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export const authService = {
  register: async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update the user profile with the display name
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName })
    }

    return userCredential.user
  },

  login: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },

  logout: async () => {
    await signOut(auth)
  },

  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  },

  getCurrentUser: () => {
    return auth.currentUser
  },

  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback)
  },
}

export type { FirebaseUser as User }

