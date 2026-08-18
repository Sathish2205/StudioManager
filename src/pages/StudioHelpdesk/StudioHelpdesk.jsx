import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'

import './StudioHelpdesk.css'

export default function StudioHelpdesk({ onShowToast }) {
  const [tickets, setTickets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studio_helpdesk_tickets') || '[]') } catch { return [] }
  })
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterPriority, setFilterPriority] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [tTitle, setTTitle] = useState('')
  const [tDesc, setTDesc] = useState('')
  const [tCategory, setTCategory] = useState('Technical')
  const [tPriority, setTPriority] = useState('High')
  const [tAssignee, setTAssignee] = useState('IT Support')

  // Comment Form
  const [newComment, setNewComment] = useState('')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleCreateTicket = () => {
    if (!tTitle || !tDesc) {
      triggerToast('Title and Description are required', 'error')
      return
    }

    const newT = {
      id: `TCK-${900 + tickets.length + 1}`,
      title: tTitle,
      description: tDesc,
      category: tCategory,
      priority: tPriority,
      createdBy: 'Studio Manager',
      assignedTo: tAssignee,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-08-15',
      status: 'Open',
      comments: [
        { user: 'Studio Manager', time: 'Just Now', text: tDesc }
      ]
    }

    setTickets([newT, ...tickets])
    setIsCreateOpen(false)
    triggerToast(`Ticket ${newT.id} created!`, 'success')
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTicket) return

    const updatedComment = {
      user: 'Sathish Manager',
      time: 'Just Now',
      text: newComment
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, comments: [...t.comments, updatedComment] }
          : t
      )
    )

    setSelectedTicket((prev) => ({
      ...prev,
      comments: [...prev.comments, updatedComment]
    }))

    setNewComment('')
    triggerToast('Comment added to ticket activity timeline!')
  }

  const prioritySeverity = (p) => {
    switch (p) {
      case 'Critical': return 'danger'
      case 'High': return 'warning'
      case 'Medium': return 'info'
      default: return 'secondary'
    }
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Open': return 'danger'
      case 'In Progress': return 'warning'
      case 'Waiting': return 'info'
      case 'Resolved': return 'success'
      default: return 'secondary'
    }
  }

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = !filterCategory || filterCategory === 'All Categories' || t.category === filterCategory
    const matchesPri = !filterPriority || filterPriority === 'All Priorities' || t.priority === filterPriority
    const matchesStat = !filterStatus || filterStatus === 'All Statuses' || t.status === filterStatus
    return matchesSearch && matchesCat && matchesPri && matchesStat
  })

  return (
    <div className="helpdesk-container">
      {/* ── Page Header ── */}
      <div className="helpdesk-header">
        <div>
          <h1 className="helpdesk-header__title">Studio Helpdesk & Internal Support Ticketing</h1>
          <p className="helpdesk-header__sub">
            Report studio equipment issues, editing bugs, client escalation tickets, and technical help
          </p>
        </div>

        <div className="helpdesk-header__actions">
          <Button
            label="Create Support Ticket"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>
      </div>

      {/* ── 5 DASHBOARD METRIC CARDS ── */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Open Tickets</div>
            <div className="crm-metric__val text-red-600">{tickets.filter(t => t.status === 'Open').length}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--pink"><i className="pi pi-inbox" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">High Priority</div>
            <div className="crm-metric__val text-amber-600">{tickets.filter(t => t.priority === 'Critical' || t.priority === 'High').length}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--amber"><i className="pi pi-exclamation-triangle" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">In Progress</div>
            <div className="crm-metric__val text-blue-600">{tickets.filter(t => t.status === 'In Progress').length}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--blue"><i className="pi pi-sync" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Waiting Feedback</div>
            <div className="crm-metric__val">{tickets.filter(t => t.status === 'Waiting').length}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--purple"><i className="pi pi-clock" /></div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Resolved Tickets</div>
            <div className="crm-metric__val text-green-600">{tickets.filter(t => t.status === 'Resolved').length}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--green"><i className="pi pi-check-circle" /></div>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="events-toolbar mb-3">
        <div className="events-toolbar__left">
          <div className="events-search">
            <i className="pi pi-search events-search__icon" />
            <InputText value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tickets..." className="events-search__input" />
          </div>
          <Dropdown
            value={filterCategory}
            options={[
              { label: 'All Categories', value: 'All Categories' },
              { label: 'Technical', value: 'Technical' },
              { label: 'Equipment', value: 'Equipment' },
              { label: 'Editing', value: 'Editing' },
              { label: 'Finance', value: 'Finance' }
            ]}
            onChange={(e) => setFilterCategory(e.value)}
            placeholder="Category"
            showClear
            className="events-filter__dropdown"
          />
          <Dropdown
            value={filterPriority}
            options={[
              { label: 'All Priorities', value: 'All Priorities' },
              { label: 'Critical', value: 'Critical' },
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' }
            ]}
            onChange={(e) => setFilterPriority(e.value)}
            placeholder="Priority"
            showClear
            className="events-filter__dropdown"
          />
        </div>
      </div>

      {/* ── TICKETS TABLE ── */}
      <div className="events-table-card">
        <DataTable
          value={filteredTickets}
          paginator
          paginatorLeft={
            <span className="events-paginator__count">
              Showing <strong>{filteredTickets.length}</strong> of {tickets.length} Tickets
            </span>
          }
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          responsiveLayout="scroll"
          stripedRows
          className="events-datatable"
        >
          <Column field="id" header="Ticket ID" sortable style={{ minWidth: '110px' }} />
          <Column field="title" header="Title & Subject" sortable style={{ minWidth: '240px' }} />
          <Column field="category" header="Category" body={(r) => <Tag value={r.category} severity="info" />} style={{ minWidth: '120px' }} />
          <Column field="priority" header="Priority" body={(r) => <Tag value={r.priority} severity={prioritySeverity(r.priority)} />} sortable style={{ minWidth: '120px' }} />
          <Column field="assignedTo" header="Assigned To" style={{ minWidth: '150px' }} />
          <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={statusSeverity(r.status)} />} sortable style={{ minWidth: '130px' }} />
          <Column
            header="Actions"
            body={(r) => (
              <Button
                label="View Activity"
                icon="pi pi-comments"
                className="p-button-outlined p-button-sm text-xs"
                onClick={() => setSelectedTicket(r)}
              />
            )}
            style={{ minWidth: '140px' }}
          />
        </DataTable>
      </div>

      {/* ── TICKET ACTIVITY TIMELINE DIALOG ── */}
      {selectedTicket && (
        <Dialog
          header={`Ticket ${selectedTicket.id}: ${selectedTicket.title}`}
          visible={!!selectedTicket}
          style={{ width: '560px' }}
          onHide={() => setSelectedTicket(null)}
        >
          <div className="flex flex-column gap-3 text-xs">
            <div className="flex justify-content-between align-items-center">
              <Tag value={selectedTicket.priority} severity={prioritySeverity(selectedTicket.priority)} />
              <Tag value={selectedTicket.status} severity={statusSeverity(selectedTicket.status)} />
            </div>

            <div className="bg-surface-ground p-3 border-round">
              <strong>Description:</strong>
              <p className="mt-1 text-700">{selectedTicket.description}</p>
            </div>

            <div className="border-top-1 surface-border pt-2">
              <h3 className="font-bold text-xs uppercase text-primary mb-2">Activity Timeline Comments ({selectedTicket.comments.length})</h3>
              {selectedTicket.comments.map((c, i) => (
                <div key={i} className="bg-surface-card p-3 border-round-lg border-1 surface-border mb-2">
                  <div className="flex justify-content-between font-bold text-primary mb-1">
                    <span>{c.user}</span>
                    <span className="text-500 font-normal">{c.time}</span>
                  </div>
                  <div className="text-700">{c.text}</div>
                </div>
              ))}

              <div className="mt-3 flex gap-2">
                <InputText
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type a comment or status update..."
                  className="flex-1 p-inputtext-sm"
                />
                <Button label="Post" icon="pi pi-send" className="p-button-sm" onClick={handleAddComment} />
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* ── CREATE TICKET DIALOG ── */}
      <Dialog
        header="Create Internal Support Ticket"
        visible={isCreateOpen}
        style={{ width: '480px' }}
        onHide={() => setIsCreateOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsCreateOpen(false)} />
            <Button label="Submit Ticket" icon="pi pi-check" className="p-button-primary" onClick={handleCreateTicket} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Ticket Title *</label>
            <InputText value={tTitle} onChange={(e) => setTTitle(e.target.value)} placeholder="Summary of issue" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Description *</label>
            <InputTextarea value={tDesc} onChange={(e) => setTDesc(e.target.value)} rows={3} placeholder="Detailed explanation" className="w-full" />
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Category</label>
              <Dropdown value={tCategory} options={['Technical', 'Equipment', 'Editing', 'Finance', 'Event']} onChange={(e) => setTCategory(e.value)} showClear className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Priority</label>
              <Dropdown value={tPriority} options={['Low', 'Medium', 'High', 'Critical']} onChange={(e) => setTPriority(e.value)} showClear className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
