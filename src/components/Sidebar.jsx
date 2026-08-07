import React from 'react'
import { Badge } from 'primereact/badge'
import './Sidebar.css'

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'pi pi-home' },
    { id: 'events', label: 'Wedding Events', icon: 'pi pi-calendar', badge: '12' },
    { id: 'clients', label: 'Clients & Leads', icon: 'pi pi-users', badge: '5' },
    { id: 'deliverables', label: 'Editing & Albums', icon: 'pi pi-images', badge: '8' },
    { id: 'crew', label: 'Crew & Gear', icon: 'pi pi-camera' },
    { id: 'finance', label: 'Finance & Invoices', icon: 'pi pi-wallet' },
    { id: 'settings', label: 'Studio Settings', icon: 'pi pi-cog' }
  ]

  return (
    <aside className="sidebar">
      {/* Studio Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <i className="pi pi-heart-fill" />
        </div>
        <div className="sidebar__brand-info">
          <span className="sidebar__title">Vows & Lenses</span>
          <span className="sidebar__subtitle">Wedding Studio Pro</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar__nav">
        <div className="sidebar__section-title">MANAGEMENT</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__item ${activeTab === item.id ? 'sidebar__item--active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="sidebar__item-left">
              <i className={`${item.icon} sidebar__icon`} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <Badge
                value={item.badge}
                severity={item.id === 'events' ? 'danger' : 'info'}
                className="sidebar__badge"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Studio Quick Status */}
      <div className="sidebar__footer">
        <div className="sidebar__gear-card">
          <div className="sidebar__gear-header">
            <i className="pi pi-bolt" />
            <span>Peak Season Status</span>
          </div>
          <p>8 Shoots scheduled for this weekend. All gear checked.</p>
          <div className="sidebar__season-progress">
            <div className="sidebar__season-bar" style={{ width: '85%' }} />
          </div>
          <small>85% Calendar Capacity</small>
        </div>
      </div>
    </aside>
  )
}
