// POST /api/events
export const createEvent = async (eventData) => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    success: true,
    id: `EVT-${Date.now()}`,
    data: eventData
  }
}
