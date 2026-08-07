import React from 'react'
import './Sidebar.css'

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'pi pi-home', active: true },
    { id: 'engage', label: 'Engage', icon: 'pi pi-wifi' },
    { id: 'worklife', label: 'My Worklife', icon: 'pi pi-th-large', hasSub: true },
    { id: 'todo', label: 'To do', icon: 'pi pi-clipboard', hasSub: true },
    { id: 'salary', label: 'Salary & Earnings', icon: 'pi pi-wallet', hasSub: true },
    { id: 'leave', label: 'Events & Leave', icon: 'pi pi-calendar', hasSub: true },
    { id: 'documents', label: 'Document Center', icon: 'pi pi-file' },
    { id: 'people', label: 'Studio Crew & People', icon: 'pi pi-users' },
    { id: 'helpdesk', label: 'Helpdesk', icon: 'pi pi-info-circle' },
    { id: 'requests', label: 'Request Hub', icon: 'pi pi-layers' },
    { id: 'workflow', label: 'Workflow Delegates', icon: 'pi pi-sitemap' }
  ]

  return (
    <aside className="portal-sidebar">
      {/* Brand Logo Header */}
      <div className="portal-sidebar__brand">
        <div className="portal-sidebar__logo-wrap">
          <span className="portal-sidebar__brand-name">
            IT<span className="portal-sidebar__brand-dot">⊙</span>rizon<sup>®</sup>
          </span>
          <span className="portal-sidebar__brand-sub">STUDIO MANAGEMENT SERVICES</span>
        </div>
      </div>

      {/* Profile Snippet Box */}
      <div className="portal-sidebar__profile">
        <div className="portal-sidebar__avatar-wrap">
          <i className="pi pi-user portal-sidebar__avatar-icon" />
        </div>
        <div className="portal-sidebar__user-details">
          <span className="portal-sidebar__greeting">Hi SATHISH</span>
          <a href="#info" className="portal-sidebar__view-link">View My Info</a>
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
