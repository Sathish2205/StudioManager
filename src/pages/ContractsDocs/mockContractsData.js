export const MOCK_CONTRACTS = [
  {
    contractNo: 'CTR-2026-801',
    clientName: 'Sophia & James Sterling',
    eventName: 'Sophia & James Wedding',
    contractType: 'Master Wedding Agreement',
    createdDate: '2026-07-15',
    startDate: '2026-08-12',
    endDate: '2026-08-13',
    amount: 200600,
    status: 'Signed',
    notes: 'Signed via Digital E-Sign on July 18.'
  },
  {
    contractNo: 'CTR-2026-802',
    clientName: 'Priya & Rohan Sharma',
    eventName: 'Priya & Rohan Sangeet',
    contractType: 'Event Photography Agreement',
    createdDate: '2026-07-20',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    amount: 135700,
    status: 'Active',
    notes: 'Advance received, contract active.'
  }
]

export const MOCK_DOCUMENTS = [
  {
    id: 'DOC-501',
    name: 'Sophia_James_Wedding_Contract_Signed.pdf',
    type: 'Contract',
    clientName: 'Sophia & James Sterling',
    eventName: 'Sophia & James Wedding',
    uploadedDate: '2026-07-18',
    uploadedBy: 'Sathish (Manager)',
    status: 'Verified'
  },
  {
    id: 'DOC-502',
    name: 'Priya_Rohan_Aadhaar_ID_Proof.pdf',
    type: 'ID Proof',
    clientName: 'Priya & Rohan Sharma',
    eventName: 'Priya & Rohan Sangeet',
    uploadedDate: '2026-07-21',
    uploadedBy: 'Client Upload',
    status: 'Verified'
  },
  {
    id: 'DOC-503',
    name: 'Aarav_Ananya_Tax_Invoice_INV003.pdf',
    type: 'Invoice',
    clientName: 'Aarav & Ananya Mehta',
    eventName: 'Aarav & Ananya Muhurtham',
    uploadedDate: '2026-08-01',
    uploadedBy: 'System Generated',
    status: 'Active'
  }
]
