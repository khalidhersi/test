"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ProgressClient() {
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      console.log("ProgressClient component mounted")
      setMounted(true)
    } catch (err) {
      console.error("Error in ProgressClient:", err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  if (error) {
    return <div className="p-4 bg-red-50 text-red-500 rounded-md">Error rendering Progress section: {error}</div>
  }

  if (!mounted) {
    return <div>Loading Progress section...</div>
  }

  return (
    <div
      style={{
        display: "block",
        width: "100%",
        marginTop: "2rem",
        paddingTop: "2rem",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <h2 className="text-2xl font-bold mb-6">Progress</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem",
        }}
      >
        <Link href="/applications" style={{ display: "block" }}>
          <Card
            style={{
              transition: "border-color 0.2s",
              cursor: "pointer",
            }}
          >
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                height: "8rem",
              }}
            >
              <Briefcase
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--primary)",
                }}
              />
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "500",
                }}
              >
                Applications
              </span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/analytics" style={{ display: "block" }}>
          <Card
            style={{
              transition: "border-color 0.2s",
              cursor: "pointer",
            }}
          >
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                height: "8rem",
              }}
            >
              <BarChart3
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--primary)",
                }}
              />
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "500",
                }}
              >
                Analytics
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

