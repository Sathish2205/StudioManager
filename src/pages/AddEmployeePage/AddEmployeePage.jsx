import React, { useState, useEffect, useRef, useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputSwitch } from 'primereact/inputswitch'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'

import { createEmployeeWithAccount, createEmployee, updateEmployee } from '../../services/employeeService'
import { checkUsernameAvailable } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import { ROLES, ACCOUNT_CREATOR_ROLES, getAssignableRoles, isOwnerOrAdmin, PAGE_PERMISSION_OPTIONS, PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from '../../constants/roles'
import { validatePasswordStrength, validateUsername, passwordsMatch, getStrengthClass, getStrengthLabel } from '../../validation/passwordValidation'
import './AddEmployeePage.css'

export default function AddEmployeePage({ employeeToEdit, onNavigateBack, onShowToast }) {
  const toastRef = useRef(null)
  const isEditMode = !!employeeToEdit

  // Roles available for designation multi-select
  const designationList = [
    'Photographer', 'Videographer', 'Photo Editor', 'Video Editor',
    'Album Designer', 'Manager', 'Assistant', 'Driver', 'Accountant', 'Drone Pilot', 'Other'
  ]
  const designationOptions = designationList.map(r => ({ label: r, value: r }))
  const employmentTypes = ['Full Time', 'Part Time', 'Freelancer', 'Contract']
  const statusOptions = ['Active', 'Inactive', 'On Leave']

  const { user: authUser } = useAuth()
  const canCreateAccounts = isOwnerOrAdmin(authUser?.role) || String(authUser?.role || '').toLowerCase().includes('manager')
  const assignableRoles = getAssignableRoles(authUser?.role || 'Owner/Admin')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roles: ['Photographer'], // Multi-role selection array
    employmentType: 'Full Time',
    salary: 30000,
    joiningDate: new Date(),
    status: 'Active',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    // Login Account fields
    createLoginAccount: false,
    username: '',
    password: '',
    confirmPassword: '',
    userRole: 'Assistant',
    selectedPermissions: [PERMISSIONS.EVENTS_VIEW, PERMISSIONS.CALENDAR_VIEW, PERMISSIONS.EDITING_VIEW],
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState(null) // null | 'checking' | 'available' | 'taken'
  const [saving, setSaving] = useState(false)
  const usernameCheckTimer = useRef(null)

  // Populate data if in Edit Mode
  useEffect(() => {
    if (employeeToEdit) {
      const existingRoles = Array.isArray(employeeToEdit.roles) && employeeToEdit.roles.length > 0
        ? employeeToEdit.roles
        : (employeeToEdit.role ? employeeToEdit.role.split(',').map(r => r.trim()) : ['Photographer'])

      setFormData({
        _id: employeeToEdit._id,
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        phone: employeeToEdit.phone || '',
        roles: existingRoles,
        employmentType: employeeToEdit.employmentType || 'Full Time',
        salary: employeeToEdit.salary || 30000,
        joiningDate: employeeToEdit.joiningDate ? new Date(employeeToEdit.joiningDate) : new Date(),
        status: employeeToEdit.status || 'Active',
        address: employeeToEdit.address || '',
        emergencyName: employeeToEdit.emergencyContact?.name || '',
        emergencyPhone: employeeToEdit.emergencyContact?.phone || '',
        emergencyRelation: employeeToEdit.emergencyContact?.relation || '',
        createLoginAccount: false,
        username: '',
        password: '',
        confirmPassword: '',
        userRole: 'Assistant',
        selectedPermissions: [PERMISSIONS.EVENTS_VIEW, PERMISSIONS.CALENDAR_VIEW],
      })
    }
  }, [employeeToEdit])

  // Automatically update suggested permissions when roles change
  const handleRolesChange = (selectedRoles) => {
    setFormData(prev => {
      let combinedPerms = new Set(prev.selectedPermissions)
      selectedRoles.forEach(r => {
        const defaultPerms = DEFAULT_ROLE_PERMISSIONS[r] || []
        defaultPerms.forEach(p => combinedPerms.add(p))
      })
      return {
        ...prev,
        roles: selectedRoles,
        selectedPermissions: Array.from(combinedPerms),
      }
    })
  }

  // Debounced username availability check
  const handleUsernameChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, username: value }))
    setUsernameStatus(null)

    if (usernameCheckTimer.current) clearTimeout(usernameCheckTimer.current)

    const trimmed = value.trim()
    if (trimmed.length < 3) {
      setUsernameStatus(null)
      return
    }

    setUsernameStatus('checking')
    usernameCheckTimer.current = setTimeout(async () => {
      const result = await checkUsernameAvailable(trimmed)
      setUsernameStatus(result.available ? 'available' : 'taken')
    }, 600)
  }, [])

  // Page permission check/uncheck toggle handler
  const togglePagePermission = (permString) => {
    setFormData(prev => {
      const exists = prev.selectedPermissions.includes(permString)
      const updated = exists
        ? prev.selectedPermissions.filter(p => p !== permString)
        : [...prev.selectedPermissions, permString]
      return { ...prev, selectedPermissions: updated }
    })
  }

  const handleSelectAllPages = () => {
    const allPerms = PAGE_PERMISSION_OPTIONS.map(p => p.permission)
    setFormData(prev => ({ ...prev, selectedPermissions: allPerms }))
  }

  const handleClearAllPages = () => {
    setFormData(prev => ({ ...prev, selectedPermissions: [] }))
  }

  const showToast = (severity, summary, detail) => {
    if (onShowToast) onShowToast(detail)
    else if (toastRef.current) toastRef.current.show({ severity, summary, detail, life: 3500 })
  }

  // Save Employee Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast('warn', 'Validation Error', 'Full Name is required.')
      return
    }

    if (!formData.roles || formData.roles.length === 0) {
      showToast('warn', 'Validation Error', 'Please select at least one role/designation.')
      return
    }

    // Validate login account fields if enabled
    if (!isEditMode && formData.createLoginAccount) {
      const usernameValidation = validateUsername(formData.username)
      if (!usernameValidation.isValid) {
        showToast('warn', 'Invalid Username', usernameValidation.errors[0])
        return
      }

      const pwdValidation = validatePasswordStrength(formData.password)
      if (!pwdValidation.isValid) {
        showToast('warn', 'Weak Password', pwdValidation.errors[0])
        return
      }

      if (!passwordsMatch(formData.password, formData.confirmPassword)) {
        showToast('warn', 'Password Mismatch', 'Password and Confirm Password must match.')
        return
      }

      if (usernameStatus === 'taken') {
        showToast('warn', 'Username Taken', 'Username already exists. Please choose another.')
        return
      }
    }

    setSaving(true)

    // Format payload
    const primaryRole = formData.roles.join(', ')
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: primaryRole, // Backwards compatibility
      roles: formData.roles, // Multi-roles array
      employmentType: formData.employmentType,
      salary: formData.salary,
      joiningDate: formData.joiningDate,
      status: formData.status,
      address: formData.address,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation,
      },
    }

    if (isEditMode && formData._id) {
      const res = await updateEmployee(formData._id, payload)
      setSaving(false)
      if (res) {
        showToast('success', 'Updated', 'Employee profile updated successfully.')
        if (onNavigateBack) onNavigateBack()
      }
    } else {
      if (formData.createLoginAccount) {
        const accountData = {
          username: formData.username.trim().toLowerCase(),
          password: formData.password,
          role: formData.userRole,
          permissions: formData.selectedPermissions,
        }
        const result = await createEmployeeWithAccount(payload, accountData)
        setSaving(false)
        if (result && result.success) {
          showToast('success', 'Created', 'Employee and login account created successfully.')
          if (onNavigateBack) onNavigateBack()
        } else {
          showToast('error', 'Failed', result?.message || 'Failed to create employee.')
        }
      } else {
        const res = await createEmployee(payload)
        setSaving(false)
        if (res) {
          showToast('success', 'Created', 'Employee added successfully.')
          if (onNavigateBack) onNavigateBack()
        }
      }
    }
  }

  const pwdStrength = formData.password ? validatePasswordStrength(formData.password) : null

  return (
    <div className="add-emp-page">
      <Toast ref={toastRef} />

      {/* Top Header */}
      <div className="add-emp-header">
        <div className="add-emp-header__left">
          <Button
            icon="pi pi-arrow-left"
            outlined
            severity="secondary"
            onClick={onNavigateBack}
            aria-label="Back to Employees"
            title="Back to Employees List"
          />
          <div>
            <h1 className="add-emp-header__title">
              {isEditMode ? 'Edit Employee Profile' : 'Add New Employee'}
            </h1>
            <p className="add-emp-header__sub">
              {isEditMode
                ? 'Update employee details, role designations, and contact info.'
                : 'Create employee record, assign multiple roles, and configure page login permissions.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Section 1: Employee Information ── */}
        <div className="add-emp-card mb-4">
          <div className="add-emp-card__header">
            <h3 className="add-emp-card__title">
              <i className="pi pi-user text-primary" /> Employee Basic Information
            </h3>
          </div>

          <div className="grid p-fluid">
            <div className="col-12 md:col-6">
              <label className="font-bold text-sm mb-1 block">Full Name *</label>
              <InputText
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sathish Kumar"
                required
              />
            </div>

            {/* Multi-Role Selection */}
            <div className="col-12 md:col-6">
              <label className="font-bold text-sm mb-1 block">
                Roles & Designations * <span className="text-xs font-normal text-500">(Select Multiple)</span>
              </label>
              <MultiSelect
                value={formData.roles}
                options={designationOptions}
                onChange={(e) => handleRolesChange(e.value)}
                placeholder="Select Employee Roles"
                display="chip"
                className="w-full"
              />
            </div>

            <div className="col-12 md:col-6">
              <label className="font-bold text-sm mb-1 block">Email Address</label>
              <InputText
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. sathish@photostudiopro.com"
                type="email"
              />
            </div>

            <div className="col-12 md:col-6">
              <label className="font-bold text-sm mb-1 block">Phone Number</label>
              <InputText
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="col-12 md:col-4">
              <label className="font-bold text-sm mb-1 block">Employment Type</label>
              <Dropdown
                value={formData.employmentType}
                options={employmentTypes.map(t => ({ label: t, value: t }))}
                onChange={(e) => setFormData({ ...formData, employmentType: e.value })}
              />
            </div>

            <div className="col-12 md:col-4">
              <label className="font-bold text-sm mb-1 block">Monthly Base Salary (₹)</label>
              <InputNumber
                value={formData.salary}
                onValueChange={(e) => setFormData({ ...formData, salary: e.value })}
                mode="currency"
                currency="INR"
                locale="en-IN"
              />
            </div>

            <div className="col-12 md:col-4">
              <label className="font-bold text-sm mb-1 block">Date of Joining</label>
              <Calendar
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.value })}
                dateFormat="dd/mm/yy"
                showIcon
              />
            </div>

            <div className="col-12 md:col-6">
              <label className="font-bold text-sm mb-1 block">Status</label>
              <Dropdown
                value={formData.status}
                options={statusOptions.map(s => ({ label: s, value: s }))}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
              />
            </div>

            <div className="col-12 md:col-6">
              <label className="font-bold text-sm mb-1 block">Address</label>
              <InputTextarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                placeholder="Full residential address"
              />
            </div>

            {/* Emergency Contact */}
            <div className="col-12 mt-2">
              <label className="font-bold text-xs text-500 uppercase block mb-2">Emergency Contact</label>
              <div className="grid">
                <div className="col-12 md:col-4">
                  <InputText
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    placeholder="Contact Name"
                  />
                </div>
                <div className="col-12 md:col-4">
                  <InputText
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="Contact Phone"
                  />
                </div>
                <div className="col-12 md:col-4">
                  <InputText
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                    placeholder="Relationship (e.g. Spouse, Father)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Login Account & Page Access Permissions ── */}
        {!isEditMode && canCreateAccounts && (
          <div className="add-emp-card mb-4">
            <div className="add-emp-card__header">
              <h3 className="add-emp-card__title">
                <i className="pi pi-shield text-primary" /> Login Account & Page Access Controls
              </h3>
              <div className="flex align-items-center gap-2">
                <label className="font-bold text-sm cursor-pointer" htmlFor="toggle-login">Create Login Account</label>
                <InputSwitch
                  id="toggle-login"
                  checked={formData.createLoginAccount}
                  onChange={(e) => setFormData({ ...formData, createLoginAccount: e.value })}
                />
              </div>
            </div>

            {formData.createLoginAccount && (
              <div className="flex flex-column gap-4">
                <div className="grid p-fluid">
                  {/* Username */}
                  <div className="col-12 md:col-6">
                    <label className="font-bold text-sm mb-1 block">Login Username *</label>
                    <InputText
                      value={formData.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="e.g. sathish.kumar"
                      className={usernameStatus === 'taken' ? 'p-invalid' : ''}
                    />
                    {usernameStatus === 'checking' && (
                      <div className="username-check username-check--checking">
                        <i className="pi pi-spin pi-spinner" /> Checking availability...
                      </div>
                    )}
                    {usernameStatus === 'available' && (
                      <div className="username-check username-check--available">
                        <i className="pi pi-check-circle" /> Username is available
                      </div>
                    )}
                    {usernameStatus === 'taken' && (
                      <div className="username-check username-check--taken">
                        <i className="pi pi-times-circle" /> Username already exists. Choose another.
                      </div>
                    )}
                  </div>

                  {/* Primary App Role */}
                  <div className="col-12 md:col-6">
                    <label className="font-bold text-sm mb-1 block">Primary Application Role *</label>
                    <Dropdown
                      value={formData.userRole}
                      options={assignableRoles.map(r => ({ label: r, value: r }))}
                      onChange={(e) => setFormData({ ...formData, userRole: e.value })}
                      placeholder="Select Role"
                    />
                  </div>

                  {/* Password */}
                  <div className="col-12 md:col-6">
                    <label className="font-bold text-sm mb-1 block">Password *</label>
                    <div className="pwd-field-wrap">
                      <InputText
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min 8 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="pwd-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <i className={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'} />
                      </button>
                    </div>
                    {pwdStrength && formData.password && (
                      <div className={`pwd-strength-bar ${getStrengthClass(pwdStrength.strength)}`}>
                        <div className="pwd-strength-bar__track">
                          <div className="pwd-strength-bar__fill" />
                        </div>
                        <span className="pwd-strength-bar__label">{getStrengthLabel(pwdStrength.strength)}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="col-12 md:col-6">
                    <label className="font-bold text-sm mb-1 block">Confirm Password *</label>
                    <div className="pwd-field-wrap">
                      <InputText
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className={formData.confirmPassword && !passwordsMatch(formData.password, formData.confirmPassword) ? 'p-invalid' : ''}
                      />
                      <button
                        type="button"
                        className="pwd-eye-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        <i className={showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'} />
                      </button>
                    </div>
                    {formData.confirmPassword && !passwordsMatch(formData.password, formData.confirmPassword) && (
                      <div className="field-error">Passwords do not match</div>
                    )}
                    {formData.confirmPassword && passwordsMatch(formData.password, formData.confirmPassword) && (
                      <div className="username-check username-check--available">
                        <i className="pi pi-check-circle" /> Passwords match
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Page Visibility & Granular Access Control Matrix ── */}
                <div className="surface-card p-3 border-round-lg border-1 surface-border">
                  <div className="flex align-items-center justify-content-between mb-2">
                    <div>
                      <h4 className="m-0 text-sm font-bold text-900">
                        <i className="pi pi-lock mr-2 text-primary" /> Allowed Page Permissions
                      </h4>
                      <p className="m-0 text-xs text-500 mt-1">
                        Select which pages this user can see and access in the sidebar.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        label="Select All"
                        icon="pi pi-check-square"
                        size="small"
                        outlined
                        onClick={handleSelectAllPages}
                      />
                      <Button
                        type="button"
                        label="Clear All"
                        icon="pi pi-times"
                        size="small"
                        severity="secondary"
                        outlined
                        onClick={handleClearAllPages}
                      />
                    </div>
                  </div>

                  <div className="page-matrix-grid">
                    {PAGE_PERMISSION_OPTIONS.map((item) => {
                      const isEnabled = formData.selectedPermissions.includes(item.permission)
                      return (
                        <div
                          key={item.id}
                          className={`page-matrix-item ${isEnabled ? 'page-matrix-item--active' : ''}`}
                          onClick={() => togglePagePermission(item.permission)}
                        >
                          <div className="page-matrix-item__info">
                            <i className={`${item.icon} page-matrix-item__icon`} />
                            <span className="page-matrix-item__label">{item.label}</span>
                          </div>
                          <InputSwitch
                            checked={isEnabled}
                            onChange={() => togglePagePermission(item.permission)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="add-emp-footer">
          <Button
            type="button"
            label="Cancel"
            outlined
            severity="secondary"
            onClick={onNavigateBack}
          />
          <Button
            type="submit"
            label={isEditMode ? 'Update Employee' : 'Create Employee'}
            icon="pi pi-check"
            className="p-button-primary"
            loading={saving}
          />
        </div>
      </form>
    </div>
  )
}
