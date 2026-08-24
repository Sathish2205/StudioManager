import React, { useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { recordPayment } from '../../services/financeService'
import { updateInvoice, updateInvoiceStatus } from '../../services/invoiceService'
import { downloadPdfFromElement } from '../../utils/generatePdf'
import './InvoiceDetail.css'

export default function InvoiceDetail({ invoice, onNavigateBack, onShowToast }) {
  const [currentInvoice, setCurrentInvoice] = useState(invoice || {
    invoiceNumber: 'INV-2026-001',
    clientName: 'Sophia & James Sterling',
    clientPhone: '+91 98765 43210',
    clientEmail: 'sophia.sterling@example.com',
    eventName: 'Wedding & Reception',
    eventDate: '2026-08-12',
    venue: 'The Grand Chateau, Napa Valley',
    date: '2026-08-01',
    dueDate: '2026-08-25',
    services: [
      { name: 'Wedding Photography', description: 'Full day coverage with lead photographer & candid specialist', qty: 1, unitPrice: 50000, total: 50000 },
      { name: 'Cinematic Videography', description: '4K Cinematic film, teaser, and traditional video edit', qty: 1, unitPrice: 40000, total: 40000 },
      { name: 'Premium Hardbound Album', description: '2 Luxe acrylic glass hardbound albums (50 sheets each)', qty: 2, unitPrice: 15000, total: 30000 },
      { name: 'Pre-wedding Outdoor Shoot', description: '1-day outdoor pre-wedding session with drone coverage', qty: 1, unitPrice: 20000, total: 20000 }
    ],
    subtotal: 140000,
    discount: 10000,
    taxPercent: 18,
    taxAmount: 23400,
    grandTotal: 153400,
    totalPaid: 50000,
    balance: 103400,
    status: 'Partially Paid',
    payments: [
      { id: 'PAY-1001', date: '2026-08-02', type: 'Advance Payment', method: 'UPI', ref: 'UPI981247', amount: 30000 },
      { id: 'PAY-1002', date: '2026-08-10', type: 'Second Payment', method: 'Bank Transfer', ref: 'TXN448102', amount: 20000 }
    ]
  })

  // Record Payment Dialog State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState(25000)
  const [payMethod, setPayMethod] = useState('UPI')
  const [payType, setPayType] = useState('Installment')
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0])
  const [payRef, setPayRef] = useState('')
  const [payNotes, setPayNotes] = useState('Payment received')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleRecordPayment = async () => {
    if (!payAmount || payAmount <= 0) {
      triggerToast('Please enter a valid payment amount', 'error')
      return
    }

    const newPayment = {
      id: `PAY-${1000 + (currentInvoice.payments || []).length + 1}`,
      date: payDate,
      type: payType,
      method: payMethod,
      ref: payRef || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      amount: Number(payAmount),
      notes: payNotes
    }

    const updatedPayments = [...(currentInvoice.payments || []), newPayment]
    const newTotalPaid = (currentInvoice.totalPaid || 0) + Number(payAmount)
    const newBalance = Math.max(0, (currentInvoice.grandTotal || 0) - newTotalPaid)
    let newStatus = currentInvoice.status
    if (newBalance === 0) {
      newStatus = 'Paid'
    } else if (newTotalPaid > 0) {
      newStatus = 'Partially Paid'
    }

    const updatedInvoiceObj = {
      ...currentInvoice,
      totalPaid: newTotalPaid,
      balance: newBalance,
      status: newStatus,
      payments: updatedPayments
    }

    // Try backend record
    try {
      await recordPayment({
        eventId: currentInvoice.eventId?._id || currentInvoice.eventId || null,
        clientId: currentInvoice.clientId?._id || currentInvoice.clientId || null,
        amount: Number(payAmount),
        paymentDate: payDate,
        paymentMethod: payMethod,
        transactionId: payRef,
        paymentType: payType,
        notes: payNotes
      })
    } catch {
      // Local fallback
    }

    await updateInvoice(currentInvoice._id || currentInvoice.id, updatedInvoiceObj)
    setCurrentInvoice(updatedInvoiceObj)
    setIsPayModalOpen(false)
    triggerToast(`Recorded payment of ₹${payAmount.toLocaleString()} via ${payMethod}!`, 'success')
  }

  const handleDownloadPdf = () => {
    downloadPdfFromElement('printable-invoice-card', `${currentInvoice.invoiceNumber || 'Invoice'}.pdf`)
    triggerToast('Generating PDF download...', 'info')
  }

  const handlePrint = () => {
    window.print()
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Paid': return 'success'
      case 'Partially Paid': return 'info'
      case 'Issued': return 'warning'
      case 'Overdue': return 'danger'
      default: return 'secondary'
    }
  }

  return (
    <div className="invoice-detail-container">
      {/* Actions Bar */}
      <div className="invoice-detail-actions-bar">
        <div>
          <button className="invoice-detail__back-btn" onClick={onNavigateBack}>
            <i className="pi pi-arrow-left" /> Back to Invoices
          </button>
          <h2 className="invoice-detail-actions-bar__title">
            Invoice #{currentInvoice.invoiceNumber}
            <Tag value={currentInvoice.status} severity={statusSeverity(currentInvoice.status)} style={{ marginLeft: '10px' }} />
          </h2>
        </div>

        <div className="invoice-detail-actions-bar__btn-group">
          {currentInvoice.balance > 0 && (
            <Button
              label="Record Payment"
              icon="pi pi-plus-circle"
              className="p-button-success"
              onClick={() => {
                setPayAmount(currentInvoice.balance)
                setIsPayModalOpen(true)
              }}
            />
          )}

          <Button
            label="Download PDF"
            icon="pi pi-download"
            className="p-button-outlined p-button-secondary"
            onClick={handleDownloadPdf}
          />

          <Button
            label="Print Invoice"
            icon="pi pi-print"
            className="p-button-primary"
            onClick={handlePrint}
          />
        </div>
      </div>

      {/* Printable A4 Invoice Card */}
      <div className="invoice-card" id="printable-invoice-card">
        {/* Studio Invoice Header */}
        <div className="invoice-header">
          <div>
            <div className="invoice-brand__name">
              PhotoStudio<span className="invoice-brand__dot">⊙</span>PRO<sup>®</sup>
            </div>
            <div className="invoice-brand__sub">PREMIUM CINEMATIC PHOTOGRAPHY & ALBUMS</div>
            <div className="invoice-studio-details">
              Studio #42, Luxury Plaza, Residency Road, Bengaluru, 560025
              <br />
              GSTIN: 29AAACP9988C1Z4 | Contact: +91 98450 12345 | info@photostudiopro.com
            </div>
          </div>

          <div className="invoice-meta-box">
            <div className="invoice-title">TAX INVOICE</div>
            <div className="invoice-meta-row">
              Invoice No: <strong>{currentInvoice.invoiceNumber}</strong>
            </div>
            <div className="invoice-meta-row">
              Date: <strong>{currentInvoice.date ? new Date(currentInvoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026'}</strong>
            </div>
            <div className="invoice-meta-row">
              Due Date: <strong>{currentInvoice.dueDate ? new Date(currentInvoice.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '25 Aug 2026'}</strong>
            </div>
            <div className="invoice-meta-row">
              Status: <Tag value={currentInvoice.status} severity={statusSeverity(currentInvoice.status)} />
            </div>
          </div>
        </div>

        {/* Client & Event Info Section */}
        <div className="invoice-info-section">
          <div>
            <div className="invoice-info-block__label">BILLED TO CLIENT</div>
            <div className="invoice-info-block__title">{currentInvoice.clientName || 'Client Name'}</div>
            <div className="invoice-info-block__text">
              Phone: {currentInvoice.clientPhone || '+91 98765 43210'}
              <br />
              Email: {currentInvoice.clientEmail || 'client@example.com'}
            </div>
          </div>

          <div>
            <div className="invoice-info-block__label">EVENT & VENUE DETAILS</div>
            <div className="invoice-info-block__title">{currentInvoice.eventName || 'Wedding & Reception'}</div>
            <div className="invoice-info-block__text">
              Event Date: {currentInvoice.eventDate || '12 Aug 2026'}
              <br />
              Venue: {currentInvoice.venue || 'The Grand Chateau'}
            </div>
          </div>
        </div>

        {/* Services Particulars Table */}
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Description & Photography Package</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price (₹)</th>
              <th className="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {(currentInvoice.services || []).map((s, idx) => (
              <tr key={idx}>
                <td>
                  <div className="invoice-item__name">{s.name}</div>
                  <div className="invoice-item__desc">{s.description}</div>
                </td>
                <td className="text-center">{s.qty}</td>
                <td className="text-right">₹{(s.unitPrice || 0).toLocaleString()}</td>
                <td className="text-right font-semibold">₹{(s.total || s.qty * s.unitPrice || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment History Block */}
        {(currentInvoice.payments && currentInvoice.payments.length > 0) && (
          <div className="inv-payments-history-block mb-4">
            <div className="inv-payments-history__title">
              <i className="pi pi-history text-primary mr-2" /> Payment History Log
            </div>
            <table className="inv-payments-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Payment Type</th>
                  <th>Method</th>
                  <th>Reference Code</th>
                  <th className="text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.payments.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.date}</td>
                    <td><span className="font-semibold text-900">{p.type}</span></td>
                    <td>{p.method}</td>
                    <td><code>{p.ref}</code></td>
                    <td className="text-right font-bold text-green-700">₹{(p.amount || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary & Totals Block */}
        <div className="invoice-summary-container">
          <div className="invoice-payment-terms">
            <div className="invoice-terms__title">Bank & UPI Payment Details</div>
            <div className="invoice-terms__text">
              Bank: State Bank of India
              <br />
              Account No: <strong>1234 5678 9012</strong> | IFSC: <strong>SBIN0001234</strong>
              <br />
              UPI ID: <strong>photostudiopro@sbi</strong> (Scan & Pay)
              <br />
              <span className="text-xs text-500 mt-1 block">• Advance payment required to confirm schedule. Balance prior to album print.</span>
            </div>
          </div>

          <div className="invoice-totals-box">
            <div className="invoice-total-row">
              <span>Subtotal</span>
              <span>₹{(currentInvoice.subtotal || 0).toLocaleString()}</span>
            </div>
            {currentInvoice.discount > 0 && (
              <div className="invoice-total-row text-green-600">
                <span>Discount</span>
                <span>- ₹{(currentInvoice.discount || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="invoice-total-row">
              <span>GST ({currentInvoice.taxPercent || 18}% Tax)</span>
              <span>₹{(currentInvoice.taxAmount || 0).toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-grand">
              <span>Grand Total</span>
              <span>₹{(currentInvoice.grandTotal || 0).toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-paid">
              <span>Total Paid</span>
              <span>- ₹{(currentInvoice.totalPaid || 0).toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-due">
              <span>Balance Due</span>
              <span>₹{(currentInvoice.balance || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Signoff */}
        <div className="invoice-footer">
          <div className="invoice-footer__note">
            Thank you for choosing PhotoStudio PRO to capture your special memories!
          </div>

          <div className="invoice-signature-box">
            <div className="invoice-signature__line" />
            <div className="invoice-signature__title">Authorized Signatory</div>
          </div>
        </div>
      </div>

      {/* Record Payment Dialog */}
      <Dialog
        header="Record Invoice Payment"
        visible={isPayModalOpen}
        style={{ width: '450px' }}
        onHide={() => setIsPayModalOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsPayModalOpen(false)} />
            <Button label="Save Payment" icon="pi pi-check" className="p-button-success" onClick={handleRecordPayment} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Payment Amount (₹) *</label>
            <InputNumber value={payAmount} onValueChange={(e) => setPayAmount(e.value)} className="w-full" min={1} max={currentInvoice.balance || 1000000} />
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Payment Method *</label>
              <Dropdown
                value={payMethod}
                options={['UPI', 'Cash', 'Bank Transfer', 'Card']}
                onChange={(e) => setPayMethod(e.value)}
                className="w-full"
              />
            </div>

            <div className="col-6">
              <label className="block font-bold mb-1">Payment Type</label>
              <Dropdown
                value={payType}
                options={['Advance Payment', 'Second Payment', 'Final Payment', 'Partial Payment']}
                onChange={(e) => setPayType(e.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Payment Date</label>
              <InputText type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className="w-full" />
            </div>

            <div className="col-6">
              <label className="block font-bold mb-1">Transaction / Ref No</label>
              <InputText value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. UPI123456" className="w-full" />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Notes</label>
            <InputText value={payNotes} onChange={(e) => setPayNotes(e.target.value)} placeholder="e.g. Second installment" className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
