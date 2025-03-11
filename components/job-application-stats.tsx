"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Mock data for application statistics
const monthlyData = [
  { name: "Jan", applications: 12, interviews: 5, offers: 1 },
  { name: "Feb", applications: 15, interviews: 7, offers: 2 },
  { name: "Mar", applications: 18, interviews: 8, offers: 3 },
  { name: "Apr", applications: 14, interviews: 6, offers: 1 },
  { name: "May", applications: 20, interviews: 9, offers: 2 },
  { name: "Jun", applications: 25, interviews: 12, offers: 4 },
]

const weeklyData = [
  { name: "Mon", applications: 4, interviews: 1, offers: 0 },
  { name: "Tue", applications: 6, interviews: 2, offers: 1 },
  { name: "Wed", applications: 8, interviews: 3, offers: 0 },
  { name: "Thu", applications: 5, interviews: 2, offers: 1 },
  { name: "Fri", applications: 7, interviews: 3, offers: 0 },
  { name: "Sat", applications: 3, interviews: 0, offers: 0 },
  { name: "Sun", applications: 2, interviews: 0, offers: 0 },
]

const statusData = [
  { name: "Applied", value: 65 },
  { name: "Screening", value: 15 },
  { name: "Interview", value: 10 },
  { name: "Offer", value: 5 },
  { name: "Rejected", value: 5 },
]

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#06b6d4", "#ef4444"]

export function JobApplicationStats() {
  const [activeTab, setActiveTab] = useState("monthly")
  const [chartData, setChartData] = useState(monthlyData)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setChartData(activeTab === "monthly" ? monthlyData : weeklyData)
  }, [activeTab])

  const isMobile = windowWidth < 768

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Status Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <div className="flex justify-end">
              <TabsList>
                <TabsTrigger
                  value="weekly"
                  onClick={() => setActiveTab("weekly")}
                  className={activeTab === "weekly" ? "bg-primary text-primary-foreground" : ""}
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  onClick={() => setActiveTab("monthly")}
                  className={activeTab === "monthly" ? "bg-primary text-primary-foreground" : ""}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#4f46e5" name="Applications" />
                <Bar dataKey="interviews" fill="#10b981" name="Interviews" />
                <Bar dataKey="offers" fill="#f59e0b" name="Offers" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pie">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx={isMobile ? "50%" : "50%"}
                  cy={isMobile ? "45%" : "45%"}
                  labelLine={!isMobile}
                  label={!isMobile ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)` : undefined}
                  outerRadius={isMobile ? 80 : 120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [`${value} applications`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

