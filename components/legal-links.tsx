"use client"

import Link from "next/link"

export function LegalLinks() {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <Link href="/legal/privacy-policy" className="hover:underline">
        Privacy Policy
      </Link>
      <Link href="/legal/terms-of-service" className="hover:underline">
        Terms of Service
      </Link>
      <Link href="/legal/cookie-policy" className="hover:underline">
        Cookie Policy
      </Link>
      <button
        className="hover:underline text-left"
        onClick={() => {
          // Clear cookie consent to show the banner again
          localStorage.removeItem("cookie-consent")
          // Reload the page to show the banner
          window.location.reload()
        }}
      >
        Cookie Settings
      </button>
    </div>
  )
}

