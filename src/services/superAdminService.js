const API_BASE = import.meta.env.VITE_API_URL || 'https://student-data-manager-ruc1.onrender.com/api'

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

// ── Auth ──
export const saLogin = (username, password) =>
  fetch(`${API_BASE}/super-admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(handleResponse)

export const saGetMe = () =>
  fetch(`${API_BASE}/super-admin/auth/me`, {
    headers: authHeaders(),
  }).then(handleResponse)

export const saChangePassword = (currentPassword, newPassword, confirmNewPassword) =>
  fetch(`${API_BASE}/super-admin/auth/change-password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  }).then(handleResponse)

export const saLogout = () =>
  fetch(`${API_BASE}/super-admin/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
  }).then(handleResponse)

// ── Dashboard ──
export const saGetDashboardStats = () =>
  fetch(`${API_BASE}/super-admin/dashboard`, {
    headers: authHeaders(),
  }).then(handleResponse)

// ── Tenants ──
export const saGetTenants = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return fetch(`${API_BASE}/super-admin/tenants?${query}`, {
    headers: authHeaders(),
  }).then(handleResponse)
}

export const saGetTenantById = (id) =>
  fetch(`${API_BASE}/super-admin/tenants/${id}`, {
    headers: authHeaders(),
  }).then(handleResponse)

export const saCreateTenant = (data) =>
  fetch(`${API_BASE}/super-admin/tenants`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const saUpdateTenant = (id, data) =>
  fetch(`${API_BASE}/super-admin/tenants/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const saActivateTenant = (id) =>
  fetch(`${API_BASE}/super-admin/tenants/${id}/activate`, {
    method: 'PATCH',
    headers: authHeaders(),
  }).then(handleResponse)

export const saDeactivateTenant = (id) =>
  fetch(`${API_BASE}/super-admin/tenants/${id}/deactivate`, {
    method: 'PATCH',
    headers: authHeaders(),
  }).then(handleResponse)
