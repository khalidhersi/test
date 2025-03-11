import * as THREE from "three"

export function createGradientTexture(colorA: string, colorB: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256

  const context = canvas.getContext("2d")
  if (!context) return null

  const gradient = context.createLinearGradient(0, 0, 256, 256)
  gradient.addColorStop(0, colorA)
  gradient.addColorStop(1, colorB)

  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  return texture
}

export function createParticleSystem(count: number) {
  const particles = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 10
    particles[i * 3 + 1] = (Math.random() - 0.5) * 10
    particles[i * 3 + 2] = (Math.random() - 0.5) * 10
    sizes[i] = Math.random() * 2
  }

  return { particles, sizes }
}

