import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// GET /api/equipment
export const getEquipment = async () => {
  const result = await apiGet('/equipment?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// POST /api/equipment
export const createEquipment = async (data) => {
  const result = await apiPost('/equipment', data)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/equipment/:id
export const updateEquipment = async (id, data) => {
  const result = await apiPut(`/equipment/${id}`, data)
  if (result && result.success) {
    return result.data
  }
  return null
}

// DELETE /api/equipment/:id
export const deleteEquipment = async (id) => {
  const result = await apiDelete(`/equipment/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}
