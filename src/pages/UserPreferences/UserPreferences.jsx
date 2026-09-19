import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import './UserPreferences.css'

export default function UserPreferences({ onShowToast }) {
  const [prefs, setPrefs] = useState({
    theme: 'Light Theme',
    dateFormat: 'DD/MM/YYYY (22/09/2026)',
    defaultCalendarView: 'Month View',
    emailNotifications: true,
    smsAlerts: false,
    remindersSound: true,
    autoOpenInvoice: true,
    compactTableDensity: false
  })

  const triggerToast = (msg, sev = 'success') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleToggle = (field, checked) => {
    setPrefs((prev) => ({ ...prev, [field]: checked }))
  }

  const handleSelect = (field, val) => {
    setPrefs((prev) => ({ ...prev, [field]: val }))
  }

  const handleSavePreferences = (e) => {
    e.preventDefault()
    triggerToast('Application preferences saved!', 'success')
  }

  return (
    <div className="user-preferences-page">
      {/* Page Header */}
      <div className="ent-page-header">
        <div>
          <h1 className="ent-page-header__title">User Preferences</h1>
          <p className="ent-page-header__sub">Customize your display appearance, notification channels, calendar views, and desktop workflow behavior</p>
        </div>
      </div>

      <form onSubmit={handleSavePreferences} className="pref-form-card">
        {/* Appearance Section */}
        <div className="pref-section">
          <h3 className="pref-section-title">
            <i className="pi pi-palette text-primary mr-2" /> Appearance & Display Theme
          </h3>
          <div className="pref-grid">
            <div className="pref-field">
              <label>Application Theme</label>
              <Dropdown
                value={prefs.theme}
                options={['Light Theme (Enterprise SaaS)', 'Dark Slate Theme', 'System Match']}
                onChange={(e) => handleSelect('theme', e.value)}
              />
            </div>

            <div className="pref-field">
              <label>Date Format Display</label>
              <Dropdown
                value={prefs.dateFormat}
                options={['DD/MM/YYYY (22/09/2026)', 'MM/DD/YYYY (09/22/2026)', 'YYYY-MM-DD (2026-09-22)']}
                onChange={(e) => handleSelect('dateFormat', e.value)}
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="pref-section">
          <h3 className="pref-section-title">
            <i className="pi pi-bell text-primary mr-2" /> Notification Channels & Alerts
          </h3>
          <div className="pref-checkbox-group">
            <label className="pref-checkbox-item">
              <Checkbox checked={prefs.emailNotifications} onChange={(e) => handleToggle('emailNotifications', e.checked)} />
              <div>
                <strong>Email Notifications</strong>
                <p>Receive email alerts for new client bookings, advance payments, and shoot schedule updates</p>
              </div>
            </label>

            <label className="pref-checkbox-item">
              <Checkbox checked={prefs.smsAlerts} onChange={(e) => handleToggle('smsAlerts', e.checked)} />
              <div>
                <strong>SMS / WhatsApp Notifications</strong>
                <p>Send automated booking confirmations and payment reminders to clients via SMS</p>
              </div>
            </label>

            <label className="pref-checkbox-item">
              <Checkbox checked={prefs.remindersSound} onChange={(e) => handleToggle('remindersSound', e.checked)} />
              <div>
                <strong>In-App Reminder Audio Sound</strong>
                <p>Play a subtle chime audio cue when smart shoot reminders pop up</p>
              </div>
            </label>
          </div>
        </div>

        {/* Workflow & Calendar Section */}
        <div className="pref-section">
          <h3 className="pref-section-title">
            <i className="pi pi-sliders-h text-primary mr-2" /> Shoot Calendar & Workflow Defaults
          </h3>
          <div className="pref-grid">
            <div className="pref-field">
              <label>Default Calendar View</label>
              <Dropdown
                value={prefs.defaultCalendarView}
                options={['Month View', 'Week View', 'Timeline Agenda View']}
                onChange={(e) => handleSelect('defaultCalendarView', e.value)}
              />
            </div>
          </div>

          <div className="pref-checkbox-group mt-3">
            <label className="pref-checkbox-item">
              <Checkbox checked={prefs.autoOpenInvoice} onChange={(e) => handleToggle('autoOpenInvoice', e.checked)} />
              <div>
                <strong>Auto-Navigate to Invoice after Booking Creation</strong>
                <p>Automatically redirect to the printable GST tax invoice page right after creating an event</p>
              </div>
            </label>
          </div>
        </div>

        <div className="pref-form-actions">
          <Button label="Save Preferences" icon="pi pi-check" type="submit" className="p-button-primary p-button-sm" />
        </div>
      </form>
    </div>
  )
}
