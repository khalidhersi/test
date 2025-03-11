"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface TwoFactorVerificationProps {
  temporaryToken: string
  onSuccess: (data: any) => void
}

export function TwoFactorVerification({ temporaryToken, onSuccess }: TwoFactorVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleVerification = async () => {
    if (isRecoveryMode && !recoveryCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a recovery code",
      })
      return
    }

    if (!isRecoveryMode && !verificationCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/v1/auth/two-factor/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temporaryToken,
          verificationCode: isRecoveryMode ? recoveryCode : verificationCode,
          isRecoveryCode: isRecoveryMode,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Store tokens in localStorage
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        // Call the onSuccess callback
        onSuccess(data)

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        const errorData = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.message || "Invalid verification code",
        })
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify two-factor authentication",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          {isRecoveryMode
            ? "Enter a recovery code to access your account"
            : "Enter the verification code from your authenticator app"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRecoveryMode ? (
          <div className="space-y-2">
            <Label htmlFor="recoveryCode">Recovery Code</Label>
            <Input
              id="recoveryCode"
              placeholder="XXXXX-XXXXX"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
            />
          </div>
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={handleVerification} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isRecoveryMode ? "Verify Recovery Code" : "Verify Code"}
        </Button>
        <Button variant="link" className="px-0" onClick={() => setIsRecoveryMode(!isRecoveryMode)} disabled={isLoading}>
          {isRecoveryMode ? "Use authenticator app instead" : "Use a recovery code instead"}
        </Button>
      </CardFooter>
    </Card>
  )
}

