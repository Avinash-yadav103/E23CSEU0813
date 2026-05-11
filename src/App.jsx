import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { logger } from './utils/logger'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import NotificationList from './components/NotificationList'
import PriorityInbox from './components/PriorityInbox'
import './App.css'

/* ── Inner app (rendered only when authenticated) ── */
function Dashboard() {
  const [view, setView]           = useState('all')
  const [limit, setLimit]         = useState(15)
  const [filterType, setFilterType] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  logger.debug('Dashboard', 'Render', { view, limit, filterType })

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        setView={setView}
        unreadCount={unreadCount}
      />

      <div className="main-area">
        <TopBar
          filterType={filterType}
          setFilterType={setFilterType}
          limit={limit}
          setLimit={setLimit}
        />

        <div className="page-body">
          <div className="page-heading">
            <h1 id="page-title">
              {view === 'all' ? 'Notifications' : 'Priority Inbox'}
            </h1>
            <p className="page-sub">
              {view === 'all'
                ? 'All your campus updates in one place'
                : `Showing top ${limit} most important notifications`}
            </p>
          </div>

          <div className="content-wrap">
            {view === 'all' ? (
              <NotificationList
                limit={limit}
                notificationType={filterType}
                onUnreadCount={setUnreadCount}
              />
            ) : (
              <PriorityInbox
                limit={limit}
                notificationType={filterType}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Root: show Login or Dashboard based on auth state ── */
function Root() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Dashboard /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  )
}
