import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'

export async function GET() {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ user: null })
  }

  const { data: profile } = await adminClient
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      profile,
    },
  })
}
