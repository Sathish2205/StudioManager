import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { getPermissionsForRole, DEFAULT_ROLE_PERMISSIONS } from '../constants/roles'

const API_BASE = import.meta.env.VITE_API_URL || 'https://student-data-manager-ruc1.onrender.com/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })
  const [tenant, setTenant] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tenant') || 'null') } catch { return null }
  })
  const [permissions, setPermissions] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('permissions') || 'null')
      if (stored && stored.length > 0) return stored
    } catch { /* ignore */ }
    // Derive from stored user role as fallback
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (storedUser?.role) {
        return getPermissionsForRole(storedUser.role, null)
      }
    } catch { /* ignore */ }
    return []
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
            const userData = result.data.user
            const tenantData = result.data.tenant

            setUser(userData)
            setTenant(tenantData)
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('tenant', JSON.stringify(tenantData))

            // Resolve permissions: prefer backend-provided, fallback to role defaults
            const resolvedPerms = getPermissionsForRole(
              userData?.role,
              result.data.permissions || userData?.permissions
            )
            setPermissions(resolvedPerms)
            localStorage.setItem('permissions', JSON.stringify(resolvedPerms))
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

    // Resolve permissions from login response
    const resolvedPerms = getPermissionsForRole(
      userObj?.role,
      result.data.permissions || userObj?.permissions
    )
    setPermissions(resolvedPerms)
    localStorage.setItem('permissions', JSON.stringify(resolvedPerms))

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
    setPermissions([])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('tenant')
    localStorage.removeItem('permissions')
  }

  /**
   * Check if the current user has a specific permission.
   * Owner/Admin always returns true.
   */
  const hasPermission = useCallback((permission) => {
    if (!permission) return true // null permission means no restriction
    if (user?.role === 'Owner/Admin' || user?.role === 'admin') return true
    return permissions.includes(permission)
  }, [permissions, user])

  /**
   * Check if the current user has ANY of the listed permissions.
   */
  const hasAnyPermission = useCallback((permList) => {
    if (!permList || permList.length === 0) return true
    if (user?.role === 'Owner/Admin' || user?.role === 'admin') return true
    return permList.some((p) => permissions.includes(p))
  }, [permissions, user])

  const contextValue = useMemo(() => ({
    token,
    user,
    tenant,
    permissions,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
  }), [token, user, tenant, permissions, loading, hasPermission, hasAnyPermission])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
