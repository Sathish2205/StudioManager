import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Tag } from 'primereact/tag'
import { ProgressBar } from 'primereact/progressbar'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import './EventDetailDrawer.css'

export default function EventDetailDrawer({ event, visible, onHide, onEdit }) {
  if (!event) return null

  // Helpers for Badge Severities
  const getStatusSeverity = (status) => {
    switch (status) {
      case 'Shooting Today':
        return 'danger'
      case 'Confirmed':
        return 'info'
      case 'In Post-Production':
        return 'warning'
      case 'Delivered':
        return 'success'
      default:
        return 'info'
    }
  }

  const getPaymentSeverity = (payment) => {
    switch (payment) {
      case 'Paid in Full':
        return 'success'
      case 'Deposit Paid (50%)':
        return 'info'
      case 'Deposit Due':
        return 'danger'
      default:
        return 'warning'
    }
  }

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="event-detail-drawer"
      style={{ width: '520px', maxWidth: '100vw' }}
    >
      {/* ── Drawer Header ── */}
      <div className="drawer-header">
        <div className="drawer-header__title-box">
          <span className="drawer-header__id">{event.id}</span>
          <h2 className="drawer-header__couple">{event.couple}</h2>
          <div className="drawer-header__badges">
            <Tag value={event.eventType} severity="info" className="drawer-tag" />
            <Tag value={event.status} severity={getStatusSeverity(event.status)} className="drawer-tag" />
            <Tag value={event.payment} severity={getPaymentSeverity(event.payment)} className="drawer-tag" />
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Drawer Content Body ── */}
      <div className="drawer-body">
        {/* Section 1: Event Schedule & Location */}
        <div className="drawer-section">
          <h4 className="drawer-section__title">
            <i className="pi pi-calendar-times drawer-icon" /> Event Schedule & Location
          </h4>
          <div className="drawer-grid">
            <div className="drawer-field">
              <span className="field-label">Date & Time</span>
              <span className="field-value highlight">
                <i className="pi pi-calendar" /> {event.date} ({event.time || '10:00 AM - 10:00 PM'})
              </span>
            </div>

            <div className="drawer-field">
              <span className="field-label">Venue & City</span>
              <span className="field-value">
                <i className="pi pi-map-marker" /> {event.venue}
              </span>
            </div>
          </div>
        </div>

        <Divider />

        {/* Section 2: Package & Financial Quote */}
        <div className="drawer-section">
          <h4 className="drawer-section__title">
            <i className="pi pi-wallet drawer-icon" /> Package & Financial Quote
          </h4>
          <div className="drawer-grid">
            <div className="drawer-field">
              <span className="field-label">Selected Package</span>
              <span className="field-value bold">{event.package}</span>
            </div>

            <div className="drawer-field">
              <span className="field-label">Total Amount Quote</span>
              <span className="field-value price">{event.amount}</span>
            </div>

            <div className="drawer-field">
              <span className="field-label">Payment Status</span>
              <Tag value={event.payment} severity={getPaymentSeverity(event.payment)} />
            </div>

            <div className="drawer-field full-width">
              <div className="progress-header">
                <span className="field-label">Post-Production Completion</span>
                <span className="progress-percent">{event.progress}%</span>
              </div>
              <ProgressBar value={event.progress} showValue={false} style={{ height: '8px' }} />
            </div>
          </div>
        </div>

        <Divider />

        {/* Section 3: Assigned Camera Crew */}
        <div className="drawer-section">
          <h4 className="drawer-section__title">
            <i className="pi pi-users drawer-icon" /> Assigned Studio Crew
          </h4>
          <div className="crew-chip-container">
            {event.crew && event.crew.length > 0 ? (
              event.crew.map((member, idx) => (
                <div key={idx} className="drawer-crew-chip">
                  <i className="pi pi-user" /> {member}
                </div>
              ))
            ) : (
              <span className="field-value">No crew assigned yet.</span>
            )}
          </div>
        </div>

        <Divider />

        {/* Section 4: Included Photography Deliverables */}
        <div className="drawer-section">
          <h4 className="drawer-section__title">
            <i className="pi pi-camera drawer-icon" /> Included Services & Deliverables
          </h4>
          <div className="deliverables-grid">
            <div className="deliverable-item active">
              <i className="pi pi-check-circle" /> Candid Photography
            </div>
            <div className="deliverable-item active">
              <i className="pi pi-check-circle" /> Traditional Photography
            </div>
            <div className="deliverable-item active">
              <i className="pi pi-check-circle" /> Cinematic Video (4K)
            </div>
            <div className="deliverable-item active">
              <i className="pi pi-check-circle" /> Printed Photo Album
            </div>
            <div className="deliverable-item">
              <i className="pi pi-check-circle" /> Aerial Drone Footage
            </div>
            <div className="deliverable-item">
              <i className="pi pi-check-circle" /> Live Broadcast Stream
            </div>
          </div>
        </div>

        <Divider />

        {/* Section 5: Special Client Notes */}
        <div className="drawer-section">
          <h4 className="drawer-section__title">
            <i className="pi pi-file-edit drawer-icon" /> Special Client Instructions
          </h4>
          <div className="drawer-notes-box">
            <p>
              Client requested high-contrast cinematic color grading for the evening reception. Please ensure 2 drone battery backups are prepared for sunset couple portraits.
            </p>
          </div>
        </div>
      </div>

      {/* ── Drawer Footer Actions ── */}
      <div className="drawer-footer">
        <Button
          label="Download Invoice PDF"
          icon="pi pi-download"
          className="p-button-outlined p-button-secondary"
        />
        <Button
          label="Edit Event"
          icon="pi pi-pencil"
          className="p-button-primary"
          onClick={() => {
            onHide()
            if (onEdit) onEdit(event)
          }}
        />
      </div>
    </Sidebar>
  )
}
