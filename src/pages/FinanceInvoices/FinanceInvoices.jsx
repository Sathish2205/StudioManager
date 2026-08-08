import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import { TabMenu } from 'primereact/tabmenu'

import {
  MOCK_FINANCE_METRICS,
  MOCK_PAYMENTS,
  MOCK_INVOICES_LIST
} from './mockFinanceData'
import './FinanceInvoices.css'

export default function FinanceInvoices({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('payments') // 'payments', 'invoices', 'outstanding'
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  const [invoices, setInvoices] = useState(MOCK_INVOICES_LIST)

  // Dialog State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  // PrimeReact TabMenu Items
  const financeTabItems = [
    { label: 'Payment History', icon: 'pi pi-credit-card', key: 'payments' },
    { label: 'Invoices', icon: 'pi pi-file-pdf', key: 'invoices' },
    { label: 'Outstanding Balance', icon: 'pi pi-clock', key: 'outstanding' }
  ]

  // Paginator Left Templates (Matching Events Page)
  const paymentsPaginatorLeft = (
    <div className="events-paginator__count">
      Showing <strong>{payments.length}</strong> of <strong>{MOCK_PAYMENTS.length}</strong> Payments
    </div>
  )

  const invoicesPaginatorLeft = (
    <div className="events-paginator__count">
      Showing <strong>{invoices.length}</strong> of <strong>{MOCK_INVOICES_LIST.length}</strong> Invoices
    </div>
  )

  const outstandingPaginatorLeft = (
    <div className="events-paginator__count">
      Showing <strong>{invoices.filter((i) => i.balance > 0).length}</strong> of <strong>{invoices.filter((i) => i.balance > 0).length}</strong> Outstanding Balances
    </div>
  )

  // Form Record Payment
  const [payClient, setPayClient] = useState('')
  const [payEvent, setPayEvent] = useState('')
  const [payAmount, setPayAmount] = useState(25000)
  const [payType, setPayType] = useState('Advance')
  const [payMethod, setPayMethod] = useState('UPI')
  const [payRef, setPayRef] = useState('')

  // Form Create Invoice
  const [invClient, setInvClient] = useState('')
  const [invEvent, setInvEvent] = useState('')
  const [invPackage, setInvPackage] = useState('Premium Wedding Package')
  const [invAmount, setInvAmount] = useState(150000)

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleRecordPayment = () => {
    if (!payClient || !payEvent || !payAmount) {
      triggerToast('Client, Event, and Amount are required', 'error')
      return
    }

    const newP = {
      id: `PAY-${1000 + payments.length + 1}`,
      clientName: payClient,
      eventName: payEvent,
      amount: payAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: payType,
      paymentMethod: payMethod,
      transactionRef: payRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Recorded via Finance Module'
    }

    setPayments([newP, ...payments])
    setIsPaymentModalOpen(false)
    triggerToast(`Payment of ₹${payAmount.toLocaleString()} recorded!`, 'success')
  }

  const handleCreateInvoice = () => {
    if (!invClient || !invEvent) {
      triggerToast('Client and Event are required', 'error')
      return
    }

    const tax = Math.round(invAmount * 0.18)
    const total = invAmount + tax

    const newInv = {
      invoiceNo: `INV-2026-${100 + invoices.length + 1}`,
      clientName: invClient,
      eventName: invEvent,
      packageName: invPackage,
      subtotal: invAmount,
      discount: 0,
      tax: tax,
      total: total,
      paid: 0,
      balance: total,
      dueDate: '2026-08-30',
      status: 'Sent'
    }

    setInvoices([newInv, ...invoices])
    setIsInvoiceModalOpen(false)
    triggerToast(`Invoice ${newInv.invoiceNo} generated!`, 'success')
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Paid': return 'success'
      case 'Partially Paid': return 'info'
      case 'Overdue': return 'danger'
      case 'Sent': return 'warning'
      default: return 'secondary'
    }
  }

  return (
    <div className="finance-container">
      {/* ── Page Header ── */}
      <div className="finance-header">
        <div>
          <h1 className="finance-header__title">Studio Finance & Invoice Management</h1>
          <p className="finance-header__sub">
            Track gross revenues, advance collections, pending invoice balances, and tax filings
          </p>
        </div>

        <div className="finance-header__actions">
          <Button
            label="Record Payment"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => setIsPaymentModalOpen(true)}
          />
          <Button
            label="Create Invoice"
            icon="pi pi-file-pdf"
            className="p-button-primary"
            onClick={() => setIsInvoiceModalOpen(true)}
          />
        </div>
      </div>

      {/* ── 6 EXECUTIVE FINANCE DASHBOARD CARDS (3x2 ENTERPRISE GRID) ── */}
      <div className="fin-metrics-grid">
        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Total Revenue</div>
            <div className="fin-metric__val">₹{(MOCK_FINANCE_METRICS.totalRevenue / 100000).toFixed(1)}L</div>
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
            <div className="fin-metric__val">₹{(MOCK_FINANCE_METRICS.receivedAmount / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--green">
                <i className="pi pi-check-circle" /> 62.8% Collected
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--green"><i className="pi pi-check-circle" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Pending Amount</div>
            <div className="fin-metric__val">₹{(MOCK_FINANCE_METRICS.pendingAmount / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--amber">
                <i className="pi pi-clock" /> 37.2% Uncollected
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--amber"><i className="pi pi-clock" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">Overdue Amount</div>
            <div className="fin-metric__val">₹{(MOCK_FINANCE_METRICS.overdueAmount / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--pink">
                <i className="pi pi-exclamation-circle" /> 3 Overdue
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--pink"><i className="pi pi-exclamation-circle" /></div>
        </div>

        <div className="fin-metric-card">
          <div>
            <div className="fin-metric__label">This Month Revenue</div>
            <div className="fin-metric__val">₹{(MOCK_FINANCE_METRICS.thisMonthRevenue / 100000).toFixed(1)}L</div>
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
            <div className="fin-metric__label">Upcoming Payments</div>
            <div className="fin-metric__val">₹{(MOCK_FINANCE_METRICS.upcomingPayments / 100000).toFixed(1)}L</div>
            <div className="fin-metric__sub">
              <span className="home-metric-tag home-metric-tag--blue">
                <i className="pi pi-calendar" /> Due Next 7 Days
              </span>
            </div>
          </div>
          <div className="fin-metric__icon fin-metric__icon--blue"><i className="pi pi-calendar" /></div>
        </div>
      </div>

      {/* ── PRIMEREACT TABMENU ENTERPRISE TABS ── */}
      <TabMenu
        model={financeTabItems}
        activeIndex={financeTabItems.findIndex((t) => t.key === activeTab)}
        onTabChange={(e) => setActiveTab(financeTabItems[e.index].key)}
      />

      {/* ── TAB 1: PAYMENTS ── */}
      {activeTab === 'payments' && (
        <div className="events-table-card">
          <DataTable
            value={payments}
            paginator
            paginatorLeft={paymentsPaginatorLeft}
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="id" header="Payment Ref" sortable style={{ minWidth: '120px' }} />
            <Column field="clientName" header="Client Name" sortable style={{ minWidth: '180px' }} />
            <Column field="eventName" header="Event" sortable style={{ minWidth: '200px' }} />
            <Column field="amount" header="Amount (₹)" body={(r) => `₹${r.amount.toLocaleString()}`} sortable style={{ minWidth: '140px' }} />
            <Column field="paymentDate" header="Date" sortable style={{ minWidth: '120px' }} />
            <Column field="paymentType" header="Type" body={(r) => <Tag value={r.paymentType} severity="info" />} style={{ minWidth: '120px' }} />
            <Column field="paymentMethod" header="Method" style={{ minWidth: '130px' }} />
            <Column field="transactionRef" header="Ref Code" style={{ minWidth: '150px' }} />
          </DataTable>
        </div>
      )}

      {/* ── TAB 2: INVOICES ── */}
      {activeTab === 'invoices' && (
        <div className="events-table-card">
          <DataTable
            value={invoices}
            paginator
            paginatorLeft={invoicesPaginatorLeft}
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="invoiceNo" header="Invoice #" sortable style={{ minWidth: '130px' }} />
            <Column field="clientName" header="Client" sortable style={{ minWidth: '180px' }} />
            <Column field="eventName" header="Event" style={{ minWidth: '190px' }} />
            <Column field="total" header="Total (₹)" body={(r) => `₹${r.total.toLocaleString()}`} sortable style={{ minWidth: '130px' }} />
            <Column field="paid" header="Paid (₹)" body={(r) => `₹${r.paid.toLocaleString()}`} style={{ minWidth: '120px' }} />
            <Column field="balance" header="Balance (₹)" body={(r) => `₹${r.balance.toLocaleString()}`} style={{ minWidth: '120px' }} />
            <Column field="dueDate" header="Due Date" style={{ minWidth: '120px' }} />
            <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={statusSeverity(r.status)} />} style={{ minWidth: '130px' }} />
          </DataTable>
        </div>
      )}

      {/* ── TAB 3: OUTSTANDING BALANCES ── */}
      {activeTab === 'outstanding' && (
        <div className="events-table-card">
          <DataTable
            value={invoices.filter((i) => i.balance > 0)}
            paginator
            paginatorLeft={outstandingPaginatorLeft}
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="clientName" header="Client" style={{ minWidth: '180px' }} />
            <Column field="eventName" header="Event" style={{ minWidth: '200px' }} />
            <Column field="total" header="Total (₹)" body={(r) => `₹${r.total.toLocaleString()}`} style={{ minWidth: '130px' }} />
            <Column field="paid" header="Paid (₹)" body={(r) => `₹${r.paid.toLocaleString()}`} style={{ minWidth: '120px' }} />
            <Column field="balance" header="Balance Due (₹)" body={(r) => <span className="font-bold text-red-600">₹{r.balance.toLocaleString()}</span>} style={{ minWidth: '140px' }} />
            <Column field="dueDate" header="Due Date" style={{ minWidth: '120px' }} />
            <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={statusSeverity(r.status)} />} style={{ minWidth: '130px' }} />
            <Column
              header="Action"
              body={(r) => (
                <Button
                  label="Send Reminder"
                  icon="pi pi-send"
                  className="p-button-outlined p-button-sm p-button-secondary"
                  onClick={() => triggerToast(`Reminder sent to ${r.clientName} for ₹${r.balance.toLocaleString()}`)}
                />
              )}
              style={{ minWidth: '160px' }}
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
            <Button label="Save Payment" icon="pi pi-check" className="p-button-success" onClick={handleRecordPayment} />
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
              <Dropdown value={payType} options={['Advance', 'Installment', 'Final Payment', 'Refund']} onChange={(e) => setPayType(e.value)} showClear className="w-full" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Payment Method</label>
              <Dropdown value={payMethod} options={['UPI', 'Cash', 'Bank Transfer', 'Card']} onChange={(e) => setPayMethod(e.value)} showClear className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Transaction Ref Code</label>
              <InputText value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. UPI-981247" className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>

      {/* ── CREATE INVOICE DIALOG ── */}
      <Dialog
        header="Generate New Tax Invoice"
        visible={isInvoiceModalOpen}
        style={{ width: '480px' }}
        onHide={() => setIsInvoiceModalOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsInvoiceModalOpen(false)} />
            <Button label="Generate Invoice" icon="pi pi-check" className="p-button-primary" onClick={handleCreateInvoice} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Client Name *</label>
            <InputText value={invClient} onChange={(e) => setInvClient(e.target.value)} placeholder="Client Name" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Event *</label>
            <InputText value={invEvent} onChange={(e) => setInvEvent(e.target.value)} placeholder="Event Name" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Package</label>
            <InputText value={invPackage} onChange={(e) => setInvPackage(e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Subtotal Amount (₹)</label>
            <InputNumber value={invAmount} onValueChange={(e) => setInvAmount(e.value)} className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
