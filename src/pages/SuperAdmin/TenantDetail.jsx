import React, { useState, useEffect } from 'react'
import StatusBadge from '../../components/enterprise/StatusBadge'
import { saGetTenantById } from '../../services/superAdminService'

export default function TenantDetail({ tenantData, setActiveTab, onEditTenant }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tenantData) loadTenant()
  }, [tenantData])

  const loadTenant = async () => {
    setLoading(true)
    try {
      const result = await saGetTenantById(tenantData.tenantId || tenantData._id)
      setTenant(result.data)
    } catch {
      setTenant(tenantData)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusLabel = (status) => {
    if (status === 'active') return 'Active'
    if (status === 'inactive') return 'Inactive'
    if (status === 'suspended') return 'Inactive'
    return status
  }

  if (loading) {
    return (
      <div className="sa-spinner">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.2rem' }} />
        Loading tenant details...
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="ent-empty-state">
        <i className="pi pi-exclamation-circle ent-empty-state__icon" />
        <h3 className="ent-empty-state__title">Tenant not found</h3>
        <button className="ent-empty-state__action" onClick={() => setActiveTab('tenants')}>
          <i className="pi pi-arrow-left" /> Back to Tenants
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="ent-page-header">
        <div className="ent-page-header__text">
          <h1 className="ent-page-header__title">{tenant.companyName}</h1>
          <p className="ent-page-header__desc">Tenant details and configuration</p>
        </div>
        <div className="ent-page-header__actions">
          <button className="sa-action-btn" onClick={() => setActiveTab('tenants')}>
            <i className="pi pi-arrow-left" /> Back
          </button>
          <button className="sa-action-btn sa-action-btn--primary" onClick={() => onEditTenant(tenant)}>
            <i className="pi pi-pencil" /> Edit
          </button>
        </div>
      </div>

      <div className="ent-card">
        <div className="ent-card__header">
          <span className="ent-card__title">
            <i className="pi pi-building" /> Company Information
          </span>
          <StatusBadge status={statusLabel(tenant.status)} />
        </div>
        <div className="ent-card__body">
          <div className="sa-detail-grid">
            <div className="sa-detail-field">
              <span className="sa-detail-label">Company Name</span>
              <span className="sa-detail-value">{tenant.companyName}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Tenant Code</span>
              <span className="sa-detail-value">
                <span className="sa-table__code">{tenant.tenantCode || tenant.tenantId}</span>
              </span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Tenant ID</span>
              <span className="sa-detail-value">{tenant.tenantId}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Database Name</span>
              <span className="sa-detail-value">{tenant.databaseName || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Email</span>
              <span className="sa-detail-value">{tenant.contactEmail || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Phone</span>
              <span className="sa-detail-value">{tenant.contactPhone || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Address</span>
              <span className="sa-detail-value">{tenant.address || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">City</span>
              <span className="sa-detail-value">{tenant.city || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">State</span>
              <span className="sa-detail-value">{tenant.state || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Country</span>
              <span className="sa-detail-value">{tenant.country || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Subscription Plan</span>
              <span className="sa-detail-value" style={{ textTransform: 'capitalize' }}>
                {tenant.subscriptionPlan || 'basic'}
              </span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Registered Users</span>
              <span className="sa-detail-value">{tenant.userCount ?? '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Created At</span>
              <span className="sa-detail-value">{formatDate(tenant.createdAt)}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Last Updated</span>
              <span className="sa-detail-value">{formatDate(tenant.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
