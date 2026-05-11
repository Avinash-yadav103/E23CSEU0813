/**
 * Logging Middleware
 * A structured, levelled logger for the Campus Notifications app.
 * console.log / console.error are intentionally NOT used elsewhere.
 */

const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 }
const CURRENT_LEVEL = LEVELS.DEBUG

function formatTimestamp() {
  return new Date().toISOString()
}

function log(level, context, message, meta = {}) {
  if (LEVELS[level] < CURRENT_LEVEL) return

  const entry = {
    timestamp: formatTimestamp(),
    level,
    context,
    message,
    ...meta,
  }

  const line = `[${entry.timestamp}] [${level}] [${context}] ${message}`

  switch (level) {
    case 'ERROR':
      console.error(line, Object.keys(meta).length ? meta : '')
      break
    case 'WARN':
      console.warn(line, Object.keys(meta).length ? meta : '')
      break
    default:
      console.info(line, Object.keys(meta).length ? meta : '')
  }

  return entry
}

export const logger = {
  debug: (ctx, msg, meta) => log('DEBUG', ctx, msg, meta),
  info:  (ctx, msg, meta) => log('INFO',  ctx, msg, meta),
  warn:  (ctx, msg, meta) => log('WARN',  ctx, msg, meta),
  error: (ctx, msg, meta) => log('ERROR', ctx, msg, meta),
}

export default logger
