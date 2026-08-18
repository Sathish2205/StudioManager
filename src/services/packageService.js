import { apiGet } from './apiClient'

// GET /api/settings/packages
export const getPackages = async () => {
  const result = await apiGet('/settings/packages')
  if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
    return result.data
  }
  return []
}
