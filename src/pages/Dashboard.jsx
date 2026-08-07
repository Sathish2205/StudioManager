import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import DashboardHeader from '../components/DashboardHeader'
import './Dashboard.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [showSalaryValues, setShowSalaryValues] = useState(false)

  return (
    <div className="portal-layout">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="portal-main">
        <DashboardHeader />

        <div className="portal-body">
          {/* Greeting Hero Section */}
          <div className="portal-hero">
            <div className="portal-hero__text">
              <h1 className="portal-hero__greeting">Good Evening</h1>
              <p className="portal-hero__quote">
                Life is 10% what happens to us and 90% how we react to it.
              </p>
              <span className="portal-hero__author">- Dennis P. Kimbro</span>
            </div>

            {/* Illustration Graphic (Scenic Road Trip / Bus Vector) */}
            <div className="portal-hero__graphic">
              <svg viewBox="0 0 450 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="portal-hero__svg">
                {/* Sun */}
                <circle cx="390" cy="50" r="30" fill="#f87171" opacity="0.9" />
                {/* Mountains background */}
                <path d="M280 110 L330 65 L370 110 Z" fill="#e2e8f0" />
                <path d="M340 110 L385 50 L430 110 Z" fill="#cbd5e1" />
                {/* Road */}
                <path d="M0 120 C 150 120, 250 80, 450 40" stroke="#0284c7" strokeWidth="6" strokeDasharray="6 4" fill="none" />
                <path d="M0 135 C 150 135, 260 95, 450 55" stroke="#334155" strokeWidth="12" fill="none" />
                {/* Bus / Vehicle */}
                <rect x="340" y="58" width="45" height="24" rx="5" fill="#0284c7" transform="rotate(-12 340 58)" />
                <rect x="365" y="60" width="15" height="12" rx="2" fill="#ffffff" transform="rotate(-12 365 60)" />
                <circle cx="350" cy="80" r="5" fill="#0f172a" />
                <circle cx="378" cy="74" r="5" fill="#0f172a" />
              </svg>
            </div>
          </div>

          {/* ─── Grid Section ─── */}
          <div className="portal-grid">
            {/* 1. Review Card */}
            <div className="portal-card">
              <h3 className="portal-card__title">Review</h3>
              <div className="portal-card__center">
                <div className="portal-card__icon-wrap">
                  {/* Clipboard Illustration */}
                  <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="40" height="55" rx="4" stroke="#f97316" strokeWidth="2.5" fill="#ffffff" />
                    <rect x="22" y="5" width="16" height="10" rx="2" fill="#f97316" />
                    <line x1="18" y1="26" x2="38" y2="26" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18" y1="36" x2="34" y2="36" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18" y1="46" x2="30" y2="46" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
                    <path d="M38 42 L42 54 L44 52" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="portal-card__empty-text">Hurrah! You've nothing to review.</p>
              </div>
            </div>

            {/* 2. Upcoming Holidays Card */}
            <div className="portal-card">
              <h3 className="portal-card__title">Upcoming Holidays</h3>
              <div className="portal-card__center">
                <div className="portal-card__icon-wrap">
                  {/* Palm Tree Illustration */}
                  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 62 Q 35 58 55 62 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                    <path d="M35 60 C 33 45, 36 30, 38 22" stroke="#78350f" strokeWidth="3.5" fill="none" />
                    {/* Palm Leaves */}
                    <path d="M38 22 Q 20 10 10 20" stroke="#059669" strokeWidth="2.5" fill="none" />
                    <path d="M38 22 Q 25 5 22 0" stroke="#059669" strokeWidth="2.5" fill="none" />
                    <path d="M38 22 Q 55 5 58 18" stroke="#059669" strokeWidth="2.5" fill="none" />
                    <path d="M38 22 Q 58 20 62 32" stroke="#059669" strokeWidth="2.5" fill="none" />
                  </svg>
                </div>
                <p className="portal-card__empty-text">Uh oh! No holidays to show.</p>
              </div>
            </div>

            {/* 3. Payslip / Earnings Summary Card */}
            <div className="portal-card">
              <div className="portal-card__header-link">
                <h3 className="portal-card__title">Payslip</h3>
                <i className="pi pi-arrow-right portal-card__arrow" />
              </div>

              <div className="payslip-body">
                {/* Donut Chart & Days Info */}
                <div className="payslip-chart-row">
                  <div className="payslip-chart">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="#e2e8f0" strokeWidth="14" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#0891b2"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="238"
                        strokeDashoffset="45"
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
                        strokeDashoffset="210"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="payslip-days">
                    <span className="payslip-month">Jul 2026</span>
                    <span className="payslip-count">31</span>
                    <span className="payslip-label">Paid Days</span>
                  </div>
                </div>

                {/* Payslip Items */}
                <div className="payslip-details">
                  <div className="payslip-item">
                    <span className="payslip-item__bar payslip-item__bar--black" />
                    <span className="payslip-item__name">Gross Pay</span>
                    <span className="payslip-item__value">
                      {showSalaryValues ? '₹1,25,000' : '*****'}
                    </span>
                  </div>

                  <div className="payslip-item">
                    <span className="payslip-item__bar payslip-item__bar--green" />
                    <span className="payslip-item__name">Deduction</span>
                    <span className="payslip-item__value">
                      {showSalaryValues ? '₹8,500' : '*****'}
                    </span>
                  </div>

                  <div className="payslip-item">
                    <span className="payslip-item__bar payslip-item__bar--blue" />
                    <span className="payslip-item__name">Net Pay</span>
                    <span className="payslip-item__value">
                      {showSalaryValues ? '₹1,16,500' : '*****'}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="payslip-footer">
                  <a href="#download" className="payslip-link">Download</a>
                  <button
                    className="payslip-btn-show"
                    onClick={() => setShowSalaryValues(!showSalaryValues)}
                  >
                    {showSalaryValues ? 'Hide Salary' : 'Show Salary'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Quick Access Card */}
            <div className="portal-card">
              <h3 className="portal-card__title">Quick Access</h3>
              <div className="quick-access-body">
                <div className="quick-access-links">
                  <a href="#link1" className="quick-access-item">Reimbursement Payslip</a>
                  <a href="#link2" className="quick-access-item">IT Statement</a>
                  <a href="#link3" className="quick-access-item">YTD Reports</a>
                  <a href="#link4" className="quick-access-item">Loan Statement</a>
                </div>
                <div className="quick-access-note">
                  <p>Use quick access to view important salary details.</p>
                </div>
              </div>
            </div>

            {/* 5. IT Declaration / Tax Card */}
            <div className="portal-card portal-card--wide">
              <h3 className="portal-card__title">IT Declaration</h3>
              <div className="it-declaration-body">
                <div className="it-declaration-icon">
                  <svg width="45" height="45" viewBox="0 0 50 50" fill="none">
                    <rect x="5" y="10" width="40" height="30" rx="3" fill="#0284c7" />
                    <rect x="10" y="15" width="20" height="15" fill="#ffffff" />
                    <circle cx="36" cy="22" r="4" fill="#fbbf24" />
                  </svg>
                </div>
                <p className="it-declaration-text">
                  Hold on! You can submit your Income Tax (IT) declaration once released.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
