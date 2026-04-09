'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { TreePine, Plus, Moon, Sprout, LogOut } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

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
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      {/* User avatar — top right */}
      {user && (
        <motion.div
          className="fixed top-6 right-6 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer transition-opacity duration-300"
            style={{
              border: '1px solid rgba(200, 180, 140, 0.2)',
              opacity: 0.6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
          >
            {user.user_metadata?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url as string}
                alt=""
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xs"
                style={{ background: 'rgba(200, 180, 140, 0.1)', color: 'rgba(200, 180, 140, 0.5)' }}
              >
                {(user.email?.[0] ?? '?').toUpperCase()}
              </div>
            )}
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 py-1 px-1 rounded-lg"
                style={{
                  background: 'rgba(10, 10, 20, 0.85)',
                  border: '1px solid rgba(200, 180, 140, 0.1)',
                  backdropFilter: 'blur(12px)',
                  minWidth: '120px',
                }}
              >
                <button
                  onClick={async () => { setShowMenu(false); await signOut(); router.push('/login') }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs transition-colors cursor-pointer"
                  style={{ color: 'rgba(200, 180, 140, 0.5)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 180, 140, 0.08)'
                    e.currentTarget.style.color = 'rgba(200, 180, 140, 0.8)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(200, 180, 140, 0.5)'
                  }}
                >
                  <LogOut size={12} strokeWidth={1.5} />
                  <span style={{ fontFamily: 'var(--font-sans)' }}>Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Navigation pill */}
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
    </>
  )
}
