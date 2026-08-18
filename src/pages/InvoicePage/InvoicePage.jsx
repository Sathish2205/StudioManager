import React from 'react'
import { Tag } from 'primereact/tag'
import './InvoicePage.css'

export default function InvoicePage({ event, onNavigateEvents, onNavigateWorkflow }) {
  // Default Fallback Event if none passed
  const invoiceData = event || {
    id: 'EVT-2026-0891',
    couple: 'Ananya & Vikram Sharma',
    clientName: 'Ananya Sharma',
    clientPhone: '+91 98765 43210',
    clientEmail: 'ananya.sharma@example.com',
    eventType: 'Royal Wedding & Reception',
    date: '2026-08-20',
    time: '08:00 AM - 11:00 PM',
    venue: 'Leela Palace Ballroom, Bengaluru',
    package: 'Royal Cinematic 4K + Album Luxe',
    amount: '₹1,85,000',
    advancePaid: '₹75,000',
    balanceAmount: '₹1,10,000',
    paymentStatus: 'Deposit Paid (40%)',
    photographer: 'Sathish Kumar & Lead Team'
  }

  const rawId = String(invoiceData.id || invoiceData._id || 'EVT-2026-0891')
  const invoiceNumStr = rawId.includes('EVT') ? rawId.replace('EVT', 'INV') : `INV-${rawId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`

  // Calculate Numerical Totals
  const parseAmt = (val) => {
    if (!val && val !== 0) return 0
    if (typeof val === 'number') return val
    return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0
  }

  const totalCost = parseAmt(invoiceData.amount || invoiceData.packageAmount || '185000')
  const advancePaid = parseAmt(invoiceData.advancePaid || invoiceData.advanceAmount || '75000')
  const balanceDue = Math.max(0, parseAmt(invoiceData.balanceAmount) || (totalCost - advancePaid))
  const gstTax = Math.round(totalCost * 0.18)
  const grandTotal = totalCost + gstTax

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="invoice-page-container">
      {/* ── Actions Header Bar (Hidden when printing) ── */}
      <div className="invoice-actions-bar">
        <div>
          <h2 className="invoice-actions-bar__title">
            <i className="pi pi-check-circle text-green-600 mr-2" />
            Event Created & Invoice Generated
          </h2>
          <p className="invoice-actions-bar__subtitle">
            Invoice #{invoiceNumStr} ready for client delivery and printing
          </p>
        </div>

        <div className="invoice-actions-bar__btn-group">
          {onNavigateEvents && (
            <button className="inv-btn inv-btn-secondary" onClick={onNavigateEvents}>
              <i className="pi pi-arrow-left" />
              <span>Back to Events</span>
            </button>
          )}
          {onNavigateWorkflow && (
            <button className="inv-btn inv-btn-info" onClick={onNavigateWorkflow}>
              <i className="pi pi-sitemap" />
              <span>Workflow List</span>
            </button>
          )}
          <button className="inv-btn inv-btn-primary" onClick={handlePrint}>
            <i className="pi pi-print" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* ── Printable A4 Invoice Card ── */}
      <div className="invoice-card">
        {/* Studio Branding & Invoice Details */}
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
              Invoice No: <strong>{invoiceNumStr}</strong>
            </div>
            <div className="invoice-meta-row">
              Date: <strong>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            </div>
            <div className="invoice-meta-row">
              Status: <Tag value={balanceDue === 0 ? 'PAID IN FULL' : 'DEPOSIT PAID'} severity={balanceDue === 0 ? 'success' : 'warning'} />
            </div>
          </div>
        </div>

        {/* Client & Event Info Section */}
        <div className="invoice-info-section">
          <div>
            <div className="invoice-info-block__label">BILLED TO CLIENT</div>
            <div className="invoice-info-block__title">{invoiceData.clientName || invoiceData.couple}</div>
            <div className="invoice-info-block__text">
              Phone: {invoiceData.clientPhone || '+91 98765 43210'}
              <br />
              Email: {invoiceData.clientEmail || 'client@example.com'}
            </div>
          </div>

          <div>
            <div className="invoice-info-block__label">EVENT & VENUE DETAILS</div>
            <div className="invoice-info-block__title">{invoiceData.eventType || 'Wedding & Reception'}</div>
            <div className="invoice-info-block__text">
              Date: {invoiceData.date || invoiceData.eventDate || '2026-08-20'}
              <br />
              Venue: {invoiceData.venue || 'Main Banquet Hall'}
            </div>
          </div>
        </div>

        {/* Particulars Table */}
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Description & Photography Package</th>
              <th className="text-right">Qty / Event</th>
              <th className="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="invoice-item__name">{invoiceData.package || 'Royal Cinematic 4K Photography & Film Package'}</div>
                <div className="invoice-item__desc">
                  Includes 4K Cinematic Highlights, Full Event Coverage, Lead Photographer ({invoiceData.photographer || 'Sathish Kumar'}), Drone Aerial Views, Luxe Hardbound Album.
                </div>
              </td>
              <td className="text-right">1 Shoot</td>
              <td className="text-right font-semibold">₹{totalCost.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Summary & Totals Block */}
        <div className="invoice-summary-container">
          <div className="invoice-payment-terms">
            <div className="invoice-terms__title">Payment Terms & Notes</div>
            <div className="invoice-terms__text">
              • 50% advance required upon booking to confirm camera crew.
              <br />
              • Balance payment payable prior to album printing & final video delivery.
              <br />• All payments made via Bank Transfer, UPI, or Cheque to PhotoStudio PRO.
            </div>
          </div>

          <div className="invoice-totals-box">
            <div className="invoice-total-row">
              <span>Subtotal</span>
              <span>₹{totalCost.toLocaleString()}</span>
            </div>
            <div className="invoice-total-row">
              <span>GST (18% Tax)</span>
              <span>₹{gstTax.toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-grand">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="invoice-total-row is-paid">
              <span>Advance Paid</span>
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
            Thank you for choosing PhotoStudio PRO to capture your precious wedding memories!
          </div>

          <div className="invoice-signature-box">
            <div className="invoice-signature__line" />
            <div className="invoice-signature__title">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </div>
  )
}
