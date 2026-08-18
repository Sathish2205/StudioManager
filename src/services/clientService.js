import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// GET /api/clients
export const getClients = async () => {
  const result = await apiGet('/clients?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// GET /api/clients/dropdown
export const getClientsDropdown = async () => {
  const result = await apiGet('/clients/dropdown')
  if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
    return result.data
  }
  return []
}

// POST /api/clients
export const createClient = async (clientData) => {
  const result = await apiPost('/clients', clientData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/clients/:id
export const updateClient = async (id, clientData) => {
  const result = await apiPut(`/clients/${id}`, clientData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// DELETE /api/clients/:id
export const deleteClient = async (id) => {
  const result = await apiDelete(`/clients/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}
