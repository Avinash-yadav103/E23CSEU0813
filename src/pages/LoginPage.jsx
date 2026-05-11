import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { logger } from '../utils/logger'
import './LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)
    logger.info('LoginPage', 'Submitting login form', { username })

    // Simulate slight async delay so the UI feels real
    await new Promise(r => setTimeout(r, 600))

    const result = login(username, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <div className="login-root">
      {/* Left panel — brand */}
      <div className="login-brand">
        <div className="brand-blur-circle c1" />
        <div className="brand-blur-circle c2" />
        <div className="brand-blur-circle c3" />

        <div className="brand-content">
          <div className="brand-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.15)" />
              <path d="M10 20 Q20 8 30 20 Q20 32 10 20Z" fill="white" opacity="0.9" />
              <circle cx="20" cy="20" r="4" fill="white" />
            </svg>
            <span>Campus Hub</span>
          </div>

          <div className="brand-text">
            <h1>Stay ahead of every update</h1>
            <p>
              Real-time Placements, Results, and Events — prioritised
              intelligently so you never miss what matters most.
            </p>
          </div>

          <div className="brand-stats">
            <div className="stat-pill">
              <strong>3</strong> Types
            </div>
            <div className="stat-pill">
              <strong>Live</strong> Feed
            </div>
            <div className="stat-pill">
              <strong>Smart</strong> Priority
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your Campus Hub account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-hint">
            <p>Demo credentials:</p>
            <div className="cred-row"><code>student</code> / <code>campus123</code></div>
            <div className="cred-row"><code>admin</code> / <code>admin123</code></div>
          </div>
        </div>
      </div>
    </div>
  )
}
