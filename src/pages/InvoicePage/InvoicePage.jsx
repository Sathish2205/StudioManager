import React from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import './InvoicePage.css'

export default function InvoicePage({ event, onNavigateEvents, onNavigateWorkflow }) {
  // Extract Raw Event Data (passed dynamically from AddEventPage / Events List / Props)
  const raw = event?.rawEvent || event?.data || event || {}

  // Parse Numerical Amounts
  const parseAmt = (val) => {
    if (!val && val !== 0) return 0
    if (typeof val === 'number') return val
    return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0
  }

  // Dynamic Fields
  const rawId = String(raw._id || raw.id || raw.eventId || 'EVT-2026-0891')
  const invoiceNumStr = rawId.includes('EVT') ? rawId.replace('EVT', 'INV') : `INV-${rawId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`

  const clientName = raw.clientName || raw.couple || (raw.clientId ? `${raw.clientId.firstName || ''} ${raw.clientId.lastName || ''}`.trim() : '') || 'Ananya & Vikram Sharma'
  const clientPhone = raw.clientPhone || raw.clientId?.phone || '+91 98765 43210'
  const clientEmail = raw.clientEmail || raw.clientId?.email || 'client@example.com'

  const eventName = raw.eventName || raw.couple || 'Royal Wedding & Reception'
  const eventType = raw.eventType || 'Wedding & Reception'
  
  let formattedDate = '2026-08-20'
  if (raw.eventDate || raw.date) {
    const d = new Date(raw.eventDate || raw.date)
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    } else {
      formattedDate = String(raw.eventDate || raw.date)
    }
  }

  const venueLocation = raw.venue || raw.venueName ? `${raw.venueName || raw.venue}${raw.city ? `, ${raw.city}` : ''}` : 'Leela Palace Ballroom, Bengaluru'
  const packageName = raw.package || raw.packageName || 'Royal Cinematic 4K Photography & Film Package'
  const leadPhotographer = raw.photographer || (raw.assignedPhotographers?.[0]?.name) || 'Sathish Kumar & Lead Team'

  // Dynamic Included Services List
  const serviceItems = []
  if (raw.droneRequired) serviceItems.push('Drone 4K Aerial Coverage')
  if (raw.liveStreaming) serviceItems.push('YouTube Live Stream Webcast')
  if (raw.albumRequired) serviceItems.push('Printed Canvera Hardbound Album')
  if (raw.candidPhotography) serviceItems.push('Candid Cinematic Photography')
  if (raw.traditionalPhotography) serviceItems.push('Traditional Stage Photography')
  if (raw.traditionalVideo) serviceItems.push('Traditional Video Recording')

  const deliverablesDescription = serviceItems.length > 0
    ? `Includes: ${serviceItems.join(', ')}. Lead Photographer: ${leadPhotographer}.`
    : `Includes 4K Cinematic Highlights, Full Event Coverage, Lead Photographer (${leadPhotographer}), Drone Aerial Views, Luxe Hardbound Album.`

  // Dynamic Financial Calculations
  const totalCost = parseAmt(raw.packageAmount || raw.packagePrice || raw.amount || raw.totalAmount || 185000)
  const advancePaid = parseAmt(raw.advanceAmount || raw.advancePaid || raw.totalPaid || raw.paidAmount || 75000)
  const balanceDue = Math.max(0, parseAmt(raw.balanceAmount) || (totalCost - advancePaid))
  const gstTax = Math.round(totalCost * 0.18)
  const grandTotal = totalCost + gstTax

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="invoice-page-container">
      {/* ── Actions Header Bar (Hidden when printing) ── */}
      <div className="invoice-actions-bar no-print">
        <div>
          <h2 className="invoice-actions-bar__title">
            <i className="pi pi-check-circle text-green-600 mr-2" />
            Event Created & Tax Invoice Generated
          </h2>
          <p className="invoice-actions-bar__subtitle">
            Official Invoice #{invoiceNumStr} ready for client delivery, email, and printing
          </p>
        </div>

        <div className="invoice-actions-bar__btn-group">
          {onNavigateEvents && (
            <Button
              label="Back to Events"
              icon="pi pi-arrow-left"
              className="p-button-outlined p-button-secondary"
              onClick={onNavigateEvents}
            />
          )}
          {onNavigateWorkflow && (
            <Button
              label="Workflow List"
              icon="pi pi-sitemap"
              className="p-button-outlined p-button-secondary"
              onClick={onNavigateWorkflow}
            />
          )}
          <Button
            label="Print Invoice"
            icon="pi pi-print"
            className="p-button-primary"
            onClick={handlePrint}
          />
        </div>
      </div>

      {/* ── Printable A4 Invoice Document Card ── */}
      <div className="invoice-card">
        {/* Studio Branding & Invoice Details Header */}
        <div className="invoice-header">
          <div className="invoice-brand-col">
            <div className="invoice-brand__name">
              PhotoStudio <i className="pi pi-camera text-primary mx-1" /> PRO<sup>®</sup>
            </div>
            <div className="invoice-brand__sub">PREMIUM CINEMATIC PHOTOGRAPHY & ALBUMS</div>
            <div className="invoice-studio-details">
              Studio #42, Luxury Plaza, Residency Road, Bengaluru, 560025
              <br />
              GSTIN: <strong>29AAACP9988C1Z4</strong> | Contact: <strong>+91 98450 12345</strong> | info@photostudiopro.com
            </div>
          </div>

          <div className="invoice-meta-box">
            <div className="invoice-title">TAX INVOICE</div>
            <div className="invoice-meta-row">
              <span className="invoice-meta-label">Invoice No:</span>
              <strong className="invoice-meta-val">{invoiceNumStr}</strong>
            </div>
            <div className="invoice-meta-row">
              <span className="invoice-meta-label">Date:</span>
              <strong className="invoice-meta-val">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            </div>
            <div className="invoice-meta-row">
              <span className="invoice-meta-label">Status:</span>
              <Tag
                value={balanceDue === 0 ? 'PAID IN FULL' : 'DEPOSIT PAID'}
                severity={balanceDue === 0 ? 'success' : 'warning'}
                className="invoice-status-tag"
              />
            </div>
          </div>
        </div>

        {/* Client & Event Info Cards */}
        <div className="invoice-info-section">
          <div className="invoice-info-card">
            <div className="invoice-info-block__label">
              <i className="pi pi-user mr-1 text-primary" /> BILLED TO CLIENT
            </div>
            <div className="invoice-info-block__title">{clientName}</div>
            <div className="invoice-info-block__text">
              <strong>Phone:</strong> {clientPhone}
              <br />
              <strong>Email:</strong> {clientEmail}
            </div>
          </div>

          <div className="invoice-info-card">
            <div className="invoice-info-block__label">
              <i className="pi pi-calendar mr-1 text-primary" /> EVENT & VENUE DETAILS
            </div>
            <div className="invoice-info-block__title">{eventName} ({eventType})</div>
            <div className="invoice-info-block__text">
              <strong>Date:</strong> {formattedDate}
              <br />
              <strong>Venue:</strong> {venueLocation}
            </div>
          </div>
        </div>

        {/* Particulars Table */}
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th className="text-left">Description & Photography Package</th>
              <th className="text-center" style={{ width: '120px' }}>Qty</th>
              <th className="text-right" style={{ width: '150px' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="invoice-item__name">{packageName}</div>
                <div className="invoice-item__desc">
                  {deliverablesDescription}
                </div>
              </td>
              <td className="text-center font-semibold">1 Shoot</td>
              <td className="text-right font-bold text-primary">₹{totalCost.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Summary & Totals Block */}
        <div className="invoice-summary-container">
          <div className="invoice-payment-terms">
            <div className="invoice-terms__title">
              <i className="pi pi-shield mr-1 text-primary" /> Payment Terms & Studio Policies
            </div>
            <div className="invoice-terms__text">
              • 50% advance required upon booking confirmation to lock camera crew dates.
              <br />
              • Balance payment payable prior to Canvera album printing & final 4K video delivery.
              <br />
              • All payments made via Bank Transfer, HDFC UPI, or Cheque to <strong>PhotoStudio PRO</strong>.
            </div>
          </div>

          <div className="invoice-totals-box">
            <div className="invoice-total-row">
              <span>Package Subtotal</span>
              <span>₹{totalCost.toLocaleString()}</span>
            </div>
            <div className="invoice-total-row">
              <span>GST (18% Govt Tax)</span>
              <span>₹{gstTax.toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-grand">
              <span>Grand Total (Incl Tax)</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-paid">
              <span>Advance Deposit Paid</span>
              <span>- ₹{advancePaid.toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-due">
              <span>Net Balance Payable</span>
              <span>₹{balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Signoff */}
        <div className="invoice-footer">
          <div className="invoice-footer__note">
            Thank you for choosing <strong>PhotoStudio PRO</strong> to capture your precious wedding memories!
            <br />
            <span className="text-xs text-muted">This is a computer-generated official tax invoice.</span>
          </div>

          <div className="invoice-signature-box">
            <div className="invoice-signature__line" />
            <div className="invoice-signature__title">Authorized Signatory</div>
            <div className="invoice-signature__sub">PhotoStudio PRO Management</div>
          </div>
        </div>
      </div>
    </div>
  )
}
