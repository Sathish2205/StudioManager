import { apiGet, apiPost } from './apiClient'

// GET /api/clients
export const getClients = async () => {
  const result = await apiGet('/clients?limit=50')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return null
}

// GET /api/clients/dropdown
export const getClientsDropdown = async () => {
  const result = await apiGet('/clients/dropdown')
  if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
    return result.data
  }
  return null
}

// POST /api/clients
export const createClient = async (clientData) => {
  const result = await apiPost('/clients', clientData)
  if (result && result.success) {
    return result.data
  }
  return null
}
