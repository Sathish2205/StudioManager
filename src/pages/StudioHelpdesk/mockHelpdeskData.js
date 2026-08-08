export const MOCK_HELPDESK_METRICS = {
  openTickets: 5,
  highPriority: 2,
  inProgress: 3,
  waiting: 1,
  resolved: 18
}

export const MOCK_TICKETS = [
  {
    id: 'TCK-901',
    title: 'SD Card Corruption Recovery Request',
    description: 'Memory Card #4 from Sophia Wedding Sangeet shoot has unreadable RAW files on Slot 2.',
    category: 'Equipment',
    priority: 'Critical',
    createdBy: 'Alex Vance',
    assignedTo: 'Technical Support',
    createdDate: '2026-08-07',
    dueDate: '2026-08-09',
    status: 'In Progress',
    comments: [
      { user: 'Alex Vance', time: 'Aug 07, 10:30 AM', text: 'Sent SD card to data recovery lab.' },
      { user: 'Tech Support', time: 'Aug 07, 02:15 PM', text: '95% of RAW files recovered successfully.' }
    ]
  },
  {
    id: 'TCK-902',
    title: 'Drone Calibration Error on Gimbal',
    description: 'DJI Mavic 3 Cine showing compass error during outdoor pre-wedding flight.',
    category: 'Technical',
    priority: 'High',
    createdBy: 'Marco K.',
    assignedTo: 'Equipment Manager',
    createdDate: '2026-08-06',
    dueDate: '2026-08-10',
    status: 'Open',
    comments: [
      { user: 'Marco K.', time: 'Aug 06, 04:00 PM', text: 'Firmware update required.' }
    ]
  },
  {
    id: 'TCK-903',
    title: 'GST Tax Invoice Printing Alignment Fix',
    description: 'Invoice layout margin adjustment for GSTIN header printing.',
    category: 'Finance',
    priority: 'Medium',
    createdBy: 'Sathish Manager',
    assignedTo: 'IT Support',
    createdDate: '2026-08-04',
    dueDate: '2026-08-12',
    status: 'Resolved',
    comments: [
      { user: 'IT Support', time: 'Aug 05, 11:00 AM', text: 'CSS printing styles updated.' }
    ]
  }
]
