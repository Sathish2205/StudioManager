import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import SmartReminders from '../SmartReminders/SmartReminders'
import { useAuth } from '../../context/AuthContext'
import './DashboardHeader.css'

export default function DashboardHeader({ activeTab = 'home', setActiveTab, onToggleSidebar }) {
  const { user, tenant, logout } = useAuth()
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

  const tenantName = tenant?.companyName || 'PhotoStudio Pro'
  const userName = user?.name || user?.username || 'User'
  const userRole = user?.role || 'admin'
  const avatarLetter = userName.charAt(0).toUpperCase()

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
        <div className="portal-header__right flex align-items-center gap-3">
          {/* Active Tenant Company Badge */}
          <div
            className="flex align-items-center gap-2 px-3 py-1 border-round-lg surface-card surface-border border-1 text-xs"
            title={`Active Tenant: ${tenantName} (${tenant?.tenantId || ''})`}
            style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
          >
            <i className="pi pi-building text-primary font-bold text-sm" />
            <span className="font-bold text-primary">{tenantName}</span>
          </div>

          <button
            className="portal-header__icon-btn"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => setIsRemindersOpen(true)}
          >
            <i className="pi pi-bell" />
            <span className="portal-header__dot" />
          </button>

          {/* User Profile & Logout */}
          <div className="flex align-items-center gap-2">
            <div className="portal-header__user-avatar" title={`${userName} (${userRole})`}>
              {avatarLetter}
            </div>
            <div className="hidden md:flex flex-column">
              <span className="text-xs font-bold line-height-1 text-900">{userName}</span>
              <span className="text-xs text-500 uppercase line-height-1 mt-1">{userRole}</span>
            </div>
            <button
              onClick={logout}
              className="p-button p-component p-button-text p-button-danger p-button-sm ml-2"
              title="Sign Out"
              style={{ padding: '0.4rem 0.6rem' }}
            >
              <i className="pi pi-sign-out" />
            </button>
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
