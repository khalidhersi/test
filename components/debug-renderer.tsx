"use client"

import { useEffect } from "react"

interface DebugRendererProps {
  id: string
  message: string
}

export function DebugRenderer({ id, message }: DebugRendererProps) {
  useEffect(() => {
    console.log(`Debug: ${id} rendered with message: ${message}`)
  }, [id, message])

  return (
    <div id={id} className="hidden">
      {/* This component is just for debugging */}
    </div>
  )
}

