import { apiGet, apiPost, apiPut } from './apiClient'

// GET /api/payroll
export const getPayrolls = async (params = {}) => {
  const query = new URLSearchParams()
  if (params.employeeId) query.append('employeeId', params.employeeId)
  if (params.month) query.append('month', params.month)
  if (params.year) query.append('year', params.year)
  if (params.status) query.append('status', params.status)

  const queryString = query.toString() ? `?${query.toString()}` : '?limit=100'
  const result = await apiGet(`/payroll${queryString}`)
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// GET /api/payroll/:id
export const getPayrollById = async (id) => {
  const result = await apiGet(`/payroll/${id}`)
  if (result && result.success && result.data) {
    return result.data
  }
  return null
}

// POST /api/payroll/generate
export const generatePayroll = async (payload) => {
  const result = await apiPost('/payroll', payload)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/payroll/:id
export const updatePayrollStatus = async (id, updateData) => {
  const result = await apiPut(`/payroll/${id}`, updateData)
  if (result && result.success) {
    return result.data
  }
  return null
}
