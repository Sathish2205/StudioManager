// GET /api/clients
export const getClients = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    { id: 'CLI-101', name: 'Sathish & Priya', mobile: '+91 98765 43210', label: 'Sathish & Priya (+91 98765 43210)' },
    { id: 'CLI-102', name: 'Sophia & James Sterling', mobile: '+1 (555) 234-5678', label: 'Sophia & James Sterling (+1 555-234-5678)' },
    { id: 'CLI-103', name: 'Priya & Rohan Sharma', mobile: '+91 99887 76655', label: 'Priya & Rohan Sharma (+91 99887 76655)' },
    { id: 'CLI-104', name: 'Aarav & Ananya Mehta', mobile: '+91 91234 56789', label: 'Aarav & Ananya Mehta (+91 91234 56789)' },
    { id: 'CLI-105', name: 'Chloe & Nathaniel Dupont', mobile: '+33 6 12 34 56 78', label: 'Chloe & Nathaniel Dupont (+33 6 12 34 56 78)' }
  ]
}
