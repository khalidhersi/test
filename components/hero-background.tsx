"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetMousePosition = useRef({ x: 0, y: 0 })
  const colorState = useRef({
    current: new THREE.Color("#3B82F6"),
    target: new THREE.Color("#3B82F6"),
  })

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup with enhanced configuration
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 40
    camera.rotation.x = -0.2 // Slight tilt for better perspective

    // Initialize renderer with improved quality settings
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: false,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Enhanced post-processing setup
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6, // Bloom strength
      0.4, // Radius
      0.85, // Threshold
    )
    composer.addPass(bloomPass)

    // Color palette for transitions
    const colors = [
      "#3B82F6", // Blue
      "#06B6D4", // Cyan
      "#6366F1", // Indigo
      "#8B5CF6", // Purple
      "#EC4899", // Pink
    ]

    // Create enhanced wave geometry
    const waveGeometry = new THREE.PlaneGeometry(120, 120, 128, 128)
    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uColor1: { value: new THREE.Color(colors[0]) },
        uColor2: { value: new THREE.Color(colors[1]) },
        uColor3: { value: new THREE.Color(colors[2]) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vElevation;

        // Improved noise function for more organic movement
        vec4 permute(vec4 x) {
          return mod(((x*34.0)+1.0)*x, 289.0);
        }

        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

          // First corner
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);

          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);

          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;

          // Permutations
          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

          // Gradients
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);

          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);

          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          float noiseFreq = 2.0;
          float noiseAmp = 1.0;
          
          // Create multiple layers of noise for more organic movement
          float noise1 = snoise(vec3(
            pos.x * 0.03 + uTime * 0.2, 
            pos.y * 0.03, 
            uTime * 0.1
          )) * 3.0;
          
          float noise2 = snoise(vec3(
            pos.x * 0.06 + uTime * 0.3 + 100.0, 
            pos.y * 0.06, 
            uTime * 0.15
          )) * 1.5;
          
          float noise3 = snoise(vec3(
            pos.x * 0.09 + uTime * 0.4 + 200.0, 
            pos.y * 0.09, 
            uTime * 0.2
          )) * 0.75;
          
          // Combine noise layers
          float elevation = noise1 + noise2 + noise3;
          
          // Enhanced mouse interaction
          float mouseDistance = length(uv - uMouse);
          float mouseInfluence = smoothstep(0.8, 0.0, mouseDistance) * 3.0;
          elevation += mouseInfluence;
          
          // Add subtle organic motion
          elevation += sin(pos.x * 0.2 + uTime) * 0.5;
          elevation += cos(pos.y * 0.2 + uTime) * 0.5;
          
          pos.z += elevation;
          vElevation = elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          // Use mouse position to influence color mixing
          float mouseInfluence = length(vUv - uMouse) * 2.0;
          
          // Create dynamic color mixing based on elevation and mouse
          vec3 mixedColor1 = mix(uColor1, uColor2, vUv.x + sin(vUv.y + vElevation * 0.3 + mouseInfluence));
          vec3 finalColor = mix(mixedColor1, uColor3, vUv.y + cos(vUv.x + vElevation * 0.3 - mouseInfluence));
          
          // Add depth-based shading
          float depth = smoothstep(-2.0, 2.0, vElevation);
          finalColor *= 0.8 + depth * 0.4;
          
          // Edge fade for smoother blending
          float edgeFade = smoothstep(0.0, 0.1, vUv.x) * 
                          smoothstep(1.0, 0.9, vUv.x) * 
                          smoothstep(0.0, 0.1, vUv.y) * 
                          smoothstep(1.0, 0.9, vUv.y);
          
          // Combine everything with proper opacity
          gl_FragColor = vec4(finalColor, 0.8 * edgeFade);
        }
      `,
      transparent: true,
    })

    const waves = new THREE.Mesh(waveGeometry, waveMaterial)
    waves.rotation.x = -Math.PI * 0.3 // Adjust angle for better perspective
    waves.position.y = -5 // Slightly lower position
    scene.add(waves)

    // Smooth mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      targetMousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1
      targetMousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Update target color based on mouse position
      const colorIndex = Math.floor(
        ((Math.atan2(targetMousePosition.current.y, targetMousePosition.current.x) + Math.PI) / (Math.PI * 2)) *
          colors.length,
      )
      colorState.current.target = new THREE.Color(colors[colorIndex])
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop with smooth transitions
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.001

      // Smooth mouse position updates
      mousePosition.current.x += (targetMousePosition.current.x - mousePosition.current.x) * 0.05
      mousePosition.current.y += (targetMousePosition.current.y - mousePosition.current.y) * 0.05

      // Smooth color transitions
      colorState.current.current.lerp(colorState.current.target, 0.01)

      // Update uniforms
      waveMaterial.uniforms.uTime.value = time
      waveMaterial.uniforms.uMouse.value.x = mousePosition.current.x
      waveMaterial.uniforms.uMouse.value.y = mousePosition.current.y
      waveMaterial.uniforms.uColor1.value.copy(colorState.current.current)
      waveMaterial.uniforms.uColor2.value.copy(colorState.current.current).multiplyScalar(0.8)
      waveMaterial.uniforms.uColor3.value.copy(colorState.current.current).multiplyScalar(0.6)

      composer.render()
    }

    // Handle resize with proper cleanup
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      composer.setSize(width, height)

      waveMaterial.uniforms.uResolution.value.set(width, height)
    }

    window.addEventListener("resize", handleResize)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)

      // Dispose of THREE.js resources
      waves.geometry.dispose()
      waveMaterial.dispose()
      renderer.dispose()

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}

