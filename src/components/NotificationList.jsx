import React, { useEffect, useState, useCallback } from 'react'
import { fetchNotifications } from '../utils/api'
import { logger } from '../utils/logger'
import './notification.css'

const VIEWED_KEY = 'campus_hub_viewed_ids'

function getViewed() {
  try { return new Set(JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]')) }
  catch { return new Set() }
}
function markViewed(id) {
  const s = getViewed(); s.add(id)
  localStorage.setItem(VIEWED_KEY, JSON.stringify([...s]))
}

export default function NotificationList({ limit = 50, notificationType = '', onUnreadCount }) {
  const [items, setItems]     = useState([])
  const [viewed, setViewed]   = useState(getViewed)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(() => {
    let alive = true
    setLoading(true)
    setError(null)
    logger.info('NotificationList', 'Fetching notifications', { limit, notificationType })

    fetchNotifications({ limit, notification_type: notificationType || undefined })
      .then(list => {
        if (!alive) return
        setItems(list || [])
        const unread = (list || []).filter(n => !getViewed().has(n.ID)).length
        onUnreadCount?.(unread)
        logger.info('NotificationList', `Loaded ${list?.length} items, ${unread} unread`)
      })
      .catch(err => {
        if (!alive) return
        logger.error('NotificationList', 'Fetch failed', { message: err.message })
        setItems([])
        setError(err.message === 'UNAUTHORISED' ? 'Session expired. Please log in again.' : err.message)
      })
      .finally(() => alive && setLoading(false))

    return () => { alive = false }
  }, [limit, notificationType])

  useEffect(load, [load])

  function handleClick(id) {
    markViewed(id)
    setViewed(getViewed())
    logger.debug('NotificationList', 'Notification marked as viewed', { id })
  }

  if (loading) return <div className="state-box loading"><span className="spin-ring" /><p>Loading notifications…</p></div>
  if (error)   return <div className="state-box error"><span className="state-icon">⚠</span><p>{error}</p></div>
  if (!items.length) return <div className="state-box empty"><span className="state-icon">🔔</span><p>No notifications found</p></div>

  return (
    <div className="notif-list">
      {items.map(n => {
        const isNew = !viewed.has(n.ID)
        return (
          <div
            key={n.ID}
            id={`notif-${n.ID}`}
            className={`notif-card ${isNew ? 'unread' : 'read'}`}
            onClick={() => handleClick(n.ID)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleClick(n.ID)}
          >
            {isNew && <div className="unread-dot" />}
            <div className="notif-card-left">
              <div className={`type-badge type-${n.Type?.toLowerCase()}`}>{n.Type}</div>
              <h3 className="notif-message">{n.Message}</h3>
              <span className="notif-time">{new Date(n.Timestamp).toLocaleString()}</span>
            </div>
            {isNew && <span className="new-tag">New</span>}
          </div>
        )
      })}
    </div>
  )
}
