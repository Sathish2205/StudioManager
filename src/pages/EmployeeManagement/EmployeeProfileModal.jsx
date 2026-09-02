import React, { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { Tag } from 'primereact/tag'
import { Avatar } from 'primereact/avatar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import { getEmployeeById } from '../../services/employeeService'
import { getMonthlyAttendance } from '../../services/attendanceService'
import { getUserByEmployee, changeUserRole, changeUserStatus, resetUserPassword } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import { ACCOUNT_CREATOR_ROLES, getAssignableRoles } from '../../constants/roles'
import { validatePasswordStrength, passwordsMatch } from '../../validation/passwordValidation'

export default function EmployeeProfileModal({ visible, onHide, employeeId }) {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthlyCalData, setMonthlyCalData] = useState({ calendar: {}, summary: {} })

  // Account management state
  const [userAccount, setUserAccount] = useState(null)
  const [loadingAccount, setLoadingAccount] = useState(false)
  const [roleDialogVisible, setRoleDialogVisible] = useState(false)
  const [resetPwdDialogVisible, setResetPwdDialogVisible] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmNewPwd, setShowConfirmNewPwd] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const { user: authUser } = useAuth()
  const canManageAccounts = ACCOUNT_CREATOR_ROLES.includes(authUser?.role) || authUser?.role === 'admin'
  const assignableRoles = getAssignableRoles(authUser?.role || 'Owner/Admin')

  useEffect(() => {
    if (visible && employeeId) {
      loadProfile()
      loadUserAccount()
    }
  }, [visible, employeeId])

  const loadProfile = async () => {
    setLoading(true)
    const data = await getEmployeeById(employeeId)
    if (data) {
      setProfileData(data)
    }
    const cal = await getMonthlyAttendance(employeeId, selectedYear, selectedMonth)
    if (cal) setMonthlyCalData(cal)
    setLoading(false)
  }

  const loadUserAccount = async () => {
    setLoadingAccount(true)
    const acct = await getUserByEmployee(employeeId)
    setUserAccount(acct)
    setLoadingAccount(false)
  }

  // Change Role handler
  const handleChangeRole = async () => {
    if (!userAccount || !newRole) return
    setActionLoading(true)
    const result = await changeUserRole(userAccount._id || userAccount.id, { role: newRole })
    setActionLoading(false)
    if (result && result.success) {
      setUserAccount({ ...userAccount, role: newRole })
      setRoleDialogVisible(false)
    }
  }

  // Reset Password handler
  const handleResetPassword = async () => {
    if (!userAccount) return

    const pwdCheck = validatePasswordStrength(newPassword)
    if (!pwdCheck.isValid) return
    if (!passwordsMatch(newPassword, confirmNewPassword)) return

    setActionLoading(true)
    const result = await resetUserPassword(userAccount._id || userAccount.id, { newPassword })
    setActionLoading(false)
    if (result && result.success) {
      setResetPwdDialogVisible(false)
      setNewPassword('')
      setConfirmNewPassword('')
    }
  }

  // Toggle Account Status
  const handleToggleStatus = () => {
    if (!userAccount) return
    const currentStatus = userAccount.status === 'active' ? 'inactive' : 'active'
    const actionLabel = currentStatus === 'active' ? 'Activate' : 'Deactivate'

    confirmDialog({
      message: `Are you sure you want to ${actionLabel.toLowerCase()} this account?`,
      header: `${actionLabel} Account`,
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: currentStatus === 'inactive' ? 'p-button-danger' : 'p-button-success',
      accept: async () => {
        const result = await changeUserStatus(userAccount._id || userAccount.id, { status: currentStatus })
        if (result && result.success) {
          setUserAccount({ ...userAccount, status: currentStatus })
        }
      },
    })
  }

  if (!profileData) {
    return (
      <Dialog visible={visible} onHide={onHide} header="Employee Profile" style={{ width: '80vw' }} modal>
        <div className="p-4 text-center">Loading employee profile details...</div>
      </Dialog>
    )
  }

  const { stats } = profileData

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Employee Profile & Records"
      style={{ width: '85vw', maxWidth: '1200px' }}
      modal
      className="employee-profile-dialog"
    >
      <ConfirmDialog />

      {/* Header Profile Summary Banner */}
      <div className="surface-card p-4 border-round-xl border-1 surface-border mb-4 flex flex-column md:flex-row align-items-center justify-content-between gap-4">
        <div className="flex align-items-center gap-3">
          <Avatar
            image={profileData.avatar}
            icon={!profileData.avatar ? 'pi pi-user' : undefined}
            size="xlarge"
            shape="circle"
            className="surface-200 text-primary font-bold"
            style={{ width: '70px', height: '70px', fontSize: '2rem' }}
          />
          <div>
            <div className="flex align-items-center gap-2">
              <h2 className="m-0 text-2xl font-bold text-900">{profileData.name}</h2>
              <Tag
                value={profileData.status || 'Active'}
                severity={profileData.status === 'Active' ? 'success' : 'warning'}
              />
            </div>
            <p className="m-0 text-600 text-sm mt-1">
              <strong className="text-primary mr-2">{profileData.employeeId || 'EMP-0000'}</strong> |{' '}
              {profileData.role} • {profileData.employmentType || 'Full Time'}
            </p>
            <p className="m-0 text-500 text-xs mt-1">
              <i className="pi pi-envelope mr-1" />
              {profileData.email || 'N/A'} | <i className="pi pi-phone mr-1 ml-2" />
              {profileData.phone || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="text-center p-3 bg-blue-50 border-round-lg min-w-7rem">
            <span className="text-xs font-semibold text-blue-600 uppercase block">Salary</span>
            <span className="text-xl font-extrabold text-blue-900">₹{profileData.salary?.toLocaleString() || 0}</span>
          </div>
          <div className="text-center p-3 bg-green-50 border-round-lg min-w-7rem">
            <span className="text-xs font-semibold text-green-600 uppercase block">Joining Date</span>
            <span className="text-sm font-bold text-green-900">
              {profileData.joiningDate ? new Date(profileData.joiningDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Employee Statistic Cards */}
      <div className="grid mb-4">
        <div className="col-12 sm:col-6 md:col-3">
          <div className="surface-card p-3 border-round-lg border-1 surface-border flex align-items-center justify-content-between">
            <div>
              <span className="text-500 text-xs font-medium block">Working Days</span>
              <span className="text-2xl font-bold text-900">{stats?.totalWorkingDays || 0}</span>
            </div>
            <i className="pi pi-calendar-check text-blue-500 text-3xl" />
          </div>
        </div>

        <div className="col-12 sm:col-6 md:col-3">
          <div className="surface-card p-3 border-round-lg border-1 surface-border flex align-items-center justify-content-between">
            <div>
              <span className="text-500 text-xs font-medium block">Present / Absent</span>
              <span className="text-2xl font-bold text-green-600">{stats?.presentDays || 0}</span>
              <span className="text-500 text-sm"> / {stats?.absentDays || 0}</span>
            </div>
            <i className="pi pi-user-check text-green-500 text-3xl" />
          </div>
        </div>

        <div className="col-12 sm:col-6 md:col-3">
          <div className="surface-card p-3 border-round-lg border-1 surface-border flex align-items-center justify-content-between">
            <div>
              <span className="text-500 text-xs font-medium block">Working Hours</span>
              <span className="text-2xl font-bold text-purple-600">{stats?.totalWorkingHours || 0}h</span>
            </div>
            <i className="pi pi-clock text-purple-500 text-3xl" />
          </div>
        </div>

        <div className="col-12 sm:col-6 md:col-3">
          <div className="surface-card p-3 border-round-lg border-1 surface-border flex align-items-center justify-content-between">
            <div>
              <span className="text-500 text-xs font-medium block">Overtime Hours</span>
              <span className="text-2xl font-bold text-orange-600">{stats?.overtimeHours || 0}h</span>
            </div>
            <i className="pi pi-bolt text-orange-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <TabView>
        {/* Tab 1: Overview */}
        <TabPanel header="Overview" leftIcon="pi pi-info-circle mr-2">
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="surface-card p-4 border-round-lg border-1 surface-border">
                <h4 className="m-0 text-base font-bold text-900 border-bottom-1 surface-border pb-2 mb-3">
                  Personal Information
                </h4>
                <div className="flex flex-column gap-2 text-sm">
                  <div><strong className="text-600">Full Name:</strong> {profileData.name}</div>
                  <div><strong className="text-600">Email:</strong> {profileData.email || 'N/A'}</div>
                  <div><strong className="text-600">Phone:</strong> {profileData.phone || 'N/A'}</div>
                  <div><strong className="text-600">Address:</strong> {profileData.address || 'N/A'}</div>
                  <div>
                    <strong className="text-600">Emergency Contact:</strong>{' '}
                    {profileData.emergencyContact?.name
                      ? `${profileData.emergencyContact.name} (${profileData.emergencyContact.relation || 'Contact'}) - ${profileData.emergencyContact.phone || ''}`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="surface-card p-4 border-round-lg border-1 surface-border">
                <h4 className="m-0 text-base font-bold text-900 border-bottom-1 surface-border pb-2 mb-3">
                  Employment Details
                </h4>
                <div className="flex flex-column gap-2 text-sm">
                  <div><strong className="text-600">Employee ID:</strong> {profileData.employeeId}</div>
                  <div><strong className="text-600">Role:</strong> {profileData.role}</div>
                  <div><strong className="text-600">Employment Type:</strong> {profileData.employmentType}</div>
                  <div><strong className="text-600">Shift:</strong> {profileData.shiftId?.name || 'Studio Shift (09:00 AM - 06:00 PM)'}</div>
                  <div><strong className="text-600">Working Hours:</strong> {profileData.workingHours || '09:00 AM - 06:00 PM'}</div>
                  <div><strong className="text-600">Specialization:</strong> {profileData.specialization || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Tab 2: Account Management */}
        <TabPanel header="Account" leftIcon="pi pi-shield mr-2">
          {loadingAccount ? (
            <div className="p-4 text-center">
              <i className="pi pi-spin pi-spinner mr-2" /> Loading account details...
            </div>
          ) : userAccount ? (
            <div className="account-info-card">
              <h4 className="m-0 mb-3 text-base font-bold text-900">
                <i className="pi pi-shield mr-2 text-primary" /> Employee Login Account
              </h4>

              <div className="account-info-row">
                <span className="account-info-row__label">Username</span>
                <span className="account-info-row__value">{userAccount.username}</span>
              </div>

              <div className="account-info-row">
                <span className="account-info-row__label">Role</span>
                <span className="account-info-row__value">
                  <Tag value={userAccount.role || 'N/A'} severity="info" />
                </span>
              </div>

              <div className="account-info-row">
                <span className="account-info-row__label">Status</span>
                <span className="account-info-row__value">
                  <Tag
                    value={userAccount.status === 'active' ? 'Active' : 'Inactive'}
                    severity={userAccount.status === 'active' ? 'success' : 'danger'}
                  />
                </span>
              </div>

              <div className="account-info-row">
                <span className="account-info-row__label">Last Login</span>
                <span className="account-info-row__value">
                  {userAccount.lastLoginAt
                    ? new Date(userAccount.lastLoginAt).toLocaleString()
                    : 'Never'}
                </span>
              </div>

              {canManageAccounts && (
                <div className="flex gap-2 mt-3 pt-3 border-top-1 surface-border">
                  <Button
                    label="Change Role"
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    outlined
                    onClick={() => {
                      setNewRole(userAccount.role || '')
                      setRoleDialogVisible(true)
                    }}
                  />
                  <Button
                    label="Reset Password"
                    icon="pi pi-key"
                    severity="warning"
                    size="small"
                    outlined
                    onClick={() => {
                      setNewPassword('')
                      setConfirmNewPassword('')
                      setShowNewPwd(false)
                      setShowConfirmNewPwd(false)
                      setResetPwdDialogVisible(true)
                    }}
                  />
                  <Button
                    label={userAccount.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                    icon={userAccount.status === 'active' ? 'pi pi-ban' : 'pi pi-check-circle'}
                    severity={userAccount.status === 'active' ? 'danger' : 'success'}
                    size="small"
                    outlined
                    onClick={handleToggleStatus}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="mb-3">
                <i className="pi pi-user-minus text-4xl text-500" />
              </div>
              <p className="text-600 text-sm mb-3">
                This employee does not have a login account.
              </p>
              {canManageAccounts && (
                <p className="text-xs text-500">
                  To create a login account, edit this employee and enable "Create Login Account".
                </p>
              )}
            </div>
          )}
        </TabPanel>

        {/* Tab 3: Attendance */}
        <TabPanel header="Attendance Logs" leftIcon="pi pi-calendar mr-2">
          <DataTable
            value={profileData.attendances || []}
            sortField="date"
            sortOrder={-1}
            paginator
            rows={10}
            className="p-datatable-sm events-datatable"
            emptyMessage="No attendance records found."
          >
            <Column
              field="date"
              header="Date"
              body={(rowData) => new Date(rowData.date).toLocaleDateString()}
            />
            <Column
              field="checkIn"
              header="Check In"
              body={(rowData) =>
                rowData.checkIn
                  ? new Date(rowData.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '--:--'
              }
            />
            <Column
              field="checkOut"
              header="Check Out"
              body={(rowData) =>
                rowData.checkOut
                  ? new Date(rowData.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '--:--'
              }
            />
            <Column
              header="Working Hours"
              body={(rowData) => `${(rowData.workingMinutes / 60).toFixed(1)}h`}
            />
            <Column
              header="Overtime"
              body={(rowData) => `${(rowData.overtimeMinutes / 60).toFixed(1)}h`}
            />
            <Column
              field="status"
              header="Status"
              body={(rowData) => (
                <Tag
                  value={rowData.status}
                  severity={
                    rowData.status === 'Present'
                      ? 'success'
                      : rowData.status === 'Late'
                      ? 'warning'
                      : rowData.status === 'On Leave'
                      ? 'info'
                      : 'danger'
                  }
                />
              )}
            />
          </DataTable>
        </TabPanel>

        {/* Tab 4: Events */}
        <TabPanel header="Assigned Events" leftIcon="pi pi-camera mr-2">
          <DataTable
            value={profileData.assignedEvents || []}
            sortField="eventDate"
            sortOrder={-1}
            paginator
            rows={5}
            className="p-datatable-sm events-datatable"
            emptyMessage="No assigned events."
          >
            <Column field="eventName" header="Event Name" />
            <Column
              field="eventDate"
              header="Event Date"
              body={(rowData) => new Date(rowData.eventDate).toLocaleDateString()}
            />
            <Column field="venue" header="Venue" />
            <Column
              field="status"
              header="Status"
              body={(rowData) => <Tag value={rowData.status} severity="info" />}
            />
          </DataTable>
        </TabPanel>

        {/* Tab 5: Tasks */}
        <TabPanel header="Assigned Tasks" leftIcon="pi pi-list mr-2">
          <DataTable
            value={profileData.tasks || []}
            sortField="dueDate"
            sortOrder={-1}
            paginator
            rows={5}
            className="p-datatable-sm events-datatable"
            emptyMessage="No assigned tasks."
          >
            <Column field="title" header="Task Title" />
            <Column field="priority" header="Priority" />
            <Column
              field="dueDate"
              header="Due Date"
              body={(rowData) => (rowData.dueDate ? new Date(rowData.dueDate).toLocaleDateString() : 'N/A')}
            />
            <Column
              field="status"
              header="Status"
              body={(rowData) => (
                <Tag
                  value={rowData.status}
                  severity={rowData.status === 'Completed' ? 'success' : 'warning'}
                />
              )}
            />
          </DataTable>
        </TabPanel>
      </TabView>

      {/* ── Change Role Dialog ── */}
      <Dialog
        visible={roleDialogVisible}
        onHide={() => setRoleDialogVisible(false)}
        header="Change User Role"
        style={{ width: '400px' }}
        modal
      >
        <div className="flex flex-column gap-3 p-fluid">
          <div>
            <label className="font-bold text-sm mb-1 block">New Role</label>
            <Dropdown
              value={newRole}
              options={assignableRoles.map(r => ({ label: r, value: r }))}
              onChange={(e) => setNewRole(e.value)}
              placeholder="Select Role"
            />
          </div>
        </div>
        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" outlined onClick={() => setRoleDialogVisible(false)} />
          <Button
            label="Update Role"
            icon="pi pi-check"
            onClick={handleChangeRole}
            loading={actionLoading}
            disabled={!newRole}
          />
        </div>
      </Dialog>

      {/* ── Reset Password Dialog ── */}
      <Dialog
        visible={resetPwdDialogVisible}
        onHide={() => setResetPwdDialogVisible(false)}
        header="Reset Password"
        style={{ width: '420px' }}
        modal
      >
        <div className="flex flex-column gap-3 p-fluid">
          <div>
            <label className="font-bold text-sm mb-1 block">New Password</label>
            <div className="pwd-field-wrap">
              <InputText
                type={showNewPwd ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pwd-eye-btn"
                onClick={() => setShowNewPwd(!showNewPwd)}
                tabIndex={-1}
              >
                <i className={showNewPwd ? 'pi pi-eye-slash' : 'pi pi-eye'} />
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-sm mb-1 block">Confirm Password</label>
            <div className="pwd-field-wrap">
              <InputText
                type={showConfirmNewPwd ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={confirmNewPassword && !passwordsMatch(newPassword, confirmNewPassword) ? 'p-invalid' : ''}
              />
              <button
                type="button"
                className="pwd-eye-btn"
                onClick={() => setShowConfirmNewPwd(!showConfirmNewPwd)}
                tabIndex={-1}
              >
                <i className={showConfirmNewPwd ? 'pi pi-eye-slash' : 'pi pi-eye'} />
              </button>
            </div>
            {confirmNewPassword && !passwordsMatch(newPassword, confirmNewPassword) && (
              <div className="field-error">Passwords do not match</div>
            )}
          </div>
        </div>
        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" outlined onClick={() => setResetPwdDialogVisible(false)} />
          <Button
            label="Reset Password"
            icon="pi pi-key"
            severity="warning"
            onClick={handleResetPassword}
            loading={actionLoading}
            disabled={!newPassword || !passwordsMatch(newPassword, confirmNewPassword) || !validatePasswordStrength(newPassword).isValid}
          />
        </div>
      </Dialog>
    </Dialog>
  )
}
