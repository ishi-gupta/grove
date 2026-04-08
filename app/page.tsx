'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { LeafData } from '@/lib/types'
import { useBranches, useNightlyLogs, useSeedSuggestions, useRandomOwnWritingLeaf, useTreeAge } from '@/lib/data'
import ExpandedLeaf from '@/components/ExpandedLeaf'
import Navigation from '@/components/Navigation'
import RootOpening from '@/components/RootOpening'
import NightlyLog from '@/components/NightlyLog'
import SeedPanel from '@/components/SeedPanel'
import ArrivalVeil from '@/components/ArrivalVeil'

// Load 3D scene client-side only — Three.js requires browser APIs
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

type AppState = 'explore' | 'feed' | 'log' | 'seed'

export default function Page() {
  const [arrived, setArrived] = useState(false)
  const [appState, setAppState] = useState<AppState>('explore')
  const [selectedLeaf, setSelectedLeaf] = useState<LeafData | null>(null)
  const [highlightedBranch, setHighlightedBranch] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'constellation'>('tree')

  // Data layer — falls back to dummy data when Supabase is not configured
  const { branches } = useBranches()
  const { logs } = useNightlyLogs()
  const suggestions = useSeedSuggestions()
  const arrivalQuote = useRandomOwnWritingLeaf(branches)
  const treeDays = useTreeAge(branches)

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

  const handleFeedSubmit = (content: string) => {
    // Phase 2: send to Gardener API
    console.log('Fed to tree:', content)
  }

  const handleToggleView = useCallback(() => {
    setViewMode((m) => (m === 'tree' ? 'constellation' : 'tree'))
  }, [])

  return (
    <main className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0a14' }}>

      {/* Arrival veil — shows a random piece of your own writing */}
      {!arrived && <ArrivalVeil quote={arrivalQuote} onComplete={() => setArrived(true)} />}

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Scene
          branches={branches}
          treeDays={treeDays}
          onLeafClick={handleLeafClick}
          highlightedBranch={highlightedBranch}
          viewMode={viewMode}
        />
      </div>

      {/* Deterministic ambient particles — no Math.random in render */}
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
        logs={logs}
        onClose={() => setAppState('explore')}
      />

      <SeedPanel
        isOpen={appState === 'seed'}
        suggestions={suggestions}
        onClose={() => setAppState('explore')}
      />

      {/* Navigation appears after arrival */}
      {arrived && (
        <Navigation
          state={appState}
          onChange={handleStateChange}
          viewMode={viewMode}
          onToggleView={handleToggleView}
        />
      )}
    </main>
  )
}
