import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

const LOCAL_STORAGE_KEY = 'studio_invoices'

const getLocalInvoices = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const saveLocalInvoices = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Failed to save invoices to localStorage:', err)
  }
}

// GET /api/invoices
export const getInvoices = async () => {
  const result = await apiGet('/invoices?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return getLocalInvoices()
}

// GET /api/invoices/:id
export const getInvoiceById = async (id) => {
  if (!id) return null
  const result = await apiGet(`/invoices/${id}`)
  if (result && result.success && result.data) {
    return result.data
  }
  const local = getLocalInvoices()
  return local.find((inv) => inv._id === id || inv.id === id || inv.invoiceNumber === id) || null
}

// POST /api/invoices
export const createInvoice = async (invoiceData) => {
  const result = await apiPost('/invoices', invoiceData)
  if (result && result.success && result.data) {
    return result.data
  }
  // Fallback to local creation
  const local = getLocalInvoices()
  const year = new Date().getFullYear()
  const invoiceNumber = invoiceData.invoiceNumber || `INV-${year}-${String(local.length + 1).padStart(3, '0')}`
  const newInvoice = {
    _id: `LOCAL-INV-${Date.now()}`,
    ...invoiceData,
    invoiceNumber,
    createdAt: new Date().toISOString(),
    totalPaid: invoiceData.totalPaid || 0,
    balance: invoiceData.grandTotal ? invoiceData.grandTotal - (invoiceData.totalPaid || 0) : 0,
    status: invoiceData.status || 'Issued',
    payments: invoiceData.payments || []
  }
  const updated = [newInvoice, ...local]
  saveLocalInvoices(updated)
  return newInvoice
}

// PUT /api/invoices/:id
export const updateInvoice = async (id, invoiceData) => {
  const result = await apiPut(`/invoices/${id}`, invoiceData)
  if (result && result.success && result.data) {
    return result.data
  }
  const local = getLocalInvoices()
  const updated = local.map((inv) => ((inv._id === id || inv.id === id) ? { ...inv, ...invoiceData } : inv))
  saveLocalInvoices(updated)
  return updated.find((inv) => inv._id === id || inv.id === id) || null
}

// PUT /api/invoices/:id/status
export const updateInvoiceStatus = async (id, status) => {
  const result = await apiPut(`/invoices/${id}/status`, { status })
  if (result && result.success) {
    return result.data
  }
  const local = getLocalInvoices()
  const updated = local.map((inv) => ((inv._id === id || inv.id === id) ? { ...inv, status } : inv))
  saveLocalInvoices(updated)
  return updated.find((inv) => inv._id === id || inv.id === id) || null
}

// DELETE /api/invoices/:id
export const deleteInvoice = async (id) => {
  const result = await apiDelete(`/invoices/${id}`)
  if (result && result.success) {
    return true
  }
  const local = getLocalInvoices()
  const filtered = local.filter((inv) => inv._id !== id && inv.id !== id)
  saveLocalInvoices(filtered)
  return true
}
