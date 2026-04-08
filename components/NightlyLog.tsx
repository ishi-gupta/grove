'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { nightlyLogs as dummyLogs } from '@/data/dummy'
import { isSupabaseConfigured } from '@/lib/supabase'

interface NightlyLogProps {
  isOpen: boolean
  onClose: () => void
}

interface LogDot {
  date: string
  positive: boolean
}

export default function NightlyLog({ isOpen, onClose }: NightlyLogProps) {
  const [entry, setEntry] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [streakDots, setStreakDots] = useState<LogDot[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Fetch 7-day streak data
  const fetchLogs = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setStreakDots(dummyLogs.slice(0, 7).reverse())
      return
    }

    try {
      const res = await fetch('/api/nightly-logs?days=7')
      if (res.ok) {
        const data = await res.json()
        const logs: LogDot[] = (data.logs ?? []).map((l: { date: string; positive: boolean }) => ({
          date: l.date,
          positive: l.positive,
        }))

        // Fill in missing days with empty dots
        const dots: LogDot[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          const existing = logs.find((l) => l.date === dateStr)
          dots.push(existing ?? { date: dateStr, positive: false })
        }
        setStreakDots(dots)
      } else {
        setStreakDots(dummyLogs.slice(0, 7).reverse())
      }
    } catch {
      setStreakDots(dummyLogs.slice(0, 7).reverse())
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
    }
  }, [isOpen, fetchLogs])

  const handleSubmit = async () => {
    if (!entry.trim() || isSaving) return

    if (!isSupabaseConfigured()) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setEntry('')
        onClose()
      }, 1800)
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/nightly-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: entry.trim() }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setEntry('')
          onClose()
        }, 1800)
      } else {
        console.error('Failed to save nightly log')
      }
    } catch (err) {
      console.error('Error saving nightly log:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(6,6,16,0.6)', backdropFilter: 'blur(6px)' }} />

          <motion.div
            className="relative z-10 w-full max-w-lg mx-6 mb-24 rounded-3xl p-8"
            style={{
              background: 'rgba(10, 10, 22, 0.97)',
              border: '1px solid rgba(200, 180, 140, 0.12)',
              boxShadow: '0 0 60px rgba(0,0,0,0.6)',
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5"
              style={{ color: 'rgba(200, 180, 140, 0.25)' }}
            >
              <X size={16} />
            </button>

            {/* Date */}
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 300,
              color: 'rgba(200, 180, 140, 0.3)',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
            </p>

            {/* Prompt */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  className="py-8 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '18px',
                    color: 'rgba(200, 180, 140, 0.7)',
                    fontStyle: 'italic',
                  }}>
                    the tree is listening.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '20px',
                    color: 'rgba(232, 213, 183, 0.85)',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                  }}>
                    What sparked something in you today?
                  </p>

                  <textarea
                    autoFocus
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    rows={4}
                    className="w-full resize-none focus:outline-none"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(200, 180, 140, 0.15)',
                      fontFamily: 'Lora, serif',
                      fontSize: '15px',
                      color: 'rgba(232, 213, 183, 0.8)',
                      lineHeight: 1.7,
                      padding: '8px 0',
                      marginBottom: '20px',
                    }}
                    placeholder="a conversation, a taste, a moment of effort, something beautiful you noticed\u2026"
                    onFocus={(e) => e.currentTarget.style.borderBottomColor = 'rgba(200, 180, 140, 0.35)'}
                    onBlur={(e) => e.currentTarget.style.borderBottomColor = 'rgba(200, 180, 140, 0.15)'}
                  />

                  {/* 7 day dots */}
                  <div className="flex gap-2 items-center mb-6">
                    {streakDots.map((log, i) => (
                      <div
                        key={i}
                        title={log.date}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{
                          background: log.positive
                            ? 'rgba(200, 180, 140, 0.6)'
                            : 'rgba(200, 180, 140, 0.15)',
                          boxShadow: log.positive ? '0 0 4px rgba(200, 180, 140, 0.4)' : 'none',
                        }}
                      />
                    ))}
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '9px',
                      color: 'rgba(200, 180, 140, 0.25)',
                      marginLeft: '4px',
                    }}>
                      last 7 days
                    </span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!entry.trim() || isSaving}
                    className="transition-all"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      fontWeight: 300,
                      letterSpacing: '0.08em',
                      color: entry.trim() && !isSaving ? 'rgba(200, 180, 140, 0.7)' : 'rgba(200, 180, 140, 0.2)',
                      padding: '8px 0',
                      border: 'none',
                      background: 'none',
                      cursor: entry.trim() && !isSaving ? 'pointer' : 'default',
                    }}
                  >
                    {isSaving ? 'saving\u2026' : 'add to the tree \u2192'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
