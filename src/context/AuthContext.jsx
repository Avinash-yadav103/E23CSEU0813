import React, { createContext, useContext, useState, useCallback } from 'react'
import { logger } from '../utils/logger'

const AuthContext = createContext(null)

/**
 * Hardcoded demo credentials.
 * In production these would be validated server-side.
 * The assignment states users are pre-authorised, so we simulate that here.
 */
const DEMO_USERS = [
  { username: 'student',  password: 'campus123', name: 'Avinash Yadav',   token: 'demo-token-student-abc' },
  { username: 'admin',    password: 'admin123',  name: 'Anne Douglas',   token: 'demo-token-admin-xyz'   },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem('auth_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const login = useCallback((username, password) => {
    logger.info('Auth', 'Login attempt', { username })

    const match = DEMO_USERS.find(
      u => u.username === username.trim() && u.password === password
    )

    if (!match) {
      logger.warn('Auth', 'Login failed — invalid credentials', { username })
      return { success: false, error: 'Invalid username or password.' }
    }

    const { token, name } = match
    const userData = { username: match.username, name, token }

    sessionStorage.setItem('auth_token', token)
    sessionStorage.setItem('auth_user', JSON.stringify(userData))
    setUser(userData)

    logger.info('Auth', 'Login successful', { username, name })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    logger.info('Auth', 'User logged out', { username: user?.username })
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_user')
    setUser(null)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
