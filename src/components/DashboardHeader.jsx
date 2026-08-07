import React from 'react'
import './DashboardHeader.css'

export default function DashboardHeader() {
  return (
    <header className="portal-header">
      {/* Left Title / Breadcrumb */}
      <div className="portal-header__left">
        <div className="portal-header__icon-box">
          <i className="pi pi-camera" />
        </div>
        <h1 className="portal-header__title">PhotoStudio Events & Finance</h1>
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
