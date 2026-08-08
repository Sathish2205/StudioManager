const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// GET /api/employees/dropdown
export const getStaff = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${API_BASE}/employees/dropdown`, { headers })
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.data && data.data.photographers) {
        return data.data
      }
    }
  } catch (err) {
    console.warn('Backend staff unavailable, using fallback:', err.message)
  }

  return {
    photographers: [
      { id: 'STF-01', name: 'Alex Vance (Lead Photographer)' },
      { id: 'STF-02', name: 'Elena Rostova (Senior Photographer)' },
      { id: 'STF-03', name: 'Maya S. (Traditional Photographer)' }
    ],
    videographers: [
      { id: 'STF-04', name: 'David P. (Cinematic Videographer)' },
      { id: 'STF-05', name: 'Marco K. (Drone & Video Specialist)' },
      { id: 'STF-06', name: 'Sarah L. (Traditional Videographer)' }
    ]
  }
}
