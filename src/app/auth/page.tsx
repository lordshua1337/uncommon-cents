'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/auth/client'
import { Coins } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createSupabaseBrowser()

  function handleDemoLogin() {
    document.cookie = 'demo-auth=true; path=/; max-age=86400'
    router.push('/dashboard')
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the login link.')
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5EDE0' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#1E3F2E' }}
          >
            <Coins className="w-8 h-8" style={{ color: '#F5EDE0' }} />
          </div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: '#1A1A1A' }}>Uncommon Cents</h1>
          <p className="text-sm mt-1" style={{ color: '#555555' }}>Sign in to save progress, quiz results, and calculations</p>
        </div>

        <div className="uc-card p-6" style={{ border: '1px solid rgba(44,95,124,0.15)' }}>
          <button onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white font-medium rounded-lg hover:bg-gray-50 transition-colors mb-4 text-sm"
            style={{ color: '#1A1A1A', border: '1px solid rgba(44,95,124,0.15)' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(44,95,124,0.15)' }} />
            <span className="text-xs" style={{ color: '#555555' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(44,95,124,0.15)' }} />
          </div>

          <form onSubmit={handleMagicLink}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm mb-3"
              style={{
                background: '#F5EDE0',
                border: '1px solid rgba(44,95,124,0.2)',
                color: '#1A1A1A',
              }} />
            <button type="submit" disabled={loading || !email}
              className="uc-button uc-button-primary w-full py-2.5 text-sm font-semibold disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          {message && (
            <p className="mt-3 text-xs text-center" style={{
              color: message.includes('Check') ? '#2C5F7C' : '#DC2626'
            }}>
              {message}
            </p>
          )}
        </div>

        <button onClick={handleDemoLogin}
          className="w-full mt-4 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
          style={{
            border: '1px solid rgba(44,95,124,0.2)',
            color: '#555555',
          }}>
          Demo Login (test@test.com)
        </button>
      </div>
    </div>
  )
}
