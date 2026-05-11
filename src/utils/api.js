import { logger } from './logger'

const BASE = 'http://4.224.186.213/evaluation-service/notifications'

/**
 * Retrieve the stored auth token from sessionStorage.
 * Returns null if not logged in.
 */
function getToken() {
  return sessionStorage.getItem('auth_token')
}

/**
 * Core fetch wrapper that injects Authorization header and logs every
 * request/response via the logging middleware.
 */
async function apiFetch(url, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  logger.info('API', `${options.method || 'GET'} ${url}`)

  const res = await fetch(url, { ...options, headers })

  logger.info('API', `Response ${res.status}`, { url })

  return res
}

/**
 * Fetch paginated / filtered notifications from the evaluation service.
 */
export async function fetchNotifications({ limit, page, notification_type } = {}) {
  const url = new URL(BASE)
  if (limit)             url.searchParams.set('limit', String(limit))
  if (page)              url.searchParams.set('page', String(page))
  if (notification_type) url.searchParams.set('notification_type', notification_type)

  logger.debug('fetchNotifications', 'Building request', { limit, page, notification_type })

  try {
    const res = await apiFetch(url.toString())

    if (res.status === 401) {
      logger.warn('fetchNotifications', 'Unauthorised — token may be missing or expired')
      throw new Error('UNAUTHORISED')
    }

    if (!res.ok) {
      logger.error('fetchNotifications', `API error ${res.status}`)
      throw new Error(`API Error: ${res.status}`)
    }

    const data = await res.json()
    const list = data.notifications || []
    logger.info('fetchNotifications', `Received ${list.length} notifications`)
    return list
  } catch (err) {
    logger.error('fetchNotifications', err.message, { stack: err.stack })
    throw err
  }
}

export default { fetchNotifications }
