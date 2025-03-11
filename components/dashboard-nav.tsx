"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LayoutDashboard, Settings, Building2, PlusCircle, Briefcase, Mail } from "lucide-react"

interface DashboardNavProps {
  className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname()
  const { user, userRole } = useAuth()

  const isEmployer = userRole === "employer"

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/applications",
      label: "My Applications",
      icon: Mail,
      active: pathname === "/dashboard/applications",
      show: !isEmployer,
    },
    {
      href: "/dashboard/jobs",
      label: "Saved Jobs",
      icon: Briefcase,
      active: pathname === "/dashboard/jobs",
      show: !isEmployer,
    },
    {
      href: "/employer/jobs",
      label: "My Jobs",
      icon: Building2,
      active: pathname === "/employer/jobs",
      show: isEmployer,
    },
    {
      href: "/employer/applications",
      label: "Applications",
      icon: Mail,
      active: pathname === "/employer/applications",
      show: isEmployer,
    },
    {
      href: "/employer/post-job",
      label: "Post a Job",
      icon: PlusCircle,
      active: pathname === "/employer/post-job",
      show: isEmployer,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {routes.map((route) => {
        // Skip routes that shouldn't be shown based on user role
        if (route.hasOwnProperty("show") && !route.show) {
          return null
        }

        return (
          <Button
            key={route.href}
            variant={route.active ? "default" : "ghost"}
            className={cn("w-full justify-start", route.active ? "bg-primary text-primary-foreground" : "")}
            asChild
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-5 w-5" />
              {route.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

