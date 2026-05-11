import React, { useEffect, useState, useCallback } from 'react'
import { fetchNotifications } from '../utils/api'
import { logger } from '../utils/logger'
import './notification.css'

const WEIGHT = { Placement: 3, Result: 2, Event: 1 }

function score(n) {
  const w = WEIGHT[n.Type] ?? 0
  const t = new Date(n.Timestamp).getTime() || 0
  return w * 1e12 + t
}

export default function PriorityInbox({ limit = 10, notificationType = '' }) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(() => {
    let alive = true
    setLoading(true)
    setError(null)
    logger.info('PriorityInbox', 'Fetching for priority sort', { limit, notificationType })

    fetchNotifications({ limit: 200, notification_type: notificationType || undefined })
      .then(list => {
        if (!alive) return
        const sorted = [...(list || [])].sort((a, b) => score(b) - score(a)).slice(0, limit)
        setItems(sorted)
        logger.info('PriorityInbox', `Top ${sorted.length} priority items selected from ${list?.length}`)
      })
      .catch(err => {
        if (!alive) return
        logger.error('PriorityInbox', 'Fetch failed', { message: err.message })
        setItems([])
        setError(err.message === 'UNAUTHORISED' ? 'Session expired. Please log in again.' : err.message)
      })
      .finally(() => alive && setLoading(false))

    return () => { alive = false }
  }, [limit, notificationType])

  useEffect(load, [load])

  if (loading) return <div className="state-box loading"><span className="spin-ring" /><p>Loading priority inbox…</p></div>
  if (error)   return <div className="state-box error"><span className="state-icon">⚠</span><p>{error}</p></div>
  if (!items.length) return <div className="state-box empty"><span className="state-icon">⭐</span><p>No priority notifications</p></div>

  return (
    <div className="notif-list priority-list">
      <div className="priority-banner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Sorted by priority: Placement → Result → Event, then by recency
      </div>
      {items.map((n, idx) => (
        <div key={n.ID} id={`priority-notif-${n.ID}`} className={`notif-card priority-card type-accent-${n.Type?.toLowerCase()}`}>
          <div className="rank-badge">#{idx + 1}</div>
          <div className="notif-card-left">
            <div className={`type-badge type-${n.Type?.toLowerCase()}`}>{n.Type}</div>
            <h3 className="notif-message">{n.Message}</h3>
            <span className="notif-time">{new Date(n.Timestamp).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
