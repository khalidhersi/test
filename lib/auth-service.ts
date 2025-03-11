import { auth } from "./firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

export async function registerUser(email: string, password: string, displayName: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update the user's profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName,
      })
    }

    return userCredential.user
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

export async function loginUser(email: string, password: string): Promise<any> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    // Check if two-factor authentication is required
    // This would typically be determined by checking a flag in your user database
    // For this example, we'll simulate it with a custom API call

    try {
      const response = await fetch("/api/v1/auth/two-factor/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()

        if (data.twoFactorEnabled) {
          // Return a special response indicating 2FA is required
          return {
            requiresTwoFactor: true,
            temporaryToken: data.temporaryToken,
            user: userCredential.user,
          }
        }
      }
    } catch (error) {
      console.error("Error checking 2FA status:", error)
      // Continue with normal login if 2FA check fails
    }

    return {
      requiresTwoFactor: false,
      user: userCredential.user,
    }
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

export async function verifyTwoFactorCode(
  temporaryToken: string,
  verificationCode: string,
  isRecoveryCode = false,
): Promise<any> {
  try {
    const response = await fetch("/api/v1/auth/two-factor/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temporaryToken,
        verificationCode,
        isRecoveryCode,
      }),
    })

    if (!response.ok) {
      throw new Error("Invalid verification code")
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying 2FA code:", error)
    throw error
  }
}

