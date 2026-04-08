'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock } from 'lucide-react'
import { LeafData } from '@/data/dummy'

interface ExpandedLeafProps {
  leaf: LeafData | null
  onClose: () => void
}

const branchColors: Record<string, string> = {
  love: '#c17f6b',
  memory: '#c4935a',
  becoming: '#4ecdc4',
  beauty: '#a78bc4',
  icons: '#c9a84c',
  body: '#7a9e6e',
  alive: '#e8a85f',
  words: '#e8d5b7',
  horizon: '#f0a500',
  people: '#b87c6a',
  seed: '#6a8fc4',
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export default function ExpandedLeaf({ leaf, onClose }: ExpandedLeafProps) {
  if (!leaf) return null
  const color = branchColors[leaf.branch] ?? '#c8b47a'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(6, 6, 16, 0.7)', backdropFilter: 'blur(8px)' }}
        />

        {/* Card */}
        <motion.div
          className="relative z-10 w-[90%] max-w-lg p-10 rounded-3xl"
          style={{
            background: 'rgba(12, 12, 24, 0.97)',
            border: `1px solid ${color}25`,
            boxShadow: `0 0 60px ${color}20, 0 0 120px ${color}08`,
          }}
          initial={{ scale: 0.88, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.88, y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 transition-opacity"
            style={{ color: 'rgba(200, 180, 140, 0.3)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <X size={18} />
          </button>

          {/* Branch dot + name */}
          <div className="flex items-center gap-2 mb-8">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 300,
              color,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              {leaf.branch}
            </span>
            {leaf.isOwnWriting && (
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                color: 'rgba(200, 180, 140, 0.4)',
                marginLeft: '4px',
              }}>
                · your words
              </span>
            )}
          </div>

          {/* Content */}
          {leaf.sealed ? (
            <div className="text-center py-6">
              <Lock size={28} style={{ color: 'rgba(200, 180, 140, 0.3)', margin: '0 auto 12px' }} />
              <p style={{
                fontFamily: 'Lora, serif',
                fontSize: '15px',
                color: 'rgba(200, 180, 140, 0.4)',
                fontStyle: 'italic',
              }}>
                This opens {leaf.sealedUntil ? new Date(leaf.sealedUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'later'}.
              </p>
            </div>
          ) : (
            <div
              style={{
                fontFamily: 'Lora, serif',
                fontSize: '18px',
                lineHeight: 1.8,
                color: 'rgba(232, 213, 183, 0.92)',
                borderLeft: leaf.isOwnWriting ? `2px solid ${color}60` : 'none',
                paddingLeft: leaf.isOwnWriting ? '16px' : '0',
              }}
            >
              {leaf.content}
            </div>
          )}

          {/* Person */}
          {leaf.person && !leaf.sealed && (
            <motion.div
              className="mt-6 pt-5"
              style={{ borderTop: `1px solid ${color}20` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 300,
                color,
                opacity: 0.7,
              }}>
                — {leaf.person}
              </span>
            </motion.div>
          )}

          {/* Gift note */}
          {leaf.type === 'gift' && (
            <motion.div
              className="mt-6 pt-5"
              style={{ borderTop: '1px solid rgba(155, 124, 184, 0.2)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p style={{
                fontFamily: 'Lora, serif',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'rgba(155, 124, 184, 0.6)',
              }}>
                a gift from the gardener
              </p>
            </motion.div>
          )}

          {/* Resurfaced note */}
          {leaf.isResurfaced && (
            <motion.div
              className="mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p style={{
                fontFamily: 'Lora, serif',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'rgba(200, 180, 140, 0.45)',
              }}>
                this found its way back to you
              </p>
            </motion.div>
          )}

          {/* Bucket list */}
          {leaf.type === 'bucket' && !leaf.sealed && (
            <motion.div
              className="mt-6 pt-5 flex items-center gap-3"
              style={{ borderTop: `1px solid ${color}20` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="w-4 h-4 rounded-sm flex items-center justify-center"
                style={{ border: `1px solid ${color}60` }}
              >
                {leaf.bucketDone && (
                  <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
                )}
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 300,
                color: 'rgba(200, 180, 140, 0.5)',
              }}>
                {leaf.bucketDone ? 'done · migrating to memory' : 'still ahead'}
              </span>
            </motion.div>
          )}

          {/* Date */}
          <div className="mt-8" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            fontWeight: 300,
            color: 'rgba(200, 180, 140, 0.25)',
            letterSpacing: '0.05em',
          }}>
            {timeAgo(leaf.date)}
          </div>

          {/* Glow animation */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: `inset 0 0 40px ${color}08` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
