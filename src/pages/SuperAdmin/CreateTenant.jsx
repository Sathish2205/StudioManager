import React, { useState } from 'react'
import { saCreateTenant } from '../../services/superAdminService'

const INITIAL_FORM = {
  companyName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  tenantCode: '',
  subscriptionPlan: 'basic',
  adminName: '',
  adminUsername: '',
  adminPassword: '',
  adminConfirmPassword: '',
}

export default function CreateTenant({ setActiveTab, showToast }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.companyName.trim()) errs.companyName = 'Company name is required'
    if (!form.email.trim()) errs.email = 'Company email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.adminName.trim()) errs.adminName = 'Admin name is required'
    if (!form.adminUsername.trim()) errs.adminUsername = 'Admin username is required'
    else if (form.adminUsername.trim().length < 3) errs.adminUsername = 'Username must be at least 3 characters'
    if (!form.adminPassword) errs.adminPassword = 'Password is required'
    else if (form.adminPassword.length < 6) errs.adminPassword = 'Password must be at least 6 characters'
    if (!form.adminConfirmPassword) errs.adminConfirmPassword = 'Confirm password is required'
    else if (form.adminPassword !== form.adminConfirmPassword) errs.adminConfirmPassword = 'Passwords do not match'
    if (form.tenantCode && !/^[A-Za-z0-9-]{2,20}$/.test(form.tenantCode)) errs.tenantCode = 'Tenant code: 2-20 alphanumeric/hyphens only'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    try {
      await saCreateTenant(form)
      showToast('Tenant created successfully!', 'success')
      setActiveTab('tenants')
    } catch (err) {
      showToast(err.message || 'Failed to create tenant', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (label, field, type = 'text', required = false, placeholder = '') => (
    <div className="ent-form-field">
      <label className={`ent-form-label ${required ? 'ent-form-label--required' : ''}`}>{label}</label>
      <input
        type={type}
        className="sa-toolbar__search-input"
        style={{ paddingLeft: '10px' }}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
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
          <h1 className="ent-page-header__title">Create New Tenant</h1>
          <p className="ent-page-header__desc">Register a new company on the platform</p>
        </div>
        <div className="ent-page-header__actions">
          <button className="sa-action-btn" onClick={() => setActiveTab('tenants')}>
            <i className="pi pi-arrow-left" /> Back to Tenants
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="ent-card">
          <div className="ent-card__body">
            {/* Company Information Section */}
            <div className="ent-form-section">
              <div className="ent-form-section__title">Company Information</div>
              <div className="ent-form-grid">
                {renderField('Company Name', 'companyName', 'text', true)}
                {renderField('Company Email', 'email', 'email', true)}
                {renderField('Phone Number', 'phone', 'tel', false, '+91 98765 43210')}
                {renderField('Tenant Code', 'tenantCode', 'text', false, 'ABC-PHOTO (auto-generated if blank)')}
                {renderField('Address', 'address')}
                {renderField('City', 'city')}
                {renderField('State', 'state')}
                {renderField('Country', 'country')}
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <div className="ent-form-field">
                  <label className="ent-form-label">Subscription Plan</label>
                  <select
                    className="sa-toolbar__select"
                    value={form.subscriptionPlan}
                    onChange={(e) => handleChange('subscriptionPlan', e.target.value)}
                    style={{ maxWidth: '260px' }}
                  >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Company Admin Section */}
            <div className="ent-form-section">
              <div className="ent-form-section__title">Company Admin Account</div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                Create the first administrator for this company. They will be assigned the <strong>Owner</strong> role.
              </p>
              <div className="ent-form-grid">
                {renderField('Admin Name', 'adminName', 'text', true)}
                {renderField('Username', 'adminUsername', 'text', true, 'admin@company.com')}
                {renderField('Password', 'adminPassword', 'password', true)}
                {renderField('Confirm Password', 'adminConfirmPassword', 'password', true)}
              </div>
            </div>

            {/* Actions */}
            <div className="ent-form-actions">
              <button type="button" className="sa-action-btn" onClick={() => setActiveTab('tenants')}>
                Cancel
              </button>
              <button type="submit" className="sa-action-btn sa-action-btn--primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="pi pi-spin pi-spinner" /> Creating...
                  </>
                ) : (
                  <>
                    <i className="pi pi-plus" /> Create Tenant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
