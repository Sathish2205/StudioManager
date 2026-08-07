import React from 'react'
import './DashboardHeader.css'

export default function DashboardHeader({ activeTab = 'home', setActiveTab }) {
  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'events':
        return [{ label: 'Events & Shoots', active: true }]
      case 'add-event':
        return [
          { label: 'Events & Shoots', onClick: () => setActiveTab && setActiveTab('events') },
          { label: 'Add Event', active: true }
        ]
      case 'calendar':
        return [{ label: 'Shoot Calendar', active: true }]
      case 'home':
      default:
        return [{ label: 'Studio Overview', active: true }]
    }
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="portal-header">
      {/* Left Title / Interactive Breadcrumb with Home Button */}
      <div className="portal-header__left">
        <button
          className="portal-header__home-btn"
          onClick={() => setActiveTab && setActiveTab('home')}
          title="Go to Home Overview"
          aria-label="Home Overview"
        >
          <i className="pi pi-home" />
        </button>

        <div className="portal-header__breadcrumb">
          <span
            className="header-crumb-home"
            onClick={() => setActiveTab && setActiveTab('home')}
          >
            Home
          </span>

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

        <button className="portal-header__icon-btn" aria-label="Notifications">
          <i className="pi pi-bell" />
          <span className="portal-header__dot" />
        </button>

        <button className="portal-header__icon-btn" aria-label="Logout">
          <i className="pi pi-power-off" />
        </button>
      </div>
    </header>
  )
}
