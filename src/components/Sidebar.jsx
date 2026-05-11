import React from 'react'
import { useAuth } from '../context/AuthContext'
import { logger } from '../utils/logger'
import './Sidebar.css'

const NAV_ITEMS = [
  {
    id: 'all',
    label: 'All Notifications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'priority',
    label: 'Priority Inbox',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

export default function Sidebar({ view, setView, unreadCount }) {
  const { user, logout } = useAuth()

  function handleLogout() {
    logger.info('Sidebar', 'User clicked logout', { username: user?.username })
    logout()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
            <path d="M10 20 Q20 8 30 20 Q20 32 10 20Z" fill="white" opacity="0.9" />
            <circle cx="20" cy="20" r="4" fill="white" />
          </svg>
        </div>
        <span className="logo-text">Campus Hub</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${view === item.id ? 'active' : ''}`}
            onClick={() => {
              logger.info('Sidebar', `View switched to: ${item.id}`)
              setView(item.id)
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'all' && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="upgrade-card">
        <div className="upgrade-avatar">
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="24" r="10" fill="rgba(255,255,255,0.3)" />
            <path d="M12 52c0-11 9-18 20-18s20 7 20 18" fill="rgba(255,255,255,0.2)" />
          </svg>
        </div>
        <p className="upgrade-title">Get Upgrade</p>
        <p className="upgrade-sub">Step to the next level, with more features</p>
        <button className="upgrade-btn" id="upgrade-learn-more">Learn more</button>
      </div>

      <div className="sidebar-footer">
        {user && (
          <div className="user-row">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span className="user-name">{user.name}</span>
          </div>
        )}
        <button className="logout-btn" id="logout-btn" onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}
