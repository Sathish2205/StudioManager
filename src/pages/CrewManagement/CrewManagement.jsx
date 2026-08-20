import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Dialog } from 'primereact/dialog'
import { ProgressBar } from 'primereact/progressbar'

import { getStaff, createStaff, deleteStaff } from '../../services/staffService'
import './CrewManagement.css'

export default function CrewManagement({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('members') // 'members', 'assignments'
  const [crewList, setCrewList] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadCrew = async () => {
    setLoading(true)
    const data = await getStaff()
    if (data && data.length > 0) {
      const mapped = data.map((st) => ({
        _id: st._id,
        id: st._id ? `CREW-${st._id.slice(-4).toUpperCase()}` : `CREW-${Date.now()}`,
        name: st.name || 'Staff Member',
        role: st.role || 'Photographer',
        phone: st.phone || '+91 98765 43210',
        email: st.email || 'crew@studio.com',
        status: st.status === 'Active' ? 'Available' : st.status || 'Available',
        eventsCompleted: Math.floor(Math.random() * 20) + 5,
        rating: 4.9,
        specialization: st.specialization || 'Wedding Photography',
        experience: st.experience || '3+ Years',
        workload: st.workload || Math.floor(Math.random() * 60) + 20,
        skills: st.skills && st.skills.length > 0 ? st.skills : ['Wedding Photography', 'Portrait', 'Outdoor Shoots'],
        avatar: st.avatar || null,
        upcomingEventsCount: 0,
        assignments: st.assignments || []
      }))
      setCrewList(mapped)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCrew()
  }, [])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState(null)

  // Dialog Assign Crew
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [assignCrewName, setAssignCrewName] = useState('')
  const [assignEventName, setAssignEventName] = useState('')
  const [assignDate, setAssignDate] = useState('2026-08-12')
  const [assignTime, setAssignTime] = useState('09:00 - 18:00')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleAssignCrew = () => {
    if (!assignCrewName || !assignEventName) {
      triggerToast('Crew Member and Event Name are required', 'error')
      return
    }

    // Conflict Check
    const targetMember = crewList.find((c) => c.name === assignCrewName)
    if (targetMember) {
      const conflict = targetMember.assignments.find((a) => a.date === assignDate)
      if (conflict) {
        alert(`⚠️ CREW CONFLICT DETECTED!\n\n${targetMember.name} is already assigned to "${conflict.event}" on ${conflict.date} (${conflict.time}).`)
        triggerToast(`Conflict detected for ${targetMember.name}!`, 'error')
        return
      }

      setCrewList((prev) =>
        prev.map((c) =>
          c.name === assignCrewName
            ? {
                ...c,
                upcomingEventsCount: c.upcomingEventsCount + 1,
                assignments: [
                  ...c.assignments,
                  { event: assignEventName, date: assignDate, time: assignTime, venue: 'Assigned Venue' }
                ]
              }
            : c
        )
      )
      triggerToast(`${assignCrewName} assigned to ${assignEventName}!`, 'success')
      setIsAssignOpen(false)
    }
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Available': return 'success'
      case 'Busy':
      case 'On Assignment': return 'danger'
      default: return 'secondary'
    }
  }

  const getCrewStatusBadge = (st) => {
    switch (st) {
      case 'Available': return 'cal-status-badge--confirmed'
      case 'Busy':
      case 'On Assignment': return 'cal-status-badge--today'
      default: return 'cal-status-badge--default'
    }
  }

  const filteredCrew = crewList.filter((c) => {
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !filterRole || filterRole === 'All Roles' || c.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="crew-container">
      {/* ── Header ── */}
      <div className="crew-header">
        <div>
          <h1 className="crew-header__title">Crew & Photographer Team Management</h1>
          <p className="crew-header__sub">
            Track photographer availability, workload, skills, and crew conflict detection
          </p>
        </div>

        <div className="crew-header__actions">
          <Button
            label="Assign Crew to Event"
            icon="pi pi-user-plus"
            className="p-button-primary"
            onClick={() => setIsAssignOpen(true)}
          />
        </div>
      </div>

      {/* ── Dedicated Studio Tab Navigation Bar ── */}
      <div className="studio-tab-bar">
        <button
          className={`studio-tab-btn ${activeTab === 'members' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <i className="pi pi-users" /> Team Roster <span className="studio-tab-badge">{crewList.length}</span>
        </button>
        <button
          className={`studio-tab-btn ${activeTab === 'assignments' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <i className="pi pi-calendar" /> Crew Event Assignments
        </button>
      </div>

      {/* ── TAB 1: TEAM ROSTER ── */}
      {activeTab === 'members' && (
        <>
          <div className="events-toolbar mb-3">
            <div className="events-toolbar__left">
              <div className="events-search">
                <i className="pi pi-search events-search__icon" />
                <InputText value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search crew member or role..." className="events-search__input" />
              </div>
              <Dropdown
                value={filterRole}
                options={[
                  { label: 'All Roles', value: 'All Roles' },
                  { label: 'Photographer', value: 'Photographer' },
                  { label: 'Videographer', value: 'Videographer' },
                  { label: 'Drone Operator', value: 'Drone Operator' },
                  { label: 'Editor', value: 'Editor' }
                ]}
                onChange={(e) => setFilterRole(e.value)}
                placeholder="Filter Role"
                showClear
                className="events-filter__dropdown"
              />
            </div>
          </div>

          <div className="grid">
            {filteredCrew.map((member) => (
              <div key={member.id} className="col-12 md:col-6 lg:col-3">
                <div className="crew-card">
                  <div className="flex align-items-center gap-3 mb-3">
                    <Avatar image={member.avatar} size="large" shape="circle" />
                    <div>
                      <h3 className="text-sm font-bold text-900">{member.name}</h3>
                      <span className="text-xs text-primary font-semibold">{member.role}</span>
                    </div>
                  </div>

                  <div className="flex justify-content-between align-items-center mb-2">
                    <span className="text-xs text-600 font-semibold">Status:</span>
                    <span className={`cal-status-badge ${getCrewStatusBadge(member.status)}`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-content-between text-xs text-600 mb-1">
                      <span>Current Workload</span>
                      <span className="font-bold text-900">{member.workload}%</span>
                    </div>
                    <ProgressBar value={member.workload} showValue={false} style={{ height: '6px' }} />
                  </div>

                  <div className="crew-skills-box text-xs mb-3">
                    <div className="font-bold text-700 mb-1">Skills:</div>
                    <div className="text-600">{member.skills.join(', ')}</div>
                  </div>

                  <button
                    className="cal-card-action-btn w-full justify-content-center"
                    onClick={() => setSelectedMember(member)}
                  >
                    <i className="pi pi-eye" /> View Assignments & Workload
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB 2: ASSIGNMENTS TABLE ── */}
      {activeTab === 'assignments' && (
        <div className="events-table-card">
          <DataTable
            value={crewList.flatMap((c) => c.assignments.map((a) => ({ ...a, crewName: c.name, role: c.role })))}
            paginator
            paginatorLeft={
              <span className="events-paginator__count">
                Showing <strong>{crewList.flatMap((c) => c.assignments).length}</strong> Event Assignments
              </span>
            }
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="crewName" header="Crew Member" sortable style={{ minWidth: '180px' }} />
            <Column field="role" header="Role" style={{ minWidth: '130px' }} />
            <Column field="event" header="Assigned Event" sortable style={{ minWidth: '220px' }} />
            <Column field="date" header="Date" sortable style={{ minWidth: '120px' }} />
            <Column field="time" header="Time Slot" style={{ minWidth: '140px' }} />
            <Column field="venue" header="Venue Location" style={{ minWidth: '180px' }} />
          </DataTable>
        </div>
      )}

      {/* ── MEMBER DETAILS DRAWER / DIALOG ── */}
      {selectedMember && (
        <Dialog
          header={`Crew Profile: ${selectedMember.name}`}
          visible={!!selectedMember}
          style={{ width: '500px' }}
          onHide={() => setSelectedMember(null)}
        >
          <div className="flex flex-column gap-3 text-xs">
            <div className="flex align-items-center gap-3">
              <Avatar image={selectedMember.avatar} size="xlarge" shape="circle" />
              <div>
                <h2 className="text-base font-bold text-900">{selectedMember.name}</h2>
                <span className="text-primary font-bold">{selectedMember.role} • {selectedMember.experience} Exp</span>
                <div className="text-500 mt-1">{selectedMember.phone} | {selectedMember.email}</div>
              </div>
            </div>

            <div className="bg-surface-card p-3 border-round-xl border-1 surface-border">
              <h3 className="font-bold text-xs uppercase text-primary mb-2">Assigned Upcoming Events ({selectedMember.assignments.length})</h3>
              {selectedMember.assignments.map((a, i) => (
                <div key={i} className="bg-surface-ground p-2 border-round mb-2">
                  <div className="font-bold text-900">{a.event}</div>
                  <div className="text-500"><i className="pi pi-calendar mr-1" /> {a.date} ({a.time}) @ {a.venue}</div>
                </div>
              ))}
            </div>
          </div>
        </Dialog>
      )}

      {/* ── ASSIGN CREW DIALOG WITH CONFLICT DETECTION ── */}
      <Dialog
        header="Assign Crew Member to Event"
        visible={isAssignOpen}
        style={{ width: '480px' }}
        onHide={() => setIsAssignOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsAssignOpen(false)} />
            <Button label="Assign Crew" icon="pi pi-check" className="p-button-primary" onClick={handleAssignCrew} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Select Crew Member (Conflict Check Enabled)</label>
            <Dropdown value={assignCrewName} options={crewList.map((c) => ({ label: `${c.name} (${c.role})`, value: c.name }))} onChange={(e) => setAssignCrewName(e.value)} placeholder="Choose Crew" showClear className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Event Name *</label>
            <InputText value={assignEventName} onChange={(e) => setAssignEventName(e.target.value)} placeholder="e.g. Priya & Rohan Sangeet" className="w-full" />
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Event Date</label>
              <InputText value={assignDate} onChange={(e) => setAssignDate(e.target.value)} placeholder="2026-08-12" className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Time Slot</label>
              <InputText value={assignTime} onChange={(e) => setAssignTime(e.target.value)} placeholder="09:00 - 18:00" className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
