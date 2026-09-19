import React, { useState, useEffect, useMemo } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'

import { getStaff } from '../../services/staffService'
import { useAuth } from '../../context/AuthContext'
import { useEvents, normalizeWorkflowStage } from '../../context/EventsContext'
import PageLoader from '../../components/PageLoader/PageLoader'
import './EditingDeliverables.css'

export default function EditingDeliverables({ onShowToast }) {
  const { user } = useAuth()
  const { events, loading, updateWorkflowStage, WORKFLOW_STAGES } = useEvents()
  const [activeTab, setActiveTab] = useState('kanban') // 'kanban' or 'deliverables'
  const [editorOptions, setEditorOptions] = useState([])

  const KANBAN_STAGES = WORKFLOW_STAGES

  useEffect(() => {
    const fetchEditors = async () => {
      const list = []
      
      // 1. Add Owner / Admin name
      const ownerName = user?.name || user?.fullName || 'Sathish'
      const ownerRole = user?.role || 'owner'
      const ownerLabel = `${ownerName} (${ownerRole})`
      list.push(ownerLabel)

      // 2. Fetch Employees from backend API
      try {
        const staff = await getStaff()
        if (Array.isArray(staff) && staff.length > 0) {
          staff.forEach((emp) => {
            if (emp.name) {
              const label = emp.role ? `${emp.name} (${emp.role})` : emp.name
              if (!list.includes(label) && !list.includes(emp.name)) {
                list.push(label)
              }
            }
          })
        }
      } catch (err) {
        console.warn('Error fetching staff for editors dropdown:', err)
      }

      setEditorOptions(list)
    }

    fetchEditors()
  }, [user])

  // Map events from EventsContext to Kanban tasks/deliverables
  const tasks = useMemo(() => {
    if (!events || events.length === 0) return []

    return events.map((evt) => {
      const clientName = evt.clientId
        ? `${evt.clientId.firstName || ''} ${evt.clientId.lastName || ''}`.trim()
        : evt.eventName || 'Client'

      const defaultOwnerName = user?.name ? `${user.name} (${user.role || 'owner'})` : 'Sathish (owner)'
      const editors = (evt.assignedEditors || []).map((e) => e.name).join(', ')
      const assignedEditor = editors || defaultOwnerName

      const rawStage = evt.workflow?.currentStage || evt.status || 'To Do'
      const currentStage = normalizeWorkflowStage(rawStage)
      const stageIdx = KANBAN_STAGES.indexOf(currentStage) >= 0 ? KANBAN_STAGES.indexOf(currentStage) : 0
      const progress = Math.round(((stageIdx + 1) / KANBAN_STAGES.length) * 100)

      return {
        _id: evt._id,
        id: evt._id ? `EVT-${evt._id.slice(-4).toUpperCase()}` : `EVT-${Date.now()}`,
        eventId: evt._id,
        eventName: evt.eventName || 'Special Event',
        clientName,
        deliverableType: evt.eventType || 'Edited Photos',
        assignedEditor,
        progress,
        status: currentStage,
        deadline: evt.eventDate ? new Date(evt.eventDate).toISOString().split('T')[0] : '2026-08-20',
        priority: evt.priority || 'Medium',
        notes: evt.notes || evt.venue || '',
        rawEvent: evt
      }
    })
  }, [events, user, KANBAN_STAGES])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStage, setFilterStage] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [filterEditor, setFilterEditor] = useState(null)

  // Mobile Filter Dialog State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [draftSearch, setDraftSearch] = useState('')
  const [draftType, setDraftType] = useState(null)
  const [draftEditor, setDraftEditor] = useState(null)

  const handleOpenMobileFilter = () => {
    setDraftSearch(searchQuery)
    setDraftType(filterType)
    setDraftEditor(filterEditor)
    setIsMobileFilterOpen(true)
  }

  const handleApplyMobileFilter = () => {
    setSearchQuery(draftSearch)
    setFilterType(draftType)
    setFilterEditor(draftEditor)
    setIsMobileFilterOpen(false)
  }

  const handleResetMobileFilter = () => {
    setDraftSearch('')
    setDraftType(null)
    setDraftEditor(null)
    setSearchQuery('')
    setFilterType(null)
    setFilterEditor(null)
    setIsMobileFilterOpen(false)
  }

  const activeFilterCount = (searchQuery ? 1 : 0) + (filterType ? 1 : 0) + (filterEditor ? 1 : 0)


  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Form
  const [formEventName, setFormEventName] = useState('')
  const [formClientName, setFormClientName] = useState('')
  const [formType, setFormType] = useState('Edited Photos')
  const [formEditor, setFormEditor] = useState('Deepa (Lead Editor)')
  const [formProgress, setFormProgress] = useState(0)
  const [formStage, setFormStage] = useState('To Do')
  const [formDeadline, setFormDeadline] = useState('2026-08-20')
  const [formPriority, setFormPriority] = useState('Medium')
  const [formNotes, setFormNotes] = useState('')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleOpenCreate = () => {
    setEditingTask(null)
    setFormEventName('')
    setFormClientName('')
    setFormType('Edited Photos')
    setFormEditor(editorOptions[0] || 'Sathish (Owner)')
    setFormProgress(0)
    setFormStage('To Do')
    setFormDeadline('2026-08-20')
    setFormPriority('Medium')
    setFormNotes('')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (task) => {
    setEditingTask(task)
    setFormEventName(task.eventName || '')
    setFormClientName(task.clientName || '')
    setFormType(task.deliverableType || 'Edited Photos')
    setFormEditor(task.assignedEditor || 'Deepa (Lead Editor)')
    setFormProgress(task.progress || 0)
    setFormStage(task.status || 'New')
    setFormDeadline(task.deadline || '2026-08-20')
    setFormPriority(task.priority || 'Medium')
    setFormNotes(task.notes || '')
    setIsDialogOpen(true)
  }

  const handleSaveTask = async () => {
    if (!formEventName || !formClientName) {
      triggerToast('Event name and client name are required', 'error')
      return
    }

    const payload = {
      title: formClientName,
      eventName: formEventName,
      description: formNotes ? `${formType} - ${formNotes}` : formType,
      deliverableType: formType,
      assignedEditor: formEditor,
      status: formStage,
      priority: formPriority,
      dueDate: formDeadline,
      progress: formProgress
    }

    if (editingTask) {
      const eventId = editingTask.eventId || editingTask._id || editingTask.id
      try {
        await updateWorkflowStage(eventId, formStage)
        triggerToast(`Event workflow stage updated to "${formStage}"!`, 'success')
      } catch (err) {
        triggerToast(`Failed to update stage: ${err.message}`, 'error')
      }
    }
    setIsDialogOpen(false)
  }

  const handleMoveStage = async (taskId, nextStage) => {
    try {
      const taskObj = tasks.find((t) => t.id === taskId || t._id === taskId)
      const eventId = taskObj?.eventId || taskObj?._id || taskId
      await updateWorkflowStage(eventId, nextStage)
      triggerToast(`Event moved to stage "${nextStage}"!`, 'success')
    } catch (err) {
      console.error('Failed to move stage:', err)
      triggerToast(`Failed to update stage: ${err.message || 'Error occurred'}`, 'error')
    }
  }

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = !filterStage || t.status === filterStage
    const matchesType = !filterType || filterType === 'All Deliverables' || t.deliverableType === filterType
    const matchesEditor = !filterEditor || filterEditor === 'All Editors' || t.assignedEditor === filterEditor

    return matchesSearch && matchesStage && matchesType && matchesEditor
  })

  const prioritySeverity = (p) => {
    switch (p) {
      case 'Urgent': return 'danger'
      case 'High': return 'warning'
      case 'Medium': return 'info'
      default: return 'secondary'
    }
  }

  return (
    <div className="editing-container">
      {/* ── Header ── */}
      <div className="editing-header">
        <div>
          <h1 className="editing-header__title">Editing Workflow & Deliverables Management</h1>
          <p className="editing-header__sub">
            Track post-production progress from Culling → Editing → Client Review → Final Delivery
          </p>
        </div>

        <div className="editing-header__actions">
          <Button
            label="Create Editing Task"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={handleOpenCreate}
          />
        </div>
      </div>

      {/* ── Dedicated Studio Tab Navigation Bar ── */}
      <div className="studio-tab-bar">
        <button
          className={`studio-tab-btn ${activeTab === 'kanban' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('kanban')}
        >
          <i className="pi pi-th-large" /> Kanban Workflow
        </button>
        <button
          className={`studio-tab-btn ${activeTab === 'deliverables' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('deliverables')}
        >
          <i className="pi pi-list" /> Deliverables Table <span className="studio-tab-badge">{tasks.length}</span>
        </button>
      </div>

      {/* ─── Desktop Search & Filter Toolbar ─── */}
      <div className="events-toolbar events-toolbar--desktop">
        <div className="events-toolbar__left">
          <div className="events-search">
            <i className="pi pi-search events-search__icon" />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event, client, or editor..."
              className="events-search__input"
            />
          </div>

          <Dropdown
            value={filterType}
            options={[
              { label: 'All Deliverables', value: 'All Deliverables' },
              { label: 'Edited Photos', value: 'Edited Photos' },
              { label: 'Wedding Video', value: 'Wedding Video' },
              { label: 'Highlight Video', value: 'Highlight Video' },
              { label: 'Teaser', value: 'Teaser' },
              { label: 'Album', value: 'Album' },
              { label: 'Reel', value: 'Reel' },
              { label: 'Raw Files', value: 'Raw Files' }
            ]}
            onChange={(e) => setFilterType(e.value)}
            placeholder="Deliverable Type"
            showClear
            className="events-filter__dropdown"
          />

          <Dropdown
            value={filterEditor}
            options={[
              { label: 'All Editors', value: 'All Editors' },
              ...editorOptions.map((opt) => ({ label: opt, value: opt }))
            ]}
            onChange={(e) => setFilterEditor(e.value)}
            placeholder="Assigned Editor"
            showClear
            className="events-filter__dropdown"
          />

          {(searchQuery || filterType || filterEditor || filterStage) && (
            <Button
              icon="pi pi-filter-slash"
              label="Reset"
              className="p-button-outlined p-button-secondary p-button-sm"
              onClick={() => {
                setSearchQuery('')
                setFilterStage(null)
                setFilterType(null)
                setFilterEditor(null)
              }}
            />
          )}
        </div>
      </div>

      {/* ─── Mobile Search & Filter Toolbar ─── */}
      <div className="events-toolbar events-toolbar--mobile">
        <div className="events-search">
          <i className="pi pi-search events-search__icon" />
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deliverables..."
            className="events-search__input"
          />
          {searchQuery && (
            <i
              className="pi pi-times events-search__clear"
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>
        <Button
          icon="pi pi-filter"
          label={activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
          className="mobile-filter-btn p-button-primary"
          onClick={handleOpenMobileFilter}
        />
      </div>

      {/* ─── Mobile Filter Dialog Modal ─── */}
      <Dialog
        header="🔍 Filter Deliverables"
        visible={isMobileFilterOpen}
        style={{ width: '92vw', maxWidth: '440px' }}
        onHide={() => setIsMobileFilterOpen(false)}
        dismissableMask
      >
        <div className="mobile-filter-form">
          <div className="mobile-filter-field">
            <label className="mobile-filter-label">Search Keyword</label>
            <InputText
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder="Search event, client, editor..."
            />
          </div>

          <div className="mobile-filter-field">
            <label className="mobile-filter-label">Deliverable Type</label>
            <Dropdown
              value={draftType}
              options={[
                { label: 'All Deliverables', value: 'All Deliverables' },
                { label: 'Edited Photos', value: 'Edited Photos' },
                { label: 'Wedding Video', value: 'Wedding Video' },
                { label: 'Highlight Video', value: 'Highlight Video' },
                { label: 'Teaser', value: 'Teaser' },
                { label: 'Album', value: 'Album' },
                { label: 'Reel', value: 'Reel' },
                { label: 'Raw Files', value: 'Raw Files' }
              ]}
              onChange={(e) => setDraftType(e.value)}
              placeholder="Deliverable Type"
              showClear
            />
          </div>

          <div className="mobile-filter-field">
            <label className="mobile-filter-label">Assigned Editor</label>
            <Dropdown
              value={draftEditor}
              options={[
                { label: 'All Editors', value: 'All Editors' },
                ...editorOptions.map((opt) => ({ label: opt, value: opt }))
              ]}
              onChange={(e) => setDraftEditor(e.value)}
              placeholder="Assigned Editor"
              showClear
            />
          </div>
        </div>

        <div className="mobile-filter-dialog-footer pt-3">
          <Button
            label="Reset"
            icon="pi pi-refresh"
            className="p-button-outlined p-button-secondary"
            onClick={handleResetMobileFilter}
          />
          <Button
            label="Apply Filters"
            icon="pi pi-check"
            className="p-button-primary"
            onClick={handleApplyMobileFilter}
          />
        </div>
      </Dialog>


      {/* ── TAB 1: KANBAN WORKFLOW ── */}
      {activeTab === 'kanban' && (
        loading ? (
          <PageLoader />
        ) : (
        <div className="kanban-board">
          {KANBAN_STAGES.map((stage) => {
            const stageTasks = filteredTasks.filter((t) => t.status === stage)
            return (
              <div key={stage} className="kanban-column">
                <div className="kanban-column-header">
                  <span className="font-bold text-xs text-800">{stage}</span>
                  <span className="kanban-count-badge">{stageTasks.length}</span>
                </div>

                <div className="kanban-tasks-list">
                  {stageTasks.map((task) => (
                    <div key={task.id} className="kanban-card">
                      <div className="flex justify-content-between align-items-center mb-2">
                        <Tag value={task.priority} severity={prioritySeverity(task.priority)} />
                        <span className="text-xs text-500 font-semibold">{task.id}</span>
                      </div>

                      <h4 className="text-xs font-bold text-900 mb-1">{task.eventName}</h4>
                      <p className="text-xs text-600 mb-2">{task.clientName}</p>

                      <div className="mb-2">
                        <div className="flex justify-content-between text-xs text-600 mb-1">
                          <span>{task.deliverableType}</span>
                          <span className="font-bold text-primary">{task.progress}%</span>
                        </div>
                        <ProgressBar value={task.progress} showValue={false} style={{ height: '6px' }} />
                      </div>

                      <div className="text-xs text-500 mb-2">
                        <i className="pi pi-user mr-1" /> {task.assignedEditor}
                        <br />
                        <i className="pi pi-calendar mr-1" /> Due: {task.deadline}
                      </div>

                      <div className="flex justify-content-between align-items-center mt-2 pt-2 border-top-1 surface-border">
                        <Button
                          icon="pi pi-pencil"
                          rounded
                          text
                          className="p-button-xs"
                          onClick={() => handleOpenEdit(task)}
                        />
                        <Dropdown
                          value={task.status}
                          options={KANBAN_STAGES}
                          onChange={(e) => handleMoveStage(task.id, e.value)}
                          className="p-inputtext-sm text-xs"
                          style={{ width: '110px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        )
      )}

      {/* ── TAB 2: DELIVERABLES TABLE ── */}
      {activeTab === 'deliverables' && (
        <div className="events-table-card">
          <DataTable
            value={filteredTasks}
            loading={loading}
            sortField="id"
            sortOrder={-1}
            paginator
            paginatorLeft={
              <span className="events-paginator__count">
                Showing <strong>{filteredTasks.length}</strong> of {tasks.length} Deliverables
              </span>
            }
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="deliverableType" header="Deliverable" sortable style={{ minWidth: '150px' }} />
            <Column field="eventName" header="Event & Client" body={(r) => `${r.eventName} (${r.clientName})`} sortable style={{ minWidth: '220px' }} />
            <Column field="assignedEditor" header="Assigned To" sortable style={{ minWidth: '170px' }} />
            <Column field="deadline" header="Due Date" sortable style={{ minWidth: '120px' }} />
            <Column
              field="progress"
              header="Progress"
              body={(r) => (
                <div style={{ width: '120px' }}>
                  <div className="text-xs font-bold mb-1">{r.progress}%</div>
                  <ProgressBar value={r.progress} showValue={false} style={{ height: '6px' }} />
                </div>
              )}
              sortable
              style={{ minWidth: '140px' }}
            />
            <Column field="status" header="Status Stage" body={(r) => <Tag value={r.status} severity="info" />} sortable style={{ minWidth: '130px' }} />
            <Column
              header="Actions"
              body={(r) => (
                <Button icon="pi pi-pencil" rounded text onClick={() => handleOpenEdit(r)} />
              )}
              style={{ minWidth: '90px' }}
            />
          </DataTable>
        </div>
      )}

      {/* ── CREATE / EDIT TASK DIALOG ── */}
      <Dialog
        header={editingTask ? `Edit Task (${editingTask.id})` : 'Create Editing Task'}
        visible={isDialogOpen}
        style={{ width: '500px' }}
        onHide={() => setIsDialogOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsDialogOpen(false)} />
            <Button label="Save Task" icon="pi pi-check" className="p-button-primary" onClick={handleSaveTask} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Event Name *</label>
            <InputText value={formEventName} onChange={(e) => setFormEventName(e.target.value)} className="w-full" />
          </div>

          <div>
            <label className="block font-bold mb-1">Client Name *</label>
            <InputText value={formClientName} onChange={(e) => setFormClientName(e.target.value)} className="w-full" />
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Deliverable Type</label>
              <Dropdown
                value={formType}
                options={['Edited Photos', 'Wedding Video', 'Highlight Video', 'Teaser', 'Album', 'Reel', 'Raw Files']}
                onChange={(e) => setFormType(e.value)}
                className="w-full"
              />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Assigned Editor</label>
              <Dropdown
                value={formEditor}
                options={editorOptions}
                onChange={(e) => setFormEditor(e.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Workflow Stage</label>
              <Dropdown
                value={formStage}
                options={KANBAN_STAGES}
                onChange={(e) => setFormStage(e.value)}
                className="w-full"
              />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Priority</label>
              <Dropdown
                value={formPriority}
                options={['Low', 'Medium', 'High', 'Urgent']}
                onChange={(e) => setFormPriority(e.value)}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Completion Progress (%)</label>
            <InputNumber value={formProgress} onValueChange={(e) => setFormProgress(e.value)} min={0} max={100} className="w-full" />
          </div>

          <div>
            <label className="block font-bold mb-1">Deadline Date</label>
            <InputText value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)} className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
