import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const saveCalcSchema = z.object({
  calculator_id: z.string().min(1),
  inputs: z.record(z.string(), z.unknown()),
  results: z.record(z.string(), z.unknown()),
  label: z.string().max(100).optional(),
})

// GET: List saved calculations
export async function GET() {
  const user = await requireUser()

  const { data, error } = await adminClient
    .from('saved_calculations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 })
  }

  return NextResponse.json({ calculations: data })
}

// POST: Save a calculation
export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = saveCalcSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { data, error } = await adminClient
    .from('saved_calculations')
    .insert({
      user_id: user.id,
      calculator_id: parsed.data.calculator_id,
      inputs: parsed.data.inputs,
      results: parsed.data.results,
      label: parsed.data.label,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 })
  }

  return NextResponse.json({ calculation: data }, { status: 201 })
}
