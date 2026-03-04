import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const contentTypeEnum = z.enum(['concept', 'strategy', 'defense', 'script', 'loop_step', 'calculator', 'lesson'])

const syncPushSchema = z.object({
  reading_progress: z.array(z.object({
    content_type: contentTypeEnum,
    content_id: z.string(),
    completed: z.boolean(),
    progress_pct: z.number().min(0).max(100).optional(),
  })).optional(),
  bookmarks: z.array(z.object({
    content_type: contentTypeEnum,
    content_id: z.string(),
  })).optional(),
  quiz_results: z.array(z.object({
    quiz_type: z.string(),
    answers: z.record(z.string(), z.unknown()),
    results: z.record(z.string(), z.unknown()),
  })).optional(),
  loop_progress: z.object({
    completed_steps: z.array(z.number()),
    notes: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  streak_date: z.string().optional(),
})

// GET: Pull all user state
export async function GET() {
  const user = await requireUser()

  const [progressRes, bookmarksRes, streakRes, quizRes, loopRes, calcsRes] = await Promise.all([
    adminClient.from('reading_progress').select('*').eq('user_id', user.id),
    adminClient.from('bookmarks').select('*').eq('user_id', user.id),
    adminClient.from('daily_streaks').select('*').eq('user_id', user.id).single(),
    adminClient.from('quiz_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    adminClient.from('loop_progress').select('*').eq('user_id', user.id).single(),
    adminClient.from('saved_calculations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return NextResponse.json({
    reading_progress: progressRes.data ?? [],
    bookmarks: bookmarksRes.data ?? [],
    streak: streakRes.data ?? null,
    quiz_results: quizRes.data ?? [],
    loop_progress: loopRes.data ?? null,
    saved_calculations: calcsRes.data ?? [],
  })
}

// POST: Push local state
export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = syncPushSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid sync data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const results: Record<string, number> = {}

  if (parsed.data.reading_progress?.length) {
    const rows = parsed.data.reading_progress.map((p) => ({
      user_id: user.id,
      content_type: p.content_type,
      content_id: p.content_id,
      completed: p.completed,
      progress_pct: p.progress_pct ?? (p.completed ? 100 : 0),
    }))

    await adminClient
      .from('reading_progress')
      .upsert(rows, { onConflict: 'user_id,content_type,content_id' })

    results.reading_progress = rows.length
  }

  if (parsed.data.bookmarks?.length) {
    const rows = parsed.data.bookmarks.map((b) => ({
      user_id: user.id,
      content_type: b.content_type,
      content_id: b.content_id,
    }))

    await adminClient
      .from('bookmarks')
      .upsert(rows, { onConflict: 'user_id,content_type,content_id' })

    results.bookmarks = rows.length
  }

  if (parsed.data.quiz_results?.length) {
    const rows = parsed.data.quiz_results.map((q) => ({
      user_id: user.id,
      quiz_type: q.quiz_type,
      answers: q.answers,
      results: q.results,
    }))

    await adminClient.from('quiz_results').insert(rows)
    results.quiz_results = rows.length
  }

  if (parsed.data.loop_progress) {
    await adminClient
      .from('loop_progress')
      .upsert({
        user_id: user.id,
        completed_steps: parsed.data.loop_progress.completed_steps,
        notes: parsed.data.loop_progress.notes ?? {},
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    results.loop_progress = 1
  }

  if (parsed.data.streak_date) {
    const today = parsed.data.streak_date
    const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().split('T')[0]

    const { data: existing } = await adminClient
      .from('daily_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existing) {
      const isConsecutive = existing.last_active_date === yesterday
      const newStreak = isConsecutive ? existing.current_streak + 1 : 1
      const newLongest = Math.max(existing.longest_streak, newStreak)

      await adminClient
        .from('daily_streaks')
        .update({ current_streak: newStreak, longest_streak: newLongest, last_active_date: today })
        .eq('user_id', user.id)
    } else {
      await adminClient
        .from('daily_streaks')
        .insert({ user_id: user.id, current_streak: 1, longest_streak: 1, last_active_date: today })
    }
    results.streak = 1
  }

  return NextResponse.json({ synced: results })
}
