'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Camera, Link, ImageIcon, Send } from 'lucide-react'

interface RootOpeningProps {
  isActive: boolean
  onSubmit: (content: string) => void
  onClose: () => void
}

export default function RootOpening({ isActive, onSubmit, onClose }: RootOpeningProps) {
  const [value, setValue] = useState('')
  const [inputType, setInputType] = useState<'text' | 'url' | 'file' | 'mic' | 'camera'>('text')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit(value.trim())
    setValue('')
    onClose()
  }

  const placeholder = {
    text: 'feed the tree…',
    url: 'paste a link — instagram, spotify, article…',
    file: 'drag a file here…',
    mic: 'recording… speak freely',
    camera: 'photograph something — a page, a note, a scene',
  }[inputType]

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center pb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg px-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input type selectors */}
            <div className="flex gap-3 justify-center mb-4">
              {([
                { type: 'url', icon: Link },
                { type: 'file', icon: ImageIcon },
                { type: 'mic', icon: Mic },
                { type: 'camera', icon: Camera },
              ] as const).map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setInputType(type)}
                  className="transition-all"
                  style={{
                    color: inputType === type ? 'rgba(200, 180, 140, 0.8)' : 'rgba(200, 180, 140, 0.25)',
                    padding: '4px',
                  }}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* Root glow */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-48 h-8 rounded-full pointer-events-none"
              style={{
                bottom: '5.5rem',
                background: 'radial-gradient(ellipse, rgba(200,180,140,0.18) 0%, transparent 70%)',
              }}
              animate={{ opacity: [0.5, 0.9, 0.5], scaleX: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Input form */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pr-12 transition-all focus:outline-none"
                style={{
                  background: 'rgba(10, 10, 20, 0.85)',
                  border: '1px solid rgba(200, 180, 140, 0.18)',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  color: 'rgba(232, 213, 183, 0.85)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(200, 180, 140, 0.12), inset 0 0 20px rgba(200, 180, 140, 0.04)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 180, 140, 0.35)'
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(200, 180, 140, 0.2), inset 0 0 20px rgba(200, 180, 140, 0.06)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 180, 140, 0.18)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(200, 180, 140, 0.12), inset 0 0 20px rgba(200, 180, 140, 0.04)'
                }}
              />

              {value && (
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity"
                  style={{ color: 'rgba(200, 180, 140, 0.5)' }}
                >
                  <Send size={14} />
                </button>
              )}

              {/* Pulse dot when empty */}
              {!value && (
                <motion.div
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'rgba(200, 180, 140, 0.4)' }}
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </form>

            {/* Hint */}
            <p className="text-center mt-4" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 300,
              color: 'rgba(200, 180, 140, 0.2)',
              letterSpacing: '0.05em',
            }}>
              anything you feed the tree becomes yours
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
