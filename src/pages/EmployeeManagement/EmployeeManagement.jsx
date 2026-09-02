import React, { useState, useEffect, useRef, useCallback } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputSwitch } from 'primereact/inputswitch'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import {
  getEmployees,
  createEmployee,
  createEmployeeWithAccount,
  updateEmployee,
  deleteEmployee,
  getEmployeeDashboardStats,
} from '../../services/employeeService'

import { checkUsernameAvailable } from '../../services/userService'

import {
  getTodayAttendance,
  getEmployeeAttendance,
  adjustAttendance,
} from '../../services/attendanceService'

import {
  getLeaves,
  applyLeave,
  approveLeave,
  rejectLeave,
} from '../../services/leaveService'

import {
  getPayrolls,
  generatePayroll,
  updatePayrollStatus,
} from '../../services/payrollService'

import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
} from '../../services/shiftService'

import { useAuth } from '../../context/AuthContext'
import { ROLES, ROLE_OPTIONS, ACCOUNT_CREATOR_ROLES, getAssignableRoles, isOwnerOrAdmin } from '../../constants/roles'
import { validatePasswordStrength, validateUsername, passwordsMatch, getStrengthClass, getStrengthLabel } from '../../validation/passwordValidation'

import CheckinWidget from './CheckinWidget'
import EmployeeProfileModal from './EmployeeProfileModal'
import './EmployeeManagement.css'

export default function EmployeeManagement({ activeTab = 'employees', setActiveTab, onNavigateAddEmployee, onNavigateEditEmployee }) {
  const toastRef = useRef(null)

  // Current Sub-Tab inside Employee Module
  const [currentSubTab, setCurrentSubTab] = useState('employees') // 'employees', 'attendance', 'terminal', 'timesheets', 'leave', 'payroll', 'shifts'

  // Summary Metrics State
  const [dashboardStats, setDashboardStats] = useState(null)

  // Employees Tab State
  const [employees, setEmployees] = useState([])
  const [loadingEmps, setLoadingEmps] = useState(true)
  const [empSearch, setEmpSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)

  // Profile View Modal State
  const [selectedEmpId, setSelectedEmpId] = useState(null)
  const [profileVisible, setProfileVisible] = useState(false)

  // Add/Edit Employee Form Dialog State
  const [empDialogVisible, setEmpDialogVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [empFormData, setEmpFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Photographer',
    employmentType: 'Full Time',
    salary: 30000,
    workingHours: '09:00 AM - 06:00 PM',
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
  })

  // Login Account UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState(null) // null | 'checking' | 'available' | 'taken'
  const usernameCheckTimer = useRef(null)
  const { user: authUser, hasPermission } = useAuth()

  // Attendance Tab State
  const [todayAttData, setTodayAttData] = useState({ summary: {}, attendances: [] })
  const [loadingAtt, setLoadingAtt] = useState(true)

  // Manual Adjust Attendance Dialog
  const [adjustDialogVisible, setAdjustDialogVisible] = useState(false)
  const [adjustRecord, setAdjustRecord] = useState(null)
  const [adjustForm, setAdjustForm] = useState({ status: 'Present', notes: '', reason: '' })

  // Leave Tab State
  const [leaves, setLeaves] = useState([])
  const [loadingLeaves, setLoadingLeaves] = useState(true)
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    employeeId: '',
    leaveType: 'Casual Leave',
    startDate: null,
    endDate: null,
    reason: '',
  })

  // Payroll Tab State
  const [payrolls, setPayrolls] = useState([])
  const [loadingPayroll, setLoadingPayroll] = useState(true)
  const [payrollDialogVisible, setPayrollDialogVisible] = useState(false)
  const [payrollForm, setPayrollForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    bonus: 0,
    deductions: 0,
  })

  // Shifts Tab State
  const [shifts, setShifts] = useState([])
  const [loadingShifts, setLoadingShifts] = useState(true)
  const [shiftDialogVisible, setShiftDialogVisible] = useState(false)
  const [shiftForm, setShiftForm] = useState({
    name: 'Studio Shift',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    breakDuration: 60,
    requiredMinutes: 480,
    gracePeriod: 15,
    overtimeEnabled: true,
  })

  // Toast Helper
  const showToast = (severity, summary, detail) => {
    if (toastRef.current) {
      toastRef.current.show({ severity, summary, detail, life: 3000 })
    }
  }

  // Load Data based on active tab
  useEffect(() => {
    loadDashboardStats()
    loadEmployeesData()
  }, [])

  useEffect(() => {
    if (currentSubTab === 'attendance') loadAttendanceData()
    if (currentSubTab === 'leave') loadLeavesData()
    if (currentSubTab === 'payroll') loadPayrollData()
    if (currentSubTab === 'shifts') loadShiftsData()
  }, [currentSubTab])

  const loadDashboardStats = async () => {
    try {
      const stats = await getEmployeeDashboardStats()
      if (stats) setDashboardStats(stats)
    } catch (err) {
      console.warn('Dashboard stats load error:', err)
    }
  }

  const loadEmployeesData = async () => {
    setLoadingEmps(true)
    try {
      const query = {}
      if (empSearch) query.search = empSearch
      if (selectedRole) query.role = selectedRole
      if (selectedType) query.employmentType = selectedType
      if (selectedStatus) query.status = selectedStatus

      const res = await getEmployees(query)
      const empArr = Array.isArray(res?.data) ? res.data : []
      const sorted = [...empArr].sort((a, b) => {
        const idA = String(a?._id || a?.employeeId || a?.id || '')
        const idB = String(b?._id || b?.employeeId || b?.id || '')
        return idB.localeCompare(idA)
      })
      setEmployees(sorted)
    } catch (err) {
      console.error('Error loading employees:', err)
      setEmployees([])
    } finally {
      setLoadingEmps(false)
    }
  }

  const loadAttendanceData = async () => {
    setLoadingAtt(true)
    try {
      const res = await getTodayAttendance()
      const attList = Array.isArray(res?.attendances)
        ? [...res.attendances].sort((a, b) => new Date(b?.checkIn || b?.createdAt || 0) - new Date(a?.checkIn || a?.createdAt || 0))
        : []
      setTodayAttData(res ? { ...res, attendances: attList } : { summary: {}, attendances: [] })
    } catch (err) {
      console.error('Error loading attendance:', err)
      setTodayAttData({ summary: {}, attendances: [] })
    } finally {
      setLoadingAtt(false)
    }
  }

  const loadLeavesData = async () => {
    setLoadingLeaves(true)
    try {
      const data = await getLeaves()
      const empArr = Array.isArray(data) ? data : []
      const sortedLeaves = [...empArr].sort((a, b) => String(b?._id || b?.id || b?.createdAt || '').localeCompare(String(a?._id || a?.id || a?.createdAt || '')))
      setLeaves(sortedLeaves)
    } catch (err) {
      console.error('Error loading leaves:', err)
      setLeaves([])
    } finally {
      setLoadingLeaves(false)
    }
  }

  const loadPayrollData = async () => {
    setLoadingPayroll(true)
    try {
      const data = await getPayrolls()
      const empArr = Array.isArray(data) ? data : []
      const sortedPayrolls = [...empArr].sort((a, b) => String(b?._id || b?.id || b?.createdAt || '').localeCompare(String(a?._id || a?.id || a?.createdAt || '')))
      setPayrolls(sortedPayrolls)
    } catch (err) {
      console.error('Error loading payroll:', err)
      setPayrolls([])
    } finally {
      setLoadingPayroll(false)
    }
  }

  const loadShiftsData = async () => {
    setLoadingShifts(true)
    try {
      const data = await getShifts()
      const empArr = Array.isArray(data) ? data : []
      const sortedShifts = [...empArr].sort((a, b) => String(b?._id || b?.id || b?.createdAt || '').localeCompare(String(a?._id || a?.id || a?.createdAt || '')))
      setShifts(sortedShifts)
    } catch (err) {
      console.error('Error loading shifts:', err)
      setShifts([])
    } finally {
      setLoadingShifts(false)
    }
  }

  // Handler: Open Add Employee
  const handleOpenAddEmp = () => {
    setEditMode(false)
    setEmpFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Photographer',
      employmentType: 'Full Time',
      salary: 30000,
      workingHours: '09:00 AM - 06:00 PM',
      status: 'Active',
      address: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelation: '',
      createLoginAccount: false,
      username: '',
      password: '',
      confirmPassword: '',
      userRole: 'Assistant',
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    setUsernameStatus(null)
    setEmpDialogVisible(true)
  }

  // Handler: Save Employee (Create or Update)
  const handleSaveEmployee = async () => {
    if (!empFormData.name) {
      showToast('warn', 'Validation Error', 'Employee name is required')
      return
    }

    // Validate login account fields if creating account
    if (!editMode && empFormData.createLoginAccount) {
      const usernameValidation = validateUsername(empFormData.username)
      if (!usernameValidation.isValid) {
        showToast('warn', 'Invalid Username', usernameValidation.errors[0])
        return
      }

      const pwdValidation = validatePasswordStrength(empFormData.password)
      if (!pwdValidation.isValid) {
        showToast('warn', 'Weak Password', pwdValidation.errors[0])
        return
      }

      if (!passwordsMatch(empFormData.password, empFormData.confirmPassword)) {
        showToast('warn', 'Password Mismatch', 'Password and Confirm Password must match')
        return
      }

      if (usernameStatus === 'taken') {
        showToast('warn', 'Username Taken', 'Username already exists. Please choose another.')
        return
      }
    }

    const payload = {
      ...empFormData,
      emergencyContact: {
        name: empFormData.emergencyName,
        phone: empFormData.emergencyPhone,
        relation: empFormData.emergencyRelation,
      },
    }

    // Remove login account fields from employee payload
    delete payload.createLoginAccount
    delete payload.username
    delete payload.password
    delete payload.confirmPassword
    delete payload.userRole
    delete payload.emergencyName
    delete payload.emergencyPhone
    delete payload.emergencyRelation

    if (editMode && empFormData._id) {
      const res = await updateEmployee(empFormData._id, payload)
      if (res) {
        showToast('success', 'Updated', 'Employee updated successfully')
        loadEmployeesData()
        setEmpDialogVisible(false)
      }
    } else {
      // Create new employee
      if (empFormData.createLoginAccount) {
        // Create employee + user account together
        const accountData = {
          username: empFormData.username.trim().toLowerCase(),
          password: empFormData.password,
          role: empFormData.userRole,
        }
        const result = await createEmployeeWithAccount(payload, accountData)
        if (result && result.success) {
          if (result.accountError) {
            showToast('warn', 'Partial Success', result.accountError)
          } else {
            showToast('success', 'Created', 'Employee and login account created successfully')
          }
          loadEmployeesData()
          loadDashboardStats()
          setEmpDialogVisible(false)
        } else {
          showToast('error', 'Failed', result?.message || 'Failed to create employee')
        }
      } else {
        // Create employee without login account
        const res = await createEmployee(payload)
        if (res) {
          showToast('success', 'Created', 'Employee added successfully')
          loadEmployeesData()
          loadDashboardStats()
          setEmpDialogVisible(false)
        }
      }
    }
  }

  // Debounced username availability check
  const handleUsernameChange = useCallback((value) => {
    setEmpFormData((prev) => ({ ...prev, username: value }))
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

  // Handler: Edit Employee
  const handleEditEmployee = (emp) => {
    setEditMode(true)
    setEmpFormData({
      _id: emp._id,
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      role: emp.role || 'Photographer',
      employmentType: emp.employmentType || 'Full Time',
      salary: emp.salary || 0,
      workingHours: emp.workingHours || '09:00 AM - 06:00 PM',
      status: emp.status || 'Active',
      address: emp.address || '',
      emergencyName: emp.emergencyContact?.name || '',
      emergencyPhone: emp.emergencyContact?.phone || '',
      emergencyRelation: emp.emergencyContact?.relation || '',
    })
    setEmpDialogVisible(true)
  }

  // Handler: Delete Employee
  const handleDeleteEmployee = (emp) => {
    confirmDialog({
      message: `Are you sure you want to delete employee "${emp.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        const success = await deleteEmployee(emp._id)
        if (success) {
          showToast('info', 'Deleted', 'Employee removed')
          loadEmployeesData()
          loadDashboardStats()
        }
      },
    })
  }

  // Handler: View Profile
  const handleViewProfile = (empId) => {
    setSelectedEmpId(empId)
    setProfileVisible(true)
  }

  // Handler: Save Manual Attendance Adjustment
  const handleSaveAttendanceAdjust = async () => {
    if (!adjustRecord) return
    const res = await adjustAttendance(adjustRecord._id, adjustForm)
    if (res && res.success) {
      showToast('success', 'Adjusted', 'Attendance record updated')
      loadAttendanceData()
      setAdjustDialogVisible(false)
    } else {
      showToast('error', 'Failed', res?.message || 'Adjustment failed')
    }
  }

  // Handler: Apply Leave
  const handleSaveLeave = async () => {
    if (!leaveForm.employeeId || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      showToast('warn', 'Validation Error', 'Please complete all required fields')
      return
    }

    const res = await applyLeave(leaveForm)
    if (res) {
      showToast('success', 'Submitted', 'Leave application submitted')
      loadLeavesData()
      setLeaveDialogVisible(false)
    }
  }

  // Handler: Approve / Reject Leave
  const handleApproveLeave = async (leaveId) => {
    const res = await approveLeave(leaveId, 'Approved by manager')
    if (res) {
      showToast('success', 'Approved', 'Leave request approved')
      loadLeavesData()
    }
  }

  const handleRejectLeave = async (leaveId) => {
    const res = await rejectLeave(leaveId, 'Rejected by manager')
    if (res) {
      showToast('info', 'Rejected', 'Leave request rejected')
      loadLeavesData()
    }
  }

  // Handler: Generate Payroll
  const handleGeneratePayroll = async () => {
    if (!payrollForm.employeeId) {
      showToast('warn', 'Validation Error', 'Please select an employee')
      return
    }

    const res = await generatePayroll(payrollForm)
    if (res) {
      showToast('success', 'Generated', 'Monthly payroll calculated')
      loadPayrollData()
      setPayrollDialogVisible(false)
    }
  }

  // Handler: Create Shift
  const handleSaveShift = async () => {
    if (!shiftForm.name) {
      showToast('warn', 'Validation Error', 'Shift name is required')
      return
    }

    const res = await createShift(shiftForm)
    if (res) {
      showToast('success', 'Created', 'Shift configured successfully')
      loadShiftsData()
      setShiftDialogVisible(false)
    }
  }

  const designationOptions = [
    'Photographer', 'Videographer', 'Photo Editor', 'Video Editor',
    'Album Designer', 'Manager', 'Assistant', 'Driver', 'Accountant', 'Other',
  ]
  const typeOptions = ['Full Time', 'Part Time', 'Freelancer', 'Contract']
  const statusOptions = ['Active', 'Inactive', 'On Leave']
  const canCreateAccounts = isOwnerOrAdmin(authUser?.role) || String(authUser?.role || '').toLowerCase().includes('manager')
  const assignableRoles = getAssignableRoles(authUser?.role || 'Owner/Admin')

  // Password strength for display
  const pwdStrength = empFormData.password ? validatePasswordStrength(empFormData.password) : null

  return (
    <div className="emp-container">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      {/* Header Bar */}
      <div className="emp-header">
        <div>
          <h1 className="emp-header__title">
            Employee Management & Attendance
          </h1>
          <p className="emp-header__sub">
            Manage staff profiles, shifts, daily check-ins, working hours, leave applications, and payroll.
          </p>
        </div>
      </div>

      {/* Dashboard Top Metric Cards */}
      <div className="emp-stats-grid">
        <div className="emp-stat-card">
          <div>
            <div className="emp-stat-lbl">Total Staff</div>
            <div className="emp-stat-val text-primary">{dashboardStats?.totalEmployees || employees.length || 0}</div>
          </div>
          <i className="pi pi-users text-blue-500 text-3xl opacity-60" />
        </div>

        <div className="emp-stat-card">
          <div>
            <div className="emp-stat-lbl">Present Today</div>
            <div className="emp-stat-val text-green-600">{dashboardStats?.presentToday || 0}</div>
          </div>
          <i className="pi pi-check-circle text-green-500 text-3xl opacity-60" />
        </div>

        <div className="emp-stat-card">
          <div>
            <div className="emp-stat-lbl">Absent / Leave</div>
            <div className="emp-stat-val text-orange-600">{dashboardStats?.absentToday || 0} / {dashboardStats?.onLeaveToday || 0}</div>
          </div>
          <i className="pi pi-exclamation-circle text-orange-500 text-3xl opacity-60" />
        </div>

        <div className="emp-stat-card">
          <div>
            <div className="emp-stat-lbl">Working Hours (Month)</div>
            <div className="emp-stat-val text-purple-600">{dashboardStats?.monthWorkingHours || 0}h</div>
          </div>
          <i className="pi pi-clock text-purple-500 text-3xl opacity-60" />
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="emp-nav-tabs">
        <button
          className={`emp-tab-btn ${currentSubTab === 'employees' ? 'active' : ''}`}
          onClick={() => setCurrentSubTab('employees')}
        >
          <i className="pi pi-users" /> Employee List
        </button>
        <button
          className={`emp-tab-btn ${currentSubTab === 'terminal' ? 'active' : ''}`}
          onClick={() => setCurrentSubTab('terminal')}
        >
          <i className="pi pi-mobile" /> Check-In Terminal
        </button>
        <button
          className={`emp-tab-btn ${currentSubTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setCurrentSubTab('attendance')}
        >
          <i className="pi pi-clock" /> Daily Attendance Log
        </button>
        <button
          className={`emp-tab-btn ${currentSubTab === 'leave' ? 'active' : ''}`}
          onClick={() => setCurrentSubTab('leave')}
        >
          <i className="pi pi-calendar-minus" /> Leave Management
        </button>
        <button
          className={`emp-tab-btn ${currentSubTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setCurrentSubTab('payroll')}
        >
          <i className="pi pi-money-bill" /> Payroll Preparation
        </button>
        <button
          className={`emp-tab-btn ${currentSubTab === 'shifts' ? 'active' : ''}`}
          onClick={() => setCurrentSubTab('shifts')}
        >
          <i className="pi pi-sliders-h" /> Shift Management
        </button>
      </div>

      {/* ──────────────── TAB 1: EMPLOYEES LIST ──────────────── */}
      {currentSubTab === 'employees' && (
        <>
          {/* Filters Bar */}
          <div className="events-toolbar">
            <div className="events-toolbar__left">
              <div className="events-search">
                <i className="pi pi-search events-search__icon" />
                <InputText
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  placeholder="Search employee name, ID, phone..."
                  className="events-search__input"
                />
              </div>

              <Dropdown
                value={selectedRole}
                options={designationOptions.map(r => ({ label: r, value: r }))}
                onChange={(e) => setSelectedRole(e.value)}
                placeholder="All Roles"
                showClear
                className="events-filter__dropdown"
              />
              <Dropdown
                value={selectedType}
                options={typeOptions.map(t => ({ label: t, value: t }))}
                onChange={(e) => setSelectedType(e.value)}
                placeholder="All Employment Types"
                showClear
                className="events-filter__dropdown"
              />
              <Dropdown
                value={selectedStatus}
                options={statusOptions.map(s => ({ label: s, value: s }))}
                onChange={(e) => setSelectedStatus(e.value)}
                placeholder="All Statuses"
                showClear
                className="events-filter__dropdown"
              />
            </div>

            <div className="events-toolbar__right">
              <Button
                label="Add New Employee"
                icon="pi pi-user-plus"
                className="p-button-primary"
                onClick={() => onNavigateAddEmployee ? onNavigateAddEmployee() : handleOpenAddEmp()}
              />
            </div>
          </div>

          <div className="emp-table-card">

          <DataTable
            value={employees}
            sortField="employeeId"
            sortOrder={-1}
            loading={loadingEmps}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            paginatorLeft={
              <div className="events-paginator__count">
                Total: <strong>{employees.length} Staff Members</strong>
              </div>
            }
            className="events-datatable p-datatable-sm"
            emptyMessage="No employees found."
          >
            <Column
              field="employeeId"
              header="Employee ID"
              sortable
              body={(rd, idx) => {
                if (!rd) return null
                return (
                  <strong className="text-primary font-mono text-xs">
                    {rd.employeeId || rd.empId || (rd._id ? `EMP-${String(rd._id).slice(-4).toUpperCase()}` : `EMP-${String((idx?.rowIndex || 0) + 1).padStart(4, '0')}`)}
                  </strong>
                )
              }}
            />
            <Column
              field="name"
              header="Employee Name"
              sortable
              body={(rd) => {
                if (!rd) return null
                return (
                  <div className="flex align-items-center gap-2">
                    <Avatar image={rd.avatar} icon={!rd.avatar ? 'pi pi-user' : undefined} shape="circle" />
                    <div>
                      <div className="font-semibold text-900">{rd.name || 'N/A'}</div>
                      <div className="text-xs text-500">{rd.email || 'No email'}</div>
                    </div>
                  </div>
                )
              }}
            />
            <Column
              header="Roles / Designations"
              sortable
              field="role"
              body={(rd) => {
                if (!rd) return null
                const roleList = Array.isArray(rd.roles) && rd.roles.length > 0
                  ? rd.roles
                  : (rd.role ? rd.role.split(',').map(r => r.trim()) : [])
                if (roleList.length === 0) return <span className="text-500 text-xs">N/A</span>
                return (
                  <div className="flex flex-wrap gap-1">
                    {roleList.map((r, i) => (
                      <Tag key={i} value={r} severity="secondary" style={{ fontSize: '0.7rem' }} />
                    ))}
                  </div>
                )
              }}
            />
            <Column field="phone" header="Phone" />
            <Column
              field="employmentType"
              header="Type"
              sortable
              body={(rd) => {
                if (!rd) return null
                return <Tag value={rd.employmentType || 'Full Time'} severity="info" />
              }}
            />
            <Column
              field="joiningDate"
              header="Joining Date"
              sortable
              body={(rd) => {
                if (!rd || !rd.joiningDate) return 'N/A'
                try {
                  return new Date(rd.joiningDate).toLocaleDateString()
                } catch {
                  return 'N/A'
                }
              }}
            />
            <Column
              field="status"
              header="Status"
              sortable
              body={(rd) => {
                if (!rd) return null
                return (
                  <Tag
                    value={rd.status || 'Active'}
                    severity={rd.status === 'Active' ? 'success' : 'danger'}
                  />
                )
              }}
            />
            <Column
              header="Account"
              body={(rd) => {
                if (!rd) return null
                const acct = rd.userAccount || rd.user
                if (!acct) {
                  return (
                    <span className="account-badge account-badge--none">
                      No Account
                    </span>
                  )
                }
                const isActive = acct.status === 'active' || acct.status === 'Active'
                return (
                  <span className={`account-badge ${isActive ? 'account-badge--active' : 'account-badge--inactive'}`}>
                    <span className="account-badge__dot" />
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                )
              }}
              style={{ minWidth: '100px' }}
            />
            <Column
              header="Actions"
              body={(rd) => {
                if (!rd) return null
                return (
                  <div className="flex gap-1">
                    <Button
                      icon="pi pi-eye"
                      rounded
                      text
                      severity="info"
                      tooltip="View Profile"
                      onClick={() => handleViewProfile(rd._id)}
                    />
                    <Button
                      icon="pi pi-pencil"
                      rounded
                      text
                      severity="warning"
                      tooltip="Edit Employee"
                      onClick={() => onNavigateEditEmployee ? onNavigateEditEmployee(rd) : handleEditEmployee(rd)}
                    />
                    <Button
                      icon="pi pi-trash"
                      rounded
                      text
                      severity="danger"
                      tooltip="Delete"
                      onClick={() => handleDeleteEmployee(rd)}
                    />
                  </div>
                )
              }}
            />
          </DataTable>
        </div>
      </>
      )}

      {/* ──────────────── TAB 2: CHECK-IN TERMINAL WIDGET ──────────────── */}
      {currentSubTab === 'terminal' && (
        <CheckinWidget onToast={showToast} />
      )}

      {/* ──────────────── TAB 3: DAILY ATTENDANCE LOG ──────────────── */}
      {currentSubTab === 'attendance' && (
        <div className="emp-table-card">
          <div className="p-3 surface-100 border-bottom-1 surface-border flex justify-content-between align-items-center">
            <h4 className="m-0 text-base font-bold text-900">
              Today's Attendance Logs ({new Date().toLocaleDateString()})
            </h4>
            <Button label="Refresh Log" icon="pi pi-refresh" size="small" outlined onClick={loadAttendanceData} />
          </div>

          <DataTable
            value={todayAttData.attendances}
            loading={loadingAtt}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            paginatorLeft={
              <div className="events-paginator__count">
                Total: <strong>{(todayAttData.attendances || []).length} Attendance Logs</strong>
              </div>
            }
            className="events-datatable p-datatable-sm"
            emptyMessage="No attendance records logged for today."
          >
            <Column
              header="Employee"
              body={(rd) => (
                <div className="flex align-items-center gap-2">
                  <Avatar image={rd.employeeId?.avatar} icon={!rd.employeeId?.avatar ? 'pi pi-user' : undefined} shape="circle" />
                  <div>
                    <div className="font-semibold">{rd.employeeId?.name || 'Staff'}</div>
                    <div className="text-xs text-500">{rd.employeeId?.role}</div>
                  </div>
                </div>
              )}
            />
            <Column
              header="Shift"
              body={(rd) => rd.shiftId?.name || 'Studio Shift'}
            />
            <Column
              header="Check In"
              body={(rd) => (rd.checkIn ? new Date(rd.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--')}
            />
            <Column
              header="Check Out"
              body={(rd) => (rd.checkOut ? new Date(rd.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--')}
            />
            <Column
              header="Break Duration"
              body={(rd) => `${rd.totalBreakMinutes || 0} mins`}
            />
            <Column
              header="Working Hours"
              body={(rd) => `${((rd.workingMinutes || 0) / 60).toFixed(1)}h`}
            />
            <Column
              field="status"
              header="Status"
              body={(rd) => (
                <Tag
                  value={rd.status}
                  severity={
                    rd.status === 'Present'
                      ? 'success'
                      : rd.status === 'Late'
                      ? 'warning'
                      : rd.status === 'On Leave'
                      ? 'info'
                      : 'danger'
                  }
                />
              )}
            />
            <Column
              header="Actions"
              body={(rd) => (
                <Button
                  label="Adjust"
                  icon="pi pi-cog"
                  size="small"
                  outlined
                  onClick={() => {
                    setAdjustRecord(rd)
                    setAdjustForm({ status: rd.status || 'Present', notes: rd.notes || '', reason: '' })
                    setAdjustDialogVisible(true)
                  }}
                />
              )}
            />
          </DataTable>
        </div>
      )}

      {/* ──────────────── TAB 4: LEAVE MANAGEMENT ──────────────── */}
      {currentSubTab === 'leave' && (
        <>
          <div className="events-toolbar">
            <div className="events-toolbar__left">
              <span className="font-bold text-sm text-700">Leave Applications & Approvals</span>
            </div>
            <div className="events-toolbar__right">
              <Button
                label="Apply Leave"
                icon="pi pi-calendar-plus"
                className="p-button-primary"
                onClick={() => {
                  if (employees.length > 0) setLeaveForm(prev => ({ ...prev, employeeId: employees[0]._id }))
                  setLeaveDialogVisible(true)
                }}
              />
            </div>
          </div>

          <div className="emp-table-card">

          <DataTable
            value={leaves}
            loading={loadingLeaves}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            paginatorLeft={
              <div className="events-paginator__count">
                Total: <strong>{(leaves || []).length} Leave Requests</strong>
              </div>
            }
            className="events-datatable p-datatable-sm"
            emptyMessage="No leave requests."
          >
            <Column
              header="Employee"
              body={(rd) => (
                <div className="font-semibold text-900">
                  {rd.employeeId?.name || 'Staff'} ({rd.employeeId?.role})
                </div>
              )}
            />
            <Column field="leaveType" header="Leave Type" />
            <Column
              header="Dates"
              body={(rd) =>
                `${new Date(rd.startDate).toLocaleDateString()} to ${new Date(rd.endDate).toLocaleDateString()} (${rd.totalDays || 1} days)`
              }
            />
            <Column field="reason" header="Reason" />
            <Column
              field="status"
              header="Status"
              body={(rd) => (
                <Tag
                  value={rd.status}
                  severity={
                    rd.status === 'Approved' ? 'success' : rd.status === 'Pending' ? 'warning' : 'danger'
                  }
                />
              )}
            />
            <Column
              header="Actions"
              body={(rd) => (
                <div className="flex gap-2">
                  {rd.status === 'Pending' && (
                    <>
                      <Button
                        icon="pi pi-check"
                        severity="success"
                        rounded
                        text
                        tooltip="Approve"
                        onClick={() => handleApproveLeave(rd._id)}
                      />
                      <Button
                        icon="pi pi-times"
                        severity="danger"
                        rounded
                        text
                        tooltip="Reject"
                        onClick={() => handleRejectLeave(rd._id)}
                      />
                    </>
                  )}
                </div>
              )}
            />
          </DataTable>
        </div>
      </>
      )}

      {/* ──────────────── TAB 5: PAYROLL ──────────────── */}
      {currentSubTab === 'payroll' && (
        <>
          <div className="events-toolbar">
            <div className="events-toolbar__left">
              <span className="font-bold text-sm text-700">Monthly Payroll & Salary Slips</span>
            </div>
            <div className="events-toolbar__right">
              <Button
                label="Calculate Payroll"
                icon="pi pi-calculator"
                className="p-button-success"
                onClick={() => {
                  if (employees.length > 0) setPayrollForm(prev => ({ ...prev, employeeId: employees[0]._id }))
                  setPayrollDialogVisible(true)
                }}
              />
            </div>
          </div>

          <div className="emp-table-card">

          <DataTable
            value={payrolls}
            loading={loadingPayroll}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            paginatorLeft={
              <div className="events-paginator__count">
                Total: <strong>{(payrolls || []).length} Payroll Records</strong>
              </div>
            }
            className="events-datatable p-datatable-sm"
            emptyMessage="No payroll records generated yet."
          >
            <Column
              header="Employee"
              body={(rd) => rd.employeeId?.name || 'Staff'}
            />
            <Column header="Month / Year" body={(rd) => `${rd.month}/${rd.year}`} />
            <Column header="Base Salary" body={(rd) => `₹${rd.baseSalary?.toLocaleString() || 0}`} />
            <Column header="Present Days" body={(rd) => `${rd.presentDays || 0} days`} />
            <Column header="Overtime Pay" body={(rd) => `₹${rd.overtimeAmount?.toLocaleString() || 0}`} />
            <Column header="Deductions" body={(rd) => `₹${rd.deductions?.toLocaleString() || 0}`} />
            <Column
              header="Net Salary"
              body={(rd) => <strong className="text-green-600">₹{rd.netSalary?.toLocaleString() || 0}</strong>}
            />
            <Column
              field="status"
              header="Status"
              body={(rd) => <Tag value={rd.status} severity="success" />}
            />
          </DataTable>
        </div>
      </>
      )}

      {/* ──────────────── TAB 6: SHIFTS ──────────────── */}
      {currentSubTab === 'shifts' && (
        <>
          <div className="events-toolbar">
            <div className="events-toolbar__left">
              <span className="font-bold text-sm text-700">Studio Shift Configurations</span>
            </div>
            <div className="events-toolbar__right">
              <Button
                label="Create Shift"
                icon="pi pi-plus"
                className="p-button-primary"
                onClick={() => setShiftDialogVisible(true)}
              />
            </div>
          </div>

          <div className="emp-table-card">

          <DataTable
            value={shifts}
            loading={loadingShifts}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            paginatorLeft={
              <div className="events-paginator__count">
                Total: <strong>{(shifts || []).length} Shift Templates</strong>
              </div>
            }
            className="events-datatable p-datatable-sm"
            emptyMessage="No shift configurations."
          >
            <Column field="name" header="Shift Name" body={(rd) => <strong>{rd.name}</strong>} />
            <Column header="Timing" body={(rd) => `${rd.startTime} – ${rd.endTime}`} />
            <Column header="Break Duration" body={(rd) => `${rd.breakDuration || 60} mins`} />
            <Column header="Grace Period" body={(rd) => `${rd.gracePeriod || 15} mins`} />
            <Column
              header="Overtime"
              body={(rd) => (rd.overtimeEnabled ? <Tag value="Enabled" severity="success" /> : <Tag value="Disabled" severity="warning" />)}
            />
          </DataTable>
        </div>
      </>
      )}

      {/* ──────────────── DIALOG: ADD/EDIT EMPLOYEE ──────────────── */}
      <Dialog
        visible={empDialogVisible}
        onHide={() => setEmpDialogVisible(false)}
        header={editMode ? 'Edit Employee Profile' : 'Add New Employee'}
        style={{ width: '650px' }}
        modal
        className="emp-dialog"
      >
        {/* ── Section 1: Employee Information ── */}
        <div className="emp-dialog-section__title">
          <i className="pi pi-user" /> Employee Information
        </div>
        <div className="grid p-fluid">
          <div className="col-12 md:col-6">
            <label className="font-bold text-sm">Full Name *</label>
            <InputText
              value={empFormData.name}
              onChange={(e) => setEmpFormData({ ...empFormData, name: e.target.value })}
              placeholder="e.g. Sathish Kumar"
            />
          </div>

          <div className="col-12 md:col-6">
            <label className="font-bold text-sm">Designation *</label>
            <Dropdown
              value={empFormData.role}
              options={designationOptions.map(r => ({ label: r, value: r }))}
              onChange={(e) => setEmpFormData({ ...empFormData, role: e.value })}
            />
          </div>

          <div className="col-12 md:col-6">
            <label className="font-bold text-sm">Email Address</label>
            <InputText
              value={empFormData.email}
              onChange={(e) => setEmpFormData({ ...empFormData, email: e.target.value })}
              placeholder="e.g. sathish@studio.com"
            />
          </div>

          <div className="col-12 md:col-6">
            <label className="font-bold text-sm">Phone Number</label>
            <InputText
              value={empFormData.phone}
              onChange={(e) => setEmpFormData({ ...empFormData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="col-12 md:col-6">
            <label className="font-bold text-sm">Employment Type</label>
            <Dropdown
              value={empFormData.employmentType}
              options={typeOptions.map(t => ({ label: t, value: t }))}
              onChange={(e) => setEmpFormData({ ...empFormData, employmentType: e.value })}
            />
          </div>

          <div className="col-12 md:col-6">
            <label className="font-bold text-sm">Monthly Base Salary (₹)</label>
            <InputNumber
              value={empFormData.salary}
              onValueChange={(e) => setEmpFormData({ ...empFormData, salary: e.value })}
              mode="currency"
              currency="INR"
              locale="en-IN"
            />
          </div>

          <div className="col-12 md:col-6">
            <label className="font-bold text-sm">Status</label>
            <Dropdown
              value={empFormData.status}
              options={statusOptions.map(s => ({ label: s, value: s }))}
              onChange={(e) => setEmpFormData({ ...empFormData, status: e.value })}
            />
          </div>

          <div className="col-12">
            <label className="font-bold text-sm">Address</label>
            <InputTextarea
              value={empFormData.address}
              onChange={(e) => setEmpFormData({ ...empFormData, address: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        {/* ── Section 2: Login Account (only for new employees) ── */}
        {!editMode && canCreateAccounts && (
          <div className="emp-dialog-section">
            <div className="emp-dialog-section__title">
              <i className="pi pi-shield" /> Login Account
            </div>

            <div className="emp-toggle-row">
              <label>Create Login Account</label>
              <InputSwitch
                checked={empFormData.createLoginAccount}
                onChange={(e) => setEmpFormData({ ...empFormData, createLoginAccount: e.value })}
              />
            </div>

            {empFormData.createLoginAccount && (
              <div className="grid p-fluid">
                {/* Username */}
                <div className="col-12">
                  <label className="font-bold text-sm">Login Username *</label>
                  <InputText
                    value={empFormData.username}
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
                      <i className="pi pi-times-circle" /> Username already exists. Please choose another.
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="col-12 md:col-6">
                  <label className="font-bold text-sm">Password *</label>
                  <div className="pwd-field-wrap">
                    <InputText
                      type={showPassword ? 'text' : 'password'}
                      value={empFormData.password}
                      onChange={(e) => setEmpFormData({ ...empFormData, password: e.target.value })}
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
                  {pwdStrength && empFormData.password && (
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
                  <label className="font-bold text-sm">Confirm Password *</label>
                  <div className="pwd-field-wrap">
                    <InputText
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={empFormData.confirmPassword}
                      onChange={(e) => setEmpFormData({ ...empFormData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      className={empFormData.confirmPassword && !passwordsMatch(empFormData.password, empFormData.confirmPassword) ? 'p-invalid' : ''}
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
                  {empFormData.confirmPassword && !passwordsMatch(empFormData.password, empFormData.confirmPassword) && (
                    <div className="field-error">Passwords do not match</div>
                  )}
                  {empFormData.confirmPassword && passwordsMatch(empFormData.password, empFormData.confirmPassword) && (
                    <div className="username-check username-check--available">
                      <i className="pi pi-check-circle" /> Passwords match
                    </div>
                  )}
                </div>

                {/* Role */}
                <div className="col-12 md:col-6">
                  <label className="font-bold text-sm">Application Role *</label>
                  <Dropdown
                    value={empFormData.userRole}
                    options={assignableRoles.map(r => ({ label: r, value: r }))}
                    onChange={(e) => setEmpFormData({ ...empFormData, userRole: e.value })}
                    placeholder="Select Role"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" outlined onClick={() => setEmpDialogVisible(false)} />
          <Button label={editMode ? 'Update Employee' : 'Create Employee'} icon="pi pi-check" onClick={handleSaveEmployee} />
        </div>
      </Dialog>

      {/* ──────────────── DIALOG: APPLY LEAVE ──────────────── */}
      <Dialog
        visible={leaveDialogVisible}
        onHide={() => setLeaveDialogVisible(false)}
        header="Apply for Leave"
        style={{ width: '500px' }}
        modal
      >
        <div className="flex flex-column gap-3 p-fluid">
          <div>
            <label className="font-bold text-sm mb-1 block">Employee *</label>
            <Dropdown
              value={leaveForm.employeeId}
              options={employees.map(e => ({ label: `${e.name} (${e.role})`, value: e._id }))}
              onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: e.value })}
            />
          </div>

          <div>
            <label className="font-bold text-sm mb-1 block">Leave Type *</label>
            <Dropdown
              value={leaveForm.leaveType}
              options={['Casual Leave', 'Sick Leave', 'Paid Leave', 'Unpaid Leave', 'Emergency Leave'].map(l => ({ label: l, value: l }))}
              onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.value })}
            />
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="font-bold text-sm mb-1 block">Start Date *</label>
              <Calendar
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.value })}
                showIcon
              />
            </div>
            <div className="col-6">
              <label className="font-bold text-sm mb-1 block">End Date *</label>
              <Calendar
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.value })}
                showIcon
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-sm mb-1 block">Reason *</label>
            <InputTextarea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" outlined onClick={() => setLeaveDialogVisible(false)} />
          <Button label="Submit Leave" icon="pi pi-check" onClick={handleSaveLeave} />
        </div>
      </Dialog>

      {/* ──────────────── DIALOG: CALCULATE PAYROLL ──────────────── */}
      <Dialog
        visible={payrollDialogVisible}
        onHide={() => setPayrollDialogVisible(false)}
        header="Calculate Monthly Payroll"
        style={{ width: '450px' }}
        modal
      >
        <div className="flex flex-column gap-3 p-fluid">
          <div>
            <label className="font-bold text-sm mb-1 block">Select Employee *</label>
            <Dropdown
              value={payrollForm.employeeId}
              options={employees.map(e => ({ label: `${e.name} (${e.role})`, value: e._id }))}
              onChange={(e) => setPayrollForm({ ...payrollForm, employeeId: e.value })}
            />
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="font-bold text-sm mb-1 block">Month</label>
              <InputNumber
                value={payrollForm.month}
                onValueChange={(e) => setPayrollForm({ ...payrollForm, month: e.value })}
                min={1}
                max={12}
              />
            </div>
            <div className="col-6">
              <label className="font-bold text-sm mb-1 block">Year</label>
              <InputNumber
                value={payrollForm.year}
                onValueChange={(e) => setPayrollForm({ ...payrollForm, year: e.value })}
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-sm mb-1 block">Bonus Amount (₹)</label>
            <InputNumber
              value={payrollForm.bonus}
              onValueChange={(e) => setPayrollForm({ ...payrollForm, bonus: e.value })}
            />
          </div>
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" outlined onClick={() => setPayrollDialogVisible(false)} />
          <Button label="Generate Slip" icon="pi pi-calculator" severity="success" onClick={handleGeneratePayroll} />
        </div>
      </Dialog>

      {/* ──────────────── DIALOG: CREATE SHIFT ──────────────── */}
      <Dialog
        visible={shiftDialogVisible}
        onHide={() => setShiftDialogVisible(false)}
        header="Configure Shift"
        style={{ width: '450px' }}
        modal
      >
        <div className="flex flex-column gap-3 p-fluid">
          <div>
            <label className="font-bold text-sm mb-1 block">Shift Name *</label>
            <InputText
              value={shiftForm.name}
              onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
            />
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="font-bold text-sm mb-1 block">Start Time</label>
              <InputText
                value={shiftForm.startTime}
                onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="font-bold text-sm mb-1 block">End Time</label>
              <InputText
                value={shiftForm.endTime}
                onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" outlined onClick={() => setShiftDialogVisible(false)} />
          <Button label="Save Shift" icon="pi pi-check" onClick={handleSaveShift} />
        </div>
      </Dialog>

      {/* ──────────────── MODAL: PROFILE DETAILS ──────────────── */}
      <EmployeeProfileModal
        visible={profileVisible}
        onHide={() => setProfileVisible(false)}
        employeeId={selectedEmpId}
      />
    </div>
  )
}
