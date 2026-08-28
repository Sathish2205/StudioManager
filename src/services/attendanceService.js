import { apiGet, apiPost, apiPut } from './apiClient'

// GET /api/attendance/today
export const getTodayAttendance = async () => {
  const result = await apiGet('/attendance/today')
  if (result && result.success && result.data) {
    return result.data
  }
  return { summary: {}, attendances: [] }
}

// POST /api/attendance/check-in
export const checkIn = async (employeeId) => {
  const result = await apiPost('/attendance/check-in', { employeeId })
  return result
}

// POST /api/attendance/check-out
export const checkOut = async (employeeId) => {
  const result = await apiPost('/attendance/check-out', { employeeId })
  return result
}

// POST /api/attendance/break/start
export const startBreak = async (employeeId) => {
  const result = await apiPost('/attendance/break/start', { employeeId })
  return result
}

// POST /api/attendance/break/end
export const endBreak = async (employeeId) => {
  const result = await apiPost('/attendance/break/end', { employeeId })
  return result
}

// GET /api/attendance/employee/:id
export const getEmployeeAttendance = async (employeeId, params = {}) => {
  const query = new URLSearchParams()
  if (params.status) query.append('status', params.status)
  if (params.startDate) query.append('startDate', params.startDate)
  if (params.endDate) query.append('endDate', params.endDate)
  if (params.page) query.append('page', params.page)
  if (params.limit) query.append('limit', params.limit || 50)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  const result = await apiGet(`/attendance/employee/${employeeId}${queryString}`)
  if (result && result.success) {
    return { data: result.data || [], pagination: result.pagination || null }
  }
  return { data: [], pagination: null }
}

// GET /api/attendance/employee/:id/status
export const getEmployeeCurrentStatus = async (employeeId) => {
  const result = await apiGet(`/attendance/employee/${employeeId}/status`)
  if (result && result.success && result.data) {
    return result.data
  }
  return null
}

// GET /api/attendance/employee/:id/monthly/:year/:month
export const getMonthlyAttendance = async (employeeId, year, month) => {
  const result = await apiGet(`/attendance/employee/${employeeId}/monthly/${year}/${month}`)
  if (result && result.success && result.data) {
    return result.data
  }
  return { calendar: {}, summary: {} }
}

// PUT /api/attendance/:id/adjust
export const adjustAttendance = async (attendanceId, adjustData) => {
  const result = await apiPut(`/attendance/${attendanceId}/adjust`, adjustData)
  return result
}
