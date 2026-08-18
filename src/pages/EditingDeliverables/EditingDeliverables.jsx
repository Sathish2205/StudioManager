import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'

import { getTasks, createTask, updateTask, deleteTask } from '../../services/taskService'
import './EditingDeliverables.css'

const KANBAN_STAGES = ['New', 'In Progress', 'Review', 'Approved', 'Delivered']

export default function EditingDeliverables({ onShowToast }) {
  const [tasks, setTasks] = useState([])
  const [activeTab, setActiveTab] = useState('kanban') // 'kanban' or 'deliverables'
  const [loading, setLoading] = useState(true)

  const loadTasks = async () => {
    setLoading(true)
    const data = await getTasks()
    if (data && data.length > 0) {
      const mapped = data.map(t => ({
        _id: t._id,
        id: t._id ? `TASK-${t._id.slice(-4).toUpperCase()}` : `TASK-${Date.now()}`,
        eventName: t.eventId ? t.eventId.eventName : 'Studio Task',
        clientName: t.title || 'Client',
        type: t.description || 'Edited Photos',
        editor: t.assignedTo ? t.assignedTo.name : 'Unassigned',
        progress: t.status === 'Completed' ? 100 : t.status === 'In Progress' ? 50 : 0,
        stage: t.status === 'Completed' ? 'Delivered' : t.status === 'In Progress' ? 'In Progress' : 'New',
        deadline: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '',
        priority: t.priority || 'Medium',
        notes: t.description || ''
      }))
      setTasks(mapped)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStage, setFilterStage] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [filterEditor, setFilterEditor] = useState(null)

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Form
  const [formEventName, setFormEventName] = useState('')
  const [formClientName, setFormClientName] = useState('')
  const [formType, setFormType] = useState('Edited Photos')
  const [formEditor, setFormEditor] = useState('Deepa (Lead Editor)')
  const [formProgress, setFormProgress] = useState(0)
  const [formStage, setFormStage] = useState('New')
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
    setFormEditor('Deepa (Lead Editor)')
    setFormProgress(0)
    setFormStage('New')
    setFormDeadline('2026-08-20')
    setFormPriority('Medium')
    setFormNotes('')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (task) => {
    setEditingTask(task)
    setFormEventName(task.eventName)
    setFormClientName(task.clientName)
    setFormType(task.deliverableType)
    setFormEditor(task.assignedEditor)
    setFormProgress(task.progress)
    setFormStage(task.status)
    setFormDeadline(task.deadline)
    setFormPriority(task.priority)
    setFormNotes(task.notes)
    setIsDialogOpen(true)
  }

  const handleSaveTask = () => {
    if (!formEventName || !formClientName) {
      triggerToast('Event name and client name are required', 'error')
      return
    }

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                eventName: formEventName,
                clientName: formClientName,
                deliverableType: formType,
                assignedEditor: formEditor,
                progress: formProgress,
                status: formStage,
                deadline: formDeadline,
                priority: formPriority,
                notes: formNotes
              }
            : t
        )
      )
      triggerToast(`Editing task ${editingTask.id} updated!`, 'success')
    } else {
      const newT = {
        id: `TSK-${200 + tasks.length + 1}`,
        eventId: `EVT-2026-${200 + tasks.length + 1}`,
        eventName: formEventName,
        clientName: formClientName,
        assignedEditor: formEditor,
        deliverableType: formType,
        photosTotal: 500,
        photosCompleted: Math.round(500 * (formProgress / 100)),
        progress: formProgress,
        deadline: formDeadline,
        priority: formPriority,
        status: formStage,
        notes: formNotes || 'New task created.'
      }
      setTasks([newT, ...tasks])
      triggerToast(`New editing task ${newT.id} created!`, 'success')
    }
    setIsDialogOpen(false)
  }

  const handleMoveStage = (taskId, nextStage) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStage } : t))
    )
    triggerToast(`Task ${taskId} moved to ${nextStage}!`)
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

      {/* ── Toolbar Search & Filters ── */}
      <div className="events-toolbar">
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
              { label: 'Deepa (Lead Editor)', value: 'Deepa (Lead Editor)' },
              { label: 'Rahul Video Editor', value: 'Rahul Video Editor' },
              { label: 'Arun Retoucher', value: 'Arun Retoucher' }
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

      {/* ── TAB 1: KANBAN WORKFLOW ── */}
      {activeTab === 'kanban' && (
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
      )}

      {/* ── TAB 2: DELIVERABLES TABLE ── */}
      {activeTab === 'deliverables' && (
        <div className="events-table-card">
          <DataTable
            value={filteredTasks}
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
                options={['Deepa (Lead Editor)', 'Rahul Video Editor', 'Arun Retoucher']}
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
