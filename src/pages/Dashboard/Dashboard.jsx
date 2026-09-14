import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import SmartReminders from '../../components/SmartReminders/SmartReminders'
import KpiCard from '../../components/enterprise/KpiCard'
import { useAuth } from '../../context/AuthContext'
import { getDashboardData } from '../../services/dashboardService'
import './Dashboard.css'

// Currency formatter for Indian Rupees
const formatCurrency = (val) => {
  if (!val && val !== 0) return '₹0'
  const num = Number(val)
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`
  return `₹${num.toLocaleString('en-IN')}`
}

const formatFullCurrency = (val) => {
  if (!val && val !== 0) return '₹0'
  return `₹${Number(val).toLocaleString('en-IN')}`
}

// Get time-of-day greeting
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

// Map event status to color
const getStatusColor = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'booked' || s === 'confirmed') return '#0284c7'
  if (s === 'completed') return '#16a34a'
  if (s === 'cancelled') return '#dc2626'
  if (s.includes('progress') || s.includes('production')) return '#d97706'
  return '#6366f1'
}

export default function Dashboard({ activeTab = 'home', setActiveTab }) {
  const { user } = useAuth()
  const [showFinancials, setShowFinancials] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Real dashboard data from API
  const [dashData, setDashData] = useState({
    totalEvents: 0,
    totalClients: 0,
    totalCollected: 0,
    pendingTasks: 0,
    recentEvents: [],
    recentClients: [],
  })

  useEffect(() => {
    async function fetchBackendDashboard() {
      const data = await getDashboardData()
      if (data) {
        setDashData({
          totalEvents: data.totalEvents || 0,
          totalClients: data.totalClients || 0,
          totalCollected: data.totalCollected || 0,
          pendingTasks: data.pendingTasks || 0,
          recentEvents: data.recentEvents || [],
          recentClients: data.recentClients || [],
        })
      }
    }
    fetchBackendDashboard()
  }, [])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Dynamic greeting using logged-in user name
  const userName = user?.name || user?.username || 'User'
  const greeting = getGreeting()

  // Map recent events into upcoming shoots table rows
  const upcomingShoots = dashData.recentEvents.map((evt) => {
    const clientName = evt.clientId
      ? `${evt.clientId.firstName || ''} ${evt.clientId.lastName || ''}`.trim()
      : evt.clientName || 'Client'
    const venueParts = [evt.venueName || evt.venue, evt.city].filter(Boolean)
    let dateStr = ''
    if (evt.eventDate) {
      const d = new Date(evt.eventDate)
      if (!isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      }
    }
    return {
      id: evt._id || evt.id,
      couple: clientName || evt.eventName || 'Event',
      eventType: evt.eventType || 'Shoot',
      date: dateStr,
      venue: venueParts.join(', ') || 'Venue TBD',
      status: evt.eventStatus || evt.status || 'Booked',
      statusColor: getStatusColor(evt.eventStatus || evt.status),
    }
  })

  // Compute financial overview from real data
  const grossContractValue = dashData.recentEvents.reduce(
    (sum, evt) => sum + (Number(evt.packageAmount) || 0), 0
  )
  const advancesReceived = dashData.totalCollected
  const pendingBalance = Math.max(0, grossContractValue - advancesReceived)

  // Current month/year label
  const currentMonthLabel = new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

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
              <h1 className="dash-greeting__title">{greeting}, {userName}</h1>
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
              value={String(dashData.totalEvents)}
              icon="pi pi-calendar-plus"
            />
            <KpiCard
              title="Gross Revenue"
              value={formatCurrency(grossContractValue)}
              subtitle={`${formatCurrency(advancesReceived)} Collected`}
              icon="pi pi-wallet"
            />
            <KpiCard
              title="Pending Tasks"
              value={String(dashData.pendingTasks)}
              icon="pi pi-images"
            />
            <KpiCard
              title="Total Clients"
              value={String(dashData.totalClients)}
              icon="pi pi-users"
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
                  <i className="pi pi-calendar" /> Recent Events
                </h3>
                <span className="ent-card__link" onClick={() => setActiveTab('events')}>
                  View All →
                </span>
              </div>
              <div className="ent-card__body" style={{ padding: 0 }}>
                {upcomingShoots.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <i className="pi pi-calendar-plus" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No events yet. Book your first event!</p>
                  </div>
                ) : (
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
                )}
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
                    <span className="dash-fin-summary__label">{currentMonthLabel}</span>
                    <span className="dash-fin-summary__count">{dashData.totalEvents}</span>
                    <span className="dash-fin-summary__sub">Active Bookings</span>
                  </div>

                  <div className="dash-fin-items">
                    <div className="dash-fin-item">
                      <span className="dash-fin-item__dot dash-fin-item__dot--dark" />
                      <span className="dash-fin-item__name">Gross Contract Value</span>
                      <span className="dash-fin-item__value">
                        {showFinancials ? formatFullCurrency(grossContractValue) : '•••••'}
                      </span>
                    </div>
                    <div className="dash-fin-item">
                      <span className="dash-fin-item__dot dash-fin-item__dot--green" />
                      <span className="dash-fin-item__name">Advances Received</span>
                      <span className="dash-fin-item__value">
                        {showFinancials ? formatFullCurrency(advancesReceived) : '•••••'}
                      </span>
                    </div>
                    <div className="dash-fin-item">
                      <span className="dash-fin-item__dot dash-fin-item__dot--blue" />
                      <span className="dash-fin-item__name">Net Pending Balance</span>
                      <span className="dash-fin-item__value">
                        {showFinancials ? formatFullCurrency(pendingBalance) : '•••••'}
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
