export const MOCK_PACKAGES = [
  {
    id: 'PKG-01',
    name: 'Premium Wedding Package',
    price: 150000,
    duration: '2 Days',
    photographers: 2,
    videographers: 2,
    albumPages: 40,
    description: 'Complete 2-day wedding & reception coverage with candid photography and cinematic 4K video.',
    deliverables: ['Candid Photography', 'Traditional Photography', 'Wedding Film', '40 Page Album', 'Pre-wedding Shoot']
  },
  {
    id: 'PKG-02',
    name: 'Royal Heritage Grand Wedding',
    price: 250000,
    duration: '3 Days',
    photographers: 3,
    videographers: 3,
    albumPages: 60,
    description: 'Grand royal wedding package with drone coverage, 60-page premium leather album, and teaser reel.',
    deliverables: ['Drone Aerial Coverage', '3 Lead Photographers', '4K Cinematic Film', '60 Page Leather Album', 'Trailer Reel']
  },
  {
    id: 'PKG-03',
    name: 'Cinematic Pre-Wedding Shoot',
    price: 65000,
    duration: '1 Day',
    photographers: 1,
    videographers: 1,
    albumPages: 20,
    description: 'Outdoor sunset pre-wedding shoot with 1-minute Instagram teaser and 20-page mini album.',
    deliverables: ['Outdoor Sunset Location', '1-Min Reel', '20 Page Album', 'Soft Copy Drive']
  }
]

export const MOCK_ADDONS = [
  { id: 'ADD-01', name: '4K Drone Aerial Coverage', price: 15000, status: 'Active', description: '3 hours drone pilot coverage' },
  { id: 'ADD-02', name: 'Extra Traditional Photographer', price: 12000, status: 'Active', description: '1 full day additional photographer' },
  { id: 'ADD-03', name: 'Same-day Edit Teaser Video', price: 20000, status: 'Active', description: 'Edited 60s teaser shown at evening reception' },
  { id: 'ADD-04', name: 'Extra 20 Album Pages', price: 10000, status: 'Active', description: 'Flush mount premium pages' }
]

export const MOCK_QUOTES = [
  {
    quoteNo: 'QUO-2026-101',
    clientName: 'Arun & Priya',
    eventName: 'Arun & Priya Destination Wedding',
    packageName: 'Premium Wedding Package',
    addOns: ['4K Drone Aerial Coverage', 'Same-day Edit Teaser Video'],
    subtotal: 185000,
    discount: 10000,
    tax: 31500,
    total: 206500,
    validUntil: '2026-08-30',
    status: 'Approved'
  },
  {
    quoteNo: 'QUO-2026-102',
    clientName: 'Vikram & Ananya',
    eventName: 'Sangeet & Cocktail Party',
    packageName: 'Cinematic Pre-Wedding Shoot',
    addOns: [],
    subtotal: 65000,
    discount: 5000,
    tax: 10800,
    total: 70800,
    validUntil: '2026-08-25',
    status: 'Sent'
  }
]
