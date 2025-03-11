"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import {
  LayoutDashboard,
  UserCircle,
  Search,
  BarChart,
  Settings,
  Menu,
  Briefcase,
  Sparkles,
  X,
  CreditCard,
  Building,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/hooks/use-auth"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserCircle,
  },
  {
    name: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isEmployer } = useAuth()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update the header className
  const headerClassName = cn(
    "fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-200",
    scrolled && "shadow-sm",
  )

  return (
    // Replace the conditional bg-background/0 with this fixed style
    <header className={headerClassName}>
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-gradient hidden sm:block">AutoApplyAI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <Link href="/search">
                <Button className="gradient-hover ml-2">
                  <Search className="mr-2 h-4 w-4" />
                  Search Jobs
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              {isEmployer && (
                <Link
                  href="/employer/dashboard"
                  className={cn(
                    "p-2 rounded-md hover:bg-muted flex items-center gap-2",
                    pathname.startsWith("/employer") && "text-primary",
                  )}
                >
                  <Building className="h-5 w-5" />
                  <span className="text-sm font-medium">Employer</span>
                </Link>
              )}
              {!isEmployer && user && (
                <Link href="/employer/register" className="p-2 rounded-md hover:bg-muted flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span className="text-sm font-medium">For Employers</span>
                </Link>
              )}
              <Link
                href="/settings"
                className={cn("p-2 rounded-md hover:bg-muted", pathname === "/settings" && "text-primary")}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
              <ThemeToggle />
            </div>
            <UserNav />

            {/* Mobile Menu Button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[300px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl">AutoApplyAI</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-colors",
                              pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        )
                      })}

                      {/* Employer Link in Mobile Menu */}
                      {isEmployer ? (
                        <Link
                          href="/employer/dashboard"
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-colors",
                            pathname.startsWith("/employer")
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                          )}
                        >
                          <Building className="h-5 w-5" />
                          Employer Dashboard
                        </Link>
                      ) : user ? (
                        <Link
                          href="/employer/register"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-colors text-muted-foreground hover:text-primary hover:bg-primary/5"
                        >
                          <Building className="h-5 w-5" />
                          For Employers
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t">
                    <div className="flex items-center justify-between">
                      <ThemeToggle />
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Close Menu
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t md:hidden z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Link href="/" className="flex-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full h-16 flex flex-col items-center justify-center gap-1",
                pathname === "/" && "text-primary",
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/applications" className="flex-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full h-16 flex flex-col items-center justify-center gap-1",
                pathname === "/applications" && "text-primary",
              )}
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs">Jobs</span>
            </Button>
          </Link>
          <Link href="/pricing" className="flex-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full h-16 flex flex-col items-center justify-center gap-1",
                pathname === "/pricing" && "text-primary",
              )}
            >
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">Pricing</span>
            </Button>
          </Link>
          <Link href="/profile" className="flex-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full h-16 flex flex-col items-center justify-center gap-1",
                pathname === "/profile" && "text-primary",
              )}
            >
              <UserCircle className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
          {isEmployer ? (
            <Link href="/employer/dashboard" className="flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-16 flex flex-col items-center justify-center gap-1",
                  pathname.startsWith("/employer") && "text-primary",
                )}
              >
                <Building className="h-5 w-5" />
                <span className="text-xs">Employer</span>
              </Button>
            </Link>
          ) : (
            <Link href="/analytics" className="flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-16 flex flex-col items-center justify-center gap-1",
                  pathname === "/analytics" && "text-primary",
                )}
              >
                <BarChart className="h-5 w-5" />
                <span className="text-xs">Stats</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

