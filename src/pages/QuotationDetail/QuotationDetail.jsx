import React, { useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { updateQuotationStatus, convertQuotationToInvoice } from '../../services/quotationService'
import { downloadPdfFromElement } from '../../utils/generatePdf'
import './QuotationDetail.css'

export default function QuotationDetail({ quotation, onNavigateBack, onNavigateEdit, onNavigateInvoiceDetail, onShowToast }) {
  const [currentQuotation, setCurrentQuotation] = useState(quotation || {
    quotationNumber: 'QT-2026-001',
    clientName: 'Sophia & James Sterling',
    clientPhone: '+91 98765 43210',
    clientEmail: 'sophia.sterling@example.com',
    eventName: 'Wedding & Reception',
    eventDate: '2026-08-12',
    venue: 'The Grand Chateau, Napa Valley',
    date: '2026-08-01',
    validUntil: '2026-09-01',
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
    status: 'Sent',
    notes: '• 50% advance required upon booking.\n• Balance payment payable prior to album printing.\n• All payments made via Bank Transfer, UPI, or Cheque.'
  })

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleStatusChange = async (newStatus) => {
    const updated = await updateQuotationStatus(currentQuotation._id || currentQuotation.id, newStatus)
    if (updated) {
      setCurrentQuotation({ ...currentQuotation, status: newStatus })
      triggerToast(`Quotation status changed to "${newStatus}"`, 'success')
    } else {
      setCurrentQuotation({ ...currentQuotation, status: newStatus })
      triggerToast(`Quotation updated to "${newStatus}"`, 'success')
    }
  }

  const handleConvertToInvoice = async () => {
    const createdInvoice = await convertQuotationToInvoice(currentQuotation._id || currentQuotation.id)
    if (createdInvoice) {
      triggerToast(`Quotation ${currentQuotation.quotationNumber} converted to Invoice ${createdInvoice.invoiceNumber || 'INV-2026-001'}!`, 'success')
      if (onNavigateInvoiceDetail) {
        onNavigateInvoiceDetail(createdInvoice)
      }
    }
  }

  const handleDownloadPdf = () => {
    downloadPdfFromElement('printable-quotation-card', `${currentQuotation.quotationNumber || 'Quotation'}.pdf`)
    triggerToast('Generating PDF download...', 'info')
  }

  const handlePrint = () => {
    window.print()
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Accepted': return 'success'
      case 'Sent': return 'info'
      case 'Viewed': return 'warning'
      case 'Rejected': return 'danger'
      case 'Expired': return 'warning'
      default: return 'secondary'
    }
  }

  return (
    <div className="quote-detail-container">
      {/* Action Navigation Top Bar */}
      <div className="quote-detail-actions-bar">
        <div>
          <button className="quote-detail__back-btn" onClick={onNavigateBack}>
            <i className="pi pi-arrow-left" /> Back to Quotations
          </button>
          <h2 className="quote-detail-actions-bar__title">
            Quotation {currentQuotation.quotationNumber}
            <Tag value={currentQuotation.status} severity={statusSeverity(currentQuotation.status)} style={{ marginLeft: '10px' }} />
          </h2>
        </div>

        {/* Sleek Icon Action Bar */}
        <div className="quote-detail-icons-bar">
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            severity="warning"
            tooltip="Edit / Negotiate Price"
            tooltipOptions={{ position: 'top' }}
            onClick={() => onNavigateEdit && onNavigateEdit(currentQuotation)}
          />

          {currentQuotation.status !== 'Accepted' && (
            <Button
              icon="pi pi-file-export"
              rounded
              severity="success"
              tooltip="Convert to Invoice"
              tooltipOptions={{ position: 'top' }}
              onClick={handleConvertToInvoice}
            />
          )}

          {currentQuotation.status === 'Draft' && (
            <Button
              icon="pi pi-send"
              rounded
              severity="info"
              tooltip="Send to Customer"
              tooltipOptions={{ position: 'top' }}
              onClick={() => handleStatusChange('Sent')}
            />
          )}

          {currentQuotation.status === 'Sent' && (
            <Button
              icon="pi pi-check"
              rounded
              outlined
              severity="success"
              tooltip="Mark Accepted"
              tooltipOptions={{ position: 'top' }}
              onClick={() => handleStatusChange('Accepted')}
            />
          )}

          <Button
            icon="pi pi-download"
            rounded
            outlined
            severity="secondary"
            tooltip="Download PDF"
            tooltipOptions={{ position: 'top' }}
            onClick={handleDownloadPdf}
          />

          <Button
            icon="pi pi-print"
            rounded
            severity="primary"
            tooltip="Print Quotation"
            tooltipOptions={{ position: 'top' }}
            onClick={handlePrint}
          />
        </div>
      </div>

      {/* Printable A4 Quotation Card */}
      <div className="quote-card" id="printable-quotation-card">
        {/* Header Branding & Quotation Meta */}
        <div className="quote-header">
          <div>
            <div className="quote-brand__name">
              PhotoStudio<span className="quote-brand__dot">⊙</span>PRO<sup>®</sup>
            </div>
            <div className="quote-brand__sub">PREMIUM CINEMATIC PHOTOGRAPHY & ALBUMS</div>
            <div className="quote-studio-details">
              Studio #42, Luxury Plaza, Residency Road, Bengaluru, 560025
              <br />
              GSTIN: 29AAACP9988C1Z4 | Contact: +91 98450 12345 | info@photostudiopro.com
            </div>
          </div>

          <div className="quote-meta-box">
            <div className="quote-title">QUOTATION</div>
            <div className="quote-meta-row">
              Quote No: <strong>{currentQuotation.quotationNumber}</strong>
            </div>
            <div className="quote-meta-row">
              Date: <strong>{currentQuotation.date ? new Date(currentQuotation.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026'}</strong>
            </div>
            <div className="quote-meta-row">
              Valid Until: <strong>{currentQuotation.validUntil ? new Date(currentQuotation.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '31 Aug 2026'}</strong>
            </div>
            <div className="quote-meta-row">
              Status: <Tag value={currentQuotation.status} severity={statusSeverity(currentQuotation.status)} />
            </div>
          </div>
        </div>

        {/* Client & Event Info */}
        <div className="quote-info-section">
          <div>
            <div className="quote-info-block__label">PREPARED FOR CLIENT</div>
            <div className="quote-info-block__title">{currentQuotation.clientName || 'Client Name'}</div>
            <div className="quote-info-block__text">
              Phone: {currentQuotation.clientPhone || '+91 98765 43210'}
              <br />
              Email: {currentQuotation.clientEmail || 'client@example.com'}
            </div>
          </div>

          <div>
            <div className="quote-info-block__label">EVENT & VENUE DETAILS</div>
            <div className="quote-info-block__title">{currentQuotation.eventName || 'Wedding Shoot'}</div>
            <div className="quote-info-block__text">
              Event Date: {currentQuotation.eventDate || '12 Aug 2026'}
              <br />
              Venue: {currentQuotation.venue || 'The Grand Chateau'}
            </div>
          </div>
        </div>

        {/* Particulars Services Table */}
        <table className="quote-items-table">
          <thead>
            <tr>
              <th>Service Item</th>
              <th>Description</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price (₹)</th>
              <th className="text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {(currentQuotation.services || []).map((s, idx) => (
              <tr key={idx}>
                <td className="quote-item__name">{s.name}</td>
                <td className="quote-item__desc">{s.description}</td>
                <td className="text-center">{s.qty}</td>
                <td className="text-right">₹{(s.unitPrice || 0).toLocaleString()}</td>
                <td className="text-right font-semibold">₹{(s.total || s.qty * s.unitPrice || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Financial Summary & Terms */}
        <div className="quote-summary-container">
          <div className="quote-payment-terms">
            <div className="quote-terms__title">Terms & Notes</div>
            <div className="quote-terms__text">
              {currentQuotation.notes || '• 50% advance required upon booking to confirm studio team.\n• All payments via Bank Transfer, UPI, or Cheque.'}
            </div>
          </div>

          <div className="quote-totals-box">
            <div className="quote-total-row">
              <span>Subtotal</span>
              <span>₹{(currentQuotation.subtotal || 0).toLocaleString()}</span>
            </div>
            {currentQuotation.discount > 0 && (
              <div className="quote-total-row text-green-600">
                <span>Special Discount</span>
                <span>- ₹{(currentQuotation.discount || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="quote-total-row">
              <span>GST ({currentQuotation.taxPercent || 18}% Tax)</span>
              <span>₹{(currentQuotation.taxAmount || 0).toLocaleString()}</span>
            </div>
            <div className="quote-total-row is-grand">
              <span>Grand Total</span>
              <span>₹{(currentQuotation.grandTotal || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signoff */}
        <div className="quote-footer">
          <div className="quote-footer__note">
            This proposal is valid until {currentQuotation.validUntil ? new Date(currentQuotation.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '31 Aug 2026'}. Contact us to convert into a confirmed shoot booking.
          </div>

          <div className="quote-signature-box">
            <div className="quote-signature__line" />
            <div className="quote-signature__title">Authorized Studio Manager</div>
          </div>
        </div>
      </div>
    </div>
  )
}
