'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useMemo } from 'react'
import Tree3D from './Tree3D'
import ConstellationMode from './ConstellationMode'
import type { BranchData, LeafData } from '@/lib/types'
import { getSeasonalPalette } from '@/lib/seasons'

interface SceneProps {
  branches: BranchData[]
  treeDays: number
  onLeafClick: (leaf: LeafData) => void
  highlightedBranch: string | null
  viewMode: 'tree' | 'constellation'
}

export default function Scene({ branches, treeDays, onLeafClick, highlightedBranch, viewMode }: SceneProps) {
  const palette = useMemo(() => getSeasonalPalette(), [])

  return (
    <Canvas
      camera={{ position: [0, 3, 9], fov: 55 }}
      style={{ background: '#0a0a14' }}
      gl={{ antialias: true, alpha: false }}
    >
      {/* Seasonal lighting */}
      <ambientLight intensity={palette.ambientIntensity} color={palette.ambientColor} />
      <pointLight position={[0, 8, 0]} intensity={palette.topLightIntensity} color={palette.topLight} />
      <pointLight position={[-5, 3, 5]} intensity={palette.warmLightIntensity} color={palette.warmLight} />
      <pointLight position={[5, 3, -5]} intensity={palette.coolLightIntensity} color={palette.coolLight} />

      {/* Seasonal fog */}
      <fog attach="fog" args={[palette.fogColor, palette.fogNear, palette.fogFar]} />

      {/* Stars — more visible in winter, hazy in summer */}
      <Stars
        radius={30}
        depth={20}
        count={palette.starCount}
        factor={1.2}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Tree or Constellation view */}
      <Suspense fallback={null}>
        {viewMode === 'tree' ? (
          <Tree3D
            branches={branches}
            treeDays={treeDays}
            onLeafClick={onLeafClick}
            highlightedBranch={highlightedBranch}
          />
        ) : (
          <ConstellationMode
            branches={branches}
            onLeafClick={onLeafClick}
          />
        )}
      </Suspense>

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={4}
        maxDistance={18}
        autoRotate
        autoRotateSpeed={0.3}
        target={[0, 2, 0]}
      />

      {/* Post-processing — seasonal bloom */}
      <EffectComposer>
        <Bloom
          intensity={palette.bloomIntensity}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
