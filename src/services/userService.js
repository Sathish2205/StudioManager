import { apiGet, apiPost, apiPut } from './apiClient'

// ── User Account Management Service ──

/**
 * Create a user login account linked to an employee.
 * POST /api/users/create-account
 * @param {{ employeeId: string, username: string, password: string, role: string }} data
 */
export const createUserAccount = async (data) => {
  const result = await apiPost('/users/create-account', data)
  return result
}

/**
 * Check if a username is available.
 * GET /api/users/check-username/:username
 * @param {string} username
 * @returns {{ available: boolean }}
 */
export const checkUsernameAvailable = async (username) => {
  try {
    const result = await apiGet(`/users/check-username/${encodeURIComponent(username.trim())}`)
    if (result && result.success) {
      return { available: result.data?.available ?? true }
    }
    // If endpoint doesn't exist yet, assume available
    return { available: true }
  } catch {
    return { available: true }
  }
}

/**
 * Change a user's role.
 * PUT /api/users/:id/role
 * @param {string} userId
 * @param {{ role: string }} roleData
 */
export const changeUserRole = async (userId, roleData) => {
  const result = await apiPut(`/users/${userId}/role`, roleData)
  return result
}

/**
 * Activate or deactivate a user account.
 * PUT /api/users/:id/status
 * @param {string} userId
 * @param {{ status: 'active'|'inactive' }} statusData
 */
export const changeUserStatus = async (userId, statusData) => {
  const result = await apiPut(`/users/${userId}/status`, statusData)
  return result
}

/**
 * Reset a user's password (admin action).
 * POST /api/users/:id/reset-password
 * @param {string} userId
 * @param {{ newPassword: string }} passwordData
 */
export const resetUserPassword = async (userId, passwordData) => {
  const result = await apiPost(`/users/${userId}/reset-password`, passwordData)
  return result
}

/**
 * Get user account details for a specific employee.
 * GET /api/users/by-employee/:employeeId
 * @param {string} employeeId
 */
export const getUserByEmployee = async (employeeId) => {
  try {
    const result = await apiGet(`/users/by-employee/${employeeId}`)
    if (result && result.success) {
      return result.data
    }
    return null
  } catch {
    return null
  }
}
