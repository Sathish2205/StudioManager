import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// GET /api/employees with full query filters
export const getEmployees = async (queryParams = {}) => {
  const params = new URLSearchParams()
  if (queryParams.search) params.append('search', queryParams.search)
  if (queryParams.role) params.append('role', queryParams.role)
  if (queryParams.employmentType) params.append('employmentType', queryParams.employmentType)
  if (queryParams.status) params.append('status', queryParams.status)
  if (queryParams.page) params.append('page', queryParams.page)
  if (queryParams.limit) params.append('limit', queryParams.limit || 100)

  const queryString = params.toString() ? `?${params.toString()}` : '?limit=100'
  const result = await apiGet(`/employees${queryString}`)
  if (result && result.success) {
    return { data: result.data || [], pagination: result.pagination || null }
  }
  return { data: [], pagination: null }
}

// GET /api/employees/:id
export const getEmployeeById = async (id) => {
  const result = await apiGet(`/employees/${id}`)
  if (result && result.success) {
    return result.data
  }
  return null
}

// POST /api/employees
export const createEmployee = async (employeeData) => {
  const result = await apiPost('/employees', employeeData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/employees/:id
export const updateEmployee = async (id, employeeData) => {
  const result = await apiPut(`/employees/${id}`, employeeData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// DELETE /api/employees/:id
export const deleteEmployee = async (id) => {
  const result = await apiDelete(`/employees/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}

// GET /api/employees/dropdown
export const getEmployeesDropdown = async () => {
  const result = await apiGet('/employees/dropdown')
  if (result && result.success && result.data) {
    return result.data
  }
  return { photographers: [], videographers: [], editors: [], all: [] }
}

// GET /api/employees/dashboard/stats
export const getEmployeeDashboardStats = async () => {
  const result = await apiGet('/employees/dashboard/stats')
  if (result && result.success && result.data) {
    return result.data
  }
  return null
}

// Compatibility aliases with legacy staffService
export const getStaff = async () => (await getEmployees()).data
export const getStaffDropdown = getEmployeesDropdown
export const createStaff = createEmployee
export const updateStaff = updateEmployee
export const deleteStaff = deleteEmployee
