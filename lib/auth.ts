import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService, type User } from "./firebase/auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const user = await authService.login(email, password)
          set({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({ error: error.message || "Invalid credentials", isLoading: false })
          throw error
        }
      },
      register: async (email: string, password: string, fullName: string) => {
        try {
          set({ isLoading: true, error: null })
          const user = await authService.register(email, password, fullName)
          set({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({ error: error.message || "Registration failed", isLoading: false })
          throw error
        }
      },
      logout: async () => {
        await authService.logout()
        set({ user: null, isAuthenticated: false })
      },
      loadUser: async () => {
        try {
          set({ isLoading: true })
          const user = await authService.getCurrentUser()
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          })
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

