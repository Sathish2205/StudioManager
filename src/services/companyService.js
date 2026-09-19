import { apiGet, apiPut } from './apiClient'

export const getCompanySettings = async () => {
  try {
    const res = await apiGet('/company')
    if (res && res.success) return res.data
    // Fallback to /settings
    const settingsRes = await apiGet('/settings')
    return settingsRes?.data || null
  } catch (err) {
    console.error('Failed to fetch company settings:', err)
    throw err
  }
}

export const updateCompanySettings = async (data) => {
  try {
    const res = await apiPut('/company', data)
    if (res && res.success) return res.data
    // Fallback to /settings
    const settingsRes = await apiPut('/settings', data)
    return settingsRes?.data || null
  } catch (err) {
    console.error('Failed to update company settings:', err)
    throw err
  }
}
