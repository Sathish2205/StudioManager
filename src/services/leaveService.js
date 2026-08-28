import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// GET /api/leaves
export const getLeaves = async (params = {}) => {
  const query = new URLSearchParams()
  if (params.employeeId) query.append('employeeId', params.employeeId)
  if (params.status) query.append('status', params.status)
  if (params.leaveType) query.append('leaveType', params.leaveType)

  const queryString = query.toString() ? `?${query.toString()}` : '?limit=100'
  const result = await apiGet(`/leaves${queryString}`)
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// POST /api/leaves - Apply
export const applyLeave = async (leaveData) => {
  const result = await apiPost('/leaves', leaveData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/leaves/:id/approve
export const approveLeave = async (id, approverNotes = '') => {
  const result = await apiPut(`/leaves/${id}/approve`, { approverNotes })
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/leaves/:id/reject
export const rejectLeave = async (id, approverNotes = '') => {
  const result = await apiPut(`/leaves/${id}/reject`, { approverNotes })
  if (result && result.success) {
    return result.data
  }
  return null
}

// DELETE /api/leaves/:id
export const deleteLeave = async (id) => {
  const result = await apiDelete(`/leaves/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}
