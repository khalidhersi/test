import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/cookie-consent"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ClarityProvider } from "@/components/providers/clarity-provider"
import "./globals.css"

export const metadata = {
  title: "AutoApplyAI - Automated Job Application Platform",
  description: "Streamline your job search with AutoApplyAI - the smart way to apply for jobs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ClarityProvider />
            <Navigation />
            {children}
            <Footer />
            <CookieConsent />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'