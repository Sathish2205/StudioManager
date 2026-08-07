export const ALL_STAGES = [
  'Booking',
  'Advance Payment',
  'Event Assigned',
  'Event Completed',
  'Photo Backup',
  'Photo Selection',
  'Photo Editing',
  'Client Review',
  'Revision (Optional)',
  'Final Approval',
  'Album Design',
  'Album Approval',
  'Album Printing',
  'Frame Printing (Optional)',
  'Video Editing',
  'Video Rendering',
  'Deliverables Ready',
  'Balance Payment',
  'Delivered',
  'Completed'
]

export const MOCK_SUMMARY_METRICS = {
  totalWorkflows: 38,
  inEditing: 12,
  pendingApproval: 7,
  printing: 5,
  readyForDelivery: 4,
  deliveredToday: 3
}

export const MOCK_WORKFLOWS = [
  {
    id: 'WF-2026-0891',
    eventName: 'Ananya & Vikram Grand Wedding',
    clientName: 'Ananya Sharma',
    clientPhone: '+91 98765 43210',
    clientEmail: 'ananya.sharma@example.com',
    venue: 'Leela Palace Ballroom, Bengaluru',
    eventType: 'Wedding',
    eventDate: '2026-08-02',
    photographer: 'Sathish Kumar & Team',
    photographerTeamSize: 4,
    equipmentSet: 'Sony A7IV x 3, 70-200mm f2.8, Godox AD600Pro',
    assignedEditor: 'Rohan Verma (Lead)',
    videoEditor: 'Priya Sundaram',
    albumDesigner: 'Vikram Sethi',
    overallStatus: 'Editing',
    currentStageIndex: 6, // Photo Editing
    estimatedDeliveryDate: '2026-08-25',
    paymentSummary: {
      totalAmount: 185000,
      advancePaid: 75000,
      balanceDue: 110000,
      paymentStatus: 'Advance Received'
    },
    tasks: [
      { id: 'T-101', name: 'Photo Editing', assignedTo: 'Rohan Verma', priority: 'High', dueDate: '2026-08-12', status: 'In Progress', progress: 65 },
      { id: 'T-102', name: 'Video Editing', assignedTo: 'Priya Sundaram', priority: 'High', dueDate: '2026-08-15', status: 'In Progress', progress: 40 },
      { id: 'T-103', name: 'Album Design', assignedTo: 'Vikram Sethi', priority: 'Medium', dueDate: '2026-08-18', status: 'Pending', progress: 10 },
      { id: 'T-104', name: 'Album Printing', assignedTo: 'Print Lab Pro', priority: 'Normal', dueDate: '2026-08-21', status: 'Pending', progress: 0 },
      { id: 'T-105', name: 'Frame Printing', assignedTo: 'ArtFrame Works', priority: 'Low', dueDate: '2026-08-22', status: 'Pending', progress: 0 },
      { id: 'T-106', name: 'Quality Check', assignedTo: 'Sathish Kumar', priority: 'High', dueDate: '2026-08-23', status: 'Pending', progress: 0 },
      { id: 'T-107', name: 'Packaging', assignedTo: 'Studio Ops', priority: 'Normal', dueDate: '2026-08-24', status: 'Pending', progress: 0 }
    ],
    deliverables: [
      { id: 'D-01', name: 'Edited Photos', status: 'In Progress', completedDate: null, isAvailable: true, downloadUrl: '#', fileCount: '450 / 800 Photos' },
      { id: 'D-02', name: 'Album Design', status: 'Draft Ready', completedDate: null, isAvailable: true, downloadUrl: '#', fileCount: '40 Pages (PDF Draft)' },
      { id: 'D-03', name: 'Printed Album', status: 'Pending', completedDate: null, isAvailable: false, fileCount: 'Canvera Luxe Flush Mount' },
      { id: 'D-04', name: 'Highlight Video', status: 'In Progress', completedDate: null, isAvailable: true, downloadUrl: '#', fileCount: '4K Teaser (3 mins)' },
      { id: 'D-05', name: 'Full-Length Video', status: 'In Progress', completedDate: null, isAvailable: false, fileCount: '4K Full Film (45 mins)' },
      { id: 'D-06', name: 'Soft Copy', status: 'Ready', completedDate: '2026-08-04', isAvailable: true, downloadUrl: '#', fileCount: 'RAW + JPG High Res (120 GB)' },
      { id: 'D-07', name: 'Pendrive', status: 'Pending', completedDate: null, isAvailable: false, fileCount: 'Custom Engraved 128GB USB' },
      { id: 'D-08', name: 'Photo Frame', status: 'Pending', completedDate: null, isAvailable: false, fileCount: '24x36 Canvas Frame' },
      { id: 'D-09', name: 'Photo Book', status: 'Pending', completedDate: null, isAvailable: false, fileCount: 'Mini Parent Album (2 copies)' },
      { id: 'D-10', name: 'Cloud Upload', status: 'In Progress', completedDate: null, isAvailable: true, downloadUrl: '#', fileCount: 'Private Web Gallery' },
      { id: 'D-11', name: 'Client Delivery', status: 'Pending', completedDate: null, isAvailable: false, fileCount: 'Courier Box & Gift Bag' }
    ],
    activityLog: [
      { id: 'ACT-01', title: 'Booking Created', timestamp: '2026-07-10 10:30 AM', actor: 'Sathish Kumar', details: 'Client Ananya confirmed wedding photography package #3.' },
      { id: 'ACT-02', title: 'Advance Payment Received', timestamp: '2026-07-11 02:15 PM', actor: 'Finance Dept', details: '₹75,000 received via UPI Ref #UPI984210.' },
      { id: 'ACT-03', title: 'Photographer Team Assigned', timestamp: '2026-07-15 11:00 AM', actor: 'Studio Admin', details: 'Assigned Sathish Kumar (Lead) + 3 secondary shooters.' },
      { id: 'ACT-04', title: 'Event Shoot Completed', timestamp: '2026-08-02 11:45 PM', actor: 'Sathish Kumar', details: 'Wedding coverage completed with 4,200 RAW shots captured.' },
      { id: 'ACT-05', title: 'Photo Backup & Ingestion', timestamp: '2026-08-03 09:30 AM', actor: 'Rohan Verma', details: 'Backups created on NAS Storage Pool 2 & AWS Cloud S3.' },
      { id: 'ACT-06', title: 'Photo Selection Completed', timestamp: '2026-08-05 04:20 PM', actor: 'Ananya (Client)', details: '800 favorite shots selected via client portal.' },
      { id: 'ACT-07', title: 'Editing & Color Grading Started', timestamp: '2026-08-06 10:00 AM', actor: 'Rohan Verma', details: 'Lightroom preset applied, manual retouching ongoing.' }
    ],
    stageDetails: ALL_STAGES.map((stage, idx) => ({
      stage,
      status: idx < 6 ? 'Completed' : idx === 6 ? 'In Progress' : 'Pending',
      timestamp: idx < 6 ? '2026-08-05 04:20 PM' : null,
      assignedEmployee: idx < 6 ? 'Rohan Verma' : 'Unassigned',
      notes: idx < 6 ? 'Stage finished successfully.' : 'In progress or pending queue.'
    }))
  },
  {
    id: 'WF-2026-0892',
    eventName: 'Rohan 1st Birthday Celebration',
    clientName: 'Rajesh & Sneha Patel',
    clientPhone: '+91 98200 11223',
    clientEmail: 'rajesh.patel@example.com',
    venue: 'Grand Taj Banquet, Mumbai',
    eventType: 'Birthday',
    eventDate: '2026-08-04',
    photographer: 'Kavita Reddy',
    photographerTeamSize: 2,
    equipmentSet: 'Sony A7R V, 35mm f1.4, Speedlight',
    assignedEditor: 'Amit Roy',
    videoEditor: 'Amit Roy',
    albumDesigner: 'Vikram Sethi',
    overallStatus: 'Booking',
    currentStageIndex: 2, // Event Assigned
    estimatedDeliveryDate: '2026-08-18',
    paymentSummary: {
      totalAmount: 45000,
      advancePaid: 15000,
      balanceDue: 30000,
      paymentStatus: 'Advance Received'
    },
    tasks: [
      { id: 'T-201', name: 'Photo Editing', assignedTo: 'Amit Roy', priority: 'Medium', dueDate: '2026-08-10', status: 'Pending', progress: 0 },
      { id: 'T-202', name: 'Video Editing', assignedTo: 'Amit Roy', priority: 'Normal', dueDate: '2026-08-12', status: 'Pending', progress: 0 },
      { id: 'T-203', name: 'Album Design', assignedTo: 'Vikram Sethi', priority: 'Low', dueDate: '2026-08-14', status: 'Pending', progress: 0 },
      { id: 'T-204', name: 'Album Printing', assignedTo: 'Print Lab Pro', priority: 'Normal', dueDate: '2026-08-16', status: 'Pending', progress: 0 },
      { id: 'T-205', name: 'Quality Check', assignedTo: 'Sathish Kumar', priority: 'Medium', dueDate: '2026-08-17', status: 'Pending', progress: 0 }
    ],
    deliverables: [
      { id: 'D-201', name: 'Edited Photos', status: 'Pending', completedDate: null, isAvailable: false, fileCount: '250 Photos' },
      { id: 'D-202', name: 'Album Design', status: 'Pending', completedDate: null, isAvailable: false, fileCount: '20 Pages Album' },
      { id: 'D-203', name: 'Printed Album', status: 'Pending', completedDate: null, isAvailable: false, fileCount: '12x18 Photobook' },
      { id: 'D-204', name: 'Highlight Video', status: 'Pending', completedDate: null, isAvailable: false, fileCount: 'Birthday Reel (2 mins)' }
    ],
    activityLog: [
      { id: 'ACT-201', title: 'Booking Created', timestamp: '2026-07-28 03:00 PM', actor: 'Kavita Reddy', details: 'Birthday bash booking registered.' },
      { id: 'ACT-202', title: 'Advance Received', timestamp: '2026-07-29 11:30 AM', actor: 'Finance Dept', details: 'Advance ₹15,000 received.' }
    ],
    stageDetails: ALL_STAGES.map((stage, idx) => ({
      stage,
      status: idx < 2 ? 'Completed' : idx === 2 ? 'In Progress' : 'Pending',
      timestamp: idx < 2 ? '2026-07-29 11:30 AM' : null,
      assignedEmployee: idx < 2 ? 'Kavita Reddy' : 'Unassigned',
      notes: idx < 2 ? 'Stage finished.' : 'Awaiting event.'
    }))
  },
  {
    id: 'WF-2026-0893',
    eventName: 'Kapoor Family Grand Reception',
    clientName: 'Sunil Kapoor',
    clientPhone: '+91 99887 76655',
    clientEmail: 'sunil.kapoor@example.com',
    venue: 'JW Marriott, New Delhi',
    eventType: 'Reception',
    eventDate: '2026-07-25',
    photographer: 'Deepak Malhotra',
    photographerTeamSize: 3,
    equipmentSet: 'Canon R5 x 2, 85mm f1.2, Studio Strobe Kit',
    assignedEditor: 'Rohan Verma',
    videoEditor: 'Priya Sundaram',
    albumDesigner: 'Vikram Sethi',
    overallStatus: 'Completed',
    currentStageIndex: 19, // Completed
    estimatedDeliveryDate: '2026-08-05',
    paymentSummary: {
      totalAmount: 120000,
      advancePaid: 120000,
      balanceDue: 0,
      paymentStatus: 'Fully Paid'
    },
    tasks: [
      { id: 'T-301', name: 'Photo Editing', assignedTo: 'Rohan Verma', priority: 'High', dueDate: '2026-07-28', status: 'Completed', progress: 100 },
      { id: 'T-302', name: 'Video Editing', assignedTo: 'Priya Sundaram', priority: 'High', dueDate: '2026-07-30', status: 'Completed', progress: 100 },
      { id: 'T-303', name: 'Album Design', assignedTo: 'Vikram Sethi', priority: 'Medium', dueDate: '2026-08-01', status: 'Completed', progress: 100 }
    ],
    deliverables: [
      { id: 'D-301', name: 'Edited Photos', status: 'Delivered', completedDate: '2026-07-28', isAvailable: true, downloadUrl: '#', fileCount: '600 Photos' },
      { id: 'D-302', name: 'Album Design', status: 'Approved', completedDate: '2026-08-01', isAvailable: true, downloadUrl: '#', fileCount: '30 Pages PDF' },
      { id: 'D-303', name: 'Printed Album', status: 'Delivered', completedDate: '2026-08-03', isAvailable: true, downloadUrl: '#', fileCount: '1 Hardcover Album' }
    ],
    activityLog: [
      { id: 'ACT-301', title: 'Booking Created', timestamp: '2026-07-01 10:00 AM', actor: 'Deepak Malhotra', details: 'Reception photography contract created.' },
      { id: 'ACT-302', title: 'Delivered to Client', timestamp: '2026-08-05 11:00 AM', actor: 'Delivery Exec', details: 'Full project handed over.' }
    ],
    stageDetails: ALL_STAGES.map((stage) => ({
      stage,
      status: 'Completed',
      timestamp: '2026-08-05 11:00 AM',
      assignedEmployee: 'Deepak Malhotra',
      notes: 'Completed & signed off.'
    }))
  },
  {
    id: 'WF-2026-0894',
    eventName: 'Mehta Corporate Silver Jubilee',
    clientName: 'Sanjay Mehta',
    clientPhone: '+91 97654 32109',
    clientEmail: 'sanjay.mehta@mehtacorp.com',
    venue: 'ITC Gardenia, Bengaluru',
    eventType: 'Corporate',
    eventDate: '2026-08-06',
    photographer: 'Sathish Kumar',
    photographerTeamSize: 3,
    equipmentSet: 'Sony A7S III x 2, Ronin RS3 Gimbal, Wireless Mics',
    assignedEditor: 'Priya Sundaram',
    videoEditor: 'Priya Sundaram',
    albumDesigner: 'N/A',
    overallStatus: 'Editing',
    currentStageIndex: 14, // Video Editing
    estimatedDeliveryDate: '2026-08-16',
    paymentSummary: {
      totalAmount: 95000,
      advancePaid: 45000,
      balanceDue: 50000,
      paymentStatus: 'Advance Received'
    },
    tasks: [
      { id: 'T-401', name: 'Photo Editing', assignedTo: 'Rohan Verma', priority: 'High', dueDate: '2026-08-08', status: 'Completed', progress: 100 },
      { id: 'T-402', name: 'Video Editing', assignedTo: 'Priya Sundaram', priority: 'High', dueDate: '2026-08-12', status: 'In Progress', progress: 70 },
      { id: 'T-403', name: 'Quality Check', assignedTo: 'Sathish Kumar', priority: 'Medium', dueDate: '2026-08-14', status: 'Pending', progress: 0 }
    ],
    deliverables: [
      { id: 'D-401', name: 'Edited Photos', status: 'Ready', completedDate: '2026-08-08', isAvailable: true, downloadUrl: '#', fileCount: '350 Corporate Shots' },
      { id: 'D-402', name: 'Highlight Video', status: 'In Progress', completedDate: null, isAvailable: true, downloadUrl: '#', fileCount: '4K Event Recap' }
    ],
    activityLog: [
      { id: 'ACT-401', title: 'Corporate Gala Covered', timestamp: '2026-08-06 11:00 PM', actor: 'Sathish Kumar', details: 'Full corporate jubilee event recorded in 4K.' }
    ],
    stageDetails: ALL_STAGES.map((stage, idx) => ({
      stage,
      status: idx < 14 ? 'Completed' : idx === 14 ? 'In Progress' : 'Pending',
      timestamp: idx < 14 ? '2026-08-07 10:00 AM' : null,
      assignedEmployee: 'Priya Sundaram',
      notes: 'Corporate media processing.'
    }))
  },
  {
    id: 'WF-2026-0895',
    eventName: 'Pooja & Karthik Sangeet Night',
    clientName: 'Karthik Raja',
    clientPhone: '+91 94433 22110',
    clientEmail: 'karthik.raja@example.com',
    venue: 'Radisson Blu Resort, Mahabalipuram',
    eventType: 'Sangeet',
    eventDate: '2026-08-01',
    photographer: 'Deepak Malhotra',
    photographerTeamSize: 3,
    equipmentSet: 'Canon R6 II x 3, Godox Flashes',
    assignedEditor: 'Rohan Verma',
    videoEditor: 'Priya Sundaram',
    albumDesigner: 'Vikram Sethi',
    overallStatus: 'Delivered',
    currentStageIndex: 18, // Delivered
    estimatedDeliveryDate: '2026-08-10',
    paymentSummary: {
      totalAmount: 110000,
      advancePaid: 110000,
      balanceDue: 0,
      paymentStatus: 'Fully Paid'
    },
    tasks: [
      { id: 'T-501', name: 'Photo Editing', assignedTo: 'Rohan Verma', priority: 'High', dueDate: '2026-08-04', status: 'Completed', progress: 100 },
      { id: 'T-502', name: 'Video Editing', assignedTo: 'Priya Sundaram', priority: 'High', dueDate: '2026-08-06', status: 'Completed', progress: 100 }
    ],
    deliverables: [
      { id: 'D-501', name: 'Edited Photos', status: 'Delivered', completedDate: '2026-08-04', isAvailable: true, downloadUrl: '#', fileCount: '500 Photos' },
      { id: 'D-502', name: 'Highlight Video', status: 'Delivered', completedDate: '2026-08-06', isAvailable: true, downloadUrl: '#', fileCount: 'Sangeet Teaser Reel' }
    ],
    activityLog: [
      { id: 'ACT-501', title: 'Sangeet Media Delivered', timestamp: '2026-08-07 02:00 PM', actor: 'Deepak Malhotra', details: 'All digital files delivered online.' }
    ],
    stageDetails: ALL_STAGES.map((stage) => ({
      stage,
      status: 'Completed',
      timestamp: '2026-08-07 02:00 PM',
      assignedEmployee: 'Deepak Malhotra',
      notes: 'Delivered to client.'
    }))
  }
]
