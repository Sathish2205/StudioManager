export const MOCK_KANBAN_TASKS = [
  {
    id: 'TSK-201',
    eventId: 'EVT-2026-001',
    eventName: 'Sophia & James Wedding',
    clientName: 'Sophia & James Sterling',
    assignedEditor: 'Deepa (Lead Editor)',
    deliverableType: 'Edited Photos',
    photosTotal: 1200,
    photosCompleted: 850,
    progress: 70,
    deadline: '2026-08-14',
    priority: 'High',
    status: 'Editing',
    notes: 'Color tone warming requested for evening reception photos.'
  },
  {
    id: 'TSK-202',
    eventId: 'EVT-2026-001',
    eventName: 'Sophia & James Wedding',
    clientName: 'Sophia & James Sterling',
    assignedEditor: 'Rahul Video Editor',
    deliverableType: 'Wedding Video',
    photosTotal: 1,
    photosCompleted: 0,
    progress: 40,
    deadline: '2026-08-18',
    priority: 'High',
    status: 'Culling',
    notes: 'Selecting background music tracks for 4K film.'
  },
  {
    id: 'TSK-203',
    eventId: 'EVT-2026-002',
    eventName: 'Priya & Rohan Sangeet',
    clientName: 'Priya & Rohan Sharma',
    assignedEditor: 'Arun Retoucher',
    deliverableType: 'Teaser',
    photosTotal: 30,
    photosCompleted: 30,
    progress: 100,
    deadline: '2026-08-10',
    priority: 'Urgent',
    status: 'Client Review',
    notes: 'Instagram 60-second Teaser Reel sent to client.'
  },
  {
    id: 'TSK-204',
    eventId: 'EVT-2026-003',
    eventName: 'Olivia & Liam Pre-Wedding',
    clientName: 'Olivia & Liam Vance',
    assignedEditor: 'Deepa (Lead Editor)',
    deliverableType: 'Album',
    photosTotal: 40,
    photosCompleted: 40,
    progress: 90,
    deadline: '2026-08-22',
    priority: 'Medium',
    status: 'Internal Review',
    notes: 'Album layout 40 pages ready for studio manager signoff.'
  },
  {
    id: 'TSK-205',
    eventId: 'EVT-2026-004',
    eventName: 'Aarav & Ananya Muhurtham',
    clientName: 'Aarav & Ananya Mehta',
    assignedEditor: 'Arun Retoucher',
    deliverableType: 'Highlight Video',
    photosTotal: 1,
    photosCompleted: 1,
    progress: 100,
    deadline: '2026-08-05',
    priority: 'Medium',
    status: 'Delivered',
    notes: 'USB drive & cloud drive link delivered.'
  }
]

export const KANBAN_STAGES = [
  'New',
  'Culling',
  'Editing',
  'Internal Review',
  'Client Review',
  'Revision',
  'Approved',
  'Delivered'
]
