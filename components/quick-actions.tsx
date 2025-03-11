"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Search, FileText, UserCircle, X, Briefcase, Upload, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: Search,
      label: "Search Jobs",
      href: "/search",
      color: "text-blue-500",
    },
    {
      icon: Briefcase,
      label: "New Application",
      href: "/applications/new",
      color: "text-green-500",
    },
    {
      icon: Upload,
      label: "Upload Resume",
      href: "/profile#resume",
      color: "text-purple-500",
    },
    {
      icon: UserCircle,
      label: "Edit Profile",
      href: "/profile",
      color: "text-orange-500",
    },
    {
      icon: FileText,
      label: "Applications",
      href: "/applications",
      color: "text-cyan-500",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      color: "text-gray-500",
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-16 right-0 mb-4"
          >
            <Card className="p-4 grid grid-cols-2 gap-4 w-[280px]">
              {actions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button
                    variant="ghost"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <action.icon className={cn("h-6 w-6", action.color)} />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className={cn("h-14 w-14 rounded-full shadow-lg", isOpen && "bg-muted-foreground hover:bg-muted-foreground/90")}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  )
}

