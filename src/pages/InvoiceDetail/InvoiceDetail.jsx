import React, { useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { recordPayment } from '../../services/financeService'
import { updateInvoice } from '../../services/invoiceService'
import { downloadPdfFromElement } from '../../utils/generatePdf'
import { useAuth } from '../../context/AuthContext'
import './InvoiceDetail.css'

export default function InvoiceDetail({ invoice, onNavigateBack, onShowToast }) {
  const { tenant, user } = useAuth ? useAuth() : {}
  const studioName = tenant?.companyName || user?.studioName || invoice?.studioName || 'ABC Photography'
  const [currentInvoice, setCurrentInvoice] = useState(invoice || {
    invoiceNumber: 'INV-2026-001',
    clientName: 'Sophia & James Sterling',
    clientPhone: '+91 98765 43210',
    clientEmail: 'sophia.sterling@example.com',
    eventName: 'Wedding & Reception',
    eventDate: '2026-08-12',
    venue: 'The Grand Chateau, Bengaluru',
    date: '2026-08-01',
    dueDate: '2026-08-25',
    services: [
      { name: 'Candid Cinematic Photography', category: 'Photography', qty: 1, unitPrice: 5000, discount: 0, total: 5000 },
      { name: 'Traditional Stage Photography', category: 'Photography', qty: 1, unitPrice: 3000, discount: 0, total: 3000 },
      { name: 'Traditional Video Recording', category: 'Videography', qty: 1, unitPrice: 4000, discount: 500, total: 3500 },
      { name: 'Lead Photographer', category: 'Staffing', qty: 1, unitPrice: 1000, discount: 0, total: 1000 }
    ],
    subtotal: 13000,
    discount: 500,
    taxPercent: 18,
    taxAmount: 2250,
    grandTotal: 14750,
    totalPaid: 5000,
    balance: 9750,
    status: 'Partially Paid',
    payments: [
      { id: 'PAY-1001', date: '2026-08-02', type: 'Advance Payment', method: 'UPI', ref: 'UPI981247', amount: 5000 }
    ]
  })

  // Record Payment Dialog State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState(currentInvoice.balance || 2500)
  const [payMethod, setPayMethod] = useState('UPI')
  const [payType, setPayType] = useState('Part Payment')
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0])
  const [payRef, setPayRef] = useState('')

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
      amount: Number(payAmount)
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

    try {
      await recordPayment({
        eventId: currentInvoice.eventId?._id || currentInvoice.eventId || null,
        clientId: currentInvoice.clientId?._id || currentInvoice.clientId || null,
        amount: Number(payAmount),
        paymentDate: payDate,
        paymentMethod: payMethod,
        transactionId: payRef,
        paymentType: payType
      })
    } catch {
      // Local fallback
    }

    await updateInvoice(currentInvoice._id || currentInvoice.id, updatedInvoiceObj)
    setCurrentInvoice(updatedInvoiceObj)
    setIsPayModalOpen(false)
    triggerToast(`Recorded payment of ₹${payAmount.toLocaleString('en-IN')} via ${payMethod}!`, 'success')
  }

  const handleDownloadPdf = () => {
    downloadPdfFromElement('printable-invoice-detail-card', `${currentInvoice.invoiceNumber || 'Invoice'}.pdf`)
    triggerToast('Downloading PDF...', 'info')
  }

  const handlePrint = () => {
    window.print()
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Paid':
      case 'PAID IN FULL': return 'success'
      case 'Partially Paid':
      case 'DEPOSIT PAID': return 'info'
      case 'Issued':
      case 'Pending': return 'warning'
      case 'Overdue': return 'danger'
      default: return 'secondary'
    }
  }

  // Derive services breakdown if services is not array or single custom item
  const rawServices = Array.isArray(currentInvoice.services) && currentInvoice.services.length > 0
    ? currentInvoice.services
    : [
        { name: 'Candid Cinematic Photography', category: 'Photography', qty: 1, unitPrice: 5000, discount: 0, total: 5000 },
        { name: 'Traditional Stage Photography', category: 'Photography', qty: 1, unitPrice: 3000, discount: 0, total: 3000 },
        { name: 'Traditional Video Recording', category: 'Videography', qty: 1, unitPrice: 4000, discount: 0, total: 4000 },
        { name: 'Lead Photographer', category: 'Staffing', qty: 1, unitPrice: 1000, discount: 0, total: 1000 }
      ]

  return (
    <div className="ent-invoice-container">
      {/* Actions Bar */}
      <div className="ent-invoice-actions-bar no-print">
        <div className="flex align-items-center gap-3">
          <Button
            icon="pi pi-arrow-left"
            className="p-button-outlined p-button-secondary p-button-sm"
            onClick={onNavigateBack}
          />
          <div>
            <div className="flex align-items-center gap-2">
              <h2 className="ent-invoice-actions-bar__title">
                Invoice #{currentInvoice.invoiceNumber}
              </h2>
              <Tag value={currentInvoice.status} severity={statusSeverity(currentInvoice.status)} outlined />
            </div>
            <p className="ent-invoice-actions-bar__subtitle">Client: {currentInvoice.clientName}</p>
          </div>
        </div>

        <div className="ent-invoice-actions-bar__btn-group">
          {currentInvoice.balance > 0 && (
            <Button
              label="Record Payment"
              icon="pi pi-plus-circle"
              className="p-button-outlined p-button-success p-button-sm"
              onClick={() => {
                setPayAmount(currentInvoice.balance)
                setIsPayModalOpen(true)
              }}
            />
          )}
          <Button
            label="Download PDF"
            icon="pi pi-download"
            className="p-button-outlined p-button-primary p-button-sm"
            onClick={handleDownloadPdf}
          />
          <Button
            label="Print Invoice"
            icon="pi pi-print"
            className="p-button-primary p-button-sm"
            onClick={handlePrint}
          />
        </div>
      </div>

      {/* Printable Enterprise A4 Card */}
      <div className="ent-invoice-card" id="printable-invoice-detail-card">
        {/* Header */}
        <div className="ent-invoice-header">
          <div className="ent-invoice-brand">
            <div className="ent-invoice-brand__logo">
              <span className="ent-brand-text">{studioName}</span>
              <sup className="ent-brand-reg">®</sup>
            </div>
            <div className="ent-invoice-brand__tagline">PREMIUM CINEMATIC PHOTOGRAPHY & ALBUMS</div>
            <div className="ent-invoice-studio-details">
              Studio #42, Luxury Plaza, Residency Road, Bengaluru, Karnataka — 560025
              <br />
              <strong>GSTIN:</strong> 29AAACP9988C1Z4 &nbsp;|&nbsp; <strong>Contact:</strong> +91 98450 12345 &nbsp;|&nbsp; info@photostudiopro.com
            </div>
          </div>

          <div className="ent-invoice-meta-box">
            <div className="ent-invoice-meta__title">TAX INVOICE</div>
            <div className="ent-invoice-meta__row">
              <span>Invoice No:</span>
              <strong>{currentInvoice.invoiceNumber}</strong>
            </div>
            <div className="ent-invoice-meta__row">
              <span>Invoice Date:</span>
              <strong>{currentInvoice.date || '01 Aug 2026'}</strong>
            </div>
            <div className="ent-invoice-meta__row">
              <span>Due Date:</span>
              <strong>{currentInvoice.dueDate || '25 Aug 2026'}</strong>
            </div>
            <div className="ent-invoice-meta__row">
              <span>Status:</span>
              <Tag value={currentInvoice.status} severity={statusSeverity(currentInvoice.status)} outlined />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="ent-invoice-info-grid">
          <div className="ent-info-card">
            <div className="ent-info-card__header">
              <i className="pi pi-user text-primary mr-2" />
              <span>BILLED TO CLIENT</span>
            </div>
            <div className="ent-info-card__title">{currentInvoice.clientName || 'Client Name'}</div>
            <div className="ent-info-card__details">
              <div><strong>Phone:</strong> {currentInvoice.clientPhone || '+91 98765 43210'}</div>
              <div><strong>Email:</strong> {currentInvoice.clientEmail || 'client@example.com'}</div>
            </div>
          </div>

          <div className="ent-info-card">
            <div className="ent-info-card__header">
              <i className="pi pi-calendar text-primary mr-2" />
              <span>EVENT & VENUE DETAILS</span>
            </div>
            <div className="ent-info-card__title">{currentInvoice.eventName || 'Wedding & Reception'}</div>
            <div className="ent-info-card__details">
              <div><strong>Event Date:</strong> {currentInvoice.eventDate || '12 Aug 2026'}</div>
              <div><strong>Venue:</strong> {currentInvoice.venue || 'The Grand Chateau'}</div>
            </div>
          </div>
        </div>

        {/* Individual Line Items Table */}
        <div className="ent-invoice-table-wrapper">
          <div className="ent-table-section-title">
            <i className="pi pi-list text-primary mr-2" />
            <span>INCLUDED SERVICES & LINE ITEMS</span>
          </div>

          <table className="ent-invoice-table">
            <thead>
              <tr>
                <th className="text-left" style={{ width: '40%' }}>Service / Item Description</th>
                <th className="text-center" style={{ width: '15%' }}>Category</th>
                <th className="text-center" style={{ width: '8%' }}>Qty</th>
                <th className="text-right" style={{ width: '15%' }}>Unit Price</th>
                <th className="text-right" style={{ width: '22%' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {rawServices.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="ent-item-name">{s.name}</div>
                    <div className="ent-item-sub">{s.description || 'Full HD/4K coverage, edited deliverables'}</div>
                  </td>
                  <td className="text-center">
                    <span className="ent-category-pill">{s.category || 'Photography'}</span>
                  </td>
                  <td className="text-center font-semibold">{s.qty || 1}</td>
                  <td className="text-right">₹{(s.unitPrice || s.price || 0).toLocaleString('en-IN')}</td>
                  <td className="text-right font-bold text-primary">₹{(s.total || (s.qty || 1) * (s.unitPrice || s.price || 0)).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {/* Summary Grid */}
        <div className="ent-invoice-summary-grid">
          <div className="ent-terms-column">
            <div className="ent-payment-info-box">
              <div className="ent-box-title">Bank Transfer & UPI Details</div>
              <div className="ent-box-content text-xs">
                <div>Bank: State Bank of India</div>
                <div>Account No: <strong>1234 5678 9012</strong> | IFSC: <strong>SBIN0001234</strong></div>
                <div>UPI ID: <code>photostudiopro@sbi</code></div>
              </div>
            </div>

            {currentInvoice.payments && currentInvoice.payments.length > 0 && (
              <div className="ent-history-box">
                <div className="ent-box-title">Payment History Log</div>
                <table className="ent-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Method</th>
                      <th className="text-right">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.payments.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.date}</td>
                        <td className="font-medium">{p.type}</td>
                        <td className="text-muted">{p.method}</td>
                        <td className="text-right font-bold text-emerald-700">₹{(p.amount || 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="ent-totals-card">
            <div className="ent-totals-header">PRICING SUMMARY</div>

            <div className="ent-totals-row">
              <span>Subtotal</span>
              <span>₹{(currentInvoice.subtotal || 0).toLocaleString('en-IN')}</span>
            </div>

            {currentInvoice.discount > 0 && (
              <div className="ent-totals-row text-emerald-600">
                <span>Discount</span>
                <span>- ₹{(currentInvoice.discount || 0).toLocaleString('en-IN')}</span>
              </div>
            )}



            <div className="ent-totals-row">
              <span>GST ({currentInvoice.taxPercent || 18}%)</span>
              <span>₹{(currentInvoice.taxAmount || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="ent-totals-row is-grand-total">
              <span>Grand Total</span>
              <span>₹{(currentInvoice.grandTotal || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="ent-totals-row is-paid">
              <span>Total Paid</span>
              <span>- ₹{(currentInvoice.totalPaid || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className={`ent-totals-row is-balance-due ${currentInvoice.balance === 0 ? 'is-settled' : ''}`}>
              <span>Balance Due</span>
              <span>₹{(currentInvoice.balance || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ent-invoice-footer">
          <div className="ent-footer-note">
            Thank you for trusting <strong>{studioName}</strong> with your wedding memories!
            <br />
            <span className="text-xs text-muted">This is an official computer-generated GST tax invoice. No signature required.</span>
          </div>

          <div className="ent-signature-box">
            <div className="ent-signature-line" />
            <div className="ent-signature-title">Authorized Signatory</div>
            <div className="ent-signature-sub">{studioName} Management</div>
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
            <Button label="Cancel" className="p-button-text p-button-sm" onClick={() => setIsPayModalOpen(false)} />
            <Button label="Save Payment" icon="pi pi-check" className="p-button-success p-button-sm" onClick={handleRecordPayment} />
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
                options={['UPI', 'Cash', 'Bank Transfer', 'Cheque']}
                onChange={(e) => setPayMethod(e.value)}
                className="w-full"
              />
            </div>

            <div className="col-6">
              <label className="block font-bold mb-1">Payment Type</label>
              <Dropdown
                value={payType}
                options={['Advance Payment', 'Second Payment', 'Final Balance', 'Part Payment']}
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
        </div>
      </Dialog>
    </div>
  )
}
