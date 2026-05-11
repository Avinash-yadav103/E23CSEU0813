import React, { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import NotificationList from './components/NotificationList'
import PriorityInbox from './components/PriorityInbox'

function App() {
  const [view, setView] = useState('all')
  const [limit, setLimit] = useState(15)
  const [filterType, setFilterType] = useState('')

  return (
    <div className="app-container">
      <Sidebar view={view} setView={setView} />
      
      <div className="main-content">
        <div className="top-bar">
          <h1>Campus Notifications</h1>
          <div className="filter-controls">
            <label>
              Type:
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">(all types)</option>
                <option value="Placement">Placement</option>
                <option value="Result">Result</option>
                <option value="Event">Event</option>
              </select>
            </label>
            <label>
              Limit:
              <input type="number" min="1" max="100" value={limit} onChange={(e) => setLimit(Number(e.target.value) || 1)} />
            </label>
          </div>
        </div>

        <div className="content-area">
          {view === 'all' ? (
            <NotificationList limit={limit} notificationType={filterType} />
          ) : (
            <PriorityInbox limit={limit} notificationType={filterType} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
