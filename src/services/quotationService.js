import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

const LOCAL_STORAGE_KEY = 'studio_quotations'

const getLocalQuotations = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const saveLocalQuotations = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Failed to save quotations to localStorage:', err)
  }
}

// GET /api/quotations
export const getQuotations = async () => {
  const result = await apiGet('/quotations?limit=100')
  if (result && result.success && Array.isArray(result.data)) {
    return result.data
  }
  return getLocalQuotations()
}

// GET /api/quotations/:id
export const getQuotationById = async (id) => {
  if (!id) return null
  const result = await apiGet(`/quotations/${id}`)
  if (result && result.success && result.data) {
    return result.data
  }
  const local = getLocalQuotations()
  return local.find((q) => q._id === id || q.id === id || q.quotationNumber === id) || null
}

// POST /api/quotations
export const createQuotation = async (quotationData) => {
  const result = await apiPost('/quotations', quotationData)
  if (result && result.success && result.data) {
    return result.data
  }
  // Fallback to local creation
  const local = getLocalQuotations()
  const year = new Date().getFullYear()
  const quotationNumber = quotationData.quotationNumber || `QT-${year}-${String(local.length + 1).padStart(3, '0')}`
  const newQuotation = {
    _id: `LOCAL-QT-${Date.now()}`,
    ...quotationData,
    quotationNumber,
    createdAt: new Date().toISOString(),
    status: quotationData.status || 'Draft'
  }
  const updated = [newQuotation, ...local]
  saveLocalQuotations(updated)
  return newQuotation
}

// PUT /api/quotations/:id
export const updateQuotation = async (id, quotationData) => {
  const result = await apiPut(`/quotations/${id}`, quotationData)
  if (result && result.success && result.data) {
    return result.data
  }
  const local = getLocalQuotations()
  const updated = local.map((q) => ((q._id === id || q.id === id) ? { ...q, ...quotationData } : q))
  saveLocalQuotations(updated)
  return updated.find((q) => q._id === id || q.id === id) || null
}

// PUT /api/quotations/:id/status
export const updateQuotationStatus = async (id, status) => {
  const result = await apiPut(`/quotations/${id}/status`, { status })
  if (result && result.success) {
    return result.data
  }
  const local = getLocalQuotations()
  const updated = local.map((q) => ((q._id === id || q.id === id) ? { ...q, status } : q))
  saveLocalQuotations(updated)
  return updated.find((q) => q._id === id || q.id === id) || null
}

// POST /api/quotations/:id/convert
export const convertQuotationToInvoice = async (id) => {
  const result = await apiPost(`/quotations/${id}/convert`, {})
  if (result && result.success && result.data) {
    return result.data
  }
  // Local fallback conversion
  const quotation = await getQuotationById(id)
  if (!quotation) return null

  const localInvoices = JSON.parse(localStorage.getItem('studio_invoices') || '[]')
  const year = new Date().getFullYear()
  const invoiceNumber = `INV-${year}-${String(localInvoices.length + 1).padStart(3, '0')}`

  const newInvoice = {
    _id: `LOCAL-INV-${Date.now()}`,
    invoiceNumber,
    quotationId: quotation._id || quotation.id,
    clientId: quotation.clientId,
    eventId: quotation.eventId,
    clientName: quotation.clientName || (typeof quotation.clientId === 'object' ? `${quotation.clientId.firstName || ''} ${quotation.clientId.lastName || ''}`.trim() : ''),
    eventName: quotation.eventName || (typeof quotation.eventId === 'object' ? quotation.eventId.eventName : ''),
    services: quotation.services || [],
    subtotal: quotation.subtotal || 0,
    discount: quotation.discount || 0,
    taxPercent: quotation.taxPercent || 18,
    taxAmount: quotation.taxAmount || 0,
    grandTotal: quotation.grandTotal || 0,
    totalPaid: 0,
    balance: quotation.grandTotal || 0,
    status: 'Issued',
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    payments: []
  }

  localStorage.setItem('studio_invoices', JSON.stringify([newInvoice, ...localInvoices]))
  updateQuotationStatus(id, 'Accepted')
  return newInvoice
}

// DELETE /api/quotations/:id
export const deleteQuotation = async (id) => {
  const result = await apiDelete(`/quotations/${id}`)
  if (result && result.success) {
    return true
  }
  const local = getLocalQuotations()
  const filtered = local.filter((q) => q._id !== id && q.id !== id)
  saveLocalQuotations(filtered)
  return true
}
