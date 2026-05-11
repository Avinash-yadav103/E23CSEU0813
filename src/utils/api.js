const BASE = 'http://4.224.186.213/evaluation-service/notifications'

export async function fetchNotifications({ limit, page, notification_type } = {}) {
  const url = new URL(BASE)
  if (limit) url.searchParams.set('limit', String(limit))
  if (page) url.searchParams.set('page', String(page))
  if (notification_type) url.searchParams.set('notification_type', notification_type)

  // simple logging middleware
  console.info('[Logging Middleware] GET', url.toString())

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Network error: ' + res.status)
  const data = await res.json()
  console.info('[Logging Middleware] Response', data)
  return data.notifications || []
}

export default { fetchNotifications }
