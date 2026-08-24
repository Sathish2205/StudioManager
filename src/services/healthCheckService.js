/**
 * Health Check Service
 * 
 * Pings the backend /api/health endpoint every 10 minutes to keep
 * the Render free-tier instance warm and prevent it from spinning down.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://student-data-manager-ruc1.onrender.com/api'
const HEALTH_CHECK_INTERVAL = 10 * 60 * 1000 // 10 minutes in milliseconds

let intervalId = null

const pingHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' })
    if (res.ok) {
      const data = await res.json()
      console.log(
        `[HealthCheck] ✅ Backend alive — ${data.message} (${new Date().toLocaleTimeString()})`
      )
    } else {
      console.warn(`[HealthCheck] ⚠️ Backend responded with status ${res.status}`)
    }
  } catch (err) {
    console.warn(`[HealthCheck] ❌ Backend unreachable — ${err.message}`)
  }
}

/**
 * Start the recurring health check.
 * Pings immediately on start, then every 10 minutes.
 */
export const startHealthCheck = () => {
  if (intervalId) {
    console.log('[HealthCheck] Already running, skipping duplicate start.')
    return
  }

  console.log('[HealthCheck] 🚀 Starting — will ping backend every 10 minutes.')

  // Ping immediately on app load
  pingHealth()

  // Then repeat every 10 minutes
  intervalId = setInterval(pingHealth, HEALTH_CHECK_INTERVAL)
}

/**
 * Stop the recurring health check (cleanup).
 */
export const stopHealthCheck = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    console.log('[HealthCheck] 🛑 Stopped.')
  }
}
