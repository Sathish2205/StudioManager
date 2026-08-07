import React from 'react'
import './Sidebar.css'

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Studio Overview', icon: 'pi pi-home' },
    { id: 'events', label: 'Events & Shoots', icon: 'pi pi-calendar' },
    { id: 'calendar', label: 'Shoot Calendar', icon: 'pi pi-calendar-plus', hasSub: true },
    { id: 'tasks', label: 'Editing & Deliverables', icon: 'pi pi-images', hasSub: true },
    { id: 'finance', label: 'Finance & Invoices', icon: 'pi pi-wallet', hasSub: true },
    { id: 'packages', label: 'Packages & Quotes', icon: 'pi pi-tag', hasSub: true },
    { id: 'contracts', label: 'Contracts & Docs', icon: 'pi pi-file' },
    { id: 'crew', label: 'Crew & Photographers', icon: 'pi pi-users' },
    { id: 'equipment', label: 'Equipment Tracker', icon: 'pi pi-camera' },
    { id: 'helpdesk', label: 'Studio Helpdesk', icon: 'pi pi-info-circle' },
    { id: 'requests', label: 'Client Requests', icon: 'pi pi-layers' }
  ]

  return (
    <aside className="portal-sidebar">
      {/* Brand Logo Header */}
      <div className="portal-sidebar__brand">
        <div className="portal-sidebar__logo-wrap">
          <span className="portal-sidebar__brand-name">
            PhotoStudio<span className="portal-sidebar__brand-dot">⊙</span>PRO<sup>®</sup>
          </span>
          <span className="portal-sidebar__brand-sub">EVENT & FINANCE MANAGEMENT</span>
        </div>
      </div>

      {/* Profile Snippet Box */}
      <div className="portal-sidebar__profile">
        <div className="portal-sidebar__avatar-wrap">
          <i className="pi pi-camera portal-sidebar__avatar-icon" />
        </div>
        <div className="portal-sidebar__user-details">
          <span className="portal-sidebar__greeting">Hi SATHISH</span>
          <a href="#info" className="portal-sidebar__view-link">Lead Studio Manager</a>
        </div>
        <button className="portal-sidebar__settings-btn" aria-label="Settings">
          <i className="pi pi-cog" />
        </button>
      </div>

      {/* Vertical Navigation Links */}
      <nav className="portal-sidebar__nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`portal-sidebar__item ${activeTab === item.id ? 'portal-sidebar__item--active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="portal-sidebar__item-left">
              <i className={`${item.icon} portal-sidebar__icon`} />
              <span>{item.label}</span>
            </div>
            {item.hasSub && (
              <i className="pi pi-chevron-down portal-sidebar__caret" />
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}
