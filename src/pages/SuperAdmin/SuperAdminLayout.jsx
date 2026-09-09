import React, { useState } from 'react'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'pi pi-th-large', section: 'OVERVIEW' },
  { id: 'tenants', label: 'Tenants', icon: 'pi pi-building', section: 'MANAGEMENT' },
  { id: 'create-tenant', label: 'Create Tenant', icon: 'pi pi-plus-circle', section: 'MANAGEMENT' },
  { id: 'settings', label: 'Settings', icon: 'pi pi-cog', section: 'ACCOUNT' },
  { id: 'change-password', label: 'Change Password', icon: 'pi pi-key', section: 'ACCOUNT' },
]

const BREADCRUMB_MAP = {
  'dashboard': 'Dashboard',
  'tenants': 'Tenants',
  'create-tenant': 'Create Tenant',
  'edit-tenant': 'Edit Tenant',
  'tenant-detail': 'Tenant Details',
  'settings': 'Settings',
  'change-password': 'Change Password',
}

export default function SuperAdminLayout({ activeTab, setActiveTab, children }) {
  const { user, logout } = useSuperAdminAuth()
  const [isExpanded, setIsExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (id) => {
    setActiveTab(id)
    setMobileOpen(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  const sidebarClasses = [
    'sa-sidebar',
    isExpanded ? 'sa-sidebar--expanded' : '',
    mobileOpen ? 'sa-sidebar--mobile-open' : '',
  ].filter(Boolean).join(' ')

  const avatarLetter = (user?.username || 'S').charAt(0).toUpperCase()

  // Group nav items by section
  const sections = []
  let currentSection = null
  NAV_ITEMS.forEach((item) => {
    if (item.section !== currentSection) {
      currentSection = item.section
      sections.push({ label: item.section, items: [] })
    }
    sections[sections.length - 1].items.push(item)
  })

  return (
    <div className="sa-layout">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="sa-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <button className="sa-sidebar__close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <i className="pi pi-times" />
        </button>

        <div className="sa-sidebar__top">
          <button
            className="sa-sidebar__toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <i className={isExpanded ? 'pi pi-chevron-left' : 'pi pi-bars'} style={{ fontSize: '0.85rem' }} />
          </button>
          {isExpanded && (
            <div className="sa-sidebar__brand">
              <span className="sa-sidebar__brand-name">PhotoStudio Pro</span>
              <span className="sa-sidebar__brand-tag">Super Admin</span>
            </div>
          )}
        </div>

        <nav className="sa-sidebar__nav">
          {sections.map((section) => (
            <div key={section.label}>
              {isExpanded && (
                <div className="sa-sidebar__section-label">{section.label}</div>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`sa-sidebar__item ${activeTab === item.id ? 'sa-sidebar__item--active' : ''}`}
                  onClick={() => handleNav(item.id)}
                  title={!isExpanded ? item.label : undefined}
                >
                  <i className={item.icon} />
                  {isExpanded && <span className="sa-sidebar__item-label">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}

          {/* Logout */}
          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
            {isExpanded && <div className="sa-sidebar__section-label">SESSION</div>}
            <button
              className="sa-sidebar__item sa-sidebar__item--danger"
              onClick={handleLogout}
              title={!isExpanded ? 'Logout' : undefined}
            >
              <i className="pi pi-sign-out" />
              {isExpanded && <span className="sa-sidebar__item-label">Logout</span>}
            </button>
          </div>
        </nav>

        <div className="sa-sidebar__footer">
          <div className="sa-sidebar__profile">
            <div className="sa-sidebar__avatar">{avatarLetter}</div>
            {isExpanded && (
              <div className="sa-sidebar__user-info">
                <span className="sa-sidebar__user-name">{user?.username || 'Super Admin'}</span>
                <span className="sa-sidebar__user-role">SUPER_ADMIN</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="sa-main">
        {/* Header */}
        <header className="sa-header">
          <div className="sa-header__left">
            <button className="sa-header__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              <i className="pi pi-bars" />
            </button>
            <div className="sa-header__breadcrumb">
              <span>Super Admin</span>
              <i className="pi pi-chevron-right sa-header__breadcrumb-sep" />
              <span className="sa-header__breadcrumb-current">
                {BREADCRUMB_MAP[activeTab] || 'Dashboard'}
              </span>
            </div>
          </div>
          <div className="sa-header__right">
            <span className="sa-header__user-badge">
              <i className="pi pi-shield" />
              Super Admin
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="sa-body">
          {children}
        </div>
      </div>
    </div>
  )
}
