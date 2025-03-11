"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
}

export function SkeletonCard({ rows = 3, className, ...props }: SkeletonCardProps) {
  return (
    <Card className={cn("p-6", className)} {...props}>
      <div className="space-y-4">
        <motion.div
          className="h-6 w-2/3 rounded-md bg-muted"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            className="h-4 w-full rounded-md bg-muted"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
          />
        ))}
      </div>
    </Card>
  )
}

