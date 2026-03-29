const requests = new Map()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 20     // per window

export function rateLimit(request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  if (!requests.has(ip)) {
    requests.set(ip, [])
  }

  const timestamps = requests.get(ip).filter(t => t > windowStart)
  timestamps.push(now)
  requests.set(ip, timestamps)

  // Cleanup old entries periodically
  if (requests.size > 10000) {
    for (const [key, val] of requests) {
      const filtered = val.filter(t => t > windowStart)
      if (filtered.length === 0) requests.delete(key)
      else requests.set(key, filtered)
    }
  }

  return timestamps.length <= MAX_REQUESTS
}
