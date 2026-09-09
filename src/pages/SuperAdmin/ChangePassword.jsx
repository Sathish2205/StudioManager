import React, { useState } from 'react'
import { saChangePassword } from '../../services/superAdminService'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'

export default function ChangePassword({ showToast }) {
  const { logout } = useSuperAdminAuth()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.currentPassword) errs.currentPassword = 'Current password is required'
    if (!form.newPassword) errs.newPassword = 'New password is required'
    else if (form.newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword))
      errs.newPassword = 'Must contain uppercase, lowercase, and a digit'
    if (!form.confirmNewPassword) errs.confirmNewPassword = 'Confirm new password'
    else if (form.newPassword !== form.confirmNewPassword) errs.confirmNewPassword = 'Passwords do not match'
    if (form.currentPassword && form.newPassword && form.currentPassword === form.newPassword)
      errs.newPassword = 'New password must be different from current'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setConfirmDialog(true)
  }

  const doChangePassword = async () => {
    setConfirmDialog(false)
    setSubmitting(true)
    try {
      await saChangePassword(form.currentPassword, form.newPassword, form.confirmNewPassword)
      showToast('Password changed successfully! Please log in again.', 'success')
      // Logout and redirect to login after a short delay
      setTimeout(async () => {
        await logout()
      }, 1500)
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (label, field, required = true) => (
    <div className="ent-form-field">
      <label className={`ent-form-label ${required ? 'ent-form-label--required' : ''}`}>{label}</label>
      <input
        type="password"
        className="sa-toolbar__search-input"
        style={{ paddingLeft: '10px', maxWidth: '400px' }}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        autoComplete="new-password"
      />
      {errors[field] && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: '2px' }}>
          {errors[field]}
        </span>
      )}
    </div>
  )

  return (
    <>
      <div className="ent-page-header">
        <div className="ent-page-header__text">
          <h1 className="ent-page-header__title">Change Password</h1>
          <p className="ent-page-header__desc">Update your Super Admin password. You will be required to log in again.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="ent-card">
          <div className="ent-card__body">
            <div className="ent-form-section">
              <div className="ent-form-section__title">Password Change</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {renderField('Current Password', 'currentPassword')}
                {renderField('New Password', 'newPassword')}
                {renderField('Confirm New Password', 'confirmNewPassword')}
              </div>

              <div style={{ marginTop: 'var(--space-4)', padding: '10px 14px', background: 'var(--color-info-light)', border: '1px solid var(--color-info-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-info)' }}>
                <i className="pi pi-info-circle" style={{ marginRight: '6px' }} />
                Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and digit.
              </div>
            </div>

            <div className="ent-form-actions">
              <button type="submit" className="sa-action-btn sa-action-btn--primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="pi pi-spin pi-spinner" /> Changing...
                  </>
                ) : (
                  <>
                    <i className="pi pi-key" /> Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="sa-dialog-overlay" onClick={() => setConfirmDialog(false)}>
          <div className="sa-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="sa-dialog__title">Confirm Password Change</h3>
            <p className="sa-dialog__message">
              Are you sure you want to change your password? You will be logged out and need to sign in with the new password.
            </p>
            <div className="sa-dialog__actions">
              <button className="sa-action-btn" onClick={() => setConfirmDialog(false)}>
                Cancel
              </button>
              <button className="sa-action-btn sa-action-btn--primary" onClick={doChangePassword}>
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
