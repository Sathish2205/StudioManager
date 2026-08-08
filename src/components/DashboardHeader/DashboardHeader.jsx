import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import SmartReminders from '../SmartReminders/SmartReminders'
import './DashboardHeader.css'

export default function DashboardHeader({ activeTab = 'home', setActiveTab }) {
  const [isRemindersOpen, setIsRemindersOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'events':
        return [{ label: 'Events & Shoots', active: true }]
      case 'add-event':
        return [
          { label: 'Events & Shoots', onClick: () => setActiveTab && setActiveTab('events') },
          { label: 'Add Event', active: true }
        ]
      case 'invoice':
        return [
          { label: 'Events & Shoots', onClick: () => setActiveTab && setActiveTab('events') },
          { label: 'Print Invoice', active: true }
        ]
      case 'calendar':
        return [{ label: 'Shoot Calendar', active: true }]
      case 'crm':
        return [{ label: 'Customer CRM', active: true }]
      case 'workflow':
        return [{ label: 'Workflow Management', active: true }]
      case 'tasks':
        return [{ label: 'Editing & Deliverables', active: true }]
      case 'finance':
        return [{ label: 'Finance & Invoices', active: true }]
      case 'packages':
        return [{ label: 'Packages & Quotes', active: true }]
      case 'contracts':
        return [{ label: 'Contracts & Docs', active: true }]
      case 'crew':
        return [{ label: 'Crew & Photographers', active: true }]
      case 'equipment':
        return [{ label: 'Equipment Tracker', active: true }]
      case 'helpdesk':
        return [{ label: 'Studio Helpdesk', active: true }]
      case 'requests':
        return [{ label: 'Client Requests', active: true }]
      case 'home':
      default:
        return [{ label: 'Studio Overview', active: true }]
    }
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <>
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            background: '#2563eb',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          <i className="pi pi-check-circle" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="portal-header">
        {/* Left Title / Interactive Breadcrumb with Home Icon Only */}
        <div className="portal-header__left">
          <div className="portal-header__breadcrumb">
            <i
              className="pi pi-home header-crumb-home-icon"
              onClick={() => setActiveTab && setActiveTab('home')}
              title="Go to Home Overview"
            />

            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <i className="pi pi-angle-right header-crumb-arrow" />
                <span
                  className={`header-crumb-item ${crumb.active ? 'is-active' : 'is-link'}`}
                  onClick={crumb.onClick}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="portal-header__right">
          <div className="portal-header__dropdown">
            <span>Quick Actions</span>
            <i className="pi pi-chevron-down" />
          </div>

          <button
            className="portal-header__icon-btn"
            aria-label="Smart Reminders & Notifications"
            title="Smart Studio Reminders"
            onClick={() => setIsRemindersOpen(true)}
          >
            <i className="pi pi-bell" />
            <span className="portal-header__dot" />
          </button>

          <button className="portal-header__icon-btn" aria-label="Logout">
            <i className="pi pi-power-off" />
          </button>
        </div>
      </header>

      {/* Smart Reminders Notification Center Dialog */}
      <Dialog
        header="🔔 Smart Studio Reminders & Alerts"
        visible={isRemindersOpen}
        style={{ width: '920px', maxWidth: '95vw' }}
        onHide={() => setIsRemindersOpen(false)}
        dismissableMask
      >
        <div style={{ padding: '0.5rem 0' }}>
          <SmartReminders onShowToast={showToast} />
        </div>
      </Dialog>
    </>
  )
}
