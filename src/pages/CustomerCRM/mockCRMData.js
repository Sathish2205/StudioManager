// Mock Customer CRM Dataset for Photo Studio Management System

export const MOCK_CRM_SUMMARY = {
  totalCustomers: 148,
  activeCustomers: 132,
  repeatCustomers: 64,
  upcomingBirthdays: 5,
  upcomingAnniversaries: 8,
  upcomingFollowups: 12,
  totalReferrals: 34,
  lifetimeRevenue: 8450000
}

export const MOCK_CUSTOMERS = [
  {
    id: 'CRM-1001',
    name: 'Sathish & Priya Kumar',
    gender: 'Couple / Family',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    mobile: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'sathish.priya@example.com',
    dob: '1992-05-14',
    anniversaryDate: '2024-11-20',
    address: '#42 Lotus Gardens, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    customerSince: '2024-01-15',
    customerType: 'VIP Regular',
    loyaltyLevel: 'Platinum',
    rewardPoints: 2450,
    status: 'Active',
    totalBookings: 4,
    lifetimeSpend: 685000,
    lastEvent: 'Royal Wedding (Nov 2024)',
    upcomingEvent: 'Baby Shower (Dec 2026)',
    familyInfo: {
      spouse: 'Priya Kumar',
      children: ['Rhea Kumar (Age 2)'],
      importantDates: [
        { label: 'Wedding Anniversary', date: '20-Nov' },
        { label: 'Priya Birthday', date: '14-May' },
        { label: 'Rhea Birthday', date: '04-Dec' }
      ]
    },
    preferences: {
      traditionalPhotography: true,
      candidPhotography: true,
      cinematicVideo: true,
      droneCoverage: true,
      outdoorShoot: true,
      indoorShoot: false,
      bwEditing: false,
      brightStyle: true,
      warmTone: true,
      matteStyle: false,
      notes: 'Customer prefers warm color grading, natural candid edits, and cinematic 4K video.'
    },
    eventsHistory: [
      {
        id: 'EVT-2024-089',
        type: 'Grand Wedding & Reception',
        date: '2024-11-20',
        package: 'Royal Cinematic 4K + Luxe Album',
        photographer: 'Alex V. & Lead Team',
        amount: 450000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered (Dec 2024)',
        rating: 5
      },
      {
        id: 'EVT-2024-012',
        type: 'Pre-Wedding Outdoor Shoot',
        date: '2024-09-10',
        package: 'Destination Pre-Wedding',
        photographer: 'Maya S.',
        amount: 120000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered',
        rating: 5
      },
      {
        id: 'EVT-2025-045',
        type: 'Maternity Portraits',
        date: '2025-06-15',
        package: 'Maternity Elegance',
        photographer: 'Elena R.',
        amount: 65000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered',
        rating: 5
      },
      {
        id: 'EVT-2026-008',
        type: 'Upcoming Baby Shower',
        date: '2026-12-10',
        package: 'Baby Shower & Family Film',
        photographer: 'Assigned Crew',
        amount: 50000,
        paymentStatus: 'Deposit Paid (50%)',
        albumDelivered: 'Pending Shoot',
        rating: 5
      }
    ],
    reminders: [
      { id: 'REM-1', type: 'Wedding Anniversary', date: '2026-11-20', status: 'Pending', note: 'Send anniversary flower bouquet & 10% discount gift code.' },
      { id: 'REM-2', type: 'Follow-up Call', date: '2026-11-25', status: 'Due Today', note: 'Confirm baby shower venue camera crew list.' }
    ],
    referrals: [
      { id: 'REF-101', name: 'Vikram & Ananya Sharma', mobile: '+91 98450 11223', status: 'Booked', bonus: '₹5,000 Voucher' },
      { id: 'REF-102', name: 'Kavya & Rahul Patel', mobile: '+91 97312 99887', status: 'Contacted', bonus: 'Pending Booking' }
    ],
    staffNotes: [
      { id: 'N-1', author: 'Sathish Manager', date: '2026-08-01', text: 'Spoke with Priya. They plan to book baby shower shoot in December.' },
      { id: 'N-2', author: 'Alex Lead Photographer', date: '2024-11-21', text: 'Loved the candid drone shots during reception.' }
    ],
    communications: [
      { id: 'COMM-1', type: 'WhatsApp', date: '2026-08-05 11:30 AM', text: 'Sent proposal quote for Baby Shower shoot in Dec 2026.' },
      { id: 'COMM-2', type: 'Phone Call', date: '2026-08-01 04:15 PM', text: 'Called Sathish regarding album pickup confirmation.' },
      { id: 'COMM-3', type: 'Email', date: '2024-12-01 10:00 AM', text: 'Tax invoice & final album link dispatched via email.' }
    ],
    documents: [
      { id: 'DOC-1', title: 'Wedding Booking Contract.pdf', date: '2024-09-01', size: '2.4 MB', type: 'Contract' },
      { id: 'DOC-2', title: 'Tax Invoice INV-2024-089.pdf', date: '2024-11-22', size: '480 KB', type: 'Invoice' },
      { id: 'DOC-3', title: 'Client ID Proof Aadhaar.pdf', date: '2024-09-01', size: '1.1 MB', type: 'ID Proof' }
    ]
  },
  {
    id: 'CRM-1002',
    name: 'Ananya & Vikram Sharma',
    gender: 'Couple',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    mobile: '+91 98450 11223',
    whatsapp: '+91 98450 11223',
    email: 'ananya.v@example.com',
    dob: '1994-08-15',
    anniversaryDate: '2025-02-14',
    address: 'Apt 502, Prestige Towers, M.G. Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    customerSince: '2024-10-05',
    customerType: 'Repeat',
    loyaltyLevel: 'Gold',
    rewardPoints: 1600,
    status: 'Active',
    totalBookings: 2,
    lifetimeSpend: 420000,
    lastEvent: 'Destination Wedding (Feb 2025)',
    upcomingEvent: '1st Anniversary Shoot (Feb 2026)',
    familyInfo: {
      spouse: 'Vikram Sharma',
      children: [],
      importantDates: [
        { label: 'Wedding Anniversary', date: '14-Feb' },
        { label: 'Ananya Birthday', date: '15-Aug' }
      ]
    },
    preferences: {
      traditionalPhotography: false,
      candidPhotography: true,
      cinematicVideo: true,
      droneCoverage: true,
      outdoorShoot: true,
      indoorShoot: true,
      bwEditing: true,
      brightStyle: false,
      warmTone: true,
      matteStyle: true,
      notes: 'Customer prefers editorial B&W portraits and cinematic slow-motion video.'
    },
    eventsHistory: [
      {
        id: 'EVT-2025-009',
        type: 'Destination Wedding (Goa)',
        date: '2025-02-14',
        package: 'Destination Luxe Film',
        photographer: 'Marco K. & Elena R.',
        amount: 350000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered',
        rating: 5
      },
      {
        id: 'EVT-2024-104',
        type: 'Engagement Shoot',
        date: '2024-10-20',
        package: 'Classic Memories',
        photographer: 'Maya S.',
        amount: 70000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered',
        rating: 5
      }
    ],
    reminders: [
      { id: 'REM-3', type: 'Birthday Wish', date: '2026-08-15', status: 'Due Soon', note: 'Send Ananya Birthday wish & complementary photo frame voucher.' }
    ],
    referrals: [],
    staffNotes: [
      { id: 'N-3', author: 'Elena Photographer', date: '2025-02-15', text: 'Goa sunset beach shoot was a massive success!' }
    ],
    communications: [
      { id: 'COMM-4', type: 'WhatsApp', date: '2025-03-01 02:00 PM', text: 'Shared online proofing gallery password with Ananya.' }
    ],
    documents: [
      { id: 'DOC-4', title: 'Goa Wedding Contract.pdf', date: '2024-10-05', size: '3.1 MB', type: 'Contract' }
    ]
  },
  {
    id: 'CRM-1003',
    name: 'Rohan & Neha Kapur',
    gender: 'Couple',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mobile: '+91 97311 88442',
    whatsapp: '+91 97311 88442',
    email: 'rohan.kapur@example.com',
    dob: '1990-11-03',
    anniversaryDate: '2023-12-08',
    address: 'Villa 18, Palm Meadows, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    customerSince: '2023-11-01',
    customerType: 'Regular',
    loyaltyLevel: 'Silver',
    rewardPoints: 950,
    status: 'Active',
    totalBookings: 2,
    lifetimeSpend: 280000,
    lastEvent: 'Birthday Gala (Nov 2025)',
    upcomingEvent: 'None',
    familyInfo: {
      spouse: 'Neha Kapur',
      children: ['Aarav Kapur (Age 1)'],
      importantDates: [
        { label: 'Wedding Anniversary', date: '08-Dec' },
        { label: 'Rohan Birthday', date: '03-Nov' }
      ]
    },
    preferences: {
      traditionalPhotography: true,
      candidPhotography: true,
      cinematicVideo: false,
      droneCoverage: false,
      outdoorShoot: false,
      indoorShoot: true,
      bwEditing: false,
      brightStyle: true,
      warmTone: false,
      matteStyle: false,
      notes: 'Prefers bright studio lighting for indoor family portraits.'
    },
    eventsHistory: [
      {
        id: 'EVT-2023-090',
        type: 'Wedding Ceremony',
        date: '2023-12-08',
        package: 'Heritage Multi-Day Gold',
        photographer: 'Alex V.',
        amount: 220000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered',
        rating: 4
      },
      {
        id: 'EVT-2025-081',
        type: 'First Birthday Bash',
        date: '2025-11-03',
        package: 'Kids Birthday Special',
        photographer: 'David P.',
        amount: 60000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered',
        rating: 5
      }
    ],
    reminders: [
      { id: 'REM-4', type: 'Follow-up Call', date: '2026-08-10', status: 'Due Today', note: 'Check if Rohan needs photography coverage for upcoming corporate event.' }
    ],
    referrals: [],
    staffNotes: [],
    communications: [],
    documents: []
  },
  {
    id: 'CRM-1004',
    name: 'Kavya & Rahul Patel',
    gender: 'Couple',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    mobile: '+91 99001 22334',
    whatsapp: '+91 99001 22334',
    email: 'kavya.patel@example.com',
    dob: '1995-03-22',
    anniversaryDate: '2026-01-18',
    address: 'B-401, Sun City Apartments, Outer Ring Rd',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    customerSince: '2025-12-10',
    customerType: 'New',
    loyaltyLevel: 'Bronze',
    rewardPoints: 300,
    status: 'Active',
    totalBookings: 1,
    lifetimeSpend: 185000,
    lastEvent: 'Wedding Ceremony (Jan 2026)',
    upcomingEvent: 'None',
    familyInfo: {
      spouse: 'Rahul Patel',
      children: [],
      importantDates: [
        { label: 'Wedding Anniversary', date: '18-Jan' }
      ]
    },
    preferences: {
      traditionalPhotography: true,
      candidPhotography: true,
      cinematicVideo: true,
      droneCoverage: true,
      outdoorShoot: true,
      indoorShoot: true,
      bwEditing: false,
      brightStyle: true,
      warmTone: true,
      matteStyle: false,
      notes: 'Customer requested 4K drone footage of garland exchange.'
    },
    eventsHistory: [
      {
        id: 'EVT-2026-004',
        type: 'Wedding & Reception',
        date: '2026-01-18',
        package: 'Royal Cinematic 4K',
        photographer: 'Elena R.',
        amount: 185000,
        paymentStatus: 'Paid in Full',
        albumDelivered: 'Delivered',
        rating: 5
      }
    ],
    reminders: [],
    referrals: [],
    staffNotes: [],
    communications: [],
    documents: []
  }
]

export const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Ananya Sharma Birthday on Aug 15', type: 'birthday', icon: 'pi pi-gift', color: '#ec4899' },
  { id: 2, text: 'Follow-up due today for Sathish & Priya', type: 'followup', icon: 'pi pi-phone', color: '#0284c7' },
  { id: 3, text: 'New Customer Referral recorded by Sathish', type: 'referral', icon: 'pi pi-users', color: '#16a34a' }
]

export const MOCK_ANALYTICS_DATA = {
  monthlyAcquisition: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 16 },
    { month: 'Mar', count: 14 },
    { month: 'Apr', count: 20 },
    { month: 'May', count: 18 },
    { month: 'Jun', count: 22 },
    { month: 'Jul', count: 26 },
    { month: 'Aug', count: 20 }
  ],
  sources: [
    { label: 'Word of Mouth / Referral', percent: 45 },
    { label: 'Instagram / Social Media', percent: 30 },
    { label: 'Google Search / Maps', percent: 15 },
    { label: 'Studio Walk-in', percent: 10 }
  ],
  loyaltyBreakdown: [
    { level: 'Platinum', count: 18, color: '#9333ea' },
    { level: 'Gold', count: 42, color: '#eab308' },
    { level: 'Silver', count: 54, color: '#94a3b8' },
    { level: 'Bronze', count: 34, color: '#b45309' }
  ]
}
