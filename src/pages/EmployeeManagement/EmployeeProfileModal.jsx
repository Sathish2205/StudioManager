import React, { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { Tag } from 'primereact/tag'
import { Avatar } from 'primereact/avatar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

import { getEmployeeById } from '../../services/employeeService'
import { getMonthlyAttendance } from '../../services/attendanceService'

export default function EmployeeProfileModal({ visible, onHide, employeeId }) {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthlyCalData, setMonthlyCalData] = useState({ calendar: {}, summary: {} })

  useEffect(() => {
    if (visible && employeeId) {
      loadProfile()
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

        {/* Tab 2: Attendance */}
        <TabPanel header="Attendance Logs" leftIcon="pi pi-calendar mr-2">
          <DataTable
            value={profileData.attendances || []}
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

        {/* Tab 3: Events */}
        <TabPanel header="Assigned Events" leftIcon="pi pi-camera mr-2">
          <DataTable
            value={profileData.assignedEvents || []}
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

        {/* Tab 4: Tasks */}
        <TabPanel header="Assigned Tasks" leftIcon="pi pi-list mr-2">
          <DataTable
            value={profileData.tasks || []}
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
    </Dialog>
  )
}
