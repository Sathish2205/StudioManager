const LOCAL_API = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000/api'
const HOSTED_API = import.meta.env.VITE_HOSTED_API_URL || import.meta.env.VITE_API_URL || 'https://student-data-manager-ruc1.onrender.com/api'

let cachedApiBaseUrl = null
let healthCheckPromise = null

/**
 * Resolves the backend API base URL dynamically.
 * First checks if localhost:5000 is available via GET /api/health.
 * If reachable within 1200ms, uses http://localhost:5000/api.
 * Otherwise, falls back to the hosted backend URL.
 */
export const resolveApiBaseUrl = async () => {
  if (cachedApiBaseUrl) return cachedApiBaseUrl
  if (healthCheckPromise) return healthCheckPromise

  healthCheckPromise = (async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)

      const res = await fetch(`${LOCAL_API}/health`, {
        method: 'GET',
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (data && (data.success || data.message)) {
          console.log('[ApiConfig] ✅ Local backend is available — using', LOCAL_API)
          cachedApiBaseUrl = LOCAL_API
          return LOCAL_API
        }
      }
    } catch (err) {
      console.log('[ApiConfig] ℹ️ Local backend not reachable on port 5000 — falling back to hosted backend:', HOSTED_API)
    }

    cachedApiBaseUrl = HOSTED_API
    return HOSTED_API
  })()

  return healthCheckPromise
}

export const getApiBaseUrlSync = () => {
  return cachedApiBaseUrl || LOCAL_API
}
