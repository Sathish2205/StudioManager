import React, { useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { recordPayment } from '../../services/financeService'
import { downloadPdfFromElement } from '../../utils/generatePdf'
import { useAuth } from '../../context/AuthContext'
import './InvoicePage.css'

export default function InvoicePage({ event, onNavigateEvents, onNavigateWorkflow, onShowToast }) {
  // Extract Raw Event Data (passed dynamically from AddEventPage / Events List / Props)
  const raw = event?.rawEvent || event?.data || event || {}

  // Parse Numerical Amounts
  const parseAmt = (val) => {
    if (!val && val !== 0) return 0
    if (typeof val === 'number') return val
    return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0
  }

  // Auth Context / Dynamic Studio Branding
  const { tenant, user } = useAuth ? useAuth() : {}
  const studioName = tenant?.companyName || user?.studioName || raw.studioName || raw.studio || 'ABC Photography'

  // Dynamic Header Fields
  const rawId = String(raw._id || raw.id || raw.eventId || 'NEW')
  const invoiceNumStr = rawId.includes('EVT') 
    ? rawId.replace('EVT', 'INV') 
    : `INV-${rawId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`

  const clientName = raw.clientName || raw.couple || (raw.clientId ? `${raw.clientId.firstName || ''} ${raw.clientId.lastName || ''}`.trim() : '') || 'Valued Client'
  const clientPhone = raw.clientPhone || raw.clientId?.phone || '+91 98450 12345'
  const clientEmail = raw.clientEmail || raw.clientId?.email || 'client@example.com'

  const eventName = raw.eventName || raw.couple || 'Wedding & Reception Shoot'
  const eventType = raw.eventType || 'Wedding'
  
  let formattedDate = '22 Sept 2026'
  if (raw.eventDate || raw.date) {
    const d = new Date(raw.eventDate || raw.date)
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    } else {
      formattedDate = String(raw.eventDate || raw.date)
    }
  }

  const venueLocation = raw.venue || raw.venueName 
    ? `${raw.venueName || raw.venue}${raw.city ? `, ${raw.city}` : ''}` 
    : 'Grand Palace Hall, Bengaluru'
    
  const packageName = raw.package || raw.packageName || 'Custom Photography Package'
  const leadPhotographer = raw.photographer || (raw.assignedPhotographers?.[0]?.name) || 'Lead Photographer'
  const leadVideographer = raw.videographer || 'Lead Videographer'

  // Dynamic Line Items Resolution Engine
  const resolveLineItems = () => {
    const items = []

    // Case 1: Custom services explicitly added to the event
    if (Array.isArray(raw.customServices) && raw.customServices.length > 0) {
      raw.customServices.forEach((cs, idx) => {
        const name = cs.name || cs.serviceName || 'Custom Service'
        const price = parseAmt(cs.price || cs.unitPrice || 0)
        
        let category = 'Photography'
        const lower = name.toLowerCase()
        if (lower.includes('video') || lower.includes('cinematic') || lower.includes('teaser')) category = 'Videography'
        else if (lower.includes('drone') || lower.includes('aerial')) category = 'Aerial Shoot'
        else if (lower.includes('stream') || lower.includes('live')) category = 'Webcast'
        else if (lower.includes('album') || lower.includes('print') || lower.includes('canvera')) category = 'Album & Print'
        else if (lower.includes('photographer') || lower.includes('staff') || lower.includes('crew') || lower.includes('lead')) category = 'Staffing'

        const discount = parseAmt(cs.discount || 0)
        const taxable = Math.max(0, price - discount)
        const tax = Math.round(taxable * 0.18)

        items.push({
          id: cs._id || cs.id || `cs-${idx}`,
          name,
          category,
          qty: cs.qty || 1,
          unitPrice: price,
          discount,
          tax,
          total: taxable + tax
        })
      })
    } else {
      // Case 2: Package / Coverage checkboxes breakdown
      const defaultServices = []

      if (raw.candidPhotography || raw.droneRequired || raw.liveStreaming || raw.albumRequired || raw.traditionalPhotography || raw.traditionalVideo) {
        if (raw.candidPhotography) defaultServices.push({ name: 'Candid Cinematic Photography', category: 'Photography', baseWeight: 5000 })
        if (raw.traditionalPhotography) defaultServices.push({ name: 'Traditional Stage Photography', category: 'Photography', baseWeight: 3000 })
        if (raw.traditionalVideo) defaultServices.push({ name: 'Traditional Video Recording', category: 'Videography', baseWeight: 4000 })
        if (raw.droneRequired) defaultServices.push({ name: '4K Drone Aerial Coverage', category: 'Aerial Shoot', baseWeight: 3000 })
        if (raw.liveStreaming) defaultServices.push({ name: 'Live YouTube Webcast Stream', category: 'Webcast', baseWeight: 2500 })
        if (raw.albumRequired) defaultServices.push({ name: 'Printed Canvera Hardbound Album', category: 'Album & Print', baseWeight: 3500 })
      } else {
        // Fallback standard breakdown totaling ₹13,000
        defaultServices.push({ name: 'Candid Cinematic Photography', category: 'Photography', baseWeight: 5000 })
        defaultServices.push({ name: 'Traditional Stage Photography', category: 'Photography', baseWeight: 3000 })
        defaultServices.push({ name: 'Traditional Video Recording', category: 'Videography', baseWeight: 4000 })
        defaultServices.push({ name: `Lead Photographer (${leadPhotographer})`, category: 'Staffing', baseWeight: 1000 })
      }

      // Always ensure Lead Photographer is listed if missing
      if (!defaultServices.some(s => s.name.toLowerCase().includes('lead photographer'))) {
        defaultServices.push({ name: `Lead Photographer (${leadPhotographer})`, category: 'Staffing', baseWeight: 1000 })
      }

      const totalPkgCost = parseAmt(raw.packageAmount || raw.packagePrice || raw.amount || raw.totalAmount || 13000)
      const weightSum = defaultServices.reduce((sum, s) => sum + s.baseWeight, 0)

      defaultServices.forEach((svc, index) => {
        let unitPrice = 0
        if (weightSum > 0) {
          if (index === defaultServices.length - 1) {
            const currentSum = items.reduce((acc, item) => acc + item.unitPrice, 0)
            unitPrice = Math.max(0, totalPkgCost - currentSum)
          } else {
            unitPrice = Math.round((svc.baseWeight / weightSum) * totalPkgCost)
          }
        } else {
          unitPrice = Math.round(totalPkgCost / defaultServices.length)
        }

        const tax = Math.round(unitPrice * 0.18)
        items.push({
          id: `pkg-item-${index + 1}`,
          name: svc.name,
          category: svc.category,
          qty: 1,
          unitPrice,
          discount: 0,
          tax,
          total: unitPrice + tax
        })
      })
    }

    return items
  }

  const lineItems = resolveLineItems()

  // Dynamic Financial Calculations
  const servicesSubtotal = lineItems.reduce((sum, item) => sum + item.unitPrice, 0)
  const totalDiscount = lineItems.reduce((sum, item) => sum + item.discount, 0)
  const taxableAmount = Math.max(0, servicesSubtotal - totalDiscount)
  const totalGstTax = lineItems.reduce((sum, item) => sum + item.tax, 0) || Math.round(taxableAmount * 0.18)
  const grandTotal = taxableAmount + totalGstTax

  // Payment Tracking State
  const initialAdvance = parseAmt(raw.advanceAmount || raw.advancePaid || raw.totalPaid || raw.paidAmount || 0)
  const [advancePaid, setAdvancePaid] = useState(initialAdvance)
  const balanceDue = Math.max(0, grandTotal - advancePaid)

  // Payment History State
  const [paymentsList, setPaymentsList] = useState(() => {
    if (initialAdvance > 0) {
      return [{
        id: 'PAY-1001',
        date: formattedDate,
        type: 'Advance Booking Deposit',
        method: 'Bank Transfer / UPI',
        ref: 'TXN981247',
        amount: initialAdvance
      }]
    }
    return []
  })

  // Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState(balanceDue || 5000)
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
      id: `PAY-${1000 + paymentsList.length + 1}`,
      date: payDate,
      type: payType,
      method: payMethod,
      ref: payRef || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      amount: Number(payAmount)
    }

    const newTotalPaid = advancePaid + Number(payAmount)
    setAdvancePaid(newTotalPaid)
    setPaymentsList([newPayment, ...paymentsList])

    try {
      await recordPayment({
        eventId: raw._id || raw.id || null,
        clientId: raw.clientId?._id || raw.clientId || null,
        amount: Number(payAmount),
        paymentDate: payDate,
        paymentMethod: payMethod,
        transactionId: payRef,
        paymentType: payType
      })
    } catch {
      // Local fallback
    }

    setIsPayModalOpen(false)
    triggerToast(`Recorded payment of ₹${payAmount.toLocaleString('en-IN')} via ${payMethod}!`, 'success')
  }

  const handleDownloadPdf = () => {
    downloadPdfFromElement('printable-invoice-card', `${invoiceNumStr}.pdf`)
    triggerToast('Downloading official GST Tax Invoice PDF...', 'info')
  }

  const handlePrint = () => {
    window.print()
  }

  // Status Badge Logic
  let statusLabel = 'DEPOSIT PAID'
  let statusSeverity = 'warning'
  if (balanceDue === 0 && grandTotal > 0) {
    statusLabel = 'PAID IN FULL'
    statusSeverity = 'success'
  } else if (advancePaid === 0) {
    statusLabel = 'PENDING DEPOSIT'
    statusSeverity = 'danger'
  } else if (advancePaid > 0) {
    statusLabel = 'PARTIALLY PAID'
    statusSeverity = 'info'
  }

  return (
    <div className="ent-invoice-container">
      {/* ── Actions Bar Header (Hidden in Print) ── */}
      <div className="ent-invoice-actions-bar no-print">
        <div className="ent-invoice-actions-bar__info">
          <div className="flex align-items-center gap-2">
            <h2 className="ent-invoice-actions-bar__title">
              Invoice #{invoiceNumStr}
            </h2>
            <Tag value={statusLabel} severity={statusSeverity} className="ent-status-badge" outlined />
          </div>
          <p className="ent-invoice-actions-bar__subtitle">
            Official Enterprise Tax Invoice ready for client delivery, email, and GST filing.
          </p>
        </div>

        <div className="ent-invoice-actions-bar__btn-group">
          {onNavigateEvents && (
            <Button
              label="Back to Events"
              icon="pi pi-arrow-left"
              className="p-button-outlined p-button-secondary p-button-sm"
              onClick={onNavigateEvents}
            />
          )}
          {onNavigateWorkflow && (
            <Button
              label="Workflow"
              icon="pi pi-sitemap"
              className="p-button-outlined p-button-secondary p-button-sm"
              onClick={onNavigateWorkflow}
            />
          )}
          {balanceDue > 0 && (
            <Button
              label="Record Payment"
              icon="pi pi-plus-circle"
              className="p-button-outlined p-button-success p-button-sm"
              onClick={() => {
                setPayAmount(balanceDue)
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

      {/* ── Printable Enterprise A4 Invoice Document ── */}
      <div className="ent-invoice-card" id="printable-invoice-card">
        {/* Studio Branding & Invoice Header */}
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
              <strong>{invoiceNumStr}</strong>
            </div>
            <div className="ent-invoice-meta__row">
              <span>Invoice Date:</span>
              <strong>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            </div>
            <div className="ent-invoice-meta__row">
              <span>Event Date:</span>
              <strong>{formattedDate}</strong>
            </div>
            <div className="ent-invoice-meta__row">
              <span>Payment Status:</span>
              <Tag value={statusLabel} severity={statusSeverity} className="ent-meta-status-tag" outlined />
            </div>
          </div>
        </div>

        {/* Client & Event Info Section */}
        <div className="ent-invoice-info-grid">
          <div className="ent-info-card">
            <div className="ent-info-card__header">
              <i className="pi pi-user text-primary mr-2" />
              <span>BILLED TO CLIENT</span>
            </div>
            <div className="ent-info-card__title">{clientName}</div>
            <div className="ent-info-card__details">
              <div><strong>Phone:</strong> {clientPhone}</div>
              <div><strong>Email:</strong> {clientEmail}</div>
              <div><strong>Location:</strong> {raw.city || 'Bengaluru, India'}</div>
            </div>
          </div>

          <div className="ent-info-card">
            <div className="ent-info-card__header">
              <i className="pi pi-calendar text-primary mr-2" />
              <span>EVENT & VENUE DETAILS</span>
            </div>
            <div className="ent-info-card__title">{eventName} ({eventType})</div>
            <div className="ent-info-card__details">
              <div><strong>Shoot Date:</strong> {formattedDate}</div>
              <div><strong>Venue:</strong> {venueLocation}</div>
              <div><strong>Assigned Team:</strong> {leadPhotographer} (Lead), {leadVideographer}</div>
            </div>
          </div>
        </div>

        {/* ── Individual Services Line Items Table ── */}
        <div className="ent-invoice-table-wrapper">
          <div className="ent-table-section-title">
            <i className="pi pi-list text-primary mr-2" />
            <span>INCLUDED SERVICES & LINE ITEMS</span>
          </div>

          <table className="ent-invoice-table">
            <thead>
              <tr>
                <th className="text-left" style={{ width: '38%' }}>Service / Item Description</th>
                <th className="text-center" style={{ width: '14%' }}>Category</th>
                <th className="text-center" style={{ width: '8%' }}>Qty</th>
                <th className="text-right" style={{ width: '13%' }}>Unit Price</th>
                <th className="text-right" style={{ width: '11%' }}>Discount</th>
                <th className="text-right" style={{ width: '16%' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>
                    <div className="ent-item-name">{item.name}</div>
                    <div className="ent-item-sub">Full HD / 4K cinematic delivery, professional color correction</div>
                  </td>
                  <td className="text-center">
                    <span className="ent-category-pill">{item.category}</span>
                  </td>
                  <td className="text-center font-semibold">{item.qty}</td>
                  <td className="text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="text-right text-muted">{item.discount > 0 ? `- ₹${item.discount.toLocaleString('en-IN')}` : '₹0'}</td>
                  <td className="text-right font-bold text-primary">₹{item.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {/* ── Financial Summary & Payment Details Grid ── */}
        <div className="ent-invoice-summary-grid">
          {/* Left: Payment Terms & History */}
          <div className="ent-terms-column">
            <div className="ent-payment-info-box">
              <div className="ent-box-title">
                <i className="pi pi-credit-card text-primary mr-2" />
                <span>Bank Transfer & UPI Details</span>
              </div>
              <div className="ent-box-content text-xs">
                <div><strong>Bank Name:</strong> State Bank of India</div>
                <div><strong>Account Name:</strong> {studioName}</div>
                <div><strong>Account No:</strong> 1234 5678 9012</div>
                <div><strong>IFSC Code:</strong> SBIN0001234</div>
                <div><strong>UPI ID:</strong> <code>{studioName.toLowerCase().replace(/[^a-z0-9]/g, '')}@sbi</code></div>
              </div>
            </div>

            {/* Payment History Log */}
            {paymentsList.length > 0 && (
              <div className="ent-history-box">
                <div className="ent-box-title">
                  <i className="pi pi-history text-primary mr-2" />
                  <span>Payment History Log</span>
                </div>
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
                    {paymentsList.map((p, i) => (
                      <tr key={i}>
                        <td>{p.date}</td>
                        <td className="font-medium">{p.type}</td>
                        <td className="text-muted">{p.method}</td>
                        <td className="text-right font-bold text-emerald-700">₹{p.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="ent-policy-box">
              <div className="ent-box-title">
                <i className="pi pi-shield text-primary mr-2" />
                <span>Studio Terms & Conditions</span>
              </div>
              <ul className="ent-policy-list">
                <li>50% advance deposit required to confirm event booking & lock crew dates.</li>
                <li>Net balance payable prior to final album printing & 4K video delivery.</li>
                <li>All payments subject to 18% GST as per Indian Tax Regulations.</li>
              </ul>
            </div>
          </div>

          {/* Right: Totals Card */}
          <div className="ent-totals-card">
            <div className="ent-totals-header">PRICING SUMMARY</div>

            <div className="ent-totals-row">
              <span>Services Subtotal</span>
              <span>₹{servicesSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="ent-totals-row text-emerald-600">
                <span>Total Discount</span>
                <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="ent-totals-row">
              <span>Taxable Amount</span>
              <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="ent-totals-row">
              <span>GST (18% Govt Tax)</span>
              <span>₹{totalGstTax.toLocaleString('en-IN')}</span>
            </div>

            <div className="ent-totals-row is-grand-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="ent-totals-row is-paid">
              <span>Amount Paid</span>
              <span>- ₹{advancePaid.toLocaleString('en-IN')}</span>
            </div>

            <div className={`ent-totals-row is-balance-due ${balanceDue === 0 ? 'is-settled' : ''}`}>
              <span>Net Balance Due</span>
              <span>₹{balanceDue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Signoff */}
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

      {/* ── Record Payment Dialog ── */}
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
            <InputNumber value={payAmount} onValueChange={(e) => setPayAmount(e.value)} className="w-full" min={1} max={balanceDue || 1000000} />
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
              <InputText value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. UPI981247" className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
