'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { BranchData, LeafData } from '@/data/dummy'
import Leaf3D from './Leaf3D'

interface Branch3DProps {
  branch: BranchData
  onLeafClick: (leaf: LeafData) => void
  highlighted: boolean
  dimmed: boolean
}

// Deterministic hash: 0..1 from seed + index (no Math.random, module-level)
function hashFn(seed: number, index: number): number {
  const n = seed * 127.1 + index * 311.7
  return Math.abs(Math.sin(n) * 43758.5453) % 1
}

export default function Branch3D({ branch, onLeafClick, highlighted, dimmed }: Branch3DProps) {
  const { attachment, direction, color, leaves } = branch

  // Build the branch curve in 3D space — organic, seeded from branch ID
  const curve = useMemo(() => {
    const [dx, dy, dz] = direction
    const start = new THREE.Vector3(0, attachment, 0)
    const end = new THREE.Vector3(dx, attachment + dy, dz)

    // Seed from branch ID charCodes — deterministic, unique per branch
    const seed = branch.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

    // Perpendicular axes for displacement noise
    const branchDir = end.clone().sub(start).normalize()
    const ref = Math.abs(branchDir.dot(new THREE.Vector3(0, 1, 0))) > 0.9
      ? new THREE.Vector3(1, 0, 0)
      : new THREE.Vector3(0, 1, 0)
    const perp1 = new THREE.Vector3().crossVectors(branchDir, ref).normalize()
    const perp2 = new THREE.Vector3().crossVectors(branchDir, perp1).normalize()

    // Gravity sag — how horizontal is this branch?
    const totalLen = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
    const horizontalness = Math.sqrt(dx * dx + dz * dz) / totalLen
    const sagAmount = horizontalness * 0.22 * (1 + leaves.length * 0.025)

    // 6 control points: start + 4 displaced intermediates + sagged end
    const points: THREE.Vector3[] = [start]

    ;[0.2, 0.4, 0.6, 0.8].forEach((t, i) => {
      const base = start.clone().lerp(end, t)
      // Noise peaks at t=0.5 (bell), small at start and tip
      const noiseScale = Math.sin(Math.PI * t) * totalLen * 0.055
      const h1 = (hashFn(seed, i * 2) - 0.5) * 2      // -1..1
      const h2 = (hashFn(seed, i * 2 + 1) - 0.5) * 2

      base.addScaledVector(perp1, h1 * noiseScale)
      base.addScaledVector(perp2, h2 * noiseScale)
      base.y -= sagAmount * t * t  // gravity increases toward tip
      points.push(base)
    })

    // Tip: apply full sag
    const tip = end.clone()
    tip.y -= sagAmount
    points.push(tip)

    return new THREE.CatmullRomCurve3(points)
  }, [attachment, direction, branch.id, leaves.length])

  // Thickness from leaf count
  const radius = useMemo(() => {
    return Math.min(0.04 + leaves.length * 0.012, 0.14)
  }, [leaves.length])

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 20, radius, 7, false)
  }, [curve, radius])

  const opacity = dimmed ? 0.25 : 1.0
  const emissiveIntensity = highlighted ? 0.6 : 0.2

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity,
      transparent: true,
      opacity,
      roughness: 0.8,
    })
  }, [color, emissiveIntensity, opacity])

  // Position leaves along the curve
  const leafPositions = useMemo(() => {
    return leaves.map((leaf, i) => {
      // Distribute along branch, starting at 20% to avoid the trunk
      const t = 0.2 + (i / Math.max(leaves.length - 1, 1)) * 0.75
      const point = curve.getPoint(t)
      const tangent = curve.getTangent(t)

      // Perpendicular offset for organic spread — seeded by leaf id
      const seed = leaf.id.charCodeAt(0) + leaf.id.charCodeAt(1)
      const angle = (seed * 137.5 * Math.PI) / 180 // golden angle distribution
      const spread = 0.12 + (seed % 5) * 0.04
      const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const offset = perp.clone().multiplyScalar(Math.cos(angle) * spread)
        .add(up.clone().multiplyScalar(Math.sin(angle) * spread * 0.5))

      return {
        position: point.clone().add(offset),
        rotation: angle,
      }
    })
  }, [curve, leaves])

  // Branch label position (at tip)
  const labelPosition = useMemo(() => curve.getPoint(1), [curve])

  return (
    <group>
      <mesh geometry={geometry} material={material} />

      {/* Leaves */}
      {leaves.map((leaf, i) => (
        <Leaf3D
          key={leaf.id}
          leaf={leaf}
          position={leafPositions[i].position}
          rotation={leafPositions[i].rotation}
          branchColor={color}
          onClick={() => onLeafClick(leaf)}
          dimmed={dimmed}
        />
      ))}

      {/* Branch name label */}
      {!dimmed && (
        <BranchLabel
          text={branch.name}
          position={labelPosition}
          color={color}
        />
      )}
    </group>
  )
}

// Simple text label using Drei Html
import { Html } from '@react-three/drei'

function BranchLabel({ text, position, color }: {
  text: string
  position: THREE.Vector3
  color: string
}) {
  return (
    <Html position={[position.x, position.y + 0.15, position.z]} center>
      <div
        style={{
          color,
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          opacity: 0.7,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textShadow: `0 0 8px ${color}`,
        }}
      >
        {text}
      </div>
    </Html>
  )
}
