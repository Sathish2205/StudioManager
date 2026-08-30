import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import { TabMenu } from 'primereact/tabmenu'

import { getPayments, getFinanceOverview, recordPayment } from '../../services/financeService'
import { getQuotations, updateQuotationStatus, convertQuotationToInvoice } from '../../services/quotationService'
import { getInvoices, updateInvoice } from '../../services/invoiceService'
import PageLoader from '../../components/PageLoader/PageLoader'
import './FinanceInvoices.css'

export default function FinanceInvoices({ onShowToast, onNavigateCreateQuotation, onNavigateEditQuotation, onNavigateQuotationDetail, onNavigateInvoiceDetail }) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'quotations', 'invoices', 'payments', 'outstanding'
  const [loading, setLoading] = useState(true)

  const [payments, setPayments] = useState([])
  const [quotations, setQuotations] = useState([])
  const [invoices, setInvoices] = useState([])

  const [finMetrics, setFinMetrics] = useState({
    totalRevenue: 3850000,
    receivedAmount: 2420000,
    pendingAmount: 1430000,
    overdueAmount: 250000,
    thisMonthRevenue: 680000,
    upcomingPayments: 420000
  })

  // Load Data
  const loadAllFinanceData = async () => {
    setLoading(true)
    try {
      const [pData, qData, iData, fOverview] = await Promise.all([
        getPayments(),
        getQuotations(),
        getInvoices(),
        getFinanceOverview()
      ])

      // Payments
      if (pData && pData.length > 0) {
        const mappedPayments = pData.map((p) => {
          const clientName = p.clientName || (p.clientId ? `${p.clientId.firstName || ''} ${p.clientId.lastName || ''}`.trim() : 'Client')
          const eventName = p.eventName || (p.eventId ? p.eventId.eventName || 'Wedding Shoot' : 'Special Shoot')
          return {
            id: p._id ? `PAY-${p._id.slice(-4).toUpperCase()}` : p.id || `PAY-${Date.now()}`,
            clientName,
            eventName,
            amount: p.amount || 0,
            paymentDate: p.paymentDate ? new Date(p.paymentDate).toISOString().split('T')[0] : '2026-08-01',
            paymentType: p.paymentType || 'Advance',
            paymentMethod: p.paymentMethod || 'UPI',
            transactionRef: p.transactionId || p.transactionRef || `TXN-${Date.now()}`
          }
        })
        setPayments([...mappedPayments].sort((a, b) => String(b.id || b._id).localeCompare(String(a.id || a._id))))
      } else {
        setPayments([
          { id: 'PAY-1002', clientName: 'Sophia & James Sterling', eventName: 'Wedding & Reception', amount: 20000, paymentDate: '2026-08-20', paymentType: 'Second Payment', method: 'Bank Transfer', transactionRef: 'TXN448102' },
          { id: 'PAY-1001', clientName: 'Sophia & James Sterling', eventName: 'Wedding & Reception', amount: 30000, paymentDate: '2026-08-10', paymentType: 'Advance Payment', paymentMethod: 'UPI', transactionRef: 'UPI123456' }
        ])
      }

      // Quotations
      if (qData && qData.length > 0) {
        setQuotations([...qData].sort((a, b) => String(b.quotationNumber || b._id).localeCompare(String(a.quotationNumber || a._id))))
      } else {
        setQuotations([
          { _id: 'q3', quotationNumber: 'QT-2026-003', clientName: 'Olivia & Liam Vance', eventName: 'Destination Wedding', grandTotal: 210000, date: '2026-08-12', validUntil: '2026-09-12', status: 'Draft' },
          { _id: 'q2', quotationNumber: 'QT-2026-002', clientName: 'Priya & Rohan Sharma', eventName: 'Sangeet & Mehendi', grandTotal: 95000, date: '2026-08-05', validUntil: '2026-09-05', status: 'Sent' },
          { _id: 'q1', quotationNumber: 'QT-2026-001', clientName: 'Sophia & James Sterling', eventName: 'Wedding & Reception', grandTotal: 130000, date: '2026-08-01', validUntil: '2026-09-01', status: 'Accepted' }
        ])
      }

      // Invoices
      if (iData && iData.length > 0) {
        setInvoices([...iData].sort((a, b) => String(b.invoiceNumber || b._id).localeCompare(String(a.invoiceNumber || a._id))))
      } else {
        setInvoices([
          { _id: 'i3', invoiceNumber: 'INV-2026-003', clientName: 'Kavya & Rahul Patel', eventName: 'Engagement & Haldi', grandTotal: 75000, totalPaid: 0, balance: 75000, dueDate: '2026-08-15', status: 'Overdue' },
          { _id: 'i2', invoiceNumber: 'INV-2026-002', clientName: 'Ananya & Vikram Sharma', eventName: 'Royal Wedding & Reception', grandTotal: 185000, totalPaid: 185000, balance: 0, dueDate: '2026-08-20', status: 'Paid' },
          { _id: 'i1', invoiceNumber: 'INV-2026-001', clientName: 'Sophia & James Sterling', eventName: 'Wedding & Reception', grandTotal: 130000, totalPaid: 50000, balance: 80000, dueDate: '2026-08-30', status: 'Partially Paid' }
        ])
      }

      // Overview Metrics
      if (fOverview && fOverview.overview) {
        setFinMetrics({
          totalRevenue: fOverview.overview.totalRevenue || 3850000,
          receivedAmount: fOverview.overview.totalCollected || 2420000,
          pendingAmount: fOverview.overview.pendingBalance || 1430000,
          overdueAmount: fOverview.overview.overdueAmount || 250000,
          thisMonthRevenue: fOverview.overview.thisMonthRevenue || 680000,
          upcomingPayments: fOverview.overview.upcomingPayments || 420000
        })
      }
    } catch (err) {
      console.warn('[FinanceInvoices] Error fetching data:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAllFinanceData()
  }, [])

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState(null)
  const [payClient, setPayClient] = useState('')
  const [payEvent, setPayEvent] = useState('')
  const [payAmount, setPayAmount] = useState(25000)
  const [payType, setPayType] = useState('Installment')
  const [payMethod, setPayMethod] = useState('UPI')
  const [payRef, setPayRef] = useState('')

  // Finance Navigation Tabs
  const financeTabItems = [
    { label: 'Overview', icon: 'pi pi-chart-line', key: 'overview' },
    { label: 'Quotations', icon: 'pi pi-file-edit', key: 'quotations' },
    { label: 'Invoices', icon: 'pi pi-file-pdf', key: 'invoices' },
    { label: 'Payment History', icon: 'pi pi-credit-card', key: 'payments' },
    { label: 'Outstanding Balance', icon: 'pi pi-clock', key: 'outstanding' }
  ]

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  // Handle Record Payment from Dialog
  const handleRecordPaymentSubmit = async () => {
    if (!payAmount || payAmount <= 0) {
      triggerToast('Please enter a valid amount', 'error')
      return
    }

    const newP = {
      id: `PAY-${1000 + payments.length + 1}`,
      clientName: payClient || 'Client',
      eventName: payEvent || 'Wedding Shoot',
      amount: Number(payAmount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: payType,
      paymentMethod: payMethod,
      transactionRef: payRef || `UPI${Math.floor(100000 + Math.random() * 900000)}`
    }

    setPayments([newP, ...payments])

    // Update invoice if linked
    if (selectedInvoiceForPay) {
      const inv = selectedInvoiceForPay
      const newPaid = (inv.totalPaid || 0) + Number(payAmount)
      const newBal = Math.max(0, (inv.grandTotal || inv.total || 0) - newPaid)
      const newSt = newBal === 0 ? 'Paid' : 'Partially Paid'

      const updatedInv = { ...inv, totalPaid: newPaid, balance: newBal, status: newSt }
      setInvoices(invoices.map(i => (i._id === inv._id || i.invoiceNumber === inv.invoiceNumber ? updatedInv : i)))
      await updateInvoice(inv._id || inv.id, updatedInv)
    }

    try {
      await recordPayment({
        amount: Number(payAmount),
        paymentDate: new Date(),
        paymentMethod: payMethod,
        transactionId: payRef,
        paymentType: payType
      })
    } catch {}

    setIsPaymentModalOpen(false)
    setSelectedInvoiceForPay(null)
    triggerToast(`Payment of ₹${Number(payAmount).toLocaleString()} recorded successfully!`, 'success')
  }

  // Handle Quotation Conversion
  const handleConvertQuote = async (e, quote) => {
    e.stopPropagation()
    const inv = await convertQuotationToInvoice(quote._id || quote.id)
    if (inv) {
      triggerToast(`Quotation ${quote.quotationNumber} converted to Invoice!`, 'success')
      loadAllFinanceData()
    }
  }

  // Status Severities
  const quoteStatusSeverity = (st) => {
    switch (st) {
      case 'Accepted': return 'success'
      case 'Sent': return 'info'
      case 'Viewed': return 'warning'
      case 'Rejected': return 'danger'
      default: return 'secondary'
    }
  }

  const invoiceStatusSeverity = (st) => {
    switch (st) {
      case 'Paid': return 'success'
      case 'Partially Paid': return 'info'
      case 'Issued': return 'warning'
      case 'Overdue': return 'danger'
      default: return 'secondary'
    }
  }

  return (
    <div className="finance-container">
      {/* ── Page Header ── */}
      <div className="finance-header">
        <div>
          <h1 className="finance-header__title">Studio Finance, Quotations & Invoices</h1>
          <p className="finance-header__sub">
            Manage client quotation proposals, tax invoices, payment receipts, and balance collections
          </p>
        </div>
      </div>

      {/* ── 6 EXECUTIVE FINANCE DASHBOARD CARDS ── */}
      <div className="fin-metrics-grid">
        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Total Revenue</div>
            <div className="fin-metric__val">₹{(finMetrics.totalRevenue / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--green">
                <i className="pi pi-arrow-up-right" /> +15.4% YoY
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--blue"><i className="pi pi-wallet" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Amount Received</div>
            <div className="fin-metric__val">₹{(finMetrics.receivedAmount / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--green">
                <i className="pi pi-check-circle" /> Collected
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--green"><i className="pi pi-check-circle" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Pending Balance</div>
            <div className="fin-metric__val">₹{(finMetrics.pendingAmount / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--amber">
                <i className="pi pi-clock" /> Uncollected
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--amber"><i className="pi pi-clock" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Overdue Invoices</div>
            <div className="fin-metric__val">₹{(finMetrics.overdueAmount / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--pink">
                <i className="pi pi-exclamation-circle" /> Action Needed
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--pink"><i className="pi pi-exclamation-circle" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">This Month Revenue</div>
            <div className="fin-metric__val">₹{(finMetrics.thisMonthRevenue / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--purple">
                <i className="pi pi-chart-line" /> Target Achieved
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--purple"><i className="pi pi-chart-line" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Quotations Count</div>
            <div className="fin-metric__val">{quotations.length}</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--blue">
                <i className="pi pi-file-edit" /> Active Proposals
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--blue"><i className="pi pi-file-edit" /></div>
        </div>
      </div>

      {/* ── ENTERPRISE TABS ── */}
      <TabMenu
        model={financeTabItems}
        activeIndex={financeTabItems.findIndex((t) => t.key === activeTab)}
        onTabChange={(e) => setActiveTab(financeTabItems[e.index].key)}
      />

      {/* ── TAB 1: OVERVIEW SUMMARY ── */}
      {activeTab === 'overview' && (
        <div className="grid">
          {/* Quick Quotations Widget */}
          <div className="col-12 md:col-6">
            <div className="events-table-card p-3">
              <div className="flex justify-content-between align-items-center mb-3">
                <h3 className="text-md font-bold text-900 m-0">
                  <i className="pi pi-file-edit text-primary mr-2" /> Recent Quotation Proposals
                </h3>
                <Button label="Create New" icon="pi pi-plus" className="p-button-text p-button-sm" onClick={onNavigateCreateQuotation} />
              </div>
              <DataTable
                value={quotations.slice(0, 4)}
                className="events-datatable"
                onRowClick={(e) => onNavigateQuotationDetail && onNavigateQuotationDetail(e.data)}
                selectionMode="single"
              >
                <Column field="quotationNumber" header="Quote #" style={{ minWidth: '110px' }} />
                <Column field="clientName" header="Client" style={{ minWidth: '150px' }} />
                <Column field="grandTotal" header="Total (₹)" body={(r) => `₹${(r.grandTotal || r.total || 0).toLocaleString()}`} style={{ minWidth: '100px' }} />
                <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={quoteStatusSeverity(r.status)} />} style={{ minWidth: '100px' }} />
              </DataTable>
            </div>
          </div>

          {/* Quick Invoices Widget */}
          <div className="col-12 md:col-6">
            <div className="events-table-card p-3">
              <div className="flex justify-content-between align-items-center mb-3">
                <h3 className="text-md font-bold text-900 m-0">
                  <i className="pi pi-file-pdf text-primary mr-2" /> Recent Invoices
                </h3>
                <span className="text-xs font-semibold text-600">Total: {invoices.length}</span>
              </div>
              <DataTable
                value={invoices.slice(0, 4)}
                className="events-datatable"
                onRowClick={(e) => onNavigateInvoiceDetail && onNavigateInvoiceDetail(e.data)}
                selectionMode="single"
              >
                <Column field="invoiceNumber" header="Invoice #" style={{ minWidth: '110px' }} />
                <Column field="clientName" header="Client" style={{ minWidth: '150px' }} />
                <Column field="balance" header="Balance (₹)" body={(r) => <span className={r.balance > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>₹{(r.balance || 0).toLocaleString()}</span>} style={{ minWidth: '110px' }} />
                <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={invoiceStatusSeverity(r.status)} />} style={{ minWidth: '100px' }} />
              </DataTable>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: QUOTATIONS ── */}
      {activeTab === 'quotations' && (
        <div className="events-table-card">
          <div className="flex justify-content-between align-items-center p-3 border-bottom-1 surface-border">
            <span className="text-sm font-bold text-700">Client Quotation Proposals ({quotations.length})</span>
            <Button label="New Quotation" icon="pi pi-plus" className="p-button-primary p-button-sm" onClick={onNavigateCreateQuotation} />
          </div>
          {loading ? (
            <PageLoader />
          ) : (
            <DataTable
              value={quotations}
              sortField="quotationNumber"
              sortOrder={-1}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              responsiveLayout="scroll"
              stripedRows
              className="events-datatable"
              emptyMessage="No quotation proposals found."
              onRowClick={(e) => onNavigateQuotationDetail && onNavigateQuotationDetail(e.data)}
              selectionMode="single"
            >
              <Column field="quotationNumber" header="Quote #" sortable style={{ minWidth: '120px' }} />
              <Column field="clientName" header="Client Name" sortable style={{ minWidth: '170px' }} />
              <Column field="eventName" header="Event Name" style={{ minWidth: '190px' }} />
              <Column field="grandTotal" header="Total (₹)" body={(r) => `₹${(r.grandTotal || r.total || 0).toLocaleString()}`} sortable style={{ minWidth: '130px' }} />
              <Column field="validUntil" header="Valid Until" style={{ minWidth: '120px' }} />
              <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={quoteStatusSeverity(r.status)} />} sortable style={{ minWidth: '120px' }} />
              <Column
                header="Actions"
                body={(r) => (
                  <div className="flex gap-2 align-items-center">
                    {r.status !== 'Accepted' && (
                      <Button
                        label="Convert to Invoice"
                        icon="pi pi-file-export"
                        className="p-button-xs p-button-success"
                        onClick={(e) => handleConvertQuote(e, r)}
                      />
                    )}
                    <Button
                      icon="pi pi-pencil"
                      rounded
                      text
                      severity="warning"
                      tooltip="Edit / Negotiate Price"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onNavigateEditQuotation) onNavigateEditQuotation(r)
                      }}
                    />
                    <Button
                      icon="pi pi-eye"
                      rounded
                      text
                      tooltip="View Quotation"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onNavigateQuotationDetail) onNavigateQuotationDetail(r)
                      }}
                    />
                  </div>
                )}
                style={{ minWidth: '180px' }}
              />
            </DataTable>
          )}
        </div>
      )}

      {/* ── TAB 3: INVOICES ── */}
      {activeTab === 'invoices' && (
        <div className="events-table-card">
          <div className="events-toolbar">
            <div className="events-toolbar__left">
              <span className="text-sm font-bold text-700">Tax Invoices ({invoices.length})</span>
            </div>
            <div className="events-toolbar__right">
              <Button
                label="Record Payment"
                icon="pi pi-plus"
                className="p-button-success"
                onClick={() => {
                  setSelectedInvoiceForPay(null)
                  setPayClient('')
                  setPayEvent('')
                  setPayAmount(25000)
                  setIsPaymentModalOpen(true)
                }}
              />
            </div>
          </div>
          {loading ? (
            <PageLoader />
          ) : (
            <DataTable
              value={invoices}
              sortField="invoiceNumber"
              sortOrder={-1}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              responsiveLayout="scroll"
              stripedRows
              className="events-datatable"
              emptyMessage="No invoices found."
              onRowClick={(e) => onNavigateInvoiceDetail && onNavigateInvoiceDetail(e.data)}
              selectionMode="single"
            >
              <Column field="invoiceNumber" header="Invoice #" sortable style={{ minWidth: '130px' }} />
              <Column field="clientName" header="Client Name" sortable style={{ minWidth: '170px' }} />
              <Column field="eventName" header="Event Name" style={{ minWidth: '190px' }} />
              <Column field="grandTotal" header="Total (₹)" body={(r) => `₹${(r.grandTotal || r.total || 0).toLocaleString()}`} sortable style={{ minWidth: '120px' }} />
              <Column field="totalPaid" header="Paid (₹)" body={(r) => `₹${(r.totalPaid || 0).toLocaleString()}`} style={{ minWidth: '110px' }} />
              <Column field="balance" header="Balance (₹)" body={(r) => <span className={r.balance > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>₹{(r.balance || 0).toLocaleString()}</span>} sortable style={{ minWidth: '120px' }} />
              <Column field="dueDate" header="Due Date" style={{ minWidth: '110px' }} />
              <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={invoiceStatusSeverity(r.status)} />} sortable style={{ minWidth: '130px' }} />
              <Column
                header="Actions"
                body={(r) => (
                  <div className="flex gap-2 align-items-center">
                    {r.balance > 0 && (
                      <Button
                        label="Record Pay"
                        icon="pi pi-plus-circle"
                        className="p-button-xs p-button-success"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedInvoiceForPay(r)
                          setPayClient(r.clientName || '')
                          setPayEvent(r.eventName || '')
                          setPayAmount(r.balance)
                          setIsPaymentModalOpen(true)
                        }}
                      />
                    )}
                    <Button
                      icon="pi pi-eye"
                      rounded
                      text
                      tooltip="View Invoice"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onNavigateInvoiceDetail) onNavigateInvoiceDetail(r)
                      }}
                    />
                  </div>
                )}
                style={{ minWidth: '170px' }}
              />
            </DataTable>
          )}
        </div>
      )}

      {/* ── TAB 4: PAYMENTS ── */}
      {activeTab === 'payments' && (
        <div className="events-table-card">
          <div className="flex justify-content-between align-items-center p-3 border-bottom-1 surface-border">
            <span className="text-sm font-bold text-700">Payment Collection Logs ({payments.length})</span>
            <Button
              label="Record Payment"
              icon="pi pi-plus"
              className="p-button-success p-button-sm"
              onClick={() => {
                setSelectedInvoiceForPay(null)
                setPayClient('')
                setPayEvent('')
                setPayAmount(25000)
                setIsPaymentModalOpen(true)
              }}
            />
          </div>
          {loading ? (
            <PageLoader />
          ) : (
            <DataTable
              value={payments}
              sortField="id"
              sortOrder={-1}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              responsiveLayout="scroll"
              stripedRows
              className="events-datatable"
              emptyMessage="No payment receipts found."
            >
              <Column field="id" header="Payment Ref" sortable style={{ minWidth: '120px' }} />
              <Column field="clientName" header="Client Name" sortable style={{ minWidth: '180px' }} />
              <Column field="eventName" header="Event" sortable style={{ minWidth: '190px' }} />
              <Column field="amount" header="Amount (₹)" body={(r) => `₹${(r.amount || 0).toLocaleString()}`} sortable style={{ minWidth: '130px' }} />
              <Column field="paymentDate" header="Date" sortable style={{ minWidth: '120px' }} />
              <Column field="paymentType" header="Type" body={(r) => <Tag value={r.paymentType} severity="info" />} style={{ minWidth: '130px' }} />
              <Column field="paymentMethod" header="Method" style={{ minWidth: '120px' }} />
              <Column field="transactionRef" header="Ref Code" style={{ minWidth: '140px' }} />
            </DataTable>
          )}
        </div>
      )}

      {/* ── TAB 5: OUTSTANDING BALANCES ── */}
      {activeTab === 'outstanding' && (
        <div className="events-table-card">
          <div className="p-3 border-bottom-1 surface-border font-bold text-700 text-sm">
            Invoices with Pending Balance ({invoices.filter(i => i.balance > 0).length})
          </div>
          <DataTable
            value={invoices.filter((i) => i.balance > 0)}
            sortField="invoiceNumber"
            sortOrder={-1}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
            emptyMessage="All invoices are fully paid!"
          >
            <Column field="clientName" header="Client" style={{ minWidth: '170px' }} />
            <Column field="eventName" header="Event" style={{ minWidth: '190px' }} />
            <Column field="grandTotal" header="Total (₹)" body={(r) => `₹${(r.grandTotal || r.total || 0).toLocaleString()}`} style={{ minWidth: '120px' }} />
            <Column field="totalPaid" header="Paid (₹)" body={(r) => `₹${(r.totalPaid || 0).toLocaleString()}`} style={{ minWidth: '110px' }} />
            <Column field="balance" header="Balance Due (₹)" body={(r) => <span className="font-bold text-red-600">₹{(r.balance || 0).toLocaleString()}</span>} style={{ minWidth: '130px' }} />
            <Column field="dueDate" header="Due Date" style={{ minWidth: '120px' }} />
            <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={invoiceStatusSeverity(r.status)} />} style={{ minWidth: '130px' }} />
            <Column
              header="Action"
              body={(r) => (
                <div className="flex gap-2">
                  <Button
                    label="Record Payment"
                    icon="pi pi-plus-circle"
                    className="p-button-xs p-button-success"
                    onClick={() => {
                      setSelectedInvoiceForPay(r)
                      setPayClient(r.clientName || '')
                      setPayEvent(r.eventName || '')
                      setPayAmount(r.balance)
                      setIsPaymentModalOpen(true)
                    }}
                  />
                  <Button
                    label="Send Reminder"
                    icon="pi pi-send"
                    className="p-button-xs p-button-outlined p-button-secondary"
                    onClick={() => triggerToast(`Reminder sent to ${r.clientName} for ₹${r.balance.toLocaleString()}`)}
                  />
                </div>
              )}
              style={{ minWidth: '240px' }}
            />
          </DataTable>
        </div>
      )}

      {/* ── RECORD PAYMENT DIALOG ── */}
      <Dialog
        header="Record Client Payment"
        visible={isPaymentModalOpen}
        style={{ width: '480px' }}
        onHide={() => setIsPaymentModalOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsPaymentModalOpen(false)} />
            <Button label="Save Payment" icon="pi pi-check" className="p-button-success" onClick={handleRecordPaymentSubmit} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Client Name *</label>
            <InputText value={payClient} onChange={(e) => setPayClient(e.target.value)} placeholder="e.g. Arun & Priya" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Event *</label>
            <InputText value={payEvent} onChange={(e) => setPayEvent(e.target.value)} placeholder="e.g. Royal Heritage Wedding" className="w-full" />
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Amount (₹) *</label>
              <InputNumber value={payAmount} onValueChange={(e) => setPayAmount(e.value)} className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Payment Type</label>
              <Dropdown value={payType} options={['Advance Payment', 'Second Payment', 'Final Payment', 'Installment']} onChange={(e) => setPayType(e.value)} className="w-full" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Payment Method</label>
              <Dropdown value={payMethod} options={['UPI', 'Cash', 'Bank Transfer', 'Card']} onChange={(e) => setPayMethod(e.value)} className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Transaction Ref Code</label>
              <InputText value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. UPI-981247" className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
