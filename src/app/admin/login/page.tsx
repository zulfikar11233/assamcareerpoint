'use client'
export const dynamic = 'force-dynamic'
// src/app/admin/login/page.tsx

import { signIn } from 'next-auth/react'
import { useState } from 'react'

const G = '#c9a227', N = '#0b1f33'

export default function AdminLogin() {
  const [form,    setForm]    = useState({ username: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    // Get client IP for rate limiting
    let clientIp = 'unknown'
    try {
      const res  = await fetch('https://api.ipify.org?format=json')
      const data = await res.json()
      clientIp = data.ip || 'unknown'
    } catch {
      // If ipify is unreachable, just use 'unknown'
      clientIp = 'unknown'
    }

    const result = await signIn('credentials', {
      username:  form.username.trim(),
      password:  form.password,
      clientIp,
      redirect:  false,
    })

    if (result?.error === 'RATE_LIMIT') {
      setError('Too many failed attempts. Please wait 15 minutes before trying again.')
    } else if (result?.error) {
      setError('Invalid username or password. Please try again.')
    } else if (result?.ok) {
      window.location.href = '/admin/dashboard'
    } else {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  const si: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid #d4e0ec', background: '#f8fbff',
    fontFamily: 'Nunito, sans-serif', fontSize: '0.92rem', color: N,
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f4f8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: 'Nunito, sans-serif',
    }}>
      <div style={{
        background: '#fff', borderRadius: 18, padding: '40px 36px',
        maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(11,31,51,.10)',
        border: '1.5px solid #d4e0ec',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: N, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', marginBottom: 12,
          }}>🔒</div>
          <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: '1.1rem', color: N, fontWeight: 900 }}>
            ACPI Admin
          </div>
          <div style={{ fontSize: '.78rem', color: '#7a8a9a', marginTop: 4 }}>
            Assam Career Point &amp; Info
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#fde8ea', border: '1.5px solid #f7bcc0', borderRadius: 10,
            padding: '10px 14px', marginBottom: 20, fontSize: '.83rem',
            color: '#c62828', lineHeight: 1.5,
          }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: '.72rem', fontWeight: 700,
              color: '#5a6a7a', marginBottom: 6,
              textTransform: 'uppercase', letterSpacing: '.04em',
            }}>
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              autoFocus
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              style={si}
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', fontSize: '.72rem', fontWeight: 700,
              color: '#5a6a7a', marginBottom: 6,
              textTransform: 'uppercase', letterSpacing: '.04em',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ ...si, paddingRight: 48 }}
                placeholder="Enter password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: '1rem', padding: 0,
                }}
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !form.username || !form.password}
            style={{
              width: '100%', padding: '13px', borderRadius: 11,
              background: loading ? '#7a8a9a' : N,
              color: G, fontWeight: 900, fontSize: '.92rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none', fontFamily: 'Arial Black, sans-serif',
              transition: 'background .2s',
            }}
          >
            {loading ? '⏳ Signing in…' : '🔓 Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', fontSize: '.73rem',
          color: '#a0aab4', marginTop: 24, lineHeight: 1.6,
        }}>
          This is a private admin area.<br />
          Unauthorised access is strictly prohibited.
        </p>
      </div>
    </div>
  )
}
