import React, { useEffect, useState } from 'react'
import { fetchNotifications } from '../utils/api'
import './notification.css'

function useViewedStorage() {
  const key = 'viewed_notification_ids'
  const get = () => new Set(JSON.parse(localStorage.getItem(key) || '[]'))
  const [setVer] = useState(0)
  return {
    isViewed: id => get().has(id),
    markViewed: id => {
      const s = get();
      s.add(id);
      localStorage.setItem(key, JSON.stringify([...s]));
      setVer(v=>v+1)
    }
  }
}

export default function NotificationList({ limit=50, notificationType='' }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const viewed = useViewedStorage()

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    fetchNotifications({ limit, notification_type: notificationType || undefined })
      .then(list => { if(mounted) setItems(list) })
      .catch(err => { console.error(err); if(mounted) setItems([]) })
      .finally(()=> mounted && setLoading(false))
    return ()=> mounted=false
  },[limit, notificationType])

  if(loading) return <div className="notice">Loading notifications…</div>

  return (
    <div className="notifications">
      {items.length===0 && <div className="notice">No notifications</div>}
      {items.map(n => (
        <div key={n.ID} className={`notice-item ${viewed.isViewed(n.ID)?'seen':'new'}`} onClick={()=>viewed.markViewed(n.ID)}>
          <div className="meta">
            <strong>{n.Type}</strong>
            <span className="time">{n.Timestamp}</span>
          </div>
          <div className="msg">{n.Message}</div>
        </div>
      ))}
    </div>
  )
}
