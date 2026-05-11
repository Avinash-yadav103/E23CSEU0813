# Stage 1

## Notification System Design

### Overview

The Campus Notifications platform delivers real-time updates to students across three categories — **Placements**, **Results**, and **Events**. With high notification volume, users lose track of what matters most. This document explains the Priority Inbox algorithm, the data structure chosen to maintain the top-N notifications efficiently, and the overall system design.

---

## Problem Statement

Students receive a continuous stream of notifications. Without prioritisation, important placement alerts get buried beneath routine event reminders. The product requirement is to always surface the top **n** most important unread notifications first (n = 10, 15, 20… configurable by the user).

Priority is defined by two dimensions:

| Dimension | Rule |
|-----------|------|
| **Type weight** | Placement (3) > Result (2) > Event (1) |
| **Recency** | Among equal-weight notifications, newer ones rank higher |

---

## Scoring Function

Each notification receives a numeric score:

```
score(n) = weight(n.Type) × 10¹² + epoch_ms(n.Timestamp)
```

Multiplying the weight by 10¹² (≈ 32 years in milliseconds) ensures that type weight always dominates recency. Two Placement notifications are then ordered purely by how recent they are.

```js
const WEIGHT = { Placement: 3, Result: 2, Event: 1 }

function score(n) {
  const w = WEIGHT[n.Type] ?? 0
  const t = new Date(n.Timestamp).getTime() || 0
  return w * 1e12 + t
}
```

---

## Algorithm — Finding Top-N

### Current approach (suitable for n ≤ ~500 items)

1. **Fetch** up to 200 notifications from the API (one page, configurable).
2. **Sort** the array in-place using JavaScript's `Array.sort`, which runs Timsort — **O(k log k)** where k is fetched items.
3. **Slice** the first n items.

```js
const sorted = [...list].sort((a, b) => score(b) - score(a))
const topN   = sorted.slice(0, n)
```

This is correct, simple, and fast enough for hundreds of notifications.

### Efficient approach for continuous streams (min-heap)

When new notifications keep arriving in real-time (e.g. via WebSocket), re-sorting the entire array on every update is wasteful. The efficient solution is a **min-heap of size n**:

```
Maintain a min-heap keyed on score, capped at size n.

For each incoming notification:
  if heap.size < n:
      heap.push(notification)
  else if score(notification) > heap.peek().score:
      heap.pop()          // evict the lowest-priority item
      heap.push(notification)
```

| Operation | Complexity |
|-----------|------------|
| Insert / evict | O(log n) |
| Query top-n | O(n log n) to extract in order |
| Space | O(n) |

This gives us a sliding window of the top-n items that is updated in **O(log n)** per notification — regardless of total volume.

---

## Handling New Incoming Notifications

The question is: *how do we maintain the top 10 efficiently as new notifications arrive?*

### Strategy

1. **Polling** (current): The UI re-fetches the API every 60 seconds. On each response the algorithm re-scores and re-slices. Simple and stateless.
2. **WebSocket / SSE** (recommended for production): The server pushes new events. The client maintains the min-heap in memory. Only O(log n) work per new notification.
3. **Read/Unread state** is persisted in `localStorage` so it survives page refreshes without a backend.

---

## Data Flow

```
API GET /evaluation-service/notifications
        │
        ▼
fetchNotifications()   ← auth token injected by api.js
        │
        ▼
PriorityInbox component
  ├── score every notification
  ├── sort descending by score
  └── slice top-n
        │
        ▼
Render ranked cards with #1 … #n badges
```

---

## Viewed / Unread Tracking

Notification read-state is maintained purely on the frontend using `localStorage`:

```
Key:   "campus_hub_viewed_ids"
Value: JSON array of notification ID strings
```

- When a card is clicked → ID is added to the set → card switches to "read" style.
- Unread count is computed by diffing the fetched IDs against the viewed set.
- No backend required; state persists across sessions on the same browser.

---

## API Integration

```
GET http://4.224.186.213/evaluation-service/notifications
    ?limit=200
    &page=1
    &notification_type=Placement|Result|Event   (optional)

Authorization: Bearer <token>
```

The token is retrieved from `sessionStorage` and injected by the `apiFetch` wrapper in `src/utils/api.js`.

---

## Logging Middleware

All API calls, navigation events, and auth actions are logged through `src/utils/logger.js`. Direct use of `console.log` / `console.error` is prohibited; all log calls go through:

```js
logger.info('Context', 'Message', { meta })
logger.warn('Context', 'Message', { meta })
logger.error('Context', 'Message', { meta })
logger.debug('Context', 'Message', { meta })
```

Each log entry is structured with `{ timestamp, level, context, message, ...meta }`.

---

## Screenshots

Screenshots of the Priority Inbox output are located in the repository at:

```
/screenshots/priority-inbox-top10.png
/screenshots/all-notifications.png
/screenshots/login-page.png
```

---

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx       # Login / logout state, sessionStorage token
├── components/
│   ├── Sidebar.jsx / .css    # Navigation, upgrade card, user avatar
│   ├── TopBar.jsx / .css     # Search, filters, user chip
│   ├── NotificationList.jsx  # All notifications with read/unread tracking
│   ├── PriorityInbox.jsx     # Top-N priority sorted notifications
│   └── notification.css      # Shared card styles
├── pages/
│   └── LoginPage.jsx / .css  # Auth UI
├── utils/
│   ├── api.js                # Fetch wrapper with auth header injection
│   └── logger.js             # Logging middleware
├── App.jsx                   # Root: AuthProvider + Login/Dashboard gate
└── index.css                 # Global tokens, reset, Inter font
```
