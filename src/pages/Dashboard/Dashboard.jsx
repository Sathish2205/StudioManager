import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import './Dashboard.css'

export default function Dashboard({ activeTab = 'home', setActiveTab }) {
  const [showFinancials, setShowFinancials] = useState(false)

  return (
    <div className="portal-layout">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="portal-main">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="portal-body">
          {/* Greeting Hero Section */}
          <div className="portal-hero">
            <div className="portal-hero__text">
              <h1 className="portal-hero__greeting">Good Evening, Sathish</h1>
              <p className="portal-hero__quote">
                Capturing timeless moments & managing studio financial growth.
              </p>
              <span className="portal-hero__author">- PhotoStudio Pro Management</span>
            </div>

            {/* Photography & Event Vector Graphic */}
            <div className="portal-hero__graphic">
              <svg viewBox="0 0 450 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="portal-hero__svg">
                {/* Studio Flash Light */}
                <circle cx="390" cy="45" r="28" fill="#38bdf8" opacity="0.8" />
                {/* Camera Lens Lines */}
                <circle cx="390" cy="45" r="18" fill="#0284c7" />
                <circle cx="390" cy="45" r="8" fill="#ffffff" />
                {/* Film Strip Path */}
                <path d="M0 115 C 150 115, 250 75, 450 35" stroke="#0284c7" strokeWidth="6" strokeDasharray="8 4" fill="none" />
                <path d="M0 130 C 150 130, 260 90, 450 50" stroke="#1e293b" strokeWidth="10" fill="none" />
                {/* Camera Body Vector */}
                <rect x="330" y="60" width="55" height="32" rx="6" fill="#0f172a" transform="rotate(-6 330 60)" />
                <circle cx="355" cy="74" r="10" fill="#38bdf8" />
                <rect x="345" y="54" width="16" height="8" rx="2" fill="#64748b" transform="rotate(-6 345 54)" />
              </svg>
            </div>
          </div>

          {/* ─── Grid Section ─── */}
          <div className="portal-grid">
            {/* 1. Pending Approvals & Edits Card */}
            <div className="portal-card">
              <h3 className="portal-card__title">Pending Client Approvals</h3>
              <div className="portal-card__center">
                <div className="portal-card__icon-wrap">
                  {/* Photo Album / Camera Proofing Graphic */}
                  <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="40" height="52" rx="4" stroke="#0284c7" strokeWidth="2.5" fill="#ffffff" />
                    <rect x="18" y="18" width="24" height="18" rx="2" fill="#e0f2fe" />
                    <circle cx="26" cy="24" r="3" fill="#0284c7" />
                    <path d="M18 34 L26 28 L32 34 H18 Z" fill="#0369a1" />
                    <line x1="18" y1="44" x2="38" y2="44" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18" y1="50" x2="30" y2="50" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="portal-card__empty-text">Hurrah! All client photo albums reviewed & approved.</p>
              </div>
            </div>

            {/* 2. Upcoming Shoots & Events Card */}
            <div className="portal-card">
              <h3 className="portal-card__title">Upcoming Studio Events</h3>
              <div className="portal-card__center">
                <div className="portal-card__icon-wrap">
                  {/* Event Calendar & Wedding Ring Graphic */}
                  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="15" y="15" width="40" height="42" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                    <path d="M15 25 H55" stroke="#0284c7" strokeWidth="3" />
                    <circle cx="25" cy="10" r="3" fill="#0f172a" />
                    <circle cx="45" cy="10" r="3" fill="#0f172a" />
                    {/* Interlocking Rings */}
                    <circle cx="30" cy="40" r="7" stroke="#fbbf24" strokeWidth="2" fill="none" />
                    <circle cx="38" cy="40" r="7" stroke="#fbbf24" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <p className="portal-card__empty-text">Next: Sophia & James Wedding (Aug 12)</p>
              </div>
            </div>

            {/* 3. Event Finance & Revenue Summary Card */}
            <div className="portal-card">
              <div className="portal-card__header-link">
                <h3 className="portal-card__title">Event Financials</h3>
                <i className="pi pi-arrow-right portal-card__arrow" />
              </div>

              <div className="payslip-body">
                {/* Donut Chart & Days Info */}
                <div className="payslip-chart-row">
                  <div className="payslip-chart">
                    <svg width="90" height="90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="#e2e8f0" strokeWidth="14" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#0891b2"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="238"
                        strokeDashoffset="55"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#a7f3d0"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="238"
                        strokeDashoffset="195"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="payslip-days">
                    <span className="payslip-month">Jul 2026</span>
                    <span className="payslip-count">38</span>
                    <span className="payslip-label">Booked Events</span>
                  </div>
                </div>

                {/* Event Financial Breakdown */}
                <div className="payslip-details">
                  <div className="payslip-item">
                    <span className="payslip-item__bar payslip-item__bar--black" />
                    <span className="payslip-item__name">Gross Event Revenue</span>
                    <span className="payslip-item__value">
                      {showFinancials ? '₹4,85,000' : '*****'}
                    </span>
                  </div>

                  <div className="payslip-item">
                    <span className="payslip-item__bar payslip-item__bar--green" />
                    <span className="payslip-item__name">Crew & Gear Expenses</span>
                    <span className="payslip-item__value">
                      {showFinancials ? '₹1,20,000' : '*****'}
                    </span>
                  </div>

                  <div className="payslip-item">
                    <span className="payslip-item__bar payslip-item__bar--blue" />
                    <span className="payslip-item__name">Net Studio Profit</span>
                    <span className="payslip-item__value">
                      {showFinancials ? '₹3,65,000' : '*****'}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="payslip-footer">
                  <a href="#download" className="payslip-link">Download P&L Statement</a>
                  <button
                    className="payslip-btn-show"
                    onClick={() => setShowFinancials(!showFinancials)}
                  >
                    {showFinancials ? 'Hide Figures' : 'Show Figures'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Quick Access Links Card */}
            <div className="portal-card">
              <h3 className="portal-card__title">Quick Access</h3>
              <div className="quick-access-body">
                <div className="quick-access-links">
                  <a href="#booking" className="quick-access-item">Create Event Invoice</a>
                  <a href="#contract" className="quick-access-item">Wedding Booking Contract</a>
                  <a href="#gear" className="quick-access-item">Gear Maintenance Log</a>
                  <a href="#proofing" className="quick-access-item">Client Proofing Portal</a>
                </div>
                <div className="quick-access-note">
                  <p>Use quick access to generate invoices & booking quotes instantly.</p>
                </div>
              </div>
            </div>

            {/* 5. Studio Announcement / Alert Card */}
            <div className="portal-card portal-card--wide">
              <h3 className="portal-card__title">Peak Season Studio Alert</h3>
              <div className="it-declaration-body">
                <div className="it-declaration-icon">
                  <svg width="45" height="45" viewBox="0 0 50 50" fill="none">
                    <rect x="5" y="10" width="40" height="30" rx="4" fill="#0284c7" />
                    <circle cx="25" cy="25" r="8" fill="#ffffff" />
                    <circle cx="25" cy="25" r="4" fill="#0f172a" />
                  </svg>
                </div>
                <p className="it-declaration-text">
                  Peak Wedding Season 2026 is live! 38 Confirmed Events. Ensure all camera rigs & drone batteries are fully charged prior to shoot dates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
