import React, { useState, useRef, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import SmartReminders from '../SmartReminders/SmartReminders'
import { useAuth } from '../../context/AuthContext'
import './DashboardHeader.css'

export default function DashboardHeader({ activeTab = 'home', setActiveTab, onToggleSidebar }) {
  const { user, logout } = useAuth()
  const [isRemindersOpen, setIsRemindersOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const userMenuRef = useRef(null)

  // Click outside and keydown listeners for user menu dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isUserMenuOpen])

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
      case 'add-employee':
        return [
          { label: 'Employees', onClick: () => setActiveTab && setActiveTab('employees') },
          { label: 'Add Employee', active: true }
        ]
      case 'equipment':
        return [{ label: 'Equipment', active: true }]
      case 'helpdesk':
        return [{ label: 'Studio Helpdesk', active: true }]
      case 'requests':
        return [{ label: 'Client Requests', active: true }]
      case 'profile':
        return [{ label: 'User Profile', active: true }]
      case 'settings':
        return [{ label: 'Account & Studio Settings', active: true }]
      case 'preferences':
        return [{ label: 'User Preferences', active: true }]
      case 'home':
      default:
        return [{ label: 'Dashboard', active: true }]
    }
  }

  const breadcrumbs = getBreadcrumbs()

  const userName = user?.name || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) || user?.username || 'ABC Studio Owner'
  const userRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Owner'
  const userEmail = user?.email || 'owner@photostudiopro.com'
  const avatarLetter = userName.trim().charAt(0).toUpperCase()

  const handleMenuAction = (action) => {
    setIsUserMenuOpen(false)
    switch (action) {
      case 'profile':
        if (setActiveTab) setActiveTab('profile')
        break
      case 'settings':
        if (setActiveTab) setActiveTab('settings')
        break
      case 'preferences':
        if (setActiveTab) setActiveTab('preferences')
        break
      case 'notifications':
        setIsRemindersOpen(true)
        break
      case 'help':
        if (setActiveTab) setActiveTab('helpdesk')
        break
      case 'logout':
        logout()
        break
      default:
        break
    }
  }

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
          <button
            className="portal-header__icon-btn"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => setIsRemindersOpen(true)}
          >
            <i className="pi pi-bell" />
            <span className="portal-header__dot" />
          </button>

          {/* Single Circular Avatar Button with Dropdown Menu */}
          <div className="portal-header__user-menu-wrapper" ref={userMenuRef}>
            <button
              className="portal-header__avatar-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
              title={`${userName} (${userRole})`}
            >
              {avatarLetter}
            </button>

            {/* Polished Enterprise Popover Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="portal-header__dropdown" role="menu">
                {/* User Info Header Card */}
                <div className="portal-header__dropdown-user-card">
                  <div className="portal-header__dropdown-avatar">
                    {avatarLetter}
                  </div>
                  <div className="portal-header__dropdown-user-info">
                    <div className="portal-header__dropdown-name">{userName}</div>
                    <div className="portal-header__dropdown-role-badge">
                      <span>{userRole}</span>
                    </div>
                    <div className="portal-header__dropdown-email">{userEmail}</div>
                  </div>
                </div>

                <div className="portal-header__dropdown-divider" />

                {/* Main Action Links */}
                <div className="portal-header__dropdown-section">
                  <button
                    className="portal-header__dropdown-item"
                    onClick={() => handleMenuAction('profile')}
                    role="menuitem"
                  >
                    <i className="pi pi-user" />
                    <span>Profile</span>
                  </button>

                  <button
                    className="portal-header__dropdown-item"
                    onClick={() => handleMenuAction('settings')}
                    role="menuitem"
                  >
                    <i className="pi pi-cog" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    className="portal-header__dropdown-item"
                    onClick={() => handleMenuAction('preferences')}
                    role="menuitem"
                  >
                    <i className="pi pi-sliders-h" />
                    <span>Preferences</span>
                  </button>

                  <button
                    className="portal-header__dropdown-item"
                    onClick={() => handleMenuAction('notifications')}
                    role="menuitem"
                  >
                    <i className="pi pi-bell" />
                    <span>Notifications</span>
                  </button>
                </div>

                <div className="portal-header__dropdown-divider" />

                {/* Support Section */}
                <div className="portal-header__dropdown-section">
                  <button
                    className="portal-header__dropdown-item"
                    onClick={() => handleMenuAction('help')}
                    role="menuitem"
                  >
                    <i className="pi pi-question-circle" />
                    <span>Help & Support</span>
                  </button>
                </div>

                <div className="portal-header__dropdown-divider" />

                {/* Logout Action */}
                <div className="portal-header__dropdown-section">
                  <button
                    className="portal-header__dropdown-item is-logout"
                    onClick={() => handleMenuAction('logout')}
                    role="menuitem"
                  >
                    <i className="pi pi-power-off" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
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
