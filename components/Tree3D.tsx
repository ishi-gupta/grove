'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import type { BranchData, LeafData } from '@/lib/types'
import Branch3D from './Branch3D'
import QuietCounter from './QuietCounter'

interface Tree3DProps {
  branches: BranchData[]
  treeDays: number
  onLeafClick: (leaf: LeafData) => void
  highlightedBranch: string | null
}

export default function Tree3D({ branches, treeDays, onLeafClick, highlightedBranch }: Tree3DProps) {
  // Trunk geometry — slightly curved upward
  const trunkCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.08, 0.8, 0.05),
      new THREE.Vector3(-0.05, 1.6, -0.03),
      new THREE.Vector3(0.04, 2.4, 0.02),
      new THREE.Vector3(0, 3.0, 0),
    ])
  }, [])

  const trunkGeometry = useMemo(() => {
    return new THREE.TubeGeometry(trunkCurve, 20, 0.18, 8, false)
  }, [trunkCurve])

  const trunkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#3d2b1a',
      roughness: 0.9,
      metalness: 0.0,
      emissive: '#1a0f07',
      emissiveIntensity: 0.3,
    })
  }, [])

  // Root geometry — base glow ellipse
  const rootGeometry = useMemo(() => new THREE.SphereGeometry(0.25, 16, 8), [])
  const rootMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6b4f2a',
    emissive: '#c8b47a',
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.6,
  }), [])

  return (
    <group>
      {/* Trunk */}
      <mesh geometry={trunkGeometry} material={trunkMaterial} />

      {/* Root glow */}
      <mesh geometry={rootGeometry} material={rootMaterial} position={[0, -0.1, 0]} />

      {/* Quiet counter — days alive, near the root */}
      <QuietCounter days={treeDays} />

      {/* Branches */}
      {branches.map((branch) => {
        const isHighlighted = highlightedBranch === branch.id
        const isDimmed = highlightedBranch !== null && !isHighlighted
        return (
          <Branch3D
            key={branch.id}
            branch={branch}
            onLeafClick={onLeafClick}
            highlighted={isHighlighted}
            dimmed={isDimmed}
          />
        )
      })}
    </group>
  )
}
