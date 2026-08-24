import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import SmartReminders from '../../components/SmartReminders/SmartReminders'
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
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="portal-main">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="portal-body">
          {/* Toast Notification Banner */}
          {toastMsg && (
            <div
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 99999,
                background: '#2563eb',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              <i className="pi pi-check-circle" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Greeting Hero Section */}
          <div className="portal-hero">
            <div className="portal-hero__text">
              <div className="portal-hero__date-badge">
                <i className="pi pi-calendar" /> Saturday, 08 Aug 2026 | Peak Wedding Season
              </div>
              <h1 className="portal-hero__greeting">Good Evening, Sathish</h1>
              <p className="portal-hero__quote">
                Capturing timeless memories, tracking editing workflows & accelerating studio revenue.
              </p>
              <div className="portal-hero__actions">
                <button
                  className="portal-hero__btn portal-hero__btn--primary"
                  onClick={() => setActiveTab('add-event')}
                >
                  <i className="pi pi-plus" /> Book New Event
                </button>
                <button
                  className="portal-hero__btn portal-hero__btn--outline"
                  onClick={() => setActiveTab('workflow')}
                >
                  <i className="pi pi-sitemap" /> Workflow List
                </button>
              </div>
            </div>

            {/* Photography & Event Vector Graphic */}
            <div className="portal-hero__graphic">
              <svg viewBox="0 0 450 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="portal-hero__svg">
                <circle cx="390" cy="45" r="28" fill="#38bdf8" opacity="0.8" />
                <circle cx="390" cy="45" r="18" fill="#0284c7" />
                <circle cx="390" cy="45" r="8" fill="#ffffff" />
                <path d="M0 115 C 150 115, 250 75, 450 35" stroke="#38bdf8" strokeWidth="6" strokeDasharray="8 4" fill="none" />
                <path d="M0 130 C 150 130, 260 90, 450 50" stroke="#ffffff" strokeWidth="10" opacity="0.2" fill="none" />
                <rect x="330" y="60" width="55" height="32" rx="6" fill="#ffffff" opacity="0.9" transform="rotate(-6 330 60)" />
                <circle cx="355" cy="74" r="10" fill="#0284c7" />
                <rect x="345" y="54" width="16" height="8" rx="2" fill="#64748b" transform="rotate(-6 345 54)" />
              </svg>
            </div>
          </div>

          {/* ── Executive Studio Metrics Grid ── */}
          <div className="home-metrics-grid">
            <div className="home-metric-card">
              <div>
                <div className="home-metric__title">Total Shoots Booked</div>
                <div className="home-metric__val">38</div>
                <div className="home-metric__sub">
                  <span className="home-metric-tag home-metric-tag--green">
                    <i className="pi pi-arrow-up-right" /> +12% this month
                  </span>
                </div>
              </div>
              <div className="home-metric__icon-wrap home-metric__icon-wrap--blue">
                <i className="pi pi-calendar-plus" />
              </div>
            </div>

            <div className="home-metric-card">
              <div>
                <div className="home-metric__title">Gross Revenue</div>
                <div className="home-metric__val">₹24.5L</div>
                <div className="home-metric__sub">
                  <span className="home-metric-tag home-metric-tag--green">
                    <i className="pi pi-check-circle" /> ₹14.2L Collected
                  </span>
                </div>
              </div>
              <div className="home-metric__icon-wrap home-metric__icon-wrap--green">
                <i className="pi pi-wallet" />
              </div>
            </div>

            <div className="home-metric-card">
              <div>
                <div className="home-metric__title">Edits In Progress</div>
                <div className="home-metric__val">14</div>
                <div className="home-metric__sub">
                  <span className="home-metric-tag home-metric-tag--amber">
                    <i className="pi pi-spinner" /> 4 Pending Review
                  </span>
                </div>
              </div>
              <div className="home-metric__icon-wrap home-metric__icon-wrap--amber">
                <i className="pi pi-images" />
              </div>
            </div>

            <div className="home-metric-card">
              <div>
                <div className="home-metric__title">Albums Delivered</div>
                <div className="home-metric__val">22</div>
                <div className="home-metric__sub">
                  <span className="home-metric-tag home-metric-tag--purple">
                    <i className="pi pi-box" /> 6 Ready Today
                  </span>
                </div>
              </div>
              <div className="home-metric__icon-wrap home-metric__icon-wrap--purple">
                <i className="pi pi-check-circle" />
              </div>
            </div>
          </div>

          {/* ── Smart Reminders & Studio Alerts Widget ── */}
          <SmartReminders onShowToast={showToast} />

          {/* ── Main Dashboard Layout Columns ── */}
          <div className="home-main-grid">
            {/* Left Column: Upcoming Shoots & Events Directory */}
            <div className="home-card">
              <div className="home-card__header">
                <h3 className="home-card__title">
                  <i className="pi pi-camera" /> Upcoming Confirmed Shoots
                </h3>
                <span className="home-card__link" onClick={() => setActiveTab('events')}>
                  View All Events ({upcomingShoots.length}) &rarr;
                </span>
              </div>

              <div className="home-shoots-list">
                {upcomingShoots.map((shoot) => (
                  <div key={shoot.id} className="home-shoot-item">
                    <div className="home-shoot__info">
                      <span className="home-shoot__couple">{shoot.couple}</span>
                      <div className="home-shoot__meta">
                        <span><i className="pi pi-tag" /> {shoot.eventType}</span>
                        <span><i className="pi pi-calendar" /> {shoot.date}</span>
                        <span><i className="pi pi-map-marker" /> {shoot.venue}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: shoot.statusColor,
                        background: '#f1f5f9',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '50px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {shoot.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Financial Summary & Quick Access */}
            <div className="flex flex-column gap-3">
              {/* Event Financials Card */}
              <div className="home-card">
                <div className="home-card__header">
                  <h3 className="home-card__title">
                    <i className="pi pi-chart-line" /> Financial Overview
                  </h3>
                </div>

                <div className="payslip-body">
                  <div className="payslip-chart-row">
                    <div className="payslip-days">
                      <span className="payslip-month">Aug 2026</span>
                      <span className="payslip-count">38</span>
                      <span className="payslip-label">Active Event Bookings</span>
                    </div>
                  </div>

                  <div className="payslip-details">
                    <div className="payslip-item">
                      <span className="payslip-item__bar payslip-item__bar--black" />
                      <span className="payslip-item__name">Gross Contract Value</span>
                      <span className="payslip-item__value">
                        {showFinancials ? '₹24,50,000' : '*****'}
                      </span>
                    </div>

                    <div className="payslip-item">
                      <span className="payslip-item__bar payslip-item__bar--green" />
                      <span className="payslip-item__name">Advances Received</span>
                      <span className="payslip-item__value">
                        {showFinancials ? '₹14,20,000' : '*****'}
                      </span>
                    </div>

                    <div className="payslip-item">
                      <span className="payslip-item__bar payslip-item__bar--blue" />
                      <span className="payslip-item__name">Net Pending Balance</span>
                      <span className="payslip-item__value">
                        {showFinancials ? '₹10,30,000' : '*****'}
                      </span>
                    </div>
                  </div>

                  <div className="payslip-footer">
                    <button
                      className="payslip-btn-show"
                      onClick={() => setShowFinancials(!showFinancials)}
                    >
                      {showFinancials ? 'Hide Figures' : 'Show Figures'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="home-card">
                <div className="home-card__header">
                  <h3 className="home-card__title">
                    <i className="pi pi-bolt" /> Studio Quick Tools
                  </h3>
                </div>

                <div className="home-quick-grid">
                  <div className="home-quick-btn" onClick={() => setActiveTab('add-event')}>
                    <i className="pi pi-plus-circle" />
                    <span>Book New Shoot</span>
                  </div>
                  <div className="home-quick-btn" onClick={() => setActiveTab('workflow')}>
                    <i className="pi pi-sitemap" />
                    <span>Workflow Stages</span>
                  </div>
                  <div className="home-quick-btn" onClick={() => setActiveTab('events')}>
                    <i className="pi pi-calendar" />
                    <span>Events Directory</span>
                  </div>
                  <div className="home-quick-btn" onClick={() => setActiveTab('invoice')}>
                    <i className="pi pi-print" />
                    <span>Tax Invoice</span>
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
