import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import SmartReminders from '../../components/SmartReminders/SmartReminders'
import KpiCard from '../../components/enterprise/KpiCard'
import { getDashboardData } from '../../services/dashboardService'
import './Dashboard.css'

export default function Dashboard({ activeTab = 'home', setActiveTab }) {
  const [showFinancials, setShowFinancials] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashKpis, setDashKpis] = useState({
    activeShootsCount: 14,
    revenueCollected: 1420000,
    editingPendingCount: 4,
    deliverablesReadyCount: 6
  })

  useEffect(() => {
    async function fetchBackendDashboard() {
      const data = await getDashboardData()
      if (data && data.kpis) {
        setDashKpis({
          activeShootsCount: data.kpis.activeShootsCount || 14,
          revenueCollected: data.kpis.revenueCollected || 1420000,
          editingPendingCount: data.kpis.editingPendingCount || 4,
          deliverablesReadyCount: data.kpis.deliverablesReadyCount || 6
        })
      }
    }
    fetchBackendDashboard()
  }, [])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const upcomingShoots = [
    {
      id: 'EVT-2026-001',
      couple: 'Sophia & James Sterling',
      eventType: 'Wedding & Reception',
      date: 'Aug 12, 2026',
      venue: 'The Grand Chateau, Napa Valley',
      status: 'Shooting Today',
      statusColor: '#dc2626'
    },
    {
      id: 'EVT-2026-002',
      couple: 'Priya & Rohan Sharma',
      eventType: 'Sangeet & Mehendi',
      date: 'Aug 15, 2026',
      venue: 'The Ritz Carlton, Mumbai',
      status: 'Confirmed',
      statusColor: '#0284c7'
    },
    {
      id: 'EVT-2026-003',
      couple: 'Olivia & Liam Vance',
      eventType: 'Destination Wedding',
      date: 'Aug 20, 2026',
      venue: 'Sunset Cove Resort, Miami',
      status: 'In Post-Production',
      statusColor: '#d97706'
    }
  ]

  return (
    <div className="portal-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <div className="portal-main">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="portal-body">
          {/* Toast */}
          {toastMsg && (
            <div className="enterprise-toast">
              <i className="pi pi-check-circle" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Greeting Line */}
          <div className="dash-greeting">
            <div>
              <h1 className="dash-greeting__title">Good Evening, Sathish</h1>
              <p className="dash-greeting__sub">Here's your studio overview for today</p>
            </div>
            <div className="dash-greeting__actions">
              <button
                className="dash-greeting__btn dash-greeting__btn--primary"
                onClick={() => setActiveTab('add-event')}
              >
                <i className="pi pi-plus" /> New Event
              </button>
              <button
                className="dash-greeting__btn dash-greeting__btn--secondary"
                onClick={() => setActiveTab('workflow')}
              >
                <i className="pi pi-sitemap" /> Workflow
              </button>
            </div>
          </div>

          {/* KPI Metrics Row */}
          <div className="ent-kpi-grid">
            <KpiCard
              title="Total Shoots Booked"
              value="38"
              trend="+12%"
              trendDirection="up"
              icon="pi pi-calendar-plus"
            />
            <KpiCard
              title="Gross Revenue"
              value="₹24.5L"
              subtitle="₹14.2L Collected"
              icon="pi pi-wallet"
            />
            <KpiCard
              title="Edits In Progress"
              value="14"
              subtitle="4 Pending Review"
              icon="pi pi-images"
            />
            <KpiCard
              title="Albums Delivered"
              value="22"
              subtitle="6 Ready Today"
              icon="pi pi-check-circle"
            />
          </div>

          {/* Smart Reminders */}
          <SmartReminders onShowToast={showToast} />

          {/* Main Dashboard Grid */}
          <div className="dash-main-grid">
            {/* Upcoming Shoots */}
            <div className="ent-card">
              <div className="ent-card__header">
                <h3 className="ent-card__title">
                  <i className="pi pi-calendar" /> Upcoming Shoots
                </h3>
                <span className="ent-card__link" onClick={() => setActiveTab('events')}>
                  View All →
                </span>
              </div>
              <div className="ent-card__body" style={{ padding: 0 }}>
                <table className="dash-shoots-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingShoots.map((shoot) => (
                      <tr key={shoot.id} onClick={() => setActiveTab('events')} className="dash-shoots-table__row">
                        <td>
                          <span className="dash-shoots-table__name">{shoot.couple}</span>
                          <span className="dash-shoots-table__venue">{shoot.venue}</span>
                        </td>
                        <td className="dash-shoots-table__type">{shoot.eventType}</td>
                        <td className="dash-shoots-table__date">{shoot.date}</td>
                        <td>
                          <span
                            className="ent-status-badge"
                            style={{
                              color: shoot.statusColor,
                              backgroundColor: shoot.statusColor + '12',
                              borderColor: shoot.statusColor + '30',
                            }}
                          >
                            {shoot.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column */}
            <div className="dash-right-column">
              {/* Financial Overview */}
              <div className="ent-card">
                <div className="ent-card__header">
                  <h3 className="ent-card__title">
                    <i className="pi pi-chart-line" /> Financial Overview
                  </h3>
                </div>
                <div className="ent-card__body">
                  <div className="dash-fin-summary">
                    <span className="dash-fin-summary__label">Aug 2026</span>
                    <span className="dash-fin-summary__count">38</span>
                    <span className="dash-fin-summary__sub">Active Bookings</span>
                  </div>

                  <div className="dash-fin-items">
                    <div className="dash-fin-item">
                      <span className="dash-fin-item__dot dash-fin-item__dot--dark" />
                      <span className="dash-fin-item__name">Gross Contract Value</span>
                      <span className="dash-fin-item__value">
                        {showFinancials ? '₹24,50,000' : '•••••'}
                      </span>
                    </div>
                    <div className="dash-fin-item">
                      <span className="dash-fin-item__dot dash-fin-item__dot--green" />
                      <span className="dash-fin-item__name">Advances Received</span>
                      <span className="dash-fin-item__value">
                        {showFinancials ? '₹14,20,000' : '•••••'}
                      </span>
                    </div>
                    <div className="dash-fin-item">
                      <span className="dash-fin-item__dot dash-fin-item__dot--blue" />
                      <span className="dash-fin-item__name">Net Pending Balance</span>
                      <span className="dash-fin-item__value">
                        {showFinancials ? '₹10,30,000' : '•••••'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="dash-fin-toggle"
                    onClick={() => setShowFinancials(!showFinancials)}
                  >
                    <i className={`pi pi-eye${showFinancials ? '-slash' : ''}`} />
                    {showFinancials ? 'Hide Figures' : 'Show Figures'}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="ent-card">
                <div className="ent-card__header">
                  <h3 className="ent-card__title">
                    <i className="pi pi-bolt" /> Quick Actions
                  </h3>
                </div>
                <div className="ent-card__body">
                  <div className="dash-quick-grid">
                    <div className="dash-quick-btn" onClick={() => setActiveTab('add-event')}>
                      <i className="pi pi-plus-circle" />
                      <span>Book Event</span>
                    </div>
                    <div className="dash-quick-btn" onClick={() => setActiveTab('workflow')}>
                      <i className="pi pi-sitemap" />
                      <span>Workflow</span>
                    </div>
                    <div className="dash-quick-btn" onClick={() => setActiveTab('events')}>
                      <i className="pi pi-calendar" />
                      <span>Events</span>
                    </div>
                    <div className="dash-quick-btn" onClick={() => setActiveTab('finance')}>
                      <i className="pi pi-wallet" />
                      <span>Finance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
