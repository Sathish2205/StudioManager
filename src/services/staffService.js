import { apiGet } from './apiClient'

// GET /api/employees
export const getStaff = async () => {
  const result = await apiGet('/employees?limit=50')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return null
}

// GET /api/employees/dropdown
export const getStaffDropdown = async () => {
  const result = await apiGet('/employees/dropdown')
  if (result && result.success && result.data) {
    return result.data
  }
  return null
}
