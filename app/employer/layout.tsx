"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Building, BriefcaseBusiness, Users, Settings, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const employerNavigation = [
  {
    name: "Dashboard",
    href: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/employer/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Applicants",
    href: "/employer/applicants",
    icon: Users,
  },
  {
    name: "Company Profile",
    href: "/employer/profile",
    icon: Building,
  },
  {
    name: "Settings",
    href: "/employer/settings",
    icon: Settings,
  },
]

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const { user, isEmployer, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip redirect for the registration page
    if (pathname === "/employer/register") {
      return
    }

    // Redirect non-employers away from employer pages
    if (!loading && (!user || !isEmployer)) {
      router.push("/employer/register")
    }
  }, [user, isEmployer, loading, router, pathname])

  // Don't show the employer navigation on the register page
  if (pathname === "/employer/register") {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Employer sub-navigation */}
      <div className="border-b sticky top-16 bg-background z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 gap-1">
            {employerNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap",
                      isActive && "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}

