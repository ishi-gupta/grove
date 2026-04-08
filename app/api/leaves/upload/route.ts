import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

// POST /api/leaves/upload — upload an image to Supabase Storage, create a leaf
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured. Running in demo mode.' },
      { status: 503 }
    )
  }

  const supabase = getSupabase()!

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const content = (formData.get('content') as string) || ''
  const branch_id = formData.get('branch_id') as string
  const user_id = (formData.get('user_id') as string) || 'demo-user'

  if (!file) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }

  if (!branch_id) {
    return NextResponse.json({ error: 'branch_id is required' }, { status: 400 })
  }

  // Upload to Supabase Storage
  const fileExt = file.name.split('.').pop() || 'png'
  const fileName = `${user_id}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('leaf-media')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('leaf-media')
    .getPublicUrl(fileName)

  const media_url = urlData.publicUrl

  // Create the leaf row
  const { data, error } = await supabase
    .from('leaves')
    .insert({
      user_id,
      branch_id,
      type: 'image' as const,
      content: content || file.name,
      date: new Date().toISOString().split('T')[0],
      person: null,
      sealed: false,
      sealed_until: null,
      is_own_writing: false,
      is_resurfaced: false,
      bucket_done: false,
      language: null,
      media_url,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating leaf:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ leaf: data, media_url }, { status: 201 })
}
