"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TwoFactorAuth } from "@/components/settings/two-factor-auth"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function SecuritySettingsPage() {
  const { user, isLoading } = useAuth()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setUserId(user.uid)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Security Settings</h1>
        <p className="mt-2 text-muted-foreground">You need to be logged in to access this page.</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Security Settings</h1>
      <p className="mt-2 text-muted-foreground">Manage your account security settings</p>

      <div className="mt-8 space-y-8">
        <TwoFactorAuth userId={userId} />

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Password change form would go here */}
            <p className="text-sm text-muted-foreground">
              Password management is handled through Firebase Authentication.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login History</CardTitle>
            <CardDescription>View your recent login activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Login history tracking is not implemented in this demo.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

