import React, { createContext, useContext, useState, useEffect } from 'react'
import { resolveApiBaseUrl } from '../services/apiConfig'

const SuperAdminAuthContext = createContext()

export const SuperAdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('sa_token') || null)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('sa_user') || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // Validate existing token on mount
  useEffect(() => {
    async function loadMe() {
      const storedToken = sessionStorage.getItem('sa_token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const apiBase = await resolveApiBaseUrl()
        const res = await fetch(`${apiBase}/super-admin/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        if (res.ok) {
          const result = await res.json()
          if (result.success) {
            setUser(result.data.user)
            sessionStorage.setItem('sa_user', JSON.stringify(result.data.user))
          } else {
            logout()
          }
        } else {
          logout()
        }
      } catch (err) {
        console.warn('Failed to verify Super Admin session:', err)
      }
      setLoading(false)
    }

    loadMe()
  }, [])

  const login = async (username, password) => {
    const apiBase = await resolveApiBaseUrl()
    const res = await fetch(`${apiBase}/super-admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const result = await res.json()
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Login failed. Please check credentials.')
    }

    const { token: newTok, user: userObj } = result.data

    setToken(newTok)
    setUser(userObj)

    sessionStorage.setItem('sa_token', newTok)
    sessionStorage.setItem('sa_user', JSON.stringify(userObj))

    return result.data
  }

  const logout = async () => {
    try {
      if (token) {
        const apiBase = await resolveApiBaseUrl()
        await fetch(`${apiBase}/super-admin/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch {}

    setToken(null)
    setUser(null)
    sessionStorage.removeItem('sa_token')
    sessionStorage.removeItem('sa_user')
  }

  return (
    <SuperAdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </SuperAdminAuthContext.Provider>
  )
}

export const useSuperAdminAuth = () => useContext(SuperAdminAuthContext)
