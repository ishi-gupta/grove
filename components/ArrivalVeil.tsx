'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { LeafData } from '@/lib/types'

interface ArrivalVeilProps {
  quote: LeafData | null
  onComplete: () => void
}

export default function ArrivalVeil({ quote, onComplete }: ArrivalVeilProps) {
  const [stage, setStage] = useState<'dark' | 'leaf' | 'waveform' | 'done'>('dark')

  useEffect(() => {
    const t1 = setTimeout(() => setStage('leaf'), 600)
    const t2 = setTimeout(() => setStage('waveform'), 2200)
    const t3 = setTimeout(() => {
      setStage('done')
      onComplete()
    }, 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: '#0a0a14' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* The opening leaf / line */}
          <AnimatePresence>
            {(stage === 'leaf' || stage === 'waveform') && (
              <motion.div
                className="text-center px-12"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <p style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  color: 'rgba(200, 180, 140, 0.75)',
                  lineHeight: 1.7,
                  maxWidth: '380px',
                }}>
                  {quote?.content ?? 'I will take shitty feeling every day rather than not feeling at all.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Waveform music indicator */}
          <AnimatePresence>
            {stage === 'waveform' && (
              <motion.div
                className="fixed bottom-12 left-8 flex items-end gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {[3, 6, 9, 5, 7, 4, 8, 5, 3, 6].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full"
                    style={{ background: 'rgba(200, 180, 140, 0.4)' }}
                    animate={{ height: [h, h * 1.8, h] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '9px',
                  fontWeight: 300,
                  color: 'rgba(200, 180, 140, 0.3)',
                  marginLeft: '8px',
                  letterSpacing: '0.08em',
                }}>
                  your music
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ambient particles */}
          <div className="fixed inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => {
              const seed = i * 137.5
              const left = (seed * 7) % 100
              const top = (seed * 13) % 100
              return (
                <motion.div
                  key={i}
                  className="absolute w-px h-px rounded-full"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    background: 'rgba(200, 180, 140, 1)',
                  }}
                  animate={{ opacity: [0, 0.15, 0] }}
                  transition={{
                    duration: 3 + (i % 4),
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                />
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
