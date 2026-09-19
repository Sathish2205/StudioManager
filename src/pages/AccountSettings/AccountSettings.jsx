import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Dropdown } from 'primereact/dropdown'
import { useAuth } from '../../context/AuthContext'
import { getCompanySettings, updateCompanySettings } from '../../services/companyService'
import './AccountSettings.css'

export default function AccountSettings({ onShowToast }) {
  const { tenant, user, updateTenantContext } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    companyName: '',
    gstin: '',
    officialEmail: '',
    contactPhone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    currency: 'INR',
    subscriptionPlan: 'Enterprise Pro Plan',

    // Bank Account Details
    accountHolderName: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: 'Savings'
  })

  // Load Company & Bank details dynamically via GET /api/company
  useEffect(() => {
    async function loadCompanyDetails() {
      setLoading(true)
      setErrorMsg('')
      try {
        const company = await getCompanySettings()
        if (company) {
          const addr = company.address || {}
          const bank = company.bankDetails || {}

          setFormData({
            companyName: company.companyName || tenant?.companyName || user?.studioName || '',
            gstin: company.gstin || '',
            officialEmail: company.officialEmail || tenant?.contactEmail || user?.email || '',
            contactPhone: company.contactPhone || tenant?.contactPhone || user?.phone || '',
            street: typeof addr === 'object' ? (addr.street || '') : (String(addr) || ''),
            city: typeof addr === 'object' ? (addr.city || '') : '',
            state: typeof addr === 'object' ? (addr.state || '') : '',
            pincode: typeof addr === 'object' ? (addr.pincode || '') : '',
            country: typeof addr === 'object' ? (addr.country || 'India') : 'India',
            currency: company.currency || 'INR',
            subscriptionPlan: tenant?.subscriptionPlan
              ? `${tenant.subscriptionPlan.charAt(0).toUpperCase()}${tenant.subscriptionPlan.slice(1)} Plan`
              : 'Enterprise Pro Plan',

            accountHolderName: bank.accountHolderName || '',
            bankName: bank.bankName || '',
            branchName: bank.branchName || '',
            accountNumber: bank.accountNumber || '',
            confirmAccountNumber: bank.accountNumber || '',
            ifscCode: bank.ifscCode || '',
            accountType: bank.accountType || 'Savings'
          })
        }
      } catch (err) {
        console.error('Failed to load company settings:', err)
        setErrorMsg('Unable to load company settings. Showing default profile data.')
      } finally {
        setLoading(false)
      }
    }

    loadCompanyDetails()
  }, [tenant, user])

  const triggerToast = (msg, sev = 'success') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const validateForm = () => {
    // Bank details validation if user is configuring bank info
    if (formData.accountNumber || formData.confirmAccountNumber || formData.ifscCode) {
      if (formData.accountNumber && formData.accountNumber !== formData.confirmAccountNumber) {
        triggerToast('Confirm Account Number does not match Account Number.', 'error')
        return false
      }

      if (formData.ifscCode) {
        const cleanIfsc = formData.ifscCode.trim().toUpperCase()
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
        if (!ifscRegex.test(cleanIfsc)) {
          triggerToast('Invalid Indian IFSC Code format (e.g. SBIN0001234).', 'error')
          return false
        }
      }
    }
    return true
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    setErrorMsg('')

    try {
      const payload = {
        companyName: formData.companyName,
        gstin: formData.gstin,
        officialEmail: formData.officialEmail,
        contactPhone: formData.contactPhone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country || 'India'
        },
        currency: formData.currency,
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          branchName: formData.branchName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.trim().toUpperCase(),
          accountType: formData.accountType
        }
      }

      const updatedCompany = await updateCompanySettings(payload)
      if (updatedCompany) {
        if (updateTenantContext) {
          updateTenantContext({ companyName: formData.companyName })
        }
        triggerToast('Company settings saved successfully', 'success')
      } else {
        triggerToast('Company settings saved successfully', 'success')
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      setErrorMsg('Unable to save company settings. Please try again.')
      triggerToast('Unable to save company settings. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="account-settings-page">
      {/* Page Header */}
      <div className="ent-page-header">
        <div>
          <h1 className="ent-page-header__title">Account & Studio Settings</h1>
          <p className="ent-page-header__sub">Configure your organization details, GST tax settings, bank account details, and workspace defaults</p>
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

      {errorMsg && (
        <div className="p-3 bg-red-50 border-round border-1 border-red-200 text-red-700 text-xs flex align-items-center gap-2">
          <i className="pi pi-exclamation-triangle text-base" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="settings-form-card">
        {/* Section 1: Company Profile & Business Info */}
        <h3 className="settings-section-title">
          <i className="pi pi-building text-primary mr-2" />
          Studio Profile & Business Information
        </h3>

        {loading ? (
          <div className="flex align-items-center justify-content-center py-5 text-sm text-slate-600">
            <i className="pi pi-spin pi-spinner text-2xl mr-2 text-primary" /> Loading company settings...
          </div>
        ) : (
          <>
            <div className="settings-form-grid">
              <div className="settings-field">
                <label>Studio / Company Name *</label>
                <InputText
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="e.g. ABC Photography"
                  required
                />
              </div>

              <div className="settings-field">
                <label>GSTIN Tax Registration Number</label>
                <InputText
                  value={formData.gstin}
                  onChange={(e) => handleChange('gstin', e.target.value)}
                  placeholder="e.g. 29AAACP9988C1Z4"
                />
              </div>

              <div className="settings-field">
                <label>Official Contact Email *</label>
                <InputText
                  value={formData.officialEmail}
                  onChange={(e) => handleChange('officialEmail', e.target.value)}
                  type="email"
                  placeholder="admin@abcstudio.com"
                  required
                />
              </div>

              <div className="settings-field">
                <label>Studio Contact Phone *</label>
                <InputText
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="+91 98450 12345"
                  required
                />
              </div>

              <div className="settings-field col-span-2">
                <label>Street Address</label>
                <InputText
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  placeholder="Studio Address"
                />
              </div>

              <div className="settings-field">
                <label>City</label>
                <InputText
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Bangalore"
                />
              </div>

              <div className="settings-field">
                <label>State</label>
                <InputText
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Karnataka"
                />
              </div>

              <div className="settings-field">
                <label>Pincode / Postal Code</label>
                <InputText
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="560025"
                />
              </div>

              <div className="settings-field">
                <label>Base Currency</label>
                <Dropdown
                  value={formData.currency}
                  options={[
                    { label: 'INR (₹)', value: 'INR' },
                    { label: 'USD ($)', value: 'USD' },
                    { label: 'EUR (€)', value: 'EUR' },
                    { label: 'AED (AED)', value: 'AED' }
                  ]}
                  onChange={(e) => handleChange('currency', e.value)}
                />
              </div>
            </div>

            {/* Section 2: Bank Account Details */}
            <div className="border-t-1 border-slate-200 pt-4 mt-3">
              <h3 className="settings-section-title mb-3">
                <i className="pi pi-credit-card text-primary mr-2" />
                Bank Account Details
              </h3>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Account Holder Name</label>
                  <InputText
                    value={formData.accountHolderName}
                    onChange={(e) => handleChange('accountHolderName', e.target.value)}
                    placeholder="e.g. ABC Photography"
                  />
                </div>

                <div className="settings-field">
                  <label>Bank Name</label>
                  <InputText
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="e.g. Example Bank / State Bank of India"
                  />
                </div>

                <div className="settings-field">
                  <label>Branch Name</label>
                  <InputText
                    value={formData.branchName}
                    onChange={(e) => handleChange('branchName', e.target.value)}
                    placeholder="e.g. Main Branch"
                  />
                </div>

                <div className="settings-field">
                  <label>Account Type</label>
                  <Dropdown
                    value={formData.accountType}
                    options={['Savings', 'Current']}
                    onChange={(e) => handleChange('accountType', e.value)}
                  />
                </div>

                <div className="settings-field">
                  <label>Account Number</label>
                  <InputText
                    type="password"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="Enter Account Number"
                  />
                </div>

                <div className="settings-field">
                  <label>Confirm Account Number</label>
                  <InputText
                    type="text"
                    value={formData.confirmAccountNumber}
                    onChange={(e) => handleChange('confirmAccountNumber', e.target.value)}
                    placeholder="Re-enter Account Number"
                  />
                </div>

                <div className="settings-field">
                  <label>IFSC Code</label>
                  <InputText
                    value={formData.ifscCode}
                    onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0001234"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="settings-form-actions">
          <Button
            label={saving ? 'Saving...' : 'Save Account Settings'}
            icon={saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
            type="submit"
            className="p-button-primary p-button-sm"
            disabled={loading || saving}
          />
        </div>
      </form>
    </div>
  )
}
