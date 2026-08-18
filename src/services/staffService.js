import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// GET /api/employees
export const getStaff = async () => {
  const result = await apiGet('/employees?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// GET /api/employees/dropdown
export const getStaffDropdown = async () => {
  const result = await apiGet('/employees/dropdown')
  if (result && result.success && result.data) {
    return result.data
  }
  return []
}

// POST /api/employees
export const createStaff = async (staffData) => {
  const result = await apiPost('/employees', staffData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/employees/:id
export const updateStaff = async (id, staffData) => {
  const result = await apiPut(`/employees/${id}`, staffData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// DELETE /api/employees/:id
export const deleteStaff = async (id) => {
  const result = await apiDelete(`/employees/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}
