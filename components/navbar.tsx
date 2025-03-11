"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"
import { Sparkles, Search, Home, User, CreditCard, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClassName = cn(
    "fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-200",
    scrolled && "shadow-sm",
  )

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
    { href: "/search", label: "Search Jobs", icon: Search },
  ]

  return (
    <header className={headerClassName}>
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-gradient hidden sm:block">AutoApplyAI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings" className="p-2 rounded-md hover:bg-muted">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </nav>
    </header>
  )
}

