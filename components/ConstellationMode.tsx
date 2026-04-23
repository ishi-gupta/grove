'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BranchData, LeafData } from '@/lib/types'

interface ConstellationModeProps {
  branches: BranchData[]
  onLeafClick: (leaf: LeafData) => void
}

/**
 * Constellation mode — an alternative view where leaves detach from branches
 * and arrange chronologically in a spiral timeline. Same data, different shape.
 * Stars connected by faint lines, grouped by branch color.
 */
export default function ConstellationMode({ branches, onLeafClick }: ConstellationModeProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Sort all leaves by date and compute 3D positions in a spiral
  const { points, connections } = useMemo(() => {
    const allLeaves: (LeafData & { branchColor: string })[] = branches.flatMap((b) =>
      b.leaves.map((l) => ({ ...l, branchColor: b.color }))
    )

    // Sort by date
    allLeaves.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Spiral layout — each leaf is a point along a rising spiral
    const pts = allLeaves.map((leaf, i) => {
      const t = i / Math.max(allLeaves.length - 1, 1)
      const angle = t * Math.PI * 6 // 3 full rotations
      const radius = 1.5 + t * 3.5  // expanding outward
      const y = t * 5 - 1           // rising from -1 to 4

      return {
        leaf,
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius,
        ),
      }
    })

    // Connect leaves on the same branch with faint lines
    const conns: { from: THREE.Vector3; to: THREE.Vector3; color: string }[] = []
    const branchLastSeen = new Map<string, THREE.Vector3>()

    for (const pt of pts) {
      const prev = branchLastSeen.get(pt.leaf.branch)
      if (prev) {
        conns.push({ from: prev.clone(), to: pt.position.clone(), color: pt.leaf.branchColor })
      }
      branchLastSeen.set(pt.leaf.branch, pt.position)
    }

    return { points: pts, connections: conns }
  }, [branches])

  // Gentle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <ConstellationLine key={`line-${i}`} from={conn.from} to={conn.to} color={conn.color} />
      ))}

      {/* Star points */}
      {points.map((pt) => (
        <ConstellationStar
          key={pt.leaf.id}
          leaf={pt.leaf}
          position={pt.position}
          color={pt.leaf.branchColor}
          onClick={() => onLeafClick(pt.leaf)}
        />
      ))}

      {/* Year markers along the spiral */}
      <YearMarkers points={points} />
    </group>
  )
}

// ─── Star (single leaf as a point of light) ──────────────────────────

function ConstellationStar({
  leaf,
  position,
  color,
  onClick,
}: {
  leaf: LeafData
  position: THREE.Vector3
  color: string
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const seed = leaf.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  // Gentle twinkle
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      const twinkle = 0.6 + Math.sin(t * 0.8 + seed * 0.3) * 0.4
      meshRef.current.scale.setScalar(twinkle)
    }
  })

  const size = leaf.isOwnWriting ? 0.07 : 0.05

  return (
    <mesh
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onPointerEnter={() => { document.body.style.cursor = 'pointer' }}
      onPointerLeave={() => { document.body.style.cursor = 'auto' }}
    >
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

// ─── Line between same-branch stars ─────────────────────────────────

function ConstellationLine({
  from,
  to,
  color,
}: {
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
}) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array([
      from.x, from.y, from.z,
      to.x, to.y, to.z,
    ])
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [from, to])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.12} />
    </lineSegments>
  )
}

// ─── Year markers ───────────────────────────────────────────────────

function YearMarkers({ points }: { points: { leaf: LeafData; position: THREE.Vector3 }[] }) {
  const markers = useMemo(() => {
    const seen = new Set<number>()
    const result: { year: number; position: THREE.Vector3 }[] = []

    for (const pt of points) {
      const year = new Date(pt.leaf.date).getFullYear()
      if (!seen.has(year)) {
        seen.add(year)
        result.push({ year, position: pt.position })
      }
    }

    return result
  }, [points])

  return (
    <>
      {markers.map((m) => (
        <Html key={m.year} position={[m.position.x - 0.5, m.position.y + 0.3, m.position.z]} center>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              fontWeight: 200,
              color: 'rgba(200, 180, 140, 0.2)',
              letterSpacing: '0.15em',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {m.year}
          </div>
        </Html>
      ))}
    </>
  )
}
