import React, { useState, useEffect } from 'react'
import KpiCard from '../../components/enterprise/KpiCard'
import { saGetDashboardStats } from '../../services/superAdminService'

export default function SuperAdminDashboard({ setActiveTab }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await saGetDashboardStats()
      setStats(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="sa-spinner">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.2rem' }} />
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="ent-empty-state">
        <i className="pi pi-exclamation-circle ent-empty-state__icon" />
        <h3 className="ent-empty-state__title">Failed to load dashboard</h3>
        <p className="ent-empty-state__message">{error}</p>
        <button className="ent-empty-state__action" onClick={loadStats}>
          <i className="pi pi-refresh" /> Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="ent-page-header">
        <div className="ent-page-header__text">
          <h1 className="ent-page-header__title">Dashboard</h1>
          <p className="ent-page-header__desc">Platform overview and tenant statistics</p>
        </div>
      </div>

      <div className="ent-kpi-grid">
        <KpiCard
          title="Total Tenants"
          value={stats?.totalTenants ?? 0}
          icon="pi pi-building"
          subtitle="All registered companies"
        />
        <KpiCard
          title="Active Tenants"
          value={stats?.activeTenants ?? 0}
          icon="pi pi-check-circle"
          subtitle="Currently operational"
        />
        <KpiCard
          title="Inactive Tenants"
          value={stats?.inactiveTenants ?? 0}
          icon="pi pi-ban"
          subtitle="Suspended or deactivated"
        />
        <KpiCard
          title="New Tenants"
          value={stats?.newTenants ?? 0}
          icon="pi pi-star"
          subtitle="Last 30 days"
        />
      </div>

      {/* Quick Actions */}
      <div className="ent-card">
        <div className="ent-card__header">
          <span className="ent-card__title">
            <i className="pi pi-bolt" /> Quick Actions
          </span>
        </div>
        <div className="ent-card__body" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button className="sa-action-btn sa-action-btn--primary" onClick={() => setActiveTab('create-tenant')}>
            <i className="pi pi-plus" /> Create New Tenant
          </button>
          <button className="sa-action-btn" onClick={() => setActiveTab('tenants')}>
            <i className="pi pi-list" /> View All Tenants
          </button>
          <button className="sa-action-btn" onClick={() => setActiveTab('change-password')}>
            <i className="pi pi-key" /> Change Password
          </button>
        </div>
      </div>
    </>
  )
}
