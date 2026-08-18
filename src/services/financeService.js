import { apiGet, apiPost } from './apiClient'

// GET /api/finance (Overview KPIs)
export const getFinanceOverview = async () => {
  const result = await apiGet('/finance')
  if (result && result.success && result.data) {
    return result.data
  }
  return null
}

// GET /api/payments
export const getPayments = async () => {
  const result = await apiGet('/payments?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// POST /api/payments
export const recordPayment = async (paymentData) => {
  const result = await apiPost('/payments', paymentData)
  if (result && result.success) {
    return result.data
  }
  return null
}

// GET /api/expenses
export const getExpenses = async () => {
  const result = await apiGet('/expenses?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return []
}

// POST /api/expenses
export const createExpense = async (expenseData) => {
  const result = await apiPost('/expenses', expenseData)
  if (result && result.success) {
    return result.data
  }
  return null
}
