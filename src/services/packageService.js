const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// GET /api/settings/packages
export const getPackages = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${API_BASE}/settings/packages`, { headers })
    if (res.ok) {
      const data = await res.json()
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data
      }
    }
  } catch (err) {
    console.warn('Backend packages unavailable, using fallback:', err.message)
  }

  return [
    { id: 'PKG-01', name: 'Royal Cinematic 4K', price: 850000 },
    { id: 'PKG-02', name: 'Heritage Multi-Day Gold', price: 620000 },
    { id: 'PKG-03', name: 'Destination Luxe Film', price: 1200000 },
    { id: 'PKG-04', name: 'Classic Memories Package', price: 350000 },
    { id: 'PKG-05', name: 'Signature Cinema + Album', price: 580000 }
  ]
}
