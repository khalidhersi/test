"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
// Update the import path to use the correct path
import { auth } from "../lib/firebase/firebase"

interface AuthContextProps {
  user: any
  loading: boolean
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = { user, loading }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

