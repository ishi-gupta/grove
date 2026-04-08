'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { LeafData } from '@/data/dummy'

interface Leaf3DProps {
  leaf: LeafData
  position: THREE.Vector3
  rotation: number
  branchColor: string
  onClick: () => void
  dimmed: boolean
}

// Organic leaf shape
function createLeafShape() {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.quadraticCurveTo(0.12, 0.08, 0.08, 0.2)
  shape.quadraticCurveTo(0.14, 0.32, 0, 0.42)
  shape.quadraticCurveTo(-0.14, 0.32, -0.08, 0.2)
  shape.quadraticCurveTo(-0.12, 0.08, 0, 0)
  return shape
}

const leafShape = createLeafShape()

export default function Leaf3D({ leaf, position, rotation, branchColor, onClick, dimmed }: Leaf3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Deterministic rotation from leaf id
  const seed = useMemo(() => {
    return leaf.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  }, [leaf.id])

  const baseRotationY = useMemo(() => (seed * 0.7) % (Math.PI * 2), [seed])
  const baseRotationX = useMemo(() => ((seed * 0.3) % 0.6) - 0.3, [seed])

  // Leaf color based on type
  const color = useMemo(() => {
    if (leaf.sealed) return '#8b6914'
    if (leaf.type === 'gift') return '#9b7cb8'
    if (leaf.isOwnWriting) return branchColor
    if (leaf.type === 'bucket') return '#d4a000'
    return branchColor
  }, [leaf, branchColor])

  const emissiveIntensity = useMemo(() => {
    if (hovered) return 0.8
    if (leaf.isOwnWriting) return 0.5
    if (leaf.sealed) return 0.6
    if (leaf.type === 'gift') return 0.7
    return 0.3
  }, [hovered, leaf])

  const geometry = useMemo(() => new THREE.ShapeGeometry(leafShape, 8), [])

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity,
    transparent: true,
    opacity: dimmed ? 0.15 : hovered ? 0.95 : 0.75,
    side: THREE.DoubleSide,
    roughness: 0.7,
  }), [color, emissiveIntensity, dimmed, hovered])

  // Gentle breathing animation
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const breathe = Math.sin(t * 0.5 + seed * 0.1) * 0.02
    meshRef.current.scale.setScalar(hovered ? 1.4 : 1.0 + breathe)
  })

  const truncated = leaf.content.slice(0, 22)

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        rotation={[baseRotationX, baseRotationY, rotation * 0.5]}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      />

      {/* Content preview on hover */}
      {hovered && !leaf.sealed && (
        <Html center distanceFactor={6}>
          <div
            style={{
              background: 'rgba(10, 10, 20, 0.92)',
              border: `1px solid ${branchColor}40`,
              borderRadius: '8px',
              padding: '8px 12px',
              maxWidth: '160px',
              pointerEvents: 'none',
              boxShadow: `0 0 16px ${branchColor}30`,
            }}
          >
            <div style={{
              fontFamily: 'Lora, serif',
              fontSize: '11px',
              color: 'rgba(232, 213, 183, 0.9)',
              lineHeight: 1.5,
            }}>
              {truncated}{leaf.content.length > 22 ? '…' : ''}
            </div>
            {leaf.person && (
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                color: branchColor,
                marginTop: '4px',
                fontWeight: 300,
              }}>
                — {leaf.person}
              </div>
            )}
            {leaf.type === 'bucket' && (
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                color: '#f0a500',
                marginTop: '4px',
              }}>
                bucket list
              </div>
            )}
          </div>
        </Html>
      )}

      {leaf.sealed && hovered && (
        <Html center distanceFactor={6}>
          <div style={{
            background: 'rgba(10, 10, 20, 0.92)',
            border: '1px solid rgba(200, 180, 140, 0.2)',
            borderRadius: '8px',
            padding: '8px 12px',
            pointerEvents: 'none',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px' }}>🔒</div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              color: 'rgba(200, 180, 140, 0.5)',
              marginTop: '4px',
            }}>
              opens {new Date(leaf.sealedUntil!).getFullYear()}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
