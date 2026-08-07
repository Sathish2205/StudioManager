import React from 'react'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Badge } from 'primereact/badge'
import './DashboardHeader.css'

export default function DashboardHeader({ onNewBooking }) {
  return (
    <header className="dash-header">
      {/* Search Input */}
      <div className="dash-header__search">
        <i className="pi pi-search dash-header__search-icon" />
        <input
          type="text"
          placeholder="Search wedding, couple, venue, or crew..."
          className="dash-header__search-input"
        />
      </div>

      {/* Header Actions */}
      <div className="dash-header__actions">
        {/* Quick Action Button */}
        <Button
          label="New Booking"
          icon="pi pi-plus"
          className="dash-header__btn-new"
          rounded
          onClick={onNewBooking}
        />

        {/* Notifications Icon */}
        <div className="dash-header__icon-btn">
          <i className="pi pi-bell" />
          <Badge value="3" className="dash-header__bell-badge" />
        </div>

        {/* Calendar Quick Sync */}
        <div className="dash-header__icon-btn">
          <i className="pi pi-sync" />
        </div>

        {/* Studio Profile */}
        <div className="dash-header__profile">
          <Avatar
            image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
            shape="circle"
            size="normal"
            className="dash-header__avatar"
          />
          <div className="dash-header__profile-text">
            <span className="dash-header__user-name">Elena Rostova</span>
            <span className="dash-header__user-role">Lead Studio Producer</span>
          </div>
        </div>
      </div>
    </header>
  )
}
