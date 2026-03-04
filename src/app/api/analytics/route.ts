import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const eventSchema = z.object({
  event_type: z.string().min(1).max(100),
  content_type: z.enum(['concept', 'strategy', 'defense', 'script', 'loop_step', 'calculator', 'lesson']).optional(),
  content_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

const batchSchema = z.object({
  events: z.array(eventSchema).min(1).max(50),
})

export async function POST(request: Request) {
  const user = await getUser()
  const body = await request.json()

  const isBatch = 'events' in body
  const parsed = isBatch
    ? batchSchema.safeParse(body)
    : z.object({ event: eventSchema }).safeParse({ event: body })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid event data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const events = isBatch
    ? (parsed.data as z.infer<typeof batchSchema>).events
    : [(parsed.data as { event: z.infer<typeof eventSchema> }).event]

  const rows = events.map((event) => ({
    user_id: user?.id ?? null,
    event_type: event.event_type,
    content_type: event.content_type ?? null,
    content_id: event.content_id ?? null,
    metadata: event.metadata ?? {},
  }))

  const { error } = await adminClient.from('analytics_events').insert(rows)

  if (error) {
    return NextResponse.json({ error: 'Failed to record events' }, { status: 500 })
  }

  return NextResponse.json({ recorded: rows.length })
}
