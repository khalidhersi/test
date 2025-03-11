import { LegalLinks } from "@/components/legal-links"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AutoApplyAI. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/employer/upgrade" className="text-sm text-muted-foreground hover:text-foreground">
            For Employers
          </Link>
          <LegalLinks />
        </div>
      </div>
    </footer>
  )
}

