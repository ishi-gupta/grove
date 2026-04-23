'use client'

import { useState, useMemo, useSyncExternalStore } from 'react'
import type { BranchData, LeafData, NightlyLogData } from './types'
import {
  branches as dummyBranches,
  seedSuggestions as dummySuggestions,
  nightlyLogs as dummyLogs,
} from '@/data/dummy'

// Supabase fetching is deferred to Phase 2 when credentials are wired.
// For now, all hooks return dummy data with the correct interface
// so the data layer is ready to swap in.

// ─── Branches + Leaves ──────────────────────────────────────────────

export function useBranches() {
  const [branches] = useState<BranchData[]>(dummyBranches)
  return { branches, loading: false }
}

// ─── All leaves (flattened) ─────────────────────────────────────────

export function useAllLeaves(branches: BranchData[]): LeafData[] {
  return useMemo(() => branches.flatMap((b) => b.leaves), [branches])
}

// ─── Own writing leaves (for ArrivalVeil) ───────────────────────────

// Stable date seed — computed once at module load, not during render
const todaySeed = (() => {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
})()

export function useRandomOwnWritingLeaf(branches: BranchData[]): LeafData | null {
  return useMemo(() => {
    const ownWriting = branches
      .flatMap((b) => b.leaves)
      .filter((l) => l.isOwnWriting && !l.sealed)

    if (ownWriting.length === 0) return null

    const index = todaySeed % ownWriting.length
    return ownWriting[index]
  }, [branches])
}

// ─── Nightly Logs ───────────────────────────────────────────────────

export function useNightlyLogs() {
  const [logs] = useState<NightlyLogData[]>(dummyLogs)
  return { logs, loading: false }
}

// ─── Seed Suggestions ───────────────────────────────────────────────

export function useSeedSuggestions() {
  return useMemo(() => dummySuggestions, [])
}

// ─── Tree Birthday (for quiet counter) ──────────────────────────────

// Module-level timestamp so it's not called during render
const moduleNow = Date.now()

// Subscribe to a stable external "now" value (module-level constant)
const subscribe = () => () => {}
const getSnapshot = () => moduleNow

export function useTreeAge(branches: BranchData[]): number {
  const now = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return useMemo(() => {
    const allDates = branches
      .flatMap((b) => b.leaves)
      .map((l) => new Date(l.date).getTime())
      .filter((t) => !isNaN(t))

    if (allDates.length === 0) return 0

    const earliest = Math.min(...allDates)
    return Math.floor((now - earliest) / (1000 * 60 * 60 * 24))
  }, [branches, now])
}
