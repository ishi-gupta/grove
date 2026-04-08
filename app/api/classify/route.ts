import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

// POST /api/classify — classify content into a branch using AI
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { content } = body

  if (!content) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }

  // Fetch available branches
  let branchNames: string[] = []
  let branchMap: Record<string, string> = {}

  if (isSupabaseConfigured()) {
    const supabase = getSupabase()!
    const { data: branches } = await supabase
      .from('branches')
      .select('id, name')

    if (branches && branches.length > 0) {
      branchNames = branches.map((b) => b.name)
      branchMap = Object.fromEntries(branches.map((b) => [b.name.toLowerCase(), b.id]))
    }
  }

  // Fallback to default branches if none found in DB
  if (branchNames.length === 0) {
    branchNames = [
      'Love', 'Memory', 'Becoming', 'Beauty', 'Icons',
      'Body', 'Alive', 'Words', 'Horizon', 'People',
    ]
    branchMap = Object.fromEntries(branchNames.map((n) => [n.toLowerCase(), n.toLowerCase()]))
  }

  // Try AI classification (Anthropic Claude or OpenAI)
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const systemPrompt = `You are the Gardener — the AI soul of a personal memory tree called Grove.
You classify content into branches. The branches are: ${branchNames.join(', ')}.

Rules:
- Return ONLY the branch name, nothing else.
- If the content is ambiguous, pick the most emotionally resonant branch.
- If the content doesn't fit any branch, return "Words" as the default.`

  const userPrompt = `Classify this into one branch:\n\n"${content}"`

  try {
    let branchName = 'Words' // fallback

    if (anthropicKey) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 20,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const text = data.content?.[0]?.text?.trim() ?? ''
        if (text) branchName = text
      }
    } else if (openaiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 20,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content?.trim() ?? ''
        if (text) branchName = text
      }
    }

    // Normalize and find the branch ID
    const normalizedName = branchName.toLowerCase().trim()
    const branchId = branchMap[normalizedName] ?? branchMap['words'] ?? 'words'

    return NextResponse.json({ branch_id: branchId, branch_name: branchName })
  } catch (err) {
    console.error('Classification error:', err)
    // Fallback: assign to "Words"
    const fallbackId = branchMap['words'] ?? 'words'
    return NextResponse.json({ branch_id: fallbackId, branch_name: 'Words' })
  }
}
