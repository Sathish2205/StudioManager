import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './apiClient'

// GET /api/events
export const getEvents = async () => {
  const result = await apiGet('/events?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// GET /api/events/:id
export const getEventById = async (id) => {
  const result = await apiGet(`/events/${id}`)
  if (result && result.success && result.data) {
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
  if (result && result.message) {
    throw new Error(result.message)
  }
  throw new Error('Failed to create event document')
}

// PUT /api/events/:id
export const updateEvent = async (id, eventData) => {
  const result = await apiPut(`/events/${id}`, eventData)
  if (result && result.success) {
    return result.data
  }
  if (result && result.message) {
    throw new Error(result.message)
  }
  throw new Error('Failed to update event document')
}

// PATCH /api/events/:id/workflow/stage
export const updateEventWorkflowStage = async (id, stage) => {
  const result = await apiPatch(`/events/${id}/workflow/stage`, { stage })
  if (result && result.success) {
    return result.data
  }
  if (result && result.message) {
    throw new Error(result.message)
  }
  throw new Error('Failed to update workflow stage')
}

// PATCH /api/events/:id/workflow
export const updateEventWorkflow = async (id, workflow) => {
  const result = await apiPatch(`/events/${id}/workflow`, { workflow })
  if (result && result.success) {
    return result.data
  }
  if (result && result.message) {
    throw new Error(result.message)
  }
  throw new Error('Failed to update event workflow')
}

// DELETE /api/events/:id
export const deleteEvent = async (id) => {
  const result = await apiDelete(`/events/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}
