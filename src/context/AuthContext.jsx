import React, { createContext, useContext, useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })
  const [tenant, setTenant] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tenant') || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // Validate existing token & load me profile on mount
  useEffect(() => {
    async function loadMe() {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        if (res.ok) {
          const result = await res.json()
          if (result.success) {
            setUser(result.data.user)
            setTenant(result.data.tenant)
            localStorage.setItem('user', JSON.stringify(result.data.user))
            localStorage.setItem('tenant', JSON.stringify(result.data.tenant))
          }
        } else {
          // Token invalid or expired
          logout()
        }
      } catch (err) {
        console.warn('Failed to verify session:', err)
      }
      setLoading(false)
    }

    loadMe()
  }, [])

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const result = await res.json()
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Login failed. Please check credentials.')
    }

    const { token: newTok, user: userObj, tenant: tenantObj } = result.data

    setToken(newTok)
    setUser(userObj)
    setTenant(tenantObj)

    localStorage.setItem('token', newTok)
    localStorage.setItem('user', JSON.stringify(userObj))
    localStorage.setItem('tenant', JSON.stringify(tenantObj))

    return result.data
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch {}

    setToken(null)
    setUser(null)
    setTenant(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('tenant')
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        tenant,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
