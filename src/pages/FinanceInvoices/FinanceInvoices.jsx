import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'

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
          <div className="editing-tab-toggle">
            <button
              className={`editing-tab-btn ${activeTab === 'payments' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              Payment History
            </button>
            <button
              className={`editing-tab-btn ${activeTab === 'invoices' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              Invoices
            </button>
            <button
              className={`editing-tab-btn ${activeTab === 'outstanding' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('outstanding')}
            >
              Outstanding Balance
            </button>
          </div>

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

      {/* ── 6 EXECUTIVE FINANCE DASHBOARD CARDS ── */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Total Revenue</div>
            <div className="crm-metric__val">₹{(MOCK_FINANCE_METRICS.totalRevenue / 100000).toFixed(1)}L</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--blue"><i className="pi pi-wallet" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Amount Received</div>
            <div className="crm-metric__val text-green-600">₹{(MOCK_FINANCE_METRICS.receivedAmount / 100000).toFixed(1)}L</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--green"><i className="pi pi-check-circle" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Pending Amount</div>
            <div className="crm-metric__val text-amber-600">₹{(MOCK_FINANCE_METRICS.pendingAmount / 100000).toFixed(1)}L</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--amber"><i className="pi pi-clock" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Overdue Amount</div>
            <div className="crm-metric__val text-red-600">₹{(MOCK_FINANCE_METRICS.overdueAmount / 100000).toFixed(1)}L</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--pink"><i className="pi pi-exclamation-circle" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">This Month Revenue</div>
            <div className="crm-metric__val">₹{(MOCK_FINANCE_METRICS.thisMonthRevenue / 100000).toFixed(1)}L</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--purple"><i className="pi pi-chart-line" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Upcoming Payments</div>
            <div className="crm-metric__val">₹{(MOCK_FINANCE_METRICS.upcomingPayments / 100000).toFixed(1)}L</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--blue"><i className="pi pi-calendar" /></div>
        </div>
      </div>

      {/* ── TAB 1: PAYMENTS ── */}
      {activeTab === 'payments' && (
        <div className="events-table-card">
          <DataTable value={payments} paginator rows={5} responsiveLayout="scroll" stripedRows className="events-datatable">
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
          <DataTable value={invoices} paginator rows={5} responsiveLayout="scroll" stripedRows className="events-datatable">
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
          <DataTable value={invoices.filter((i) => i.balance > 0)} paginator rows={5} responsiveLayout="scroll" className="events-datatable">
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
            <InputText value={payClient} onChange={(e) => setPayClient(e.target.value)} placeholder="e.g. Sathish & Priya" className="w-full" />
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
