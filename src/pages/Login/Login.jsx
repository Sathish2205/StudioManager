import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('admin@abcstudio.com')
  const [password, setPassword] = useState('admin123')
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username || !password) {
      setErrorMsg('Please enter email/username and password.')
      return
    }

    setSubmitting(true)
    try {
      await login(username, password)
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickLogin = (demoEmail) => {
    setUsername(demoEmail)
    setPassword('admin123')
  }

  return (
    <div className="login-container">
      <div className="login-backdrop" />
      <div className="login-card shadow-4">
        {/* Header Logo & Title */}
        <div className="login-card__header">
          <div className="login-card__brand-icon">
            <i className="pi pi-camera text-2xl text-primary" />
          </div>
          <h1 className="login-card__title">PhotoStudio Pro</h1>
          <p className="login-card__subtitle">Enterprise Multi-Tenant SaaS Platform</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && (
            <div className="login-error-alert">
              <i className="pi pi-exclamation-triangle" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="login-field">
            <label htmlFor="username">Email / Username</label>
            <div className="login-input-wrapper">
              <i className="pi pi-user login-input-icon" />
              <input
                id="username"
                type="text"
                className="login-input"
                placeholder="e.g. admin@abcstudio.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <i className="pi pi-lock login-input-icon" />
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="login-options">
            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="login-forgot-btn"
              onClick={() => alert('Please contact system administrator to reset password.')}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <i className="pi pi-spin pi-spinner mr-2" /> Authenticating...
              </>
            ) : (
              <>
                <i className="pi pi-sign-in mr-2" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Login Presets */}
        <div className="login-card__demo-section">
          <div className="login-demo__divider">
            <span>Select Tenant Demo Account</span>
          </div>
          <div className="login-demo__buttons">
            <button
              type="button"
              className="login-demo-chip"
              onClick={() => handleQuickLogin('superadmin@studiomanager.com')}
            >
              <i className="pi pi-shield text-purple-500" />
              <div>
                <strong>Super Admin</strong>
                <span className="block text-xs text-500">superadmin@studiomanager.com</span>
              </div>
            </button>

            <button
              type="button"
              className="login-demo-chip"
              onClick={() => handleQuickLogin('admin@abcstudio.com')}
            >
              <i className="pi pi-building text-primary" />
              <div>
                <strong>ABC Photography</strong>
                <span className="block text-xs text-500">admin@abcstudio.com</span>
              </div>
            </button>

            <button
              type="button"
              className="login-demo-chip"
              onClick={() => handleQuickLogin('admin@xyzstudio.com')}
            >
              <i className="pi pi-building text-blue-500" />
              <div>
                <strong>XYZ Studio</strong>
                <span className="block text-xs text-500">admin@xyzstudio.com</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
