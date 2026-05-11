import React, { useEffect, useState } from 'react'
import { fetchNotifications } from '../utils/api'
import './notification.css'

const WEIGHT = { 'Placement': 3, 'Result': 2, 'Event': 1 }

function score(n){
  const w = WEIGHT[n.Type] || 0
  const t = new Date(n.Timestamp).getTime() || 0
  return w * 1e12 + t
}

export default function PriorityInbox({ limit=10, notificationType='' }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    // fetch a reasonably large batch then pick top N
    fetchNotifications({ limit: 200, notification_type: notificationType || undefined })
      .then(list => {
        if(!mounted) return
        const sorted = [...list].sort((a,b)=> score(b) - score(a))
        setItems(sorted.slice(0, limit))
      }).catch(err=>{ console.error(err); if(mounted) setItems([]) })
      .finally(()=> mounted && setLoading(false))
    return ()=> mounted=false
  },[limit, notificationType])

  if(loading) return <div className="notice">Loading priority inbox…</div>

  return (
    <div className="notifications priority">
      <div className="hint">Priority inbox — top {limit} (Placement &gt; Result &gt; Event, then recency)</div>
      {items.length===0 && <div className="notice">No priority notifications</div>}
      {items.map(n => (
        <div key={n.ID} className="notice-item">
          <div className="meta"><strong>{n.Type}</strong> <span className="time">{n.Timestamp}</span></div>
          <div className="msg">{n.Message}</div>
        </div>
      ))}
    </div>
  )
}
