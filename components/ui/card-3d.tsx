"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glowColor?: string
  intensity?: "subtle" | "medium" | "strong"
}

export function Card3D({
  children,
  className,
  glowColor = "hsl(var(--primary))",
  intensity = "medium",
  ...props
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for rotation and movement
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const translateZ = useMotionValue(0)

  // Spring physics configuration based on intensity
  const springConfig = {
    stiffness: intensity === "subtle" ? 150 : intensity === "medium" ? 200 : 300,
    damping: intensity === "subtle" ? 15 : intensity === "medium" ? 20 : 25,
  }

  // Add springs for smooth animation
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)
  const translateZSpring = useSpring(translateZ, springConfig)

  // Scale based on hover state
  const scale = useSpring(1, springConfig)

  // Glow opacity based on movement
  const glowOpacity = useTransform(
    translateZ,
    [0, 20],
    [0, intensity === "subtle" ? 0.1 : intensity === "medium" ? 0.15 : 0.2],
  )

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const rotateXValue = ((mouseY - height / 2) / height) * 20
    const rotateYValue = ((mouseX - width / 2) / width) * 20

    rotateX.set(rotateXValue)
    rotateY.set(rotateYValue)
    translateZ.set(20)
  }

  function onMouseEnter() {
    setIsHovered(true)
    scale.set(1.02)
  }

  function onMouseLeave() {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
    translateZ.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        perspective: 1000,
      }}
      className={cn("relative", isHovered && "z-10", className)}
      {...props}
    >
      <motion.div
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          translateZ: translateZSpring,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}

        {/* Enhanced glow effect */}
        <motion.div
          style={{
            opacity: glowOpacity,
          }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(45deg, transparent, ${glowColor}20, transparent)`,
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

