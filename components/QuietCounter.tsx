'use client'

import { Html } from '@react-three/drei'

interface QuietCounterProps {
  days: number
}

/**
 * A single number near the root of the tree — how many days it has been alive.
 * No label. Just the number. Felt, not explained.
 */
export default function QuietCounter({ days }: QuietCounterProps) {
  if (days <= 0) return null

  return (
    <Html position={[0, -0.35, 0.4]} center>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          fontWeight: 200,
          color: 'rgba(200, 180, 140, 0.14)',
          letterSpacing: '0.15em',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {days}
      </div>
    </Html>
  )
}
