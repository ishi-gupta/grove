'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Sprout } from 'lucide-react'
import { useState } from 'react'
import type { SuggestionData } from '@/lib/types'

interface SeedPanelProps {
  isOpen: boolean
  suggestions: SuggestionData[]
  onClose: () => void
}

const complexityColor = {
  small: '#7a9e6e',
  medium: '#c4935a',
  large: '#c17f6b',
}

function SuggestionCard({ s }: { s: SuggestionData }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(s.claudePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(106, 143, 196, 0.15)',
        marginBottom: '12px',
      }}
    >
      {/* Complexity badge */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: complexityColor[s.complexity] }}
        />
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '9px',
          fontWeight: 300,
          color: complexityColor[s.complexity],
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {s.complexity}
        </span>
      </div>

      {/* Title */}
      <p style={{
        fontFamily: 'Lora, serif',
        fontSize: '15px',
        color: 'rgba(232, 213, 183, 0.9)',
        marginBottom: '10px',
        lineHeight: 1.4,
      }}>
        {s.title}
      </p>

      {/* Why */}
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 300,
        color: 'rgba(200, 180, 140, 0.45)',
        lineHeight: 1.6,
        marginBottom: '14px',
      }}>
        {s.why}
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 transition-all"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            fontWeight: 300,
            color: copied ? '#7a9e6e' : 'rgba(106, 143, 196, 0.7)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'copied' : 'copy claude prompt'}
        </button>
      </div>
    </div>
  )
}

export default function SeedPanel({ isOpen, suggestions, onClose }: SeedPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-40 w-80 overflow-y-auto"
            style={{
              background: 'rgba(8, 8, 20, 0.97)',
              borderLeft: '1px solid rgba(106, 143, 196, 0.15)',
              backdropFilter: 'blur(16px)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Sprout size={14} style={{ color: '#6a8fc4' }} />
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 300,
                    color: '#6a8fc4',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    The Seed
                  </span>
                </div>
                <button onClick={onClose} style={{ color: 'rgba(200, 180, 140, 0.25)' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: 'Lora, serif',
                fontSize: '13px',
                fontStyle: 'italic',
                color: 'rgba(200, 180, 140, 0.4)',
                lineHeight: 1.7,
                marginBottom: '24px',
              }}>
                The gardener read the tree and left these here. What the tree thinks it wants to become.
              </p>

              {/* Suggestions */}
              {suggestions.map((s) => (
                <SuggestionCard key={s.id} s={s} />
              ))}

              {/* Footer note */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 300,
                color: 'rgba(200, 180, 140, 0.2)',
                lineHeight: 1.6,
                marginTop: '16px',
              }}>
                Copy a prompt and paste it into Claude Code. The tree builds itself.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
