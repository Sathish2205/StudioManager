import React from 'react'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'

export default function SuperAdminSettings({ setActiveTab }) {
  const { user } = useSuperAdminAuth()

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

  return (
    <>
      <div className="ent-page-header">
        <div className="ent-page-header__text">
          <h1 className="ent-page-header__title">Settings</h1>
          <p className="ent-page-header__desc">Super Admin account information and security</p>
        </div>
      </div>

      <div className="ent-card">
        <div className="ent-card__header">
          <span className="ent-card__title">
            <i className="pi pi-user" /> Account Information
          </span>
        </div>
        <div className="ent-card__body">
          <div className="sa-detail-grid">
            <div className="sa-detail-field">
              <span className="sa-detail-label">Username</span>
              <span className="sa-detail-value">{user?.username || '—'}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Role</span>
              <span className="sa-detail-value">
                <span className="sa-header__user-badge" style={{ display: 'inline-flex' }}>
                  <i className="pi pi-shield" /> SUPER_ADMIN
                </span>
              </span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Status</span>
              <span className="sa-detail-value" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                <i className="pi pi-check-circle" style={{ marginRight: '4px' }} />
                Active
              </span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Last Login</span>
              <span className="sa-detail-value">{formatDate(user?.lastLoginAt)}</span>
            </div>
            <div className="sa-detail-field">
              <span className="sa-detail-label">Account Created</span>
              <span className="sa-detail-value">{formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="ent-card">
        <div className="ent-card__header">
          <span className="ent-card__title">
            <i className="pi pi-lock" /> Security
          </span>
        </div>
        <div className="ent-card__body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>
                Password
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Change your Super Admin password. You will be required to log in again.
              </div>
            </div>
            <button className="sa-action-btn sa-action-btn--primary" onClick={() => setActiveTab('change-password')}>
              <i className="pi pi-key" /> Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
