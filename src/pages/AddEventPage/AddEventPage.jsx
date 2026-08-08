import React from 'react'
import EventForm from '../../components/EventForm'
import './AddEventPage.css'

export default function AddEventPage({ onNavigateEvents, onNavigateDashboard, onNavigateInvoice }) {
  return (
    <div className="add-event-page">
      {/* ── Top Bar ── */}
      <div className="add-event-topbar">
        <div className="add-event-header">
          <div className="add-event-header__title-box">
            <h1 className="add-event-title">Add New Event</h1>
            <p className="add-event-subtitle">
              Book a new photo shoot, enter client venue details, photography packages, and financial quotes.
            </p>
          </div>

          <button className="back-btn" onClick={onNavigateEvents}>
            <i className="pi pi-arrow-left" /> Back to Events
          </button>
        </div>
      </div>

      {/* ── Event Form Inside Card ── */}
      <div className="add-event-container">
        <EventForm
          onSuccess={(createdEvent) => {
            if (onNavigateInvoice) {
              onNavigateInvoice(createdEvent)
            } else if (onNavigateEvents) {
              onNavigateEvents()
            }
          }}
          onCancel={() => onNavigateEvents && onNavigateEvents()}
        />
      </div>
    </div>
  )
}
