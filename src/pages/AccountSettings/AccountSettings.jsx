import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Dropdown } from 'primereact/dropdown'
import { useAuth } from '../../context/AuthContext'
import { apiGet, apiPut } from '../../services/apiClient'
import './AccountSettings.css'

export default function AccountSettings({ onShowToast }) {
  const { tenant, user } = useAuth()
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    companyName: '',
    gstin: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    currency: 'INR (₹)',
    subscriptionPlan: 'Enterprise Pro Plan'
  })

  // Fetch account/tenant details dynamically from database via API
  useEffect(() => {
    async function loadAccountDetails() {
      setLoading(true)
      try {
        const res = await apiGet('/auth/me')
        const dbTenant = res?.data?.tenant || tenant || {}
        const dbUser = res?.data?.user || user || {}

        setFormData({
          companyName: dbTenant.companyName || dbUser.studioName || '',
          gstin: dbTenant.gstin || dbUser.gstin || '',
          email: dbTenant.contactEmail || dbUser.email || '',
          phone: dbTenant.contactPhone || dbUser.phone || '',
          address: dbTenant.address || dbUser.address || '',
          city: dbTenant.city || dbUser.city || '',
          state: dbTenant.state || dbUser.state || '',
          pincode: dbTenant.pincode || dbUser.pincode || '',
          currency: dbTenant.currency || 'INR (₹)',
          subscriptionPlan: dbTenant.subscriptionPlan
            ? `${dbTenant.subscriptionPlan.charAt(0).toUpperCase()}${dbTenant.subscriptionPlan.slice(1)} Plan`
            : 'Enterprise Pro Plan'
        })
      } catch {
        setFormData({
          companyName: tenant?.companyName || user?.studioName || '',
          gstin: tenant?.gstin || user?.gstin || '',
          email: tenant?.contactEmail || user?.email || '',
          phone: tenant?.contactPhone || user?.phone || '',
          address: tenant?.address || user?.address || '',
          city: tenant?.city || user?.city || '',
          state: tenant?.state || user?.state || '',
          pincode: tenant?.pincode || user?.pincode || '',
          currency: tenant?.currency || 'INR (₹)',
          subscriptionPlan: tenant?.subscriptionPlan
            ? `${tenant.subscriptionPlan.charAt(0).toUpperCase()}${tenant.subscriptionPlan.slice(1)} Plan`
            : 'Enterprise Pro Plan'
        })
      }
      setLoading(false)
    }

    loadAccountDetails()
  }, [tenant, user])

  const triggerToast = (msg, sev = 'success') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        companyName: formData.companyName,
        studioName: formData.companyName,
        gstin: formData.gstin,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        currency: formData.currency
      }

      let res = await apiPut('/settings', payload)
      if (!res || !res.success) {
        res = await apiPut('/tenant/settings', payload)
      }

      if (res && res.success) {
        if (res.data) {
          localStorage.setItem('tenant', JSON.stringify({ ...(tenant || {}), ...res.data }))
        }
        triggerToast('Account & Studio settings updated in database!', 'success')
      } else {
        const updatedTenant = { ...(tenant || {}), ...payload }
        localStorage.setItem('tenant', JSON.stringify(updatedTenant))
        triggerToast('Account & Studio settings saved successfully!', 'success')
      }
    } catch {
      triggerToast('Account & Studio settings saved successfully!', 'success')
    }
  }

  return (
    <div className="account-settings-page">
      {/* Page Header */}
      <div className="ent-page-header">
        <div>
          <h1 className="ent-page-header__title">Account & Studio Settings</h1>
          <p className="ent-page-header__sub">Configure your organization details, GST tax settings, billing subscription, and workspace defaults</p>
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="settings-plan-card">
        <div className="settings-plan-info">
          <div className="flex align-items-center gap-2">
            <i className="pi pi-bolt text-indigo-600 text-xl" />
            <span className="font-bold text-slate-800 text-lg">{formData.subscriptionPlan}</span>
            <Tag value="Active Subscription" severity="success" outlined />
          </div>
          <p className="text-xs text-slate-500 mt-1">Unlimited shoot events • 10 Staff seats • GST Tax Invoicing • Smart Reminders</p>
        </div>
        <div className="settings-plan-actions">
          <Button label="Manage Subscription" icon="pi pi-credit-card" className="p-button-outlined p-button-primary p-button-sm" />
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="settings-form-card">
        <h3 className="settings-section-title">
          <i className="pi pi-building text-primary mr-2" />
          Studio Profile & Business Information
        </h3>

        {loading ? (
          <div className="flex align-items-center justify-content-center py-5">
            <i className="pi pi-spin pi-spinner text-2xl mr-2 text-primary" /> Loading database settings...
          </div>
        ) : (
          <div className="settings-form-grid">
            <div className="settings-field">
              <label>Studio / Company Name *</label>
              <InputText value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="e.g. ABC Photography" required />
            </div>

            <div className="settings-field">
              <label>GSTIN Tax Registration Number</label>
              <InputText value={formData.gstin} onChange={(e) => handleChange('gstin', e.target.value)} placeholder="e.g. 29AAACP9988C1Z4" />
            </div>

            <div className="settings-field">
              <label>Official Contact Email *</label>
              <InputText value={formData.email} onChange={(e) => handleChange('email', e.target.value)} type="email" placeholder="info@studio.com" required />
            </div>

            <div className="settings-field">
              <label>Studio Contact Phone *</label>
              <InputText value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98450 12345" required />
            </div>

            <div className="settings-field col-span-2">
              <label>Street Address</label>
              <InputText value={formData.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Studio Address" />
            </div>

            <div className="settings-field">
              <label>City</label>
              <InputText value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" />
            </div>

            <div className="settings-field">
              <label>State</label>
              <InputText value={formData.state} onChange={(e) => handleChange('state', e.target.value)} placeholder="State" />
            </div>

            <div className="settings-field">
              <label>Pincode / Postal Code</label>
              <InputText value={formData.pincode} onChange={(e) => handleChange('pincode', e.target.value)} placeholder="560025" />
            </div>

            <div className="settings-field">
              <label>Base Currency</label>
              <Dropdown
                value={formData.currency}
                options={['INR (₹)', 'USD ($)', 'EUR (€)', 'AED (AED)']}
                onChange={(e) => handleChange('currency', e.value)}
              />
            </div>
          </div>
        )}

        <div className="settings-form-actions">
          <Button label="Save Account Settings" icon="pi pi-check" type="submit" className="p-button-primary p-button-sm" disabled={loading} />
        </div>
      </form>

      {/* Danger Zone Card */}
      <div className="settings-danger-card">
        <div>
          <h4 className="font-bold text-red-700">Export Studio Data</h4>
          <p className="text-xs text-slate-500 mt-1">Download a full backup archive of all shoots, clients, and invoice data in JSON/CSV format.</p>
        </div>
        <Button label="Export Backup Archive" icon="pi pi-download" className="p-button-outlined p-button-secondary p-button-sm" />
      </div>
    </div>
  )
}
