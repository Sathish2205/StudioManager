import { apiGet } from './apiClient'

// GET /api/dashboard
export const getDashboardData = async () => {
  const result = await apiGet('/dashboard')
  if (result && result.success && result.data) {
    return result.data
  }
  return null
}
