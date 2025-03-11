// Since the existing code was omitted, I'll create a placeholder that adds the subscription link
// This should be integrated with your actual settings layout

import type { ReactNode } from "react"
import Link from "next/link"
import { CreditCard, User, Shield, Bell } from "lucide-react"

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  // This is a placeholder. In your actual implementation, integrate this with your existing layout
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-2">
            <Link href="/settings/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings/subscription"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-primary font-medium"
            >
              <CreditCard className="h-5 w-5" />
              <span>Subscription</span>
            </Link>
            <Link href="/settings/notifications" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </Link>
            <Link href="/settings/privacy" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
              <Shield className="h-5 w-5" />
              <span>Privacy</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

