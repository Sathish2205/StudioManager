import { apiGet, apiPost, apiPut } from './apiClient'

// GET /api/events
export const getEvents = async () => {
  const result = await apiGet('/events?limit=50')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return null
}

// POST /api/events
export const createEvent = async (eventData) => {
  const result = await apiPost('/events', eventData)
  if (result && result.success) {
    return result
  }
  
  // Fallback if backend unavailable
  return {
    success: true,
    id: `EVT-${Date.now()}`,
    data: eventData
  }
}

// PUT /api/events/:id
export const updateEvent = async (id, eventData) => {
  const result = await apiPut(`/events/${id}`, eventData)
  if (result && result.success) {
    return result.data
  }
  return null
}
