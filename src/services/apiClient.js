const API_BASE = import.meta.env.VITE_API_URL || 'https://student-data-manager-ruc1.onrender.com/api'

export const getOrFetchToken = async () => {
  let token = localStorage.getItem('token')
  if (token) return token

  // Default auto-login attempt if no token stored yet
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin@abcstudio.com',
        password: 'admin123'
      })
    })

    if (res.ok) {
      const result = await res.json()
      if (result.success && result.data?.token) {
        token = result.data.token
        localStorage.setItem('token', token)
        if (result.data.user) localStorage.setItem('user', JSON.stringify(result.data.user))
        if (result.data.tenant) localStorage.setItem('tenant', JSON.stringify(result.data.tenant))
        return token
      }
    }
  } catch (err) {
    console.warn('Auto-login authentication attempt failed:', err.message)
  }

  return null
}

export const apiGet = async (endpoint) => {
  try {
    const token = await getOrFetchToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${API_BASE}${endpoint}`, { headers })

    if (res.status === 401) {
      localStorage.removeItem('token')
      const newToken = await getOrFetchToken()
      if (newToken) {
        const retryRes = await fetch(`${API_BASE}${endpoint}`, {
          headers: { Authorization: `Bearer ${newToken}` }
        })
        if (retryRes.ok) return await retryRes.json()
      }
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.warn(`API GET ${endpoint} error:`, err.message)
    return { success: false, message: err.message, data: null }
  }
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

    if (res.status === 401) {
      localStorage.removeItem('token')
      const newToken = await getOrFetchToken()
      if (newToken) {
        const retryRes = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`
          },
          body: JSON.stringify(body)
        })
        return await retryRes.json()
      }
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.warn(`API POST ${endpoint} error:`, err.message)
    return { success: false, message: err.message, data: null }
  }
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

    const data = await res.json()
    return data
  } catch (err) {
    console.warn(`API PUT ${endpoint} error:`, err.message)
    return { success: false, message: err.message, data: null }
  }
}

export const apiDelete = async (endpoint) => {
  try {
    const token = await getOrFetchToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers
    })

    const data = await res.json()
    return data
  } catch (err) {
    console.warn(`API DELETE ${endpoint} error:`, err.message)
    return { success: false, message: err.message, data: null }
  }
}
