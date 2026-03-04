'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/auth/client'
import Link from 'next/link'

interface UserState {
  reading_progress: Array<{ content_type: string; content_id: string; completed: boolean }>
  bookmarks: Array<{ content_type: string; content_id: string }>
  streak: { current_streak: number; longest_streak: number } | null
  quiz_results: Array<{ quiz_type: string; results: Record<string, unknown>; created_at: string }>
  loop_progress: { completed_steps: number[] } | null
  saved_calculations: Array<{ calculator_id: string; label: string; created_at: string }>
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [state, setState] = useState<UserState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createSupabaseBrowser()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      try {
        const res = await fetch('/api/sync')
        if (res.ok) {
          const data = await res.json()
          setState(data as unknown as UserState)
        }
      } catch {
        // Offline
      }
      setLoading(false)
    }
    init()
  }, [])

  const completedCount = state?.reading_progress?.filter((p) => p.completed).length ?? 0
  const bookmarkCount = state?.bookmarks?.length ?? 0
  const currentStreak = state?.streak?.current_streak ?? 0
  const longestStreak = state?.streak?.longest_streak ?? 0
  const loopSteps = state?.loop_progress?.completed_steps?.length ?? 0
  const savedCalcs = state?.saved_calculations?.length ?? 0
  const latestQuiz = state?.quiz_results?.[0]

  return (
    <div className="min-h-screen bg-[#0A0F0A] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#16A34A]">Your Dashboard</h1>
            <p className="text-sm text-gray-400">{user?.email ?? 'Loading...'}</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-[#16A34A] transition-colors">
            Back to Uncommon Cents
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading your data...</div>
        ) : (
          <>
            {/* Streak */}
            <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#16A34A] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentStreak} day streak</p>
                  <p className="text-xs text-gray-500">Longest: {longestStreak} days</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-5">
                <p className="text-3xl font-bold text-[#16A34A]">{completedCount}</p>
                <p className="text-sm text-gray-400">Items read</p>
              </div>
              <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-5">
                <p className="text-3xl font-bold text-[#16A34A]">{bookmarkCount}</p>
                <p className="text-sm text-gray-400">Bookmarked</p>
              </div>
              <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-5">
                <p className="text-3xl font-bold text-[#16A34A]">{loopSteps}/6</p>
                <p className="text-sm text-gray-400">Loop steps done</p>
              </div>
              <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-5">
                <p className="text-3xl font-bold text-[#16A34A]">{savedCalcs}</p>
                <p className="text-sm text-gray-400">Saved calculations</p>
              </div>
            </div>

            {/* Money Script Result */}
            {latestQuiz && typeof latestQuiz.results === 'object' && (
              <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold mb-2">Your Money Script</h2>
                <p className="text-sm text-gray-400">
                  Last taken: {new Date(latestQuiz.created_at).toLocaleDateString()}
                </p>
                <Link href="/quiz" className="text-sm text-[#16A34A] hover:underline mt-2 inline-block">
                  Retake quiz
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
              <div className="space-y-3">
                <Link href="/concepts" className="block px-4 py-3 bg-[#0A0F0A] border border-[#1E3A1E] rounded-lg hover:border-[#16A34A] transition-colors">
                  <p className="font-medium">Concepts</p>
                  <p className="text-xs text-gray-500">Financial literacy fundamentals</p>
                </Link>
                <Link href="/explore" className="block px-4 py-3 bg-[#0A0F0A] border border-[#1E3A1E] rounded-lg hover:border-[#16A34A] transition-colors">
                  <p className="font-medium">Expansion Strategies</p>
                  <p className="text-xs text-gray-500">12 ultra-uncommon wealth moves</p>
                </Link>
                <Link href="/defenses" className="block px-4 py-3 bg-[#0A0F0A] border border-[#1E3A1E] rounded-lg hover:border-[#16A34A] transition-colors">
                  <p className="font-medium">Fraud Defenses</p>
                  <p className="text-xs text-gray-500">10 AI-era protection strategies</p>
                </Link>
                <Link href="/loop" className="block px-4 py-3 bg-[#0A0F0A] border border-[#1E3A1E] rounded-lg hover:border-[#16A34A] transition-colors">
                  <p className="font-medium">Operating Loop</p>
                  <p className="text-xs text-gray-500">Your repeatable financial system</p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
