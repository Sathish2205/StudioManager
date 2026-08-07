// GET /api/staff
export const getStaff = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))
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
