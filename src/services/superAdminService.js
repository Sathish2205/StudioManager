import { resolveApiBaseUrl } from './apiConfig'

const getToken = () => sessionStorage.getItem('sa_token')

const authHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const handleResponse = async (res) => {
  const data = await res.json()
  if (!res.ok || !data.success) {
    if (res.status === 401) {
      sessionStorage.removeItem('sa_token')
      sessionStorage.removeItem('sa_user')
      window.location.href = '/super-admin/login'
    }
    throw new Error(data.message || 'Request failed')
  }
  return data
}

const saFetch = async (path, options = {}) => {
  const apiBase = await resolveApiBaseUrl()
  const res = await fetch(`${apiBase}${path}`, options)
  return handleResponse(res)
}

// ── Auth ──
export const saLogin = (username, password) =>
  saFetch(`/super-admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

export const saGetMe = () =>
  saFetch(`/super-admin/auth/me`, {
    headers: authHeaders(),
  })

export const saChangePassword = (currentPassword, newPassword, confirmNewPassword) =>
  saFetch(`/super-admin/auth/change-password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  })

export const saLogout = () =>
  saFetch(`/super-admin/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
  })

// ── Dashboard ──
export const saGetDashboardStats = () =>
  saFetch(`/super-admin/dashboard`, {
    headers: authHeaders(),
  })

// ── Tenants ──
export const saGetTenants = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return saFetch(`/super-admin/tenants?${query}`, {
    headers: authHeaders(),
  })
}

export const saGetTenantById = (id) =>
  saFetch(`/super-admin/tenants/${id}`, {
    headers: authHeaders(),
  })

export const saCreateTenant = (data) =>
  saFetch(`/super-admin/tenants`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

export const saUpdateTenant = (id, data) =>
  saFetch(`/super-admin/tenants/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

export const saActivateTenant = (id) =>
  saFetch(`/super-admin/tenants/${id}/activate`, {
    method: 'PATCH',
    headers: authHeaders(),
  })

export const saDeactivateTenant = (id) =>
  saFetch(`/super-admin/tenants/${id}/deactivate`, {
    method: 'PATCH',
    headers: authHeaders(),
  })
