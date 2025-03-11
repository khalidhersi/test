"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { setEmployerStatus } from "@/firebase/profile-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Building, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EmployerRegister() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    if (!user) {
      setError("You must be logged in to register as an employer")
      return
    }

    if (!agreed) {
      setError("You must agree to the terms and conditions")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Update user profile to mark as employer
      await setEmployerStatus(user.uid, true)

      // Redirect to employer onboarding
      router.push("/employer/dashboard")
    } catch (err) {
      console.error("Error registering as employer:", err)
      setError("An error occurred while registering. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>You need to sign in before registering as an employer.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-6 w-6 text-primary" />
            <CardTitle>Register as an Employer</CardTitle>
          </div>
          <CardDescription>
            Create an employer account to post jobs and find the perfect candidates for your company.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Post unlimited job listings</h3>
                <p className="text-sm text-muted-foreground">
                  Create detailed job postings and reach thousands of qualified candidates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">AI-powered candidate matching</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI technology helps you find the most qualified candidates for your positions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Streamlined applicant tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your hiring pipeline with our intuitive applicant tracking system.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the employer terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                By registering as an employer, you agree to our{" "}
                <Link href="/legal/terms-of-service" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRegister} disabled={loading || !agreed} className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register as Employer
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

