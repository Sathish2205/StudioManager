import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// GET /api/tasks
export const getTasks = async () => {
  const result = await apiGet('/tasks?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// POST /api/tasks
export const createTask = async (taskData) => {
  const result = await apiPost('/tasks', taskData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// PUT /api/tasks/:id
export const updateTask = async (id, taskData) => {
  const result = await apiPut(`/tasks/${id}`, taskData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// DELETE /api/tasks/:id
export const deleteTask = async (id) => {
  const result = await apiDelete(`/tasks/${id}`)
  if (result && result.success) {
    return true
  }
  return false
}
