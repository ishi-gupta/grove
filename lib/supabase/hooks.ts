'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from './client'
import { useAuth } from '@/components/AuthProvider'
import { branches as dummyBranches, nightlyLogs as dummyNightlyLogs, seedSuggestions as dummySuggestions } from '@/data/dummy'
import type { BranchData, LeafData, SuggestionData } from '@/data/dummy'
import type { DbBranch, DbLeaf, DbNightlyLog, DbSeedSuggestion } from './types'

// ---------------------------------------------------------------------------
// Converts database rows into the frontend data shapes used by components.
// Falls back to dummy data when Supabase is not configured or the user has
// no data yet (fresh account).
// ---------------------------------------------------------------------------

function dbBranchToFrontend(branch: DbBranch, leaves: DbLeaf[]): BranchData {
  return {
    id: branch.id,
    name: branch.name,
    color: branch.color,
    attachment: branch.attachment,
    direction: [branch.direction_x, branch.direction_y, branch.direction_z],
    leaves: leaves.map(dbLeafToFrontend),
  }
}

function dbLeafToFrontend(leaf: DbLeaf): LeafData {
  return {
    id: leaf.id,
    type: leaf.type,
    content: leaf.content,
    date: leaf.date,
    branch: leaf.branch_id ?? '',
    person: leaf.person ?? undefined,
    sealed: leaf.sealed || undefined,
    sealedUntil: leaf.sealed_until ?? undefined,
    isOwnWriting: leaf.is_own_writing || undefined,
    isResurfaced: leaf.is_resurfaced || undefined,
    bucketDone: leaf.bucket_done || undefined,
    language: leaf.language ?? undefined,
  }
}

function dbSuggestionToFrontend(s: DbSeedSuggestion): SuggestionData {
  return {
    id: s.id,
    title: s.title,
    why: s.why,
    complexity: s.complexity,
    claudePrompt: s.claude_prompt,
    status: s.status,
  }
}

// ---------------------------------------------------------------------------
// useBranches — returns the tree structure (branches + leaves)
// ---------------------------------------------------------------------------

export function useBranches() {
  const { user } = useAuth()
  const [branches, setBranches] = useState<BranchData[]>(dummyBranches)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBranches = useCallback(async () => {
    const supabase = createClient()
    if (!supabase || !user) {
      setBranches(dummyBranches)
      setLoading(false)
      return
    }

    try {
      // Fetch branches
      const { data: branchRows, error: branchError } = await supabase
        .from('branches')
        .select('*')
        .order('created_at', { ascending: true })

      if (branchError) throw branchError

      // If user has no branches yet, fall back to dummy data
      if (!branchRows || branchRows.length === 0) {
        setBranches(dummyBranches)
        setLoading(false)
        return
      }

      // Fetch all leaves for this user
      const { data: leafRows, error: leafError } = await supabase
        .from('leaves')
        .select('*')
        .order('date', { ascending: false })

      if (leafError) throw leafError

      // Group leaves by branch
      const leafMap = new Map<string, DbLeaf[]>()
      for (const leaf of (leafRows ?? [])) {
        const key = leaf.branch_id ?? '__unassigned__'
        if (!leafMap.has(key)) leafMap.set(key, [])
        leafMap.get(key)!.push(leaf)
      }

      // Build frontend branch data
      const result = (branchRows as DbBranch[]).map((b) =>
        dbBranchToFrontend(b, leafMap.get(b.id) ?? [])
      )

      setBranches(result)
    } catch (err) {
      console.error('Error fetching branches:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setBranches(dummyBranches)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  return { branches, loading, error, refetch: fetchBranches }
}

// ---------------------------------------------------------------------------
// useNightlyLogs — returns recent nightly log entries
// ---------------------------------------------------------------------------

export function useNightlyLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState(dummyNightlyLogs)
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    const supabase = createClient()
    if (!supabase || !user) {
      setLogs(dummyNightlyLogs)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('nightly_logs')
        .select('*')
        .order('date', { ascending: false })
        .limit(7)

      if (error) throw error

      if (!data || data.length === 0) {
        setLogs(dummyNightlyLogs)
        setLoading(false)
        return
      }

      setLogs((data as DbNightlyLog[]).map((l) => ({
        date: l.date,
        entry: l.entry,
        positive: l.positive,
      })))
    } catch (err) {
      console.error('Error fetching nightly logs:', err)
      setLogs(dummyNightlyLogs)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const addLog = useCallback(async (entry: string, positive: boolean) => {
    const supabase = createClient()
    if (!supabase || !user) return

    const { error } = await supabase
      .from('nightly_logs')
      .upsert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        entry,
        positive,
      }, { onConflict: 'user_id,date' })

    if (error) {
      console.error('Error adding nightly log:', error)
      return
    }

    fetchLogs()
  }, [user, fetchLogs])

  return { logs, loading, addLog, refetch: fetchLogs }
}

// ---------------------------------------------------------------------------
// useSeedSuggestions — returns gardener suggestions
// ---------------------------------------------------------------------------

export function useSeedSuggestions() {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState<SuggestionData[]>(dummySuggestions)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      if (!supabase || !user) {
        setSuggestions(dummySuggestions)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('seed_suggestions')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (!data || data.length === 0) {
          setSuggestions(dummySuggestions)
          setLoading(false)
          return
        }

        setSuggestions((data as DbSeedSuggestion[]).map(dbSuggestionToFrontend))
      } catch (err) {
        console.error('Error fetching seed suggestions:', err)
        setSuggestions(dummySuggestions)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user])

  return { suggestions, loading }
}

// ---------------------------------------------------------------------------
// useAddLeaf — adds a new leaf to the tree
// ---------------------------------------------------------------------------

export function useAddLeaf() {
  const { user } = useAuth()

  return useCallback(async (content: string, type: LeafData['type'] = 'text') => {
    const supabase = createClient()
    if (!supabase || !user) {
      console.log('Fed to tree (offline):', content)
      return null
    }

    const { data, error } = await supabase
      .from('leaves')
      .insert({
        user_id: user.id,
        type,
        content,
        date: new Date().toISOString().split('T')[0],
        is_own_writing: type === 'own_writing' || type === 'text',
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding leaf:', error)
      return null
    }

    return data
  }, [user])
}
