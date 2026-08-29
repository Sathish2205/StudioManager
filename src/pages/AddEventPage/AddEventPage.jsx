import React from 'react'
import EventForm from '../../components/EventForm'
import { Button } from 'primereact/button'
import './AddEventPage.css'

export default function AddEventPage({ eventToEdit, prefillDate, onNavigateEvents, onNavigateDashboard, onNavigateInvoice }) {
  const isEditing = !!eventToEdit

  return (
    <div className="add-event-page">
      {/* ── Top Bar / Header Banner ── */}
      <div className="add-event-topbar">
        <div className="add-event-header">
          <div className="add-event-header__title-box">
            <div className="add-event-breadcrumb">
              <span>Events & Shoots</span>
              <i className="pi pi-angle-right" />
              <span>Booking Terminal</span>
              <i className="pi pi-angle-right" />
              <strong className="text-primary">{isEditing ? 'Edit Booking' : 'New Event Booking'}</strong>
            </div>
            <h1 className="add-event-title">{isEditing ? 'Edit Shoot Details & Commercial Terms' : 'Book New Photo Shoot & Generate Quote'}</h1>
            <p className="add-event-subtitle">
              {isEditing
                ? 'Update client venue specifications, camera team assignments, package pricing, or financial advance.'
                : 'Configure client information, venue specifications, photography deliverables, crew assignment, and payment terms.'}
            </p>
          </div>

          <div className="add-event-actions">
            <Button
              label="Back to Directory"
              icon="pi pi-arrow-left"
              className="p-button-outlined p-button-secondary"
              onClick={onNavigateEvents}
            />
          </div>
        </div>
      </div>

      {/* ── Event Form Container ── */}
      <div className="add-event-container">
        <EventForm
          eventToEdit={eventToEdit}
          prefillDate={prefillDate}
          onSuccess={(savedEvent) => {
            if (onNavigateInvoice) {
              onNavigateInvoice(savedEvent)
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
