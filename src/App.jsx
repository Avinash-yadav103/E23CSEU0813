import React, { useEffect, useState } from 'react'
import './App.css'
import { fetchNotifications } from './utils/api'
import PriorityInbox from './components/PriorityInbox'
import NotificationList from './components/NotificationList'

function App() {
  const [view, setView] = useState('all') // 'all' or 'priority'
  const [limit, setLimit] = useState(10)
  const [filterType, setFilterType] = useState('')

  return (
    <div className="app-root">
      <header className="header">
        <h1>Campus Notifications</h1>
        <div className="controls">
          <button onClick={() => setView('all')} className={view==='all'? 'active':''}>All</button>
          <button onClick={() => setView('priority')} className={view==='priority'? 'active':''}>Priority</button>
          <label>Limit:
            <input type="number" min="1" value={limit} onChange={e=>setLimit(Number(e.target.value)||1)} />
          </label>
          <label>Filter type:
            <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
              <option value="">(all)</option>
              <option value="Placement">Placement</option>
              <option value="Result">Result</option>
              <option value="Event">Event</option>
            </select>
          </label>
        </div>
      </header>

      <main>
        {view === 'all' ? (
          <NotificationList limit={limit} notificationType={filterType} />
        ) : (
          <PriorityInbox limit={limit} notificationType={filterType} />
        )}
      </main>

      <footer className="footer">Runs on localhost:3000 — minimal implementation</footer>
    </div>
  )
}

export default App
