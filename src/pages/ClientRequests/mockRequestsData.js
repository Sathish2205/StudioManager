export const MOCK_CLIENT_REQUESTS = [
  {
    id: 'REQ-301',
    clientName: 'Sathish & Priya Kumar',
    eventName: 'Royal Heritage Wedding',
    requestType: 'Photo Replacement',
    title: 'Swap 3 Photos on Album Page 12 & 14',
    description: 'Please replace photo #142 with #148 and add warm color grading on group photo.',
    priority: 'High',
    assignedTo: 'Arun Retoucher',
    createdDate: '2026-08-07',
    dueDate: '2026-08-11',
    status: 'Processing',
    timeline: [
      { stage: 'Submitted', date: 'Aug 07, 09:00 AM', by: 'Client Sathish' },
      { stage: 'In Review', date: 'Aug 07, 10:30 AM', by: 'Studio Manager' },
      { stage: 'Assigned', date: 'Aug 07, 11:00 AM', by: 'Arun Retoucher' },
      { stage: 'Processing', date: 'Aug 07, 02:00 PM', by: 'Arun Retoucher' }
    ]
  },
  {
    id: 'REQ-302',
    clientName: 'Sophia & James Sterling',
    eventName: 'Sophia & James Wedding',
    requestType: 'Video Revision',
    title: 'Change Teaser Background Music Track',
    description: 'Requesting soft instrumental track instead of pop audio for 60s Reel.',
    priority: 'Medium',
    assignedTo: 'Deepa Editor',
    createdDate: '2026-08-05',
    dueDate: '2026-08-09',
    status: 'Client Review',
    timeline: [
      { stage: 'Submitted', date: 'Aug 05, 02:00 PM', by: 'Client Sophia' },
      { stage: 'Assigned', date: 'Aug 05, 03:00 PM', by: 'Deepa Editor' },
      { stage: 'Client Review', date: 'Aug 06, 05:00 PM', by: 'Deepa Editor' }
    ]
  }
]
