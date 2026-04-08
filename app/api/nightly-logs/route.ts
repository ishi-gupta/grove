import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

// POST /api/nightly-logs — save a nightly log entry
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured. Running in demo mode.' },
      { status: 503 }
    )
  }

  const supabase = getSupabase()!
  const body = await req.json()

  const { entry } = body
  if (!entry) {
    return NextResponse.json({ error: 'entry is required' }, { status: 400 })
  }

  // TODO: When auth merges, replace with real user_id from session
  const user_id = body.user_id ?? 'demo-user'
  const today = new Date().toISOString().split('T')[0]

  // Upsert — one log per day
  const { data, error } = await supabase
    .from('nightly_logs')
    .upsert(
      {
        user_id,
        date: today,
        entry,
        positive: true, // default; can be refined later by the Gardener
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error saving nightly log:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ log: data }, { status: 201 })
}

// GET /api/nightly-logs?days=7 — fetch recent nightly logs
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured. Running in demo mode.' },
      { status: 503 }
    )
  }

  const supabase = getSupabase()!
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '7', 10)

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('nightly_logs')
    .select('*')
    .gte('date', sinceStr)
    .order('date', { ascending: false })
    .limit(days)

  if (error) {
    console.error('Error fetching nightly logs:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ logs: data })
}
