import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-2xl">
          AutoApplyAI
        </Link>
        <nav className="ml-8 space-x-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/applications">Applications</Link>
          <Link href="/profile">Profile</Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline">New Application</Button>
          <UserNav />
        </div>
      </div>
    </header>
  )
}

