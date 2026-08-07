import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { ProgressBar } from 'primereact/progressbar'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import Sidebar from '../components/Sidebar'
import DashboardHeader from '../components/DashboardHeader'
import './Dashboard.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [newBookingVisible, setNewBookingVisible] = useState(false)

  // Sample Form State
  const [coupleName, setCoupleName] = useState('')
  const [eventDate, setEventDate] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)

  // Mock Wedding Events Data
  const weddingEvents = [
    {
      id: 'WED-2026-01',
      couple: 'Sophia & James Sterling',
      event: 'Grand Wedding & Reception',
      date: '2026-08-12',
      venue: 'The Grand Chateau, Napa Valley',
      package: 'Royal Cinematic 4K',
      crew: ['Alex V. (Lead)', 'Marco K. (Drone)', 'Maya S. (Second)'],
      payment: 'Paid in Full',
      status: 'Shooting Next',
      progress: 0
    },
    {
      id: 'WED-2026-02',
      couple: 'Priya & Rohan Sharma',
      event: 'Sangeet & Wedding Ceremony',
      date: '2026-08-15',
      venue: 'The Ritz Carlton Ballroom',
      package: 'Heritage Multi-Day Gold',
      crew: ['Elena R. (Lead)', 'David P. (Video)'],
      payment: 'Deposit Paid ($4,500)',
      status: 'Confirmed',
      progress: 20
    },
    {
      id: 'WED-2026-03',
      couple: 'Olivia & Liam Vance',
      event: 'Destination Beach Wedding',
      date: '2026-08-04',
      venue: 'Sunset Cove Resort, Miami',
      package: 'Destination Luxe Film',
      crew: ['Alex V. (Lead)', 'Sarah L. (Culling)'],
      payment: 'Paid in Full',
      status: 'In Post-Production',
      progress: 68
    },
    {
      id: 'WED-2026-04',
      couple: 'Emma & Benjamin Hayes',
      event: 'Intimate Botanical Marriage',
      date: '2026-07-28',
      venue: 'Royal Botanical Gardens',
      package: 'Classic Memories Package',
      crew: ['Maya S. (Lead)'],
      payment: 'Paid in Full',
      status: 'Delivered',
      progress: 100
    },
    {
      id: 'WED-2026-05',
      couple: 'Chloe & Nathaniel Dupont',
      event: 'Pre-Wedding & Gala Dinner',
      date: '2026-08-22',
      venue: 'Belmond Villa San Michele',
      package: 'Signature Cinema + Album',
      crew: ['Elena R. (Lead)', 'Marco K. (Drone)'],
      payment: 'Deposit Due ($2,000)',
      status: 'Pending Deposit',
      progress: 10
    }
  ]

  // Mock Active Post-Production Pipelines
  const deliverablesPipeline = [
    {
      title: 'Olivia & Liam — Cinematic Feature Film (4K)',
      stage: 'Color Grading & Audio Mixing',
      progress: 75,
      deadline: 'Aug 18, 2026',
      editor: 'Marcus Sterling'
    },
    {
      title: 'Sophia & James — Highlight Reel Teaser',
      stage: 'RAW Photo Culling & Retouching',
      progress: 35,
      deadline: 'Aug 20, 2026',
      editor: 'Sarah Lin'
    },
    {
      title: 'Emma & Benjamin — Physical Keepsake Album',
      stage: 'Sent to Italian Print Lab',
      progress: 95,
      deadline: 'Aug 10, 2026',
      editor: 'Print Specialist'
    }
  ]

  // Mock Today's Schedule
  const todayShoots = [
    {
      time: '09:00 AM',
      title: 'Bridal Preparation Shoot',
      couple: 'Sophia & James',
      location: 'Suite 402, St. Regis Hotel',
      crew: 'Alex & Maya'
    },
    {
      time: '02:30 PM',
      title: 'First Look & Couple Portraits',
      couple: 'Sophia & James',
      location: 'Chateau Garden Lawn',
      crew: 'Full Camera Team'
    },
    {
      time: '06:00 PM',
      title: 'Sunset Ceremony & Vows',
      couple: 'Sophia & James',
      location: 'Chateau Amphitheater',
      crew: 'Lead + 2nd + Drone'
    }
  ]

  // Column Templates for DataTable
  const coupleBodyTemplate = (rowData) => (
    <div className="table__couple-cell">
      <span className="table__couple-name">{rowData.couple}</span>
      <span className="table__event-type">{rowData.event}</span>
    </div>
  )

  const dateVenueBodyTemplate = (rowData) => (
    <div className="table__venue-cell">
      <span className="table__date">
        <i className="pi pi-calendar-minus" /> {rowData.date}
      </span>
      <span className="table__venue">{rowData.venue}</span>
    </div>
  )

  const crewBodyTemplate = (rowData) => (
    <div className="table__crew-tags">
      {rowData.crew.map((member, idx) => (
        <span key={idx} className="table__crew-chip">
          {member}
        </span>
      ))}
    </div>
  )

  const paymentBodyTemplate = (rowData) => (
    <Tag value={rowData.payment} className="tag-mono" />
  )

  const statusBodyTemplate = (rowData) => (
    <div className="table__status-cell">
      <Tag value={rowData.status} className="tag-mono tag-mono--active" />
      <ProgressBar
        value={rowData.progress}
        showValue={false}
        style={{ height: '4px', marginTop: '6px' }}
      />
    </div>
  )

  const actionBodyTemplate = () => (
    <div className="table__actions">
      <Button icon="pi pi-eye" rounded text className="btn-icon-mono" aria-label="View" />
      <Button icon="pi pi-pencil" rounded text className="btn-icon-mono" aria-label="Edit" />
    </div>
  )

  const packagesOptions = [
    { label: 'Royal Cinematic 4K ($8,500)', value: 'royal' },
    { label: 'Heritage Multi-Day Gold ($6,200)', value: 'gold' },
    { label: 'Destination Luxe Film ($12,000)', value: 'luxe' },
    { label: 'Classic Memories Package ($4,000)', value: 'classic' }
  ]

  return (
    <div className="app-layout">
      {/* Permanent Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="app-main">
        <DashboardHeader onNewBooking={() => setNewBookingVisible(true)} />

        <div className="dash-body">
          {/* Welcome & Overview Header */}
          <div className="dash-welcome">
            <div>
              <h1 className="dash-welcome__title">
                STUDIO MANAGER <span className="dash-welcome__accent">DASHBOARD</span>
              </h1>
              <p className="dash-welcome__subtitle">
                Black & White Minimalist Edition • 38 Confirmed Weddings
              </p>
            </div>
            <div className="dash-welcome__quick-stats">
              <div className="quick-chip">
                <i className="pi pi-sun" />
                <span>Weather: Clear Skies, 26°C</span>
              </div>
              <div className="quick-chip">
                <i className="pi pi-check-circle" />
                <span>3 Drones Ready</span>
              </div>
            </div>
          </div>

          {/* ─── Metric Cards Grid ─── */}
          <div className="metrics-grid">
            <Card className="metric-card">
              <div className="metric-card__inner">
                <div className="metric-card__info">
                  <span className="metric-card__label">Total Weddings</span>
                  <h3 className="metric-card__value">38 Weddings</h3>
                  <span className="metric-card__sub">+12% vs last season</span>
                </div>
                <div className="metric-card__icon">
                  <i className="pi pi-heart" />
                </div>
              </div>
            </Card>

            <Card className="metric-card">
              <div className="metric-card__inner">
                <div className="metric-card__info">
                  <span className="metric-card__label">Season Revenue</span>
                  <h3 className="metric-card__value">$198,400</h3>
                  <span className="metric-card__sub">$142k Collected • $56k Pending</span>
                </div>
                <div className="metric-card__icon">
                  <i className="pi pi-wallet" />
                </div>
              </div>
            </Card>

            <Card className="metric-card">
              <div className="metric-card__inner">
                <div className="metric-card__info">
                  <span className="metric-card__label">Upcoming Shoots</span>
                  <h3 className="metric-card__value">6 This Week</h3>
                  <span className="metric-card__sub">Next: Sophia & James Today</span>
                </div>
                <div className="metric-card__icon">
                  <i className="pi pi-video" />
                </div>
              </div>
            </Card>

            <Card className="metric-card">
              <div className="metric-card__inner">
                <div className="metric-card__info">
                  <span className="metric-card__label">Editing Queue</span>
                  <h3 className="metric-card__value">14 Projects</h3>
                  <span className="metric-card__sub">8 Albums • 6 Films</span>
                </div>
                <div className="metric-card__icon">
                  <i className="pi pi-sliders-h" />
                </div>
              </div>
            </Card>
          </div>

          {/* ─── Main Content Grid (Table + Side Panels) ─── */}
          <div className="dash-grid">
            {/* Left Column: Upcoming Wedding Events Table */}
            <div className="dash-grid__main">
              <Card className="card-custom">
                <div className="card-header">
                  <div>
                    <h2 className="card-header__title">Upcoming Wedding Bookings & Events</h2>
                    <p className="card-header__sub">
                      Live status of contracts, assigned crew, and shoot readiness
                    </p>
                  </div>
                  <Button
                    label="View All Events"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    className="p-button-text p-button-sm btn-mono-text"
                  />
                </div>

                <DataTable
                  value={weddingEvents}
                  responsiveLayout="scroll"
                  className="custom-datatable"
                  stripedRows
                >
                  <Column field="couple" header="Couple & Event" body={coupleBodyTemplate} />
                  <Column field="date" header="Date & Venue" body={dateVenueBodyTemplate} />
                  <Column field="package" header="Package" />
                  <Column field="crew" header="Assigned Crew" body={crewBodyTemplate} />
                  <Column field="payment" header="Payment" body={paymentBodyTemplate} />
                  <Column field="status" header="Shoot & Editing Status" body={statusBodyTemplate} />
                  <Column body={actionBodyTemplate} exportable={false} style={{ width: '80px' }} />
                </DataTable>
              </Card>

              {/* Editing & Deliverables Pipeline Section */}
              <Card className="card-custom" style={{ marginTop: '1.5rem' }}>
                <div className="card-header">
                  <div>
                    <h2 className="card-header__title">Active Post-Production & Album Pipeline</h2>
                    <p className="card-header__sub">
                      Tracking photo culling, video editing, color grading, and print shipping
                    </p>
                  </div>
                </div>

                <div className="pipeline-list">
                  {deliverablesPipeline.map((item, idx) => (
                    <div key={idx} className="pipeline-item">
                      <div className="pipeline-item__top">
                        <div className="pipeline-item__title-group">
                          <i className="pi pi-film pipeline-item__icon" />
                          <div>
                            <h4 className="pipeline-item__title">{item.title}</h4>
                            <span className="pipeline-item__stage">
                              Stage: <strong>{item.stage}</strong> • Editor: {item.editor}
                            </span>
                          </div>
                        </div>
                        <div className="pipeline-item__deadline">
                          <i className="pi pi-clock" /> Due {item.deadline}
                        </div>
                      </div>

                      <div className="pipeline-item__bar-group">
                        <ProgressBar value={item.progress} showValue={false} style={{ height: '6px' }} />
                        <span className="pipeline-item__pct">{item.progress}% Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column: Today's Schedule & Quick Actions */}
            <div className="dash-grid__side">
              {/* Today's Shoot Schedule Card */}
              <Card className="card-custom">
                <div className="card-header">
                  <h3 className="card-header__title">
                    <i className="pi pi-calendar-plus" style={{ color: '#ffffff', marginRight: '8px' }} />
                    Today's Shoot Timeline
                  </h3>
                </div>

                <div className="timeline-list">
                  {todayShoots.map((shoot, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-item__time-box">
                        <span className="timeline-item__time">{shoot.time}</span>
                      </div>
                      <div className="timeline-item__content">
                        <h4 className="timeline-item__title">{shoot.title}</h4>
                        <span className="timeline-item__couple">{shoot.couple}</span>
                        <div className="timeline-item__meta">
                          <span>
                            <i className="pi pi-map-marker" /> {shoot.location}
                          </span>
                          <span>
                            <i className="pi pi-user" /> {shoot.crew}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Studio Equipment Readiness Widget */}
              <Card className="card-custom" style={{ marginTop: '1.5rem' }}>
                <div className="card-header">
                  <h3 className="card-header__title">
                    <i className="pi pi-camera" style={{ color: '#ffffff', marginRight: '8px' }} />
                    Equipment Check
                  </h3>
                </div>

                <div className="gear-status-list">
                  <div className="gear-status-item">
                    <div className="gear-status-info">
                      <i className="pi pi-check-circle gear-status-icon" />
                      <div>
                        <strong>Sony A7IV & FX3 Rigs</strong>
                        <span>6/6 Camera Bodies prepped & battery 100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="gear-status-item">
                    <div className="gear-status-info">
                      <i className="pi pi-check-circle gear-status-icon" />
                      <div>
                        <strong>DJI Mavic 3 Pro Drone</strong>
                        <span>Firmware updated • 4 Batteries charged</span>
                      </div>
                    </div>
                  </div>

                  <div className="gear-status-item">
                    <div className="gear-status-info">
                      <i className="pi pi-circle gear-status-icon" />
                      <div>
                        <strong>Godox AD600 Lighting Kit</strong>
                        <span>Stand #2 replacement pending in Van B</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ─── New Booking Dialog ─── */}
      <Dialog
        header="Book New Wedding Event"
        visible={newBookingVisible}
        style={{ width: '500px' }}
        onHide={() => setNewBookingVisible(false)}
        className="custom-dialog-mono"
      >
        <div className="dialog-form">
          <div className="p-field">
            <label htmlFor="coupleName">Couple Names</label>
            <InputText
              id="coupleName"
              placeholder="e.g. Jessica & David Miller"
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="p-field" style={{ marginTop: '1rem' }}>
            <label htmlFor="eventDate">Wedding Date</label>
            <Calendar
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.value)}
              showIcon
              placeholder="Select Event Date"
              className="w-full"
            />
          </div>

          <div className="p-field" style={{ marginTop: '1rem' }}>
            <label htmlFor="package">Photography & Video Package</label>
            <Dropdown
              id="package"
              value={selectedPackage}
              options={packagesOptions}
              onChange={(e) => setSelectedPackage(e.value)}
              placeholder="Select Studio Package"
              className="w-full"
            />
          </div>

          <div className="dialog-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text btn-mono-text"
              onClick={() => setNewBookingVisible(false)}
            />
            <Button
              label="Save Booking"
              icon="pi pi-check"
              className="dash-header__btn-new"
              onClick={() => setNewBookingVisible(false)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
