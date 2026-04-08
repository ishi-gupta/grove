'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import Tree3D from './Tree3D'
import { LeafData } from '@/data/dummy'

interface SceneProps {
  onLeafClick: (leaf: LeafData) => void
  highlightedBranch: string | null
}

export default function Scene({ onLeafClick, highlightedBranch }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 3, 9], fov: 55 }}
      style={{ background: '#0a0a14' }}
      gl={{ antialias: true, alpha: false }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#1a1535" />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#c8b47a" />
      <pointLight position={[-5, 3, 5]} intensity={0.2} color="#c17f6b" />
      <pointLight position={[5, 3, -5]} intensity={0.2} color="#4ecdc4" />

      {/* Fog */}
      <fog attach="fog" args={['#060610', 18, 40]} />

      {/* Stars / atmosphere */}
      <Stars radius={30} depth={20} count={800} factor={1.2} saturation={0} fade speed={0.3} />

      {/* The tree */}
      <Suspense fallback={null}>
        <Tree3D onLeafClick={onLeafClick} highlightedBranch={highlightedBranch} />
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

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
