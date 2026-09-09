import React, { useState } from 'react'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import './superadmin.css'

export default function SuperAdminLogin() {
  const { login } = useSuperAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim() || !password) {
      setErrorMsg('Please enter username and password.')
      return
    }

    setSubmitting(true)
    try {
      await login(username.trim(), password)
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-backdrop" />
      <div className="login-card shadow-4">
        <div className="login-card__header">
          <div className="login-card__brand-icon">
            <i className="pi pi-shield text-2xl" style={{ color: '#6366f1' }} />
          </div>
          <h1 className="login-card__title">PhotoStudio Pro</h1>
          <p className="login-card__subtitle">Super Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && (
            <div className="login-error-alert">
              <i className="pi pi-exclamation-triangle" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="login-field">
            <label htmlFor="sa-username">Username</label>
            <div className="login-input-wrapper">
              <i className="pi pi-user login-input-icon" />
              <input
                id="sa-username"
                type="text"
                className="login-input"
                placeholder="Enter super admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="sa-password">Password</label>
            <div className="login-input-wrapper">
              <i className="pi pi-lock login-input-icon" />
              <input
                id="sa-password"
                type="password"
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <i className="pi pi-spin pi-spinner mr-2" /> Authenticating...
              </>
            ) : (
              <>
                <i className="pi pi-sign-in mr-2" /> Sign In as Super Admin
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            type="button"
            className="login-forgot-btn"
            onClick={() => {
              window.history.pushState({}, '', '/')
              window.location.reload()
            }}
            style={{ fontSize: '0.8rem' }}
          >
            <i className="pi pi-arrow-left" style={{ marginRight: '0.4rem' }} />
            Back to Company Login
          </button>
        </div>
      </div>
    </div>
  )
}
