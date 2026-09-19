import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { useAuth } from '../../context/AuthContext'
import './UserProfile.css'

export default function UserProfile({ onShowToast }) {
  const { user, tenant } = useAuth()

  const userName = user?.name || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) || user?.username || 'ABC Studio Owner'
  const userRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Owner'
  const userEmail = user?.email || 'admin@abcstudio.com'
  const studioName = tenant?.companyName || 'ABC Photography'
  const initial = userName.trim().charAt(0).toUpperCase()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'ABC',
    lastName: user?.lastName || 'Studio Owner',
    email: userEmail,
    phone: user?.phone || '+91 98450 12345',
    designation: userRole === 'Owner' ? 'Studio Director & Lead Photographer' : 'Senior Photographer',
    bio: 'Passionate cinematic wedding photographer with over 10 years of experience capturing luxury events across India.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [activeSubTab, setActiveSubTab] = useState('details') // 'details', 'security', 'permissions'

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const triggerToast = (msg, sev = 'success') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    triggerToast(`Profile updated successfully for ${formData.firstName}!`, 'success')
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (!formData.currentPassword) {
      triggerToast('Please enter your current password', 'error')
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      triggerToast('New password and confirm password do not match', 'error')
      return
    }
    triggerToast('Password updated successfully!', 'success')
    setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
  }

  return (
    <div className="user-profile-page">
      {/* ── Page Header ── */}
      <div className="ent-page-header">
        <div>
          <h1 className="ent-page-header__title">User Profile</h1>
          <p className="ent-page-header__sub">Manage your personal details, credentials, and studio role permissions</p>
        </div>
      </div>

      {/* ── Hero Profile Card ── */}
      <div className="profile-hero-card">
        <div className="profile-hero-avatar">{initial}</div>
        <div className="profile-hero-info">
          <div className="flex align-items-center gap-2">
            <h2 className="profile-hero-name">{userName}</h2>
            <Tag value={userRole} severity="info" className="profile-role-tag" outlined />
          </div>
          <p className="profile-hero-subtitle">
            <i className="pi pi-building text-primary mr-1" /> {studioName} &nbsp;•&nbsp;
            <i className="pi pi-envelope text-primary mr-1 ml-2" /> {userEmail} &nbsp;•&nbsp;
            <i className="pi pi-phone text-primary mr-1 ml-2" /> {formData.phone}
          </p>
        </div>
        <div className="profile-hero-badge">
          <i className="pi pi-verified text-emerald-500 mr-1" />
          <span>Verified Studio Admin</span>
        </div>
      </div>

      {/* ── Tab Navigation Bar ── */}
      <div className="profile-tabs-bar">
        <button
          className={`profile-tab-btn ${activeSubTab === 'details' ? 'is-active' : ''}`}
          onClick={() => setActiveSubTab('details')}
        >
          <i className="pi pi-user mr-2" /> Personal Details
        </button>
        <button
          className={`profile-tab-btn ${activeSubTab === 'security' ? 'is-active' : ''}`}
          onClick={() => setActiveSubTab('security')}
        >
          <i className="pi pi-shield mr-2" /> Security & Password
        </button>
        <button
          className={`profile-tab-btn ${activeSubTab === 'permissions' ? 'is-active' : ''}`}
          onClick={() => setActiveSubTab('permissions')}
        >
          <i className="pi pi-key mr-2" /> Role Permissions
        </button>
      </div>

      {/* ── Tab 1: Personal Details ── */}
      {activeSubTab === 'details' && (
        <form onSubmit={handleSaveProfile} className="profile-form-card">
          <h3 className="profile-section-title">Personal Information</h3>
          
          <div className="profile-form-grid">
            <div className="profile-field">
              <label>First Name *</label>
              <InputText value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required />
            </div>

            <div className="profile-field">
              <label>Last Name *</label>
              <InputText value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} required />
            </div>

            <div className="profile-field">
              <label>Email Address *</label>
              <InputText value={formData.email} onChange={(e) => handleChange('email', e.target.value)} type="email" required />
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <InputText value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>

            <div className="profile-field col-span-2">
              <label>Designation / Role Title</label>
              <InputText value={formData.designation} onChange={(e) => handleChange('designation', e.target.value)} />
            </div>

            <div className="profile-field col-span-2">
              <label>Professional Bio</label>
              <textarea
                className="profile-textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            </div>
          </div>

          <div className="profile-form-actions">
            <Button label="Save Profile Changes" icon="pi pi-check" type="submit" className="p-button-primary p-button-sm" />
          </div>
        </form>
      )}

      {/* ── Tab 2: Security & Password ── */}
      {activeSubTab === 'security' && (
        <form onSubmit={handleChangePassword} className="profile-form-card">
          <h3 className="profile-section-title">Change Account Password</h3>
          <p className="profile-section-sub">Ensure your account uses a strong, unique password to prevent unauthorized access.</p>

          <div className="profile-form-grid max-w-md">
            <div className="profile-field col-span-2">
              <label>Current Password *</label>
              <InputText type="password" value={formData.currentPassword} onChange={(e) => handleChange('currentPassword', e.target.value)} required />
            </div>

            <div className="profile-field col-span-2">
              <label>New Password *</label>
              <InputText type="password" value={formData.newPassword} onChange={(e) => handleChange('newPassword', e.target.value)} required />
            </div>

            <div className="profile-field col-span-2">
              <label>Confirm New Password *</label>
              <InputText type="password" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} required />
            </div>
          </div>

          <div className="profile-form-actions">
            <Button label="Update Password" icon="pi pi-lock" type="submit" className="p-button-primary p-button-sm" />
          </div>
        </form>
      )}

      {/* ── Tab 3: Role Permissions ── */}
      {activeSubTab === 'permissions' && (
        <div className="profile-form-card">
          <h3 className="profile-section-title">Assigned Role & Access Rights</h3>
          <p className="profile-section-sub">Your current user account is assigned the <strong>{userRole}</strong> role with full studio management access.</p>

          <div className="profile-permissions-grid">
            <div className="permission-item">
              <i className="pi pi-check-circle text-emerald-600" />
              <div>
                <strong>Event & Shoot Management</strong>
                <p>Full control to create, edit, reassign, and delete wedding shoot bookings</p>
              </div>
            </div>

            <div className="permission-item">
              <i className="pi pi-check-circle text-emerald-600" />
              <div>
                <strong>Finance & GST Tax Invoicing</strong>
                <p>Access to generate tax invoices, record client payments, and track outstanding balances</p>
              </div>
            </div>

            <div className="permission-item">
              <i className="pi pi-check-circle text-emerald-600" />
              <div>
                <strong>Team & Employee Operations</strong>
                <p>Ability to onboard crew members, view staff attendance, and manage payroll rates</p>
              </div>
            </div>

            <div className="permission-item">
              <i className="pi pi-check-circle text-emerald-600" />
              <div>
                <strong>Deliverables & Editing Pipeline</strong>
                <p>Track raw footage uploads, album design stages, and final 4K video deliveries</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
