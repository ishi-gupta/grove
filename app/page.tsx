'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { LeafData } from '@/data/dummy'
import ExpandedLeaf from '@/components/ExpandedLeaf'
import Navigation from '@/components/Navigation'
import RootOpening from '@/components/RootOpening'
import NightlyLog from '@/components/NightlyLog'
import SeedPanel from '@/components/SeedPanel'
import ArrivalVeil from '@/components/ArrivalVeil'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { FeedMeta } from '@/components/RootOpening'

// Load 3D scene client-side only \u2014 Three.js requires browser APIs
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

type AppState = 'explore' | 'feed' | 'log' | 'seed'

export default function Page() {
  const [arrived, setArrived] = useState(false)
  const [appState, setAppState] = useState<AppState>('explore')
  const [selectedLeaf, setSelectedLeaf] = useState<LeafData | null>(null)
  const [highlightedBranch, setHighlightedBranch] = useState<string | null>(null)

  const handleLeafClick = useCallback((leaf: LeafData) => {
    setSelectedLeaf(leaf)
    setHighlightedBranch(leaf.branch)
  }, [])

  const handleCloseLeaf = useCallback(() => {
    setSelectedLeaf(null)
    setHighlightedBranch(null)
  }, [])

  const handleStateChange = (state: AppState) => {
    setAppState(state)
    if (state !== 'explore') setSelectedLeaf(null)
  }

  const handleFeedSubmit = useCallback(async (content: string, meta?: FeedMeta) => {
    if (!isSupabaseConfigured()) {
      console.log('Fed to tree (demo mode):', content, meta)
      return
    }

    try {
      // Step 1: Classify the content into a branch
      const classifyRes = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const { branch_id } = await classifyRes.json()

      // Step 2: Create the leaf
      if (meta?.file) {
        // File upload (image, audio, camera)
        const formData = new FormData()
        formData.append('file', meta.file)
        formData.append('content', content)
        formData.append('branch_id', branch_id)

        const res = await fetch('/api/leaves/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          console.error('Failed to upload leaf:', await res.text())
        }
      } else {
        // Text or URL leaf
        const res = await fetch('/api/leaves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            type: meta?.type === 'url' ? 'text' : 'text',
            branch_id,
            is_own_writing: true,
          }),
        })

        if (!res.ok) {
          console.error('Failed to create leaf:', await res.text())
        }
      }
    } catch (err) {
      console.error('Error feeding tree:', err)
    }
  }, [])

  return (
    <main className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a14' }}>

      {/* Arrival veil */}
      {!arrived && <ArrivalVeil onComplete={() => setArrived(true)} />}

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Scene onLeafClick={handleLeafClick} highlightedBranch={highlightedBranch} />
      </div>

      {/* Deterministic ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 25 }).map((_, i) => {
          const s = i * 137.508
          return (
            <div
              key={i}
              className="absolute w-px h-px rounded-full animate-pulse"
              style={{
                left: `${(s * 7.3) % 100}%`,
                top: `${(s * 13.7) % 100}%`,
                background: 'rgba(200, 180, 140, 1)',
                opacity: 0.06 + (i % 5) * 0.02,
                animationDelay: `${(s * 0.3) % 6}s`,
                animationDuration: `${3 + (s % 4)}s`,
              }}
            />
          )
        })}
      </div>

      {/* Overlays */}
      <ExpandedLeaf leaf={selectedLeaf} onClose={handleCloseLeaf} />

      <RootOpening
        isActive={appState === 'feed'}
        onSubmit={handleFeedSubmit}
        onClose={() => setAppState('explore')}
      />

      <NightlyLog
        isOpen={appState === 'log'}
        onClose={() => setAppState('explore')}
      />

      <SeedPanel
        isOpen={appState === 'seed'}
        onClose={() => setAppState('explore')}
      />

      {/* Navigation appears after arrival */}
      {arrived && (
        <Navigation state={appState} onChange={handleStateChange} />
      )}
    </main>
  )
}
