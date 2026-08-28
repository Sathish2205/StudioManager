import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Card } from 'primereact/card'
import { getEmployeeCurrentStatus, checkIn, checkOut, startBreak, endBreak } from '../../services/attendanceService'
import { getEmployeesDropdown } from '../../services/employeeService'
import { Dropdown } from 'primereact/dropdown'

export default function CheckinWidget({ onToast }) {
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [statusData, setStatusData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Load employee dropdown list
  useEffect(() => {
    const loadEmps = async () => {
      const data = await getEmployeesDropdown()
      if (data && data.all && data.all.length > 0) {
        setEmployees(data.all)
        setSelectedEmployeeId(data.all[0]._id || data.all[0].id)
      }
    }
    loadEmps()
  }, [])

  // Fetch status whenever selected employee changes
  const fetchStatus = async () => {
    if (!selectedEmployeeId) return
    setLoading(true)
    const res = await getEmployeeCurrentStatus(selectedEmployeeId)
    if (res) {
      setStatusData(res)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStatus()
  }, [selectedEmployeeId])

  // Timer for working time counter
  useEffect(() => {
    let interval = null
    const att = statusData?.attendance
    if (att && att.checkIn && !att.checkOut && !att.isOnBreak) {
      const startTime = new Date(att.checkIn).getTime()
      interval = setInterval(() => {
        const now = Date.now()
        setElapsedSeconds(Math.max(0, Math.floor((now - startTime) / 1000)))
      }, 1000)
    } else {
      setElapsedSeconds(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [statusData])

  const formatTimer = (secs) => {
    const hours = Math.floor(secs / 3600)
    const mins = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  }

  const formatTimeStr = (isoDateStr) => {
    if (!isoDateStr) return '--:--'
    return new Date(isoDateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const formatMinutes = (mins) => {
    if (!mins) return '0m'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  const handleCheckIn = async () => {
    setActionLoading(true)
    const res = await checkIn(selectedEmployeeId)
    setActionLoading(false)
    if (res && res.success) {
      onToast && onToast('success', 'Checked In', res.message || 'Successfully checked in')
      fetchStatus()
    } else {
      onToast && onToast('error', 'Check-In Failed', res?.message || 'Check-in failed')
    }
  }

  const handleCheckOut = async () => {
    setActionLoading(true)
    const res = await checkOut(selectedEmployeeId)
    setActionLoading(false)
    if (res && res.success) {
      onToast && onToast('success', 'Checked Out', res.message || 'Successfully checked out')
      fetchStatus()
    } else {
      onToast && onToast('error', 'Check-Out Failed', res?.message || 'Check-out failed')
    }
  }

  const handleStartBreak = async () => {
    setActionLoading(true)
    const res = await startBreak(selectedEmployeeId)
    setActionLoading(false)
    if (res && res.success) {
      onToast && onToast('info', 'Break Started', 'Enjoy your break!')
      fetchStatus()
    } else {
      onToast && onToast('error', 'Error', res?.message || 'Failed to start break')
    }
  }

  const handleEndBreak = async () => {
    setActionLoading(true)
    const res = await endBreak(selectedEmployeeId)
    setActionLoading(false)
    if (res && res.success) {
      onToast && onToast('success', 'Break Ended', 'Welcome back to work!')
      fetchStatus()
    } else {
      onToast && onToast('error', 'Error', res?.message || 'Failed to end break')
    }
  }

  const att = statusData?.attendance
  const emp = statusData?.employee
  const shift = emp?.shiftId || { startTime: '09:00 AM', endTime: '06:00 PM' }

  // Greeting based on current hour
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  // Determine current widget status
  let statusLabel = 'Not Checked In'
  let statusSeverity = 'info'

  if (att) {
    if (att.checkOut) {
      statusLabel = 'Checked Out'
      statusSeverity = 'secondary'
    } else if (att.isOnBreak) {
      statusLabel = 'On Break'
      statusSeverity = 'warning'
    } else if (att.checkIn) {
      statusLabel = att.status === 'Late' ? 'Checked In (Late)' : 'Checked In'
      statusSeverity = att.status === 'Late' ? 'warning' : 'success'
    }
  }

  return (
    <div className="checkin-widget-container p-3">
      <div className="p-d-flex p-jc-between p-ai-center mb-3">
        <div className="flex align-items-center gap-2">
          <i className="pi pi-user-check text-primary text-2xl" />
          <h3 className="m-0 text-xl font-bold text-900">Attendance Terminal</h3>
        </div>
        <div className="flex align-items-center gap-2">
          <label className="text-sm font-medium text-600">Select Employee:</label>
          <Dropdown
            value={selectedEmployeeId}
            options={employees.map(e => ({ label: `${e.name} (${e.role})`, value: e._id || e.id }))}
            onChange={(e) => setSelectedEmployeeId(e.value)}
            placeholder="Select Employee"
            className="w-16rem p-inputtext-sm"
          />
        </div>
      </div>

      <div className="grid">
        {/* Main Status & Action Card */}
        <div className="col-12 md:col-7">
          <div className="surface-card p-4 shadow-1 border-round-xl border-1 surface-border">
            <div className="flex justify-content-between align-items-start mb-4">
              <div>
                <span className="text-500 font-medium text-sm">{greeting},</span>
                <h2 className="m-0 text-2xl font-bold text-900 mt-1">{emp?.name || 'Employee'} 👋</h2>
                <div className="flex align-items-center gap-2 mt-2">
                  <span className="text-600 text-sm"><i className="pi pi-briefcase mr-1 text-primary" />{emp?.role || 'Staff'}</span>
                  <span className="text-300">|</span>
                  <span className="text-600 text-sm"><i className="pi pi-clock mr-1 text-primary" />Shift: <strong>{shift.startTime || '09:00 AM'} – {shift.endTime || '06:00 PM'}</strong></span>
                </div>
              </div>
              <Tag value={statusLabel} severity={statusSeverity} className="px-3 py-2 text-sm font-semibold" />
            </div>

            {/* Live Counter Display */}
            {att?.checkIn && !att?.checkOut && !att?.isOnBreak && (
              <div className="bg-blue-50 border-1 border-blue-200 border-round-lg p-3 mb-4 text-center">
                <span className="text-blue-600 font-medium text-xs uppercase tracking-wider block mb-1">Active Working Time</span>
                <span className="text-4xl font-extrabold text-blue-900 font-mono">{formatTimer(elapsedSeconds)}</span>
              </div>
            )}

            {att?.isOnBreak && (
              <div className="bg-orange-50 border-1 border-orange-200 border-round-lg p-3 mb-4 text-center">
                <span className="text-orange-600 font-medium text-xs uppercase tracking-wider block mb-1">Currently On Break ☕</span>
                <span className="text-2xl font-bold text-orange-900">Pause in Progress</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-3">
              {(!att || !att.checkIn) && (
                <Button
                  label="CHECK IN NOW"
                  icon="pi pi-sign-in"
                  severity="success"
                  className="p-button-lg flex-1 py-3 font-bold"
                  loading={actionLoading}
                  onClick={handleCheckIn}
                />
              )}

              {att?.checkIn && !att?.checkOut && !att?.isOnBreak && (
                <>
                  <Button
                    label="START BREAK"
                    icon="pi pi-pause-circle"
                    severity="warning"
                    outlined
                    className="p-button-lg flex-1 py-3 font-bold"
                    loading={actionLoading}
                    onClick={handleStartBreak}
                  />
                  <Button
                    label="CHECK OUT"
                    icon="pi pi-sign-out"
                    severity="danger"
                    className="p-button-lg flex-1 py-3 font-bold"
                    loading={actionLoading}
                    onClick={handleCheckOut}
                  />
                </>
              )}

              {att?.checkIn && !att?.checkOut && att?.isOnBreak && (
                <Button
                  label="END BREAK & RESUME"
                  icon="pi pi-play"
                  severity="success"
                  className="p-button-lg flex-1 py-3 font-bold"
                  loading={actionLoading}
                  onClick={handleEndBreak}
                />
              )}

              {att?.checkIn && att?.checkOut && (
                <div className="w-full text-center py-2 bg-gray-100 border-round-md text-600 font-medium">
                  <i className="pi pi-check-circle text-green-500 mr-2" />
                  Attendance Completed for Today
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Day Metrics Summary Card */}
        <div className="col-12 md:col-5">
          <div className="surface-card p-4 shadow-1 border-round-xl border-1 surface-border h-full flex flex-column justify-content-between">
            <h4 className="m-0 text-lg font-bold text-900 mb-3 flex align-items-center">
              <i className="pi pi-calendar-times text-primary mr-2" /> Today's Log Details
            </h4>

            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between align-items-center pb-2 border-bottom-1 surface-border">
                <span className="text-600 text-sm">Check In Time:</span>
                <span className="font-semibold text-900">{att?.checkIn ? formatTimeStr(att.checkIn) : '--:--'}</span>
              </div>

              <div className="flex justify-content-between align-items-center pb-2 border-bottom-1 surface-border">
                <span className="text-600 text-sm">Check Out Time:</span>
                <span className="font-semibold text-900">{att?.checkOut ? formatTimeStr(att.checkOut) : '--:--'}</span>
              </div>

              <div className="flex justify-content-between align-items-center pb-2 border-bottom-1 surface-border">
                <span className="text-600 text-sm">Total Break Duration:</span>
                <span className="font-semibold text-orange-600">{formatMinutes(att?.totalBreakMinutes || 0)}</span>
              </div>

              <div className="flex justify-content-between align-items-center pb-2 border-bottom-1 surface-border">
                <span className="text-600 text-sm">Actual Working Hours:</span>
                <span className="font-bold text-green-600 text-lg">{formatMinutes(att?.workingMinutes || 0)}</span>
              </div>

              <div className="flex justify-content-between align-items-center">
                <span className="text-600 text-sm">Overtime:</span>
                <span className="font-bold text-purple-600">{formatMinutes(att?.overtimeMinutes || 0)}</span>
              </div>
            </div>

            {att?.lateMinutes > 0 && (
              <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 text-xs border-round border-1 border-yellow-200">
                <i className="pi pi-exclamation-triangle mr-1" />
                Checked in <strong>{att.lateMinutes} minutes late</strong> past grace period.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
