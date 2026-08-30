import { apiGet, apiPost, apiDelete } from './apiClient'

// GET /api/packages
export const getPackages = async () => {
  const result = await apiGet('/packages')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// POST /api/packages
export const createPackage = async (pkgData) => {
  const result = await apiPost('/packages', pkgData)
  if (result && result.success && result.data) {
    return result.data
  }
  if (result && result.message) {
    throw new Error(result.message)
  }
  throw new Error('Failed to save package')
}

// DELETE /api/packages/:id
export const deletePackage = async (id) => {
  const result = await apiDelete(`/packages/${id}`)
  return result
}
