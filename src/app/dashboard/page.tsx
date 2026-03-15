'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateHealthScore, saveScoreToHistory, getScoreGrade, type HealthScore } from '@/lib/health-score'
import { loadMastery, getAllDomainMastery, type DomainMastery } from '@/lib/mastery'
import { domains } from '@/lib/domains'
import { loadStreak } from '@/lib/daily-streak'
import { loadQuizResult, type QuizResult } from '@/lib/quiz-engine'
import { loadActionPlan, getActionPlanProgress } from '@/lib/action-plan'
import { AnimatedCounter } from '@/components/streak/animated-counter'
import { StreakFlame } from '@/components/streak/streak-flame'
import { getStreakStatus, getWarmthColor } from '@/lib/streak-status'

// ---------------------------------------------------------------------------
// StreakStatsRow -- extracted to keep DashboardPage under 50 lines
// ---------------------------------------------------------------------------

interface StreakStatsRowProps {
  readonly streak: { currentStreak: number; longestStreak: number; completedToday: boolean; totalDaysActive: number };
  readonly actionProgress: { completed: number; total: number; completionRate: number } | null;
}

function StreakStatsRow({ streak, actionProgress }: StreakStatsRowProps) {
  const status = getStreakStatus({
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    completedToday: streak.completedToday,
    totalDaysActive: streak.totalDaysActive,
    lastActiveDate: '',
    correctAnswers: 0,
    totalAnswers: 0,
  })
  const warmthColor = getWarmthColor(streak.currentStreak)

  const borderColor = streak.currentStreak > 0 ? `${warmthColor}50` : '#1E3A1E'
  const shadowColor = streak.currentStreak > 0 ? `${warmthColor}15` : 'transparent'

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Streak cell */}
      <div
        className="bg-[#111811] rounded-xl p-5 text-center transition-all duration-500"
        style={{
          border: `1px solid ${borderColor}`,
          boxShadow: `0 0 16px 0 ${shadowColor}`,
        }}
      >
        <div className="flex justify-center mb-1">
          <StreakFlame streak={streak.currentStreak} status={status} size="md" />
        </div>
        <p className="text-3xl font-bold" style={{ color: warmthColor }}>
          <AnimatedCounter value={streak.currentStreak} />
        </p>
        <p className="text-xs text-gray-500 mt-1">Day Streak</p>
        <AnimatePresence>
          {streak.completedToday && (
            <motion.span
              key="active-today"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${warmthColor}20`,
                color: warmthColor,
              }}
            >
              Active Today
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Total days cell */}
      <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-5 text-center">
        <p className="text-3xl font-bold text-[#16A34A]">
          <AnimatedCounter value={streak.totalDaysActive} />
        </p>
        <p className="text-xs text-gray-500 mt-1">Total Days</p>
      </div>

      {/* Action plan cell */}
      <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-5 text-center">
        <p className="text-3xl font-bold text-[#16A34A]">
          {actionProgress ? `${actionProgress.completed}/${actionProgress.total}` : '--'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Action Plan</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null)
  const [domainMastery, setDomainMastery] = useState<readonly DomainMastery[]>([])
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, completedToday: false, totalDaysActive: 0 })
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [actionProgress, setActionProgress] = useState<{ completed: number; total: number; completionRate: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // All data comes from localStorage -- no auth required
    const score = calculateHealthScore()
    saveScoreToHistory(score)
    setHealthScore(score)

    const mastery = loadMastery()
    setDomainMastery(getAllDomainMastery(mastery))

    const streakData = loadStreak()
    setStreak(streakData)

    const quiz = loadQuizResult()
    setQuizResult(quiz)

    const plan = loadActionPlan()
    if (plan) {
      setActionProgress(getActionPlanProgress(plan))
    }

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F0A] flex items-center justify-center">
        <div className="text-gray-500">Loading your financial profile...</div>
      </div>
    )
  }

  const grade = healthScore ? getScoreGrade(healthScore.total) : null
  const totalScore = healthScore?.total ?? 0

  // SVG ring math
  const ringRadius = 70
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference - (totalScore / 100) * ringCircumference

  return (
    <div className="min-h-screen bg-[#0A0F0A] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#16A34A]">Your Financial Profile</h1>
            <p className="text-sm text-gray-500">Track your progress across all domains</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-[#16A34A] transition-colors">
            Back
          </Link>
        </div>

        {/* Health Score Ring + Grade */}
        <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-8 mb-6">
          <div className="flex items-center gap-8">
            {/* Ring */}
            <div className="relative shrink-0">
              <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
                <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="#1E3A1E" strokeWidth="8" />
                <circle
                  cx="90" cy="90" r={ringRadius} fill="none"
                  stroke={grade?.color ?? '#16A34A'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black" style={{ color: grade?.color }}>{totalScore}</span>
                <span className="text-xs text-gray-500 font-medium">{grade?.label}</span>
              </div>
            </div>

            {/* Pillars */}
            <div className="flex-1 space-y-3">
              <h3 className="text-sm font-bold text-white mb-3">Five Pillars</h3>
              {healthScore?.pillars.map((pillar) => (
                <div key={pillar.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{pillar.label}</span>
                    <span className="text-xs font-bold" style={{ color: pillar.color }}>{pillar.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1E3A1E]">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${pillar.score}%`, background: pillar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top suggestions */}
          {healthScore && healthScore.pillars.some(p => p.suggestions.length > 0) && (
            <div className="mt-6 pt-4 border-t border-[#1E3A1E]">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Next Steps</h4>
              <div className="space-y-1.5">
                {healthScore.pillars
                  .flatMap(p => p.suggestions.map(s => ({ suggestion: s, color: p.color })))
                  .slice(0, 3)
                  .map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                      <span className="text-xs text-gray-400">{item.suggestion}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Streak + Stats Row */}
        <StreakStatsRow streak={streak} actionProgress={actionProgress} />

        {/* Domain Mastery */}
        <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Domain Mastery</h2>
          <div className="space-y-3">
            {domainMastery.map((dm) => {
              const domain = domains.find(d => d.id === dm.domainId)
              if (!domain) return null
              return (
                <Link
                  key={dm.domainId}
                  href={`/explore/${domain.slug}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 group-hover:text-[#16A34A] transition-colors">
                      {domain.shortName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">
                        {dm.visitedConcepts}/{dm.totalConcepts}
                      </span>
                      <span className="text-xs font-bold" style={{ color: domain.color }}>
                        {dm.masteryPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#1E3A1E]">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${dm.masteryPercent}%`, background: domain.color }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Money Script Result */}
        <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Money Scripts</h2>
          {quizResult ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-300">Dominant:</span>
                <span className="text-sm font-bold text-[#16A34A] capitalize">{quizResult.dominant}</span>
              </div>
              {quizResult.secondary && (
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-300">Secondary:</span>
                  <span className="text-sm font-bold text-[#8B5CF6] capitalize">{quizResult.secondary}</span>
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {quizResult.scores.map((s) => (
                  <div key={s.scriptId} className="text-center">
                    <div className="text-lg font-bold text-white">{Math.round(s.normalized)}</div>
                    <div className="text-[10px] text-gray-500 capitalize">{s.scriptId}</div>
                  </div>
                ))}
              </div>
              <Link href="/quiz" className="text-sm text-[#16A34A] hover:underline mt-3 inline-block">
                Retake quiz
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Discover your financial blind spots with the Money Script Quiz.
              </p>
              <Link
                href="/quiz"
                className="inline-flex px-4 py-2 bg-[#16A34A] text-black text-sm font-semibold rounded-lg hover:bg-[#22C55E] transition-colors"
              >
                Take the Quiz
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-[#111811] border border-[#1E3A1E] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/explore', label: 'Explore Domains', desc: '14 financial domains' },
              { href: '/calculators', label: 'Calculators', desc: 'Run your numbers' },
              { href: '/ask', label: 'AI Coach', desc: 'Ask anything' },
              { href: '/simulator', label: 'Simulators', desc: '6 scenario tools' },
              { href: '/defenses', label: 'Fraud Defenses', desc: '10 protection strategies' },
              { href: '/loop', label: 'Operating Loop', desc: 'Your financial system' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 bg-[#0A0F0A] border border-[#1E3A1E] rounded-lg hover:border-[#16A34A] transition-colors"
              >
                <p className="font-medium text-sm">{link.label}</p>
                <p className="text-[10px] text-gray-500">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
