const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper to acquire a valid JWT token automatically if missing or expired
export const getOrFetchToken = async () => {
  let token = localStorage.getItem('token')
  if (token) return token

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@photostudiopro.com',
        password: 'admin123'
      })
    })

    if (res.ok) {
      const result = await res.json()
      if (result.success && result.data?.token) {
        token = result.data.token
        localStorage.setItem('token', token)
        return token
      }
    }
  } catch (err) {
    console.warn('Auto-login authentication failed:', err.message)
  }

  return null
}

export const apiGet = async (endpoint) => {
  try {
    const token = await getOrFetchToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${API_BASE}${endpoint}`, { headers })

    if (res.status === 401) {
      // Re-authenticate if token expired
      localStorage.removeItem('token')
      const newToken = await getOrFetchToken()
      if (newToken) {
        const retryRes = await fetch(`${API_BASE}${endpoint}`, {
          headers: { Authorization: `Bearer ${newToken}` }
        })
        if (retryRes.ok) return await retryRes.json()
      }
    }

    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn(`API GET ${endpoint} error:`, err.message)
  }

  return null
}

export const apiPost = async (endpoint, body) => {
  try {
    const token = await getOrFetchToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn(`API POST ${endpoint} error:`, err.message)
  }

  return null
}

export const apiPut = async (endpoint, body) => {
  try {
    const token = await getOrFetchToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    })

    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn(`API PUT ${endpoint} error:`, err.message)
  }

  return null
}

export const apiDelete = async (endpoint) => {
  try {
    const token = await getOrFetchToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers
    })

    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn(`API DELETE ${endpoint} error:`, err.message)
  }

  return null
}

