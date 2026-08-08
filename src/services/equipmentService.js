import { apiGet } from './apiClient'

// GET /api/equipment
export const getEquipment = async () => {
  const result = await apiGet('/equipment?limit=50')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return null
}
