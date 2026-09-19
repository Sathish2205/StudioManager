import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Dropdown } from 'primereact/dropdown'
import { useAuth } from '../../context/AuthContext'
import './AccountSettings.css'

export default function AccountSettings({ onShowToast }) {
  const { tenant } = useAuth()
  const studioName = tenant?.companyName || 'ABC Photography'

  const [formData, setFormData] = useState({
    companyName: studioName,
    gstin: '29AAACP9988C1Z4',
    email: 'info@abcstudio.com',
    phone: '+91 98450 12345',
    address: 'Studio #42, Luxury Plaza, Residency Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560025',
    currency: 'INR (₹)',
    fiscalYearStart: 'April'
  })

  const triggerToast = (msg, sev = 'success') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleSaveSettings = (e) => {
    e.preventDefault()
    triggerToast('Account & Studio settings saved successfully!', 'success')
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
            <span className="font-bold text-slate-800 text-lg">Enterprise Pro Plan</span>
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

        <div className="settings-form-grid">
          <div className="settings-field">
            <label>Studio / Company Name *</label>
            <InputText value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} required />
          </div>

          <div className="settings-field">
            <label>GSTIN Tax Registration Number</label>
            <InputText value={formData.gstin} onChange={(e) => handleChange('gstin', e.target.value)} placeholder="e.g. 29AAACP9988C1Z4" />
          </div>

          <div className="settings-field">
            <label>Official Contact Email *</label>
            <InputText value={formData.email} onChange={(e) => handleChange('email', e.target.value)} type="email" required />
          </div>

          <div className="settings-field">
            <label>Studio Contact Phone *</label>
            <InputText value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
          </div>

          <div className="settings-field col-span-2">
            <label>Street Address</label>
            <InputText value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
          </div>

          <div className="settings-field">
            <label>City</label>
            <InputText value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
          </div>

          <div className="settings-field">
            <label>State</label>
            <InputText value={formData.state} onChange={(e) => handleChange('state', e.target.value)} />
          </div>

          <div className="settings-field">
            <label>Pincode / Postal Code</label>
            <InputText value={formData.pincode} onChange={(e) => handleChange('pincode', e.target.value)} />
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

        <div className="settings-form-actions">
          <Button label="Save Account Settings" icon="pi pi-check" type="submit" className="p-button-primary p-button-sm" />
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
