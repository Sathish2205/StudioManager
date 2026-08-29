import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import SmartReminders from '../SmartReminders/SmartReminders'
import './DashboardHeader.css'

export default function DashboardHeader({ activeTab = 'home', setActiveTab, onToggleSidebar }) {
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
        return [{ label: 'Workflow', active: true }]
      case 'tasks':
        return [{ label: 'Editing & Deliverables', active: true }]
      case 'finance':
        return [{ label: 'Finance & Invoices', active: true }]
      case 'create-quotation':
        return [
          { label: 'Finance & Invoices', onClick: () => setActiveTab && setActiveTab('finance') },
          { label: 'Create Quotation', active: true }
        ]
      case 'quotation-detail':
        return [
          { label: 'Finance & Invoices', onClick: () => setActiveTab && setActiveTab('finance') },
          { label: 'Quotation Detail', active: true }
        ]
      case 'invoice-detail':
        return [
          { label: 'Finance & Invoices', onClick: () => setActiveTab && setActiveTab('finance') },
          { label: 'Invoice Detail', active: true }
        ]
      case 'packages':
        return [{ label: 'Packages & Quotes', active: true }]
      case 'contracts':
        return [{ label: 'Contracts & Docs', active: true }]
      case 'crew':
        return [{ label: 'Crew & Staff', active: true }]
      case 'employees':
        return [{ label: 'Employees', active: true }]
      case 'equipment':
        return [{ label: 'Equipment', active: true }]
      case 'helpdesk':
        return [{ label: 'Studio Helpdesk', active: true }]
      case 'requests':
        return [{ label: 'Client Requests', active: true }]
      case 'home':
      default:
        return [{ label: 'Dashboard', active: true }]
    }
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <>
      {toastMsg && (
        <div className="enterprise-toast">
          <i className="pi pi-check-circle" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="portal-header">
        {/* Mobile Hamburger */}
        <button
          className="portal-header__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
        >
          <i className="pi pi-bars" />
        </button>

        {/* Breadcrumb */}
        <div className="portal-header__left">
          <div className="portal-header__breadcrumb">
            <i
              className="pi pi-home portal-header__crumb-home"
              onClick={() => setActiveTab && setActiveTab('home')}
              title="Dashboard"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveTab && setActiveTab('home')}
            />

            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <i className="pi pi-angle-right portal-header__crumb-sep" />
                <span
                  className={`portal-header__crumb-item ${crumb.active ? 'is-active' : 'is-link'}`}
                  onClick={crumb.onClick}
                  role={crumb.onClick ? 'button' : undefined}
                  tabIndex={crumb.onClick ? 0 : undefined}
                  onKeyDown={crumb.onClick ? (e) => e.key === 'Enter' && crumb.onClick() : undefined}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="portal-header__right">
          <button
            className="portal-header__icon-btn"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => setIsRemindersOpen(true)}
          >
            <i className="pi pi-bell" />
            <span className="portal-header__dot" />
          </button>

          <button className="portal-header__icon-btn" aria-label="Settings" title="Settings">
            <i className="pi pi-cog" />
          </button>

          <div className="portal-header__user-avatar" title="Sathish">
            S
          </div>
        </div>
      </header>

      {/* Smart Reminders Dialog */}
      <Dialog
        header="Notifications & Reminders"
        visible={isRemindersOpen}
        style={{ width: '920px', maxWidth: '95vw' }}
        onHide={() => setIsRemindersOpen(false)}
        dismissableMask
      >
        <div style={{ padding: '0.25rem 0' }}>
          <SmartReminders onShowToast={showToast} />
        </div>
      </Dialog>
    </>
  )
}
