'use client'

import { motion } from 'framer-motion'
import { TreePine, Plus, Moon, Sprout } from 'lucide-react'

type AppState = 'explore' | 'feed' | 'log' | 'seed'

interface NavigationProps {
  state: AppState
  onChange: (state: AppState) => void
}

const items = [
  { id: 'explore', icon: TreePine, label: 'grove' },
  { id: 'feed', icon: Plus, label: 'feed' },
  { id: 'log', icon: Moon, label: 'log' },
  { id: 'seed', icon: Sprout, label: 'seed' },
] as const

export default function Navigation({ state, onChange }: NavigationProps) {
  return (
    <motion.nav
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      style={{
        background: 'rgba(10, 10, 20, 0.7)',
        border: '1px solid rgba(200, 180, 140, 0.1)',
        borderRadius: '9999px',
        padding: '8px 16px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {items.map(({ id, icon: Icon, label }) => {
        const active = state === id
        return (
          <button
            key={id}
            onClick={() => onChange(id as AppState)}
            className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all"
            style={{ color: active ? 'rgba(200, 180, 140, 0.9)' : 'rgba(200, 180, 140, 0.25)' }}
          >
            {active && (
              <motion.div
                className="absolute inset-0 rounded-full"
                layoutId="nav-active"
                style={{ background: 'rgba(200, 180, 140, 0.08)' }}
                transition={{ type: 'spring', damping: 26, stiffness: 380 }}
              />
            )}
            <Icon size={15} strokeWidth={1.5} />
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              fontWeight: 300,
              letterSpacing: '0.08em',
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </motion.nav>
  )
}
