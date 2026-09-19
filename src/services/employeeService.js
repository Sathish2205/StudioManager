import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

export const getEmployees = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await apiGet(`/employees${query ? `?${query}` : ''}`)
  return res?.data || []
}

export const getEmployeeById = async (id) => {
  const res = await apiGet(`/employees/${id}`)
  return res?.data || null
}

export const createEmployee = async (data) => {
  const res = await apiPost('/employees', data)
  return res?.data || res
}

export const createEmployeeWithAccount = async (data) => {
  const res = await apiPost('/employees', data)
  return res?.data || res
}

export const updateEmployee = async (id, data) => {
  const res = await apiPut(`/employees/${id}`, data)
  return res?.data || res
}

export const deleteEmployee = async (id) => {
  const res = await apiDelete(`/employees/${id}`)
  return res
}

export const getEmployeeDashboardStats = async () => {
  const res = await apiGet('/employees/dashboard/stats')
  return res?.data || null
}

export const getEmployeesDropdown = async () => {
  const res = await apiGet('/employees/dropdown')
  return res?.data || { photographers: [], videographers: [], editors: [], all: [] }
}
