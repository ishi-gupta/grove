import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

// POST /api/leaves — create a new leaf
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured. Running in demo mode.' },
      { status: 503 }
    )
  }

  const supabase = getSupabase()!
  const body = await req.json()

  const {
    content,
    type = 'text',
    branch_id,
    media_url = null,
    person = null,
    language = null,
    is_own_writing = false,
    sealed = false,
    sealed_until = null,
    bucket_done = false,
  } = body

  if (!content || !branch_id) {
    return NextResponse.json(
      { error: 'content and branch_id are required' },
      { status: 400 }
    )
  }

  // TODO: When auth merges, replace with real user_id from session
  const user_id = body.user_id ?? 'demo-user'

  const { data, error } = await supabase
    .from('leaves')
    .insert({
      user_id,
      branch_id,
      type,
      content,
      date: new Date().toISOString().split('T')[0],
      person,
      sealed,
      sealed_until,
      is_own_writing,
      is_resurfaced: false,
      bucket_done,
      language,
      media_url,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating leaf:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ leaf: data }, { status: 201 })
}

// GET /api/leaves?own_writing=true&random=true — fetch leaves with filters
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured. Running in demo mode.' },
      { status: 503 }
    )
  }

  const supabase = getSupabase()!
  const { searchParams } = new URL(req.url)
  const ownWriting = searchParams.get('own_writing') === 'true'
  const random = searchParams.get('random') === 'true'

  let query = supabase.from('leaves').select('*, branches(name)')

  if (ownWriting) {
    query = query.eq('is_own_writing', true).eq('sealed', false)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leaves:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (random && data && data.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.length)
    return NextResponse.json({ leaf: data[randomIndex] })
  }

  return NextResponse.json({ leaves: data })
}
