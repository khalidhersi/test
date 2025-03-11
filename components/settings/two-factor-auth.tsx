"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"

interface TwoFactorAuthProps {
  userId: string
}

export function TwoFactorAuth({ userId }: TwoFactorAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSetupMode, setIsSetupMode] = useState(false)
  const [secretKey, setSecretKey] = useState("")
  const [qrCodeUri, setQrCodeUri] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTwoFactorStatus()
  }, [])

  const fetchTwoFactorStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/v1/auth/two-factor/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIsEnabled(data.isEnabled)
      }
    } catch (error) {
      console.error("Error fetching 2FA status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch two-factor authentication status",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const setupTwoFactor = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/v1/auth/two-factor/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSecretKey(data.secretKey)
        setQrCodeUri(data.qrCodeUri)
        setIsSetupMode(true)
      } else {
        throw new Error("Failed to setup two-factor authentication")
      }
    } catch (error) {
      console.error("Error setting up 2FA:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to setup two-factor authentication",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmSetup = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/v1/auth/two-factor/confirm-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ verificationCode }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          setIsEnabled(true)
          setIsSetupMode(false)
          fetchRecoveryCodes()
          toast({
            title: "Success",
            description: "Two-factor authentication has been enabled",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid verification code",
          })
        }
      } else {
        throw new Error("Failed to confirm two-factor authentication setup")
      }
    } catch (error) {
      console.error("Error confirming 2FA setup:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to confirm two-factor authentication setup",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const disableTwoFactor = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/v1/auth/two-factor/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        setIsEnabled(false)
        toast({
          title: "Success",
          description: "Two-factor authentication has been disabled",
        })
      } else {
        throw new Error("Failed to disable two-factor authentication")
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disable two-factor authentication",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecoveryCodes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/v1/auth/two-factor/recovery-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecoveryCodes(data.recoveryCodes)
        setShowRecoveryCodes(true)
      } else {
        throw new Error("Failed to fetch recovery codes")
      }
    } catch (error) {
      console.error("Error fetching recovery codes:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch recovery codes",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by enabling two-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isSetupMode ? (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">Scan this QR code with your authenticator app</h3>
              <div className="flex justify-center">
                <div className="overflow-hidden rounded-md bg-white p-2">
                  <img
                    src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(qrCodeUri)}`}
                    alt="QR Code"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Or enter this code manually in your app</h3>
              <code className="rounded bg-muted px-2 py-1">{secretKey}</code>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter the 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
        ) : showRecoveryCodes ? (
          <div className="space-y-4">
            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Save these recovery codes
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      Keep these recovery codes in a safe place. You can use them to regain access to your account if
                      you lose your two-factor authentication device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((code, index) => (
                <code key={index} className="rounded bg-muted px-2 py-1 text-center font-mono">
                  {code}
                </code>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="twoFactorEnabled" checked={isEnabled} disabled />
              <Label htmlFor="twoFactorEnabled">
                {isEnabled ? "Two-factor authentication is enabled" : "Two-factor authentication is disabled"}
              </Label>
            </div>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                Two-factor authentication adds an additional layer of security to your account by requiring more than
                just a password to sign in.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isSetupMode ? (
          <>
            <Button variant="outline" onClick={() => setIsSetupMode(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={confirmSetup} disabled={isLoading || !verificationCode}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify and Enable
            </Button>
          </>
        ) : showRecoveryCodes ? (
          <Button className="ml-auto" onClick={() => setShowRecoveryCodes(false)}>
            Done
          </Button>
        ) : (
          <>
            {isEnabled ? (
              <>
                <Button variant="outline" onClick={fetchRecoveryCodes} disabled={isLoading}>
                  View Recovery Codes
                </Button>
                <Button variant="destructive" onClick={disableTwoFactor} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Disable
                </Button>
              </>
            ) : (
              <Button onClick={setupTwoFactor} disabled={isLoading} className="ml-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Setup Two-Factor Authentication
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

