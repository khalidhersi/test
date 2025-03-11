"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Metrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<Metrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
  })

  useEffect(() => {
    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          fcp: entries[0].startTime,
        }))
      }
    }).observe({ entryTypes: ["paint"] })

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          lcp: entries[entries.length - 1].startTime,
        }))
      }
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          fid: entries[0].processingStart - entries[0].startTime,
        }))
      }
    }).observe({ entryTypes: ["first-input"] })

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let cls = 0
      entryList.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      })
      setMetrics((prev) => ({
        ...prev,
        cls,
      }))
    }).observe({ entryTypes: ["layout-shift"] })
  }, [])

  if (process.env.NODE_ENV !== "development") return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 left-6 z-50">
      <Card className="p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">FCP:</span>
            <span className={cn(metrics.fcp < 1000 ? "text-green-500" : "text-yellow-500")}>
              {(metrics.fcp / 1000).toFixed(2)}s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">LCP:</span>
            <span className={cn(metrics.lcp < 2500 ? "text-green-500" : "text-yellow-500")}>
              {(metrics.lcp / 1000).toFixed(2)}s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">FID:</span>
            <span className={cn(metrics.fid < 100 ? "text-green-500" : "text-yellow-500")}>
              {metrics.fid.toFixed(2)}ms
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">CLS:</span>
            <span className={cn(metrics.cls < 0.1 ? "text-green-500" : "text-yellow-500")}>
              {metrics.cls.toFixed(3)}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

