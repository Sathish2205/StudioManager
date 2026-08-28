import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// GET /api/shifts
export const getShifts = async () => {
  const result = await apiGet('/shifts?limit=50')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// GET /api/shifts/active
export const getActiveShifts = async () => {
  const result = await apiGet('/shifts/active')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// POST /api/shifts
export const createShift = async (shiftData) => {
  const result = await apiPost('/shifts', shiftData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/shifts/:id
export const updateShift = async (id, shiftData) => {
  const result = await apiPut(`/shifts/${id}`, shiftData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// DELETE /api/shifts/:id
export const deleteShift = async (id) => {
  const result = await apiDelete(`/shifts/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}
