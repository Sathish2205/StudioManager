import React, { useState } from 'react'
import './Sidebar.css'

const NAV_GROUPS = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'home', label: 'Dashboard', icon: 'pi pi-th-large' },
    ]
  },
  {
    label: 'EVENT MANAGEMENT',
    items: [
      { id: 'events', label: 'Events & Shoots', icon: 'pi pi-calendar' },
      { id: 'calendar', label: 'Shoot Calendar', icon: 'pi pi-calendar-plus' },
      { id: 'workflow', label: 'Workflow', icon: 'pi pi-sitemap' },
    ]
  },
  {
    label: 'CUSTOMERS',
    items: [
      { id: 'crm', label: 'Customer CRM', icon: 'pi pi-id-card' },
      { id: 'requests', label: 'Client Requests', icon: 'pi pi-inbox' },
    ]
  },
  {
    label: 'FINANCE',
    items: [
      { id: 'finance', label: 'Finance & Invoices', icon: 'pi pi-wallet' },
      { id: 'packages', label: 'Packages & Quotes', icon: 'pi pi-tag' },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'employees', label: 'Employees', icon: 'pi pi-users' },
      { id: 'crew', label: 'Crew & Staff', icon: 'pi pi-user-plus' },
      { id: 'equipment', label: 'Equipment', icon: 'pi pi-camera' },
    ]
  },
  {
    label: 'DELIVERY',
    items: [
      { id: 'tasks', label: 'Editing & Deliverables', icon: 'pi pi-images' },
      { id: 'contracts', label: 'Contracts & Docs', icon: 'pi pi-file' },
    ]
  },
  {
    label: 'SUPPORT',
    items: [
      { id: 'helpdesk', label: 'Studio Helpdesk', icon: 'pi pi-question-circle' },
    ]
  }
]

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleNavClick = (tabId) => {
    setActiveTab(tabId)
    // Auto-close sidebar on mobile after navigation
    if (onCloseMobile) onCloseMobile()
  }

  const sidebarClasses = [
    'portal-sidebar',
    isExpanded ? 'portal-sidebar--expanded' : '',
    isMobileOpen ? 'portal-sidebar--mobile-open' : ''
  ].filter(Boolean).join(' ')

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div className="portal-sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={sidebarClasses}>
        {/* Mobile Close Button */}
        <button className="portal-sidebar__close-btn" onClick={onCloseMobile} aria-label="Close menu">
          <i className="pi pi-times" />
        </button>

        {/* Top Bar: Hamburger + Brand */}
        <div className="portal-sidebar__top-bar">
          <button
            className="portal-sidebar__toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <i className={isExpanded ? 'pi pi-chevron-left' : 'pi pi-bars'} />
          </button>

          {isExpanded && (
            <span className="portal-sidebar__brand-name">
              PhotoStudio<span className="portal-sidebar__brand-accent">PRO</span>
            </span>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="portal-sidebar__nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="portal-sidebar__group">
              {isExpanded && (
                <div className="portal-sidebar__group-label">{group.label}</div>
              )}
              {!isExpanded && <div className="portal-sidebar__group-divider" />}
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`portal-sidebar__item ${activeTab === item.id ? 'portal-sidebar__item--active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  title={!isExpanded ? item.label : undefined}
                  aria-label={item.label}
                >
                  <div className="portal-sidebar__item-left">
                    <i className={`${item.icon} portal-sidebar__icon`} />
                    {isExpanded && <span className="portal-sidebar__label">{item.label}</span>}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom: User Profile */}
        <div className="portal-sidebar__footer">
          <div className="portal-sidebar__profile">
            <div className="portal-sidebar__avatar-wrap">
              <span className="portal-sidebar__avatar-initials">S</span>
            </div>
            {isExpanded && (
              <div className="portal-sidebar__user-details">
                <span className="portal-sidebar__user-name">Sathish</span>
                <span className="portal-sidebar__user-role">Studio Manager</span>
              </div>
            )}
            {isExpanded && (
              <button className="portal-sidebar__logout-btn" aria-label="Logout" title="Logout">
                <i className="pi pi-sign-out" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
