"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function FlowingLines() {
  const linesRef = useRef<THREE.Group>(null)
  const lineCount = 80 // Reduced from 150

  const lines = useMemo(() => {
    return Array.from({ length: lineCount }).map((_, i) => {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 10 - 5),
        new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 10 - 5),
        new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 10 - 5),
        new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 10 - 5),
      )

      const points = curve.getPoints(50)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      return {
        points: geometry,
        speed: Math.random() * 0.3 + 0.05, // Slower movement
        offset: Math.random() * Math.PI * 2,
      }
    })
  }, [])

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.03 // Slower rotation
      linesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1 // Less movement

      // Animate each line
      linesRef.current.children.forEach((child, i) => {
        const line = child as THREE.Line
        const scale = Math.sin(clock.getElapsedTime() * lines[i].speed + lines[i].offset) * 0.3 + 1.2 // Less scaling
        line.scale.set(scale, scale, scale)
      })
    }
  })

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i} geometry={line.points}>
          <lineBasicMaterial color="white" transparent opacity={Math.random() * 0.3 + 0.05} /> {/* Lower opacity */}
        </line>
      ))}
    </group>
  )
}

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <FlowingLines />
      </Canvas>
    </div>
  )
}
