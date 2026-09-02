import { apiGet, apiPost, apiPut } from './apiClient'

/**
 * Fetch aggregated workflow summaries (one per event) for the Workflow Management table.
 * Returns event-level workflow data with client info, payment summary, etc.
 */
export const fetchWorkflowSummaries = async () => {
  const result = await apiGet('/workflows/summaries')
  if (result && result.success && result.data) {
    return result.data
  }
  return []
}

/**
 * Fetch all workflow stages for a specific event.
 */
export const fetchWorkflowsByEvent = async (eventId) => {
  const result = await apiGet(`/workflows/${eventId}`)
  if (result && result.success && result.data) {
    return result.data
  }
  return null
}

/**
 * Update a workflow's stage, status, and editor by event ID.
 * Used by the Workflow Management dialog "Save & Apply Changes".
 */
export const updateWorkflowByEvent = async (eventId, data) => {
  const result = await apiPut(`/workflows/event/${eventId}`, data)
  if (result && result.success) {
    return result.data
  }
  return null
}

/**
 * Update a specific workflow stage document by its _id.
 */
export const updateWorkflowStage = async (id, data) => {
  const result = await apiPut(`/workflows/stage/${id}`, data)
  if (result && result.success) {
    return result.data
  }
  return null
}

/**
 * Create a new workflow entry for an event.
 * Called automatically when a new event is booked via the EventForm.
 */
export const createWorkflow = async (workflowData) => {
  const result = await apiPost('/workflows', workflowData)
  if (result && result.success) {
    return result.data
  }
  return null
}
