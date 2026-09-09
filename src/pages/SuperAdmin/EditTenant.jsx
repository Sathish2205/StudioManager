import React, { useState, useEffect } from 'react'
import { saGetTenantById, saUpdateTenant } from '../../services/superAdminService'

export default function EditTenant({ tenantData, setActiveTab, showToast }) {
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    tenantCode: '',
    subscriptionPlan: 'basic',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (tenantData) {
      loadTenant()
    }
  }, [tenantData])

  const loadTenant = async () => {
    setLoading(true)
    try {
      const result = await saGetTenantById(tenantData.tenantId || tenantData._id)
      const t = result.data
      setForm({
        companyName: t.companyName || '',
        email: t.contactEmail || '',
        phone: t.contactPhone || '',
        address: t.address || '',
        city: t.city || '',
        state: t.state || '',
        country: t.country || '',
        tenantCode: t.tenantCode || '',
        subscriptionPlan: t.subscriptionPlan || 'basic',
      })
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.companyName.trim()) errs.companyName = 'Company name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (form.tenantCode && !/^[A-Za-z0-9-]{2,20}$/.test(form.tenantCode)) errs.tenantCode = 'Invalid tenant code format'
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
      await saUpdateTenant(tenantData.tenantId || tenantData._id, form)
      showToast('Tenant updated successfully!', 'success')
      setActiveTab('tenants')
    } catch (err) {
      showToast(err.message || 'Failed to update tenant', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (label, field, type = 'text', required = false) => (
    <div className="ent-form-field">
      <label className={`ent-form-label ${required ? 'ent-form-label--required' : ''}`}>{label}</label>
      <input
        type={type}
        className="sa-toolbar__search-input"
        style={{ paddingLeft: '10px' }}
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

  if (loading) {
    return (
      <div className="sa-spinner">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.2rem' }} />
        Loading tenant...
      </div>
    )
  }

  return (
    <>
      <div className="ent-page-header">
        <div className="ent-page-header__text">
          <h1 className="ent-page-header__title">Edit Tenant</h1>
          <p className="ent-page-header__desc">Update company information for {form.companyName}</p>
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
            <div className="ent-form-section">
              <div className="ent-form-section__title">Company Information</div>
              <div className="ent-form-grid">
                {renderField('Company Name', 'companyName', 'text', true)}
                {renderField('Company Email', 'email', 'email')}
                {renderField('Phone Number', 'phone', 'tel')}
                {renderField('Tenant Code', 'tenantCode')}
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

            <div className="ent-form-actions">
              <button type="button" className="sa-action-btn" onClick={() => setActiveTab('tenants')}>
                Cancel
              </button>
              <button type="submit" className="sa-action-btn sa-action-btn--primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="pi pi-spin pi-spinner" /> Saving...
                  </>
                ) : (
                  <>
                    <i className="pi pi-check" /> Save Changes
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
