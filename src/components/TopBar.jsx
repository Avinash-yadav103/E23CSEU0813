import React from 'react'
import { useAuth } from '../context/AuthContext'
import './TopBar.css'

export default function TopBar({ filterType, setFilterType, limit, setLimit }) {
  const { user } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="search-box" id="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Quick Search (ctrl + D)</span>
        </div>
      </div>

      <div className="topbar-controls">
        <div className="filter-group" id="filter-type-group">
          <label htmlFor="filter-type">Type</label>
          <select
            id="filter-type"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="">All types</option>
            <option value="Placement">Placement</option>
            <option value="Result">Result</option>
            <option value="Event">Event</option>
          </select>
        </div>

        <div className="filter-group" id="filter-limit-group">
          <label htmlFor="filter-limit">Show</label>
          <input
            id="filter-limit"
            type="number"
            min="1"
            max="100"
            value={limit}
            onChange={e => setLimit(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>

        <div className="user-chip" id="user-chip">
          <div className="chip-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <span>{user?.name}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  )
}
