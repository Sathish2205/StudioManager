import React, { useState } from 'react'
import './Sidebar.css'

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const menuItems = [
    { id: 'home', label: 'Studio Overview', icon: 'pi pi-home' },
    { id: 'events', label: 'Events & Shoots', icon: 'pi pi-calendar' },
    { id: 'workflow', label: 'Workflow Management', icon: 'pi pi-sitemap' },
    { id: 'crm', label: 'Customer CRM', icon: 'pi pi-id-card' },
    { id: 'calendar', label: 'Shoot Calendar', icon: 'pi pi-calendar-plus' },
    { id: 'tasks', label: 'Editing & Deliverables', icon: 'pi pi-images' },
    { id: 'finance', label: 'Finance & Invoices', icon: 'pi pi-wallet' },
    { id: 'packages', label: 'Packages & Quotes', icon: 'pi pi-tag' },
    { id: 'contracts', label: 'Contracts & Docs', icon: 'pi pi-file' },
    { id: 'crew', label: 'Crew & Photographers', icon: 'pi pi-users' },
    { id: 'employees', label: 'Employee Management', icon: 'pi pi-user-plus' },
    { id: 'equipment', label: 'Equipment Tracker', icon: 'pi pi-camera' },
    { id: 'helpdesk', label: 'Studio Helpdesk', icon: 'pi pi-info-circle' },
    { id: 'requests', label: 'Client Requests', icon: 'pi pi-layers' }
  ]

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

        {/* Top Bar: Hamburger + Brand Logo */}
        <div className="portal-sidebar__top-bar">
          <button
            className="portal-sidebar__toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <i className="pi pi-bars" />
          </button>

          {isExpanded && (
            <span className="portal-sidebar__brand-name">
              PhotoStudio<span className="portal-sidebar__brand-dot">⊙</span>PRO<sup>®</sup>
            </span>
          )}
        </div>

        {/* Subtitle - visible only when expanded */}
        {isExpanded && (
          <div className="portal-sidebar__brand-sub-wrap">
            <span className="portal-sidebar__brand-sub">EVENT & FINANCE MANAGEMENT</span>
          </div>
        )}

        {/* Profile Snippet Box - visible only when expanded */}
        <div className="portal-sidebar__profile">
          <div className="portal-sidebar__avatar-wrap">
            <i className="pi pi-camera portal-sidebar__avatar-icon" />
          </div>
          {isExpanded && (
            <div className="portal-sidebar__user-details">
              <span className="portal-sidebar__greeting">Hi SATHISH</span>
              <a href="#info" className="portal-sidebar__view-link">Lead Studio Manager</a>
            </div>
          )}
          {isExpanded && (
            <button className="portal-sidebar__settings-btn" aria-label="Settings">
              <i className="pi pi-cog" />
            </button>
          )}
        </div>

        {/* Vertical Navigation Links */}
        <nav className="portal-sidebar__nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`portal-sidebar__item ${activeTab === item.id ? 'portal-sidebar__item--active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="portal-sidebar__item-left">
                <i className={`${item.icon} portal-sidebar__icon`} />
                {isExpanded && <span className="portal-sidebar__label">{item.label}</span>}
              </div>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
