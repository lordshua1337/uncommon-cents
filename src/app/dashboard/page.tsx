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

  const borderColor = streak.currentStreak > 0 ? `${warmthColor}50` : 'rgba(44,95,124,0.2)'
  const shadowColor = streak.currentStreak > 0 ? `${warmthColor}15` : 'transparent'

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Streak cell */}
      <div
        className="rounded-xl p-5 text-center transition-all duration-500"
        style={{
          backgroundColor: '#1E3F2E',
          border: `1px solid ${borderColor}`,
          boxShadow: `0 0 16px 0 ${shadowColor}`,
          borderRadius: '16px 4px 16px 4px',
        }}
      >
        <div className="flex justify-center mb-1">
          <StreakFlame streak={streak.currentStreak} status={status} size="md" />
        </div>
        <p className="text-3xl font-bold" style={{ color: warmthColor }}>
          <AnimatedCounter value={streak.currentStreak} />
        </p>
        <p className="text-xs mt-1" style={{ color: '#F5EDE0', opacity: 0.6 }}>Day Streak</p>
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
      <div
        className="rounded-xl p-5 text-center"
        style={{
          backgroundColor: '#1E3F2E',
          border: 'none',
          borderRadius: '16px 4px 16px 4px',
          boxShadow: '0 2px 12px rgba(44,95,124,0.12)',
        }}
      >
        <p className="text-3xl font-bold" style={{ color: '#C4A67A' }}>
          <AnimatedCounter value={streak.totalDaysActive} />
        </p>
        <p className="text-xs mt-1" style={{ color: '#F5EDE0', opacity: 0.6 }}>Total Days</p>
      </div>

      {/* Action plan cell */}
      <div
        className="rounded-xl p-5 text-center"
        style={{
          backgroundColor: '#1E3F2E',
          border: 'none',
          borderRadius: '16px 4px 16px 4px',
          boxShadow: '0 2px 12px rgba(44,95,124,0.12)',
        }}
      >
        <p className="text-3xl font-bold" style={{ color: '#C4A67A' }}>
          {actionProgress ? `${actionProgress.completed}/${actionProgress.total}` : '--'}
        </p>
        <p className="text-xs mt-1" style={{ color: '#F5EDE0', opacity: 0.6 }}>Action Plan</p>
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EDE0' }}>
        <div style={{ color: '#555555' }}>Loading your financial profile...</div>
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
    <div className="min-h-screen" style={{ backgroundColor: '#F5EDE0', color: '#1A1A1A' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading" style={{ color: '#2C5F7C' }}>Your Financial Profile</h1>
            <p className="text-sm" style={{ color: '#555555' }}>Track your progress across all domains</p>
          </div>
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: '#555555' }}
          >
            Back
          </Link>
        </div>

        {/* Health Score Ring + Grade */}
        <div
          className="rounded-xl p-8 mb-6"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(196,166,122,0.3)',
            boxShadow: '0 4px 24px rgba(44,95,124,0.1)',
            borderRadius: '14px',
          }}
        >
          <div className="flex items-center gap-8">
            {/* Ring */}
            <div className="relative shrink-0">
              <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
                <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="rgba(44,95,124,0.12)" strokeWidth="8" />
                <circle
                  cx="90" cy="90" r={ringRadius} fill="none"
                  stroke={grade?.color ?? '#2C5F7C'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black" style={{ color: grade?.color }}>{totalScore}</span>
                <span className="text-xs font-medium" style={{ color: '#555555' }}>{grade?.label}</span>
              </div>
            </div>

            {/* Pillars */}
            <div className="flex-1 space-y-3">
              <h3 className="text-sm font-bold mb-3" style={{ color: '#1A1A1A' }}>Five Pillars</h3>
              {healthScore?.pillars.map((pillar) => (
                <div key={pillar.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#555555' }}>{pillar.label}</span>
                    <span className="text-xs font-bold" style={{ color: pillar.color }}>{pillar.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(44,95,124,0.1)' }}>
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
            <div
              className="mt-6 pt-4"
              style={{ borderTop: '1px solid rgba(196,166,122,0.3)' }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#555555' }}>Next Steps</h4>
              <div className="space-y-1.5">
                {healthScore.pillars
                  .flatMap(p => p.suggestions.map(s => ({ suggestion: s, color: p.color })))
                  .slice(0, 3)
                  .map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                      <span className="text-xs" style={{ color: '#555555' }}>{item.suggestion}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Streak + Stats Row */}
        <StreakStatsRow streak={streak} actionProgress={actionProgress} />

        {/* Domain Mastery */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(196,166,122,0.3)',
            boxShadow: '0 2px 16px rgba(44,95,124,0.08)',
            borderRadius: '14px',
          }}
        >
          <h2 className="text-lg font-semibold mb-4 font-heading" style={{ color: '#1A1A1A' }}>Domain Mastery</h2>
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
                    <span
                      className="text-sm transition-colors"
                      style={{ color: '#555555' }}
                    >
                      {domain.shortName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]" style={{ color: '#555555' }}>
                        {dm.visitedConcepts}/{dm.totalConcepts}
                      </span>
                      <span className="text-xs font-bold" style={{ color: domain.color }}>
                        {dm.masteryPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(44,95,124,0.1)' }}>
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
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(196,166,122,0.3)',
            boxShadow: '0 2px 16px rgba(44,95,124,0.08)',
            borderRadius: '14px',
          }}
        >
          <h2 className="text-lg font-semibold mb-3 font-heading" style={{ color: '#1A1A1A' }}>Money Scripts</h2>
          {quizResult ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm" style={{ color: '#555555' }}>Dominant:</span>
                <span className="text-sm font-bold capitalize" style={{ color: '#2C5F7C' }}>{quizResult.dominant}</span>
              </div>
              {quizResult.secondary && (
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm" style={{ color: '#555555' }}>Secondary:</span>
                  <span className="text-sm font-bold capitalize" style={{ color: '#C4A67A' }}>{quizResult.secondary}</span>
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {quizResult.scores.map((s) => (
                  <div key={s.scriptId} className="text-center">
                    <div className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{Math.round(s.normalized)}</div>
                    <div className="text-[10px] capitalize" style={{ color: '#555555' }}>{s.scriptId}</div>
                  </div>
                ))}
              </div>
              <Link href="/quiz" className="text-sm hover:underline mt-3 inline-block" style={{ color: '#2C5F7C' }}>
                Retake quiz
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm mb-3" style={{ color: '#555555' }}>
                Discover your financial blind spots with the Money Script Quiz.
              </p>
              <Link
                href="/quiz"
                className="inline-flex px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: '#E05A1B', color: '#FFFFFF' }}
              >
                Take the Quiz
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(196,166,122,0.3)',
            boxShadow: '0 2px 16px rgba(44,95,124,0.08)',
            borderRadius: '14px',
          }}
        >
          <h2 className="text-lg font-semibold mb-4 font-heading" style={{ color: '#1A1A1A' }}>Continue Learning</h2>
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
                className="block px-4 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: '#F5EDE0',
                  border: '1px solid rgba(196,166,122,0.3)',
                }}
              >
                <p className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{link.label}</p>
                <p className="text-[10px]" style={{ color: '#555555' }}>{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
