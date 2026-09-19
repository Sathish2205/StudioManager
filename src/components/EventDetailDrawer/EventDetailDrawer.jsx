import React from 'react'
import { Dialog } from 'primereact/dialog'
import { Tag } from 'primereact/tag'
import { ProgressBar } from 'primereact/progressbar'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import './EventDetailDrawer.css'

export default function EventDetailDrawer({ event, visible, onHide, onEdit }) {
  if (!event) return null

  // Safely normalize event object fields
  const id = event.id || (event._id ? `EVT-${event._id.slice(-4).toUpperCase()}` : 'EVT-0000')
  const couple = event.couple || event.title || event.eventName || 'Special Event'
  const eventType = event.eventType || 'Wedding Shoot'
  const date = event.date || event.eventDate || ''
  const time = event.time || `${event.startTime || '09:00 AM'} - ${event.endTime || '10:00 PM'}`
  const venue = event.venue || 'Studio Location'
  const pkg = event.package || event.packageName || 'Custom Studio Package'
  const totalAmount = event.totalAmount || event.amount || (event.packageAmount ? `₹${event.packageAmount.toLocaleString()}` : '₹0')
  const paidAmount = event.paidAmount || (event.totalPaid ? `₹${event.totalPaid.toLocaleString()}` : '₹0')
  const balanceAmount = event.balanceAmount || (event.remainingAmount !== undefined ? `₹${event.remainingAmount.toLocaleString()}` : '₹0')
  const paymentProgress = event.paymentProgress !== undefined ? event.paymentProgress : 100
  const paymentStatus = event.paymentStatus || event.payment || 'Deposit Paid'
  const status = event.status || 'Scheduled'
  const crew = event.crew || (event.assignedPhotographers ? event.assignedPhotographers.map((p) => p.name || 'Photographer') : ['Lead Photographer'])
  const progress = event.progress !== undefined ? event.progress : 65

  // Helpers for Badge Severities
  const getStatusSeverity = (st) => {
    if (!st) return 'info'
    const s = st.toLowerCase()
    if (s.includes('delivered') || s.includes('completed') || s.includes('paid')) return 'success'
    if (s.includes('check') || s.includes('editing') || s.includes('culling') || s.includes('progress')) return 'info'
    if (s.includes('schedule') || s.includes('todo') || s.includes('to do') || s.includes('pending')) return 'warning'
    if (s.includes('cancel')) return 'danger'
    return 'info'
  }

  const getPaymentSeverity = (pm) => {
    if (!pm) return 'warning'
    const p = pm.toLowerCase()
    if (p.includes('full') || p.includes('completed') || p.includes('paid in full')) return 'success'
    if (p.includes('advance') || p.includes('deposit paid') || p.includes('50%')) return 'info'
    if (p.includes('due') || p.includes('pending')) return 'danger'
    return 'warning'
  }

  // Workflow Stages for Visual Timeline
  const stages = ['Scheduled', 'Culling', 'Editing', 'Quality Check', 'Delivered']
  const currentStageIndex = stages.findIndex((s) => s.toLowerCase() === status.toLowerCase())
  const activeStepIndex = currentStageIndex >= 0 ? currentStageIndex : 2

  const headerContent = (
    <div className="ent-dialog-header">
      <div className="ent-dialog-header__top">
        <div className="ent-dialog-header__badges">
          <span className="ent-dialog-id-chip">{id}</span>
          <Tag value={eventType} severity="info" outlined />
          <Tag value={status} severity={getStatusSeverity(status)} outlined />
          <Tag value={paymentStatus} severity={getPaymentSeverity(paymentStatus)} outlined />
        </div>
        <div className="ent-dialog-header__actions">
          <Button
            icon="pi pi-pencil"
            rounded
            text
            severity="secondary"
            tooltip="Edit Event"
            onClick={() => {
              onHide()
              if (onEdit) onEdit(event)
            }}
          />
          <Button
            icon="pi pi-times"
            rounded
            text
            severity="secondary"
            tooltip="Close"
            onClick={onHide}
          />
        </div>
      </div>

      <div className="ent-dialog-header__title-row">
        <h2 className="ent-dialog-title">{couple}</h2>
        <div className="ent-dialog-subinfo">
          <span><i className="pi pi-calendar text-primary" /> {date} ({time})</span>
          <span className="bullet-sep">•</span>
          <span><i className="pi pi-map-marker text-danger" /> {venue}</span>
        </div>
      </div>
    </div>
  )

  const footerContent = (
    <div className="ent-dialog-footer">
      <div className="ent-dialog-footer__left">
        <Button
          label="Download Invoice PDF"
          icon="pi pi-file-pdf"
          className="p-button-outlined p-button-secondary text-xs"
        />
      </div>
      <div className="ent-dialog-footer__right">
        <Button
          label="Close"
          icon="pi pi-times"
          className="p-button-outlined p-button-secondary text-xs"
          onClick={onHide}
        />
        <Button
          label="Edit Event Details"
          icon="pi pi-pencil"
          className="p-button-primary text-xs"
          onClick={() => {
            onHide()
            if (onEdit) onEdit(event)
          }}
        />
      </div>
    </div>
  )

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      modal
      dismissableMask
      header={headerContent}
      footer={footerContent}
      className="enterprise-event-dialog"
      style={{ width: '840px', maxWidth: '95vw' }}
      breakpoints={{ '960px': '95vw', '641px': '100vw' }}
    >
      <div className="ent-dialog-body">
        {/* ── SECTION 1: TOP SUMMARY STAT CARDS ── */}
        <div className="ent-grid-cards">
          {/* Card A: Schedule & Logistics */}
          <div className="ent-card">
            <div className="ent-card__header">
              <i className="pi pi-calendar-times ent-card__icon text-blue-600" />
              <span className="ent-card__title">Shoot Schedule & Location</span>
            </div>
            <div className="ent-card__content">
              <div className="ent-field-row">
                <span className="ent-field-label">Date & Timing</span>
                <span className="ent-field-value bold text-900">{date} ({time})</span>
              </div>
              <div className="ent-field-row">
                <span className="ent-field-label">Venue / City</span>
                <span className="ent-field-value">{venue}</span>
              </div>
              <div className="ent-field-row">
                <span className="ent-field-label">Client Contact</span>
                <span className="ent-field-value text-500">info@photostudiopro.com • +91 98450 12345</span>
              </div>
            </div>
          </div>

          {/* Card B: Financial Quote & Balance */}
          <div className="ent-card">
            <div className="ent-card__header">
              <i className="pi pi-wallet ent-card__icon text-green-600" />
              <span className="ent-card__title">Package & Payment Status</span>
            </div>
            <div className="ent-card__content">
              <div className="ent-field-row">
                <span className="ent-field-label">Selected Package</span>
                <span className="ent-field-value bold text-primary">{pkg}</span>
              </div>
              <div className="flex justify-content-between align-items-center mt-1">
                <div>
                  <span className="ent-field-label">Total Quote</span>
                  <div className="text-base font-bold text-900">{totalAmount}</div>
                </div>
                <div>
                  <span className="ent-field-label">Paid Amount</span>
                  <div className="text-base font-bold text-green-600">{paidAmount}</div>
                </div>
                <div>
                  <span className="ent-field-label">Balance</span>
                  <div className="text-base font-bold text-700">{balanceAmount}</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-content-between text-xs text-600 mb-1">
                  <span>Payment Clearance</span>
                  <span className="font-bold">{paymentProgress}%</span>
                </div>
                <ProgressBar value={paymentProgress} showValue={false} style={{ height: '6px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: WORKFLOW STAGE TIMELINE TRACKER ── */}
        <div className="ent-card mt-3">
          <div className="ent-card__header flex justify-content-between align-items-center">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-sliders-h ent-card__icon text-purple-600" />
              <span className="ent-card__title">Post-Production Workflow & Progress</span>
            </div>
            <span className="text-xs font-bold text-primary">{progress}% Completed</span>
          </div>
          <div className="ent-card__content">
            <ProgressBar value={progress} showValue={false} style={{ height: '6px', marginBottom: '16px' }} />

            <div className="ent-workflow-stepper">
              {stages.map((st, idx) => {
                const isPassed = idx <= activeStepIndex
                const isCurrent = idx === activeStepIndex
                return (
                  <div key={idx} className={`ent-step-item ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="ent-step-dot">
                      {isPassed ? <i className="pi pi-check text-xs" /> : idx + 1}
                    </div>
                    <span className="ent-step-label">{st}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: CREW & DELIVERABLES GRID ── */}
        <div className="ent-grid-cards mt-3">
          {/* Card C: Assigned Crew */}
          <div className="ent-card">
            <div className="ent-card__header">
              <i className="pi pi-users ent-card__icon text-orange-600" />
              <span className="ent-card__title">Assigned Studio Crew</span>
            </div>
            <div className="ent-card__content">
              <div className="ent-crew-chips flex flex-wrap gap-2">
                {crew && crew.length > 0 ? (
                  crew.map((member, idx) => (
                    <div key={idx} className="ent-crew-chip">
                      <i className="pi pi-user text-primary" />
                      <span>{member}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-500">No crew assigned yet.</span>
                )}
              </div>
            </div>
          </div>

          {/* Card D: Deliverables Checklist */}
          <div className="ent-card">
            <div className="ent-card__header">
              <i className="pi pi-camera ent-card__icon text-indigo-600" />
              <span className="ent-card__title">Included Services & Deliverables</span>
            </div>
            <div className="ent-card__content">
              <div className="ent-deliverables-grid">
                <div className="ent-deliv-item active">
                  <i className="pi pi-check-circle text-green-600" /> Candid Photography
                </div>
                <div className="ent-deliv-item active">
                  <i className="pi pi-check-circle text-green-600" /> Traditional Photography
                </div>
                <div className="ent-deliv-item active">
                  <i className="pi pi-check-circle text-green-600" /> Cinematic 4K Video
                </div>
                <div className="ent-deliv-item active">
                  <i className="pi pi-check-circle text-green-600" /> Printed Photo Album
                </div>
                <div className="ent-deliv-item">
                  <i className="pi pi-check-circle text-400" /> Aerial Drone Footage
                </div>
                <div className="ent-deliv-item">
                  <i className="pi pi-check-circle text-400" /> Live Stream Coverage
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: CLIENT INSTRUCTIONS ── */}
        <div className="ent-card mt-3">
          <div className="ent-card__header">
            <i className="pi pi-comment ent-card__icon text-teal-600" />
            <span className="ent-card__title">Special Client Notes & Preferences</span>
          </div>
          <div className="ent-card__content">
            <div className="ent-notes-callout">
              Client requested high-contrast cinematic color grading for evening reception. Ensure 2 extra drone battery backups are prepared for sunset couple portraits.
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
