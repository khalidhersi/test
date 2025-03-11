"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LineChart, Line, AreaChart, Area, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", applications: 4, responses: 2 },
  { name: "Tue", applications: 6, responses: 3 },
  { name: "Wed", applications: 8, responses: 4 },
  { name: "Thu", applications: 5, responses: 2 },
  { name: "Fri", applications: 7, responses: 3 },
  { name: "Sat", applications: 3, responses: 1 },
  { name: "Sun", applications: 2, responses: 1 },
]

export function MetricsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm text-muted-foreground">Weekly Applications</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">35</span>
            <span className="text-sm text-green-500">+12%</span>
          </div>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="applicationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="applications" stroke="var(--primary)" fill="url(#applicationGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm text-muted-foreground">Response Rate</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">48%</span>
            <span className="text-sm text-green-500">+5%</span>
          </div>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="responses" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm text-muted-foreground">Interview Success</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">72%</span>
            <span className="text-sm text-green-500">+8%</span>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm text-muted-foreground">Time to Offer</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">18</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Industry avg:</span>
              <span>24 days</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

