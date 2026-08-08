export const MOCK_FINANCE_METRICS = {
  totalRevenue: 3850000,
  receivedAmount: 2420000,
  pendingAmount: 1430000,
  overdueAmount: 250000,
  thisMonthRevenue: 680000,
  upcomingPayments: 420000
}

export const MOCK_PAYMENTS = [
  {
    id: 'PAY-1001',
    clientName: 'Sophia & James Sterling',
    eventName: 'Sophia & James Wedding',
    amount: 50000,
    paymentDate: '2026-08-01',
    paymentType: 'Advance',
    paymentMethod: 'Bank Transfer',
    transactionRef: 'HDFC98234710',
    notes: '20% booking advance received.'
  },
  {
    id: 'PAY-1002',
    clientName: 'Priya & Rohan Sharma',
    eventName: 'Priya & Rohan Sangeet',
    amount: 75000,
    paymentDate: '2026-08-03',
    paymentType: 'Installment',
    paymentMethod: 'UPI',
    transactionRef: 'UPI-981247012',
    notes: 'Second installment paid.'
  },
  {
    id: 'PAY-1003',
    clientName: 'Sathish & Priya Kumar',
    eventName: 'Royal Heritage Wedding',
    amount: 105000,
    paymentDate: '2026-07-28',
    paymentType: 'Final Payment',
    paymentMethod: 'Cash',
    transactionRef: 'CASH-REC-882',
    notes: 'Final balance settled post album delivery.'
  }
]

export const MOCK_INVOICES_LIST = [
  {
    invoiceNo: 'INV-2026-001',
    clientName: 'Sophia & James Sterling',
    eventName: 'Sophia & James Wedding',
    packageName: 'Royal Premium Wedding Package',
    subtotal: 180000,
    discount: 10000,
    tax: 30600,
    total: 200600,
    paid: 100000,
    balance: 100600,
    dueDate: '2026-08-15',
    status: 'Partially Paid'
  },
  {
    invoiceNo: 'INV-2026-002',
    clientName: 'Priya & Rohan Sharma',
    eventName: 'Priya & Rohan Sangeet',
    packageName: 'Pre-Wedding & Sangeet Combo',
    subtotal: 120000,
    discount: 5000,
    tax: 20700,
    total: 135700,
    paid: 135700,
    balance: 0,
    dueDate: '2026-08-05',
    status: 'Paid'
  },
  {
    invoiceNo: 'INV-2026-003',
    clientName: 'Aarav & Ananya Mehta',
    eventName: 'Aarav & Ananya Muhurtham',
    packageName: 'Traditional South Indian Wedding Package',
    subtotal: 150000,
    discount: 0,
    tax: 27000,
    total: 177000,
    paid: 45000,
    balance: 132000,
    dueDate: '2026-08-02',
    status: 'Overdue'
  }
]
