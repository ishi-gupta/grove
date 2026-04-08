'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
      style={{ background: '#0a0a14' }}
    >
      {/* Ambient particles — same as main app for visual continuity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => {
          const s = i * 137.508
          return (
            <div
              key={i}
              className="absolute w-px h-px rounded-full animate-pulse"
              style={{
                left: `${(s * 7.3) % 100}%`,
                top: `${(s * 13.7) % 100}%`,
                background: 'rgba(200, 180, 140, 1)',
                opacity: 0.04 + (i % 5) * 0.015,
                animationDelay: `${(s * 0.3) % 6}s`,
                animationDuration: `${3 + (s % 4)}s`,
              }}
            />
          )
        })}
      </div>

      {/* Login card */}
      <div className="relative z-10 flex flex-col items-center gap-10 max-w-sm px-8">
        {/* Title */}
        <div className="text-center">
          <h1
            className="text-4xl tracking-wide mb-3"
            style={{ fontFamily: 'var(--font-serif)', color: 'rgba(232, 213, 183, 0.9)' }}
          >
            Grove
          </h1>
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: 'rgba(200, 180, 140, 0.4)', letterSpacing: '0.2em' }}
          >
            a time capsule for yourself
          </p>
        </div>

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleLogin}
          className="group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 cursor-pointer"
          style={{
            background: 'rgba(200, 180, 140, 0.08)',
            border: '1px solid rgba(200, 180, 140, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(200, 180, 140, 0.14)'
            e.currentTarget.style.borderColor = 'rgba(200, 180, 140, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(200, 180, 140, 0.08)'
            e.currentTarget.style.borderColor = 'rgba(200, 180, 140, 0.15)'
          }}
        >
          {/* Google icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span
            className="text-sm"
            style={{ color: 'rgba(232, 213, 183, 0.8)', fontFamily: 'var(--font-sans)' }}
          >
            Continue with Google
          </span>
        </button>

        {/* Quiet footer */}
        <p
          className="text-xs text-center leading-relaxed"
          style={{ color: 'rgba(200, 180, 140, 0.25)' }}
        >
          Your tree grows from what you feed it.
          <br />
          Everything stays yours.
        </p>
      </div>
    </main>
  )
}
