import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import { ProgressBar } from 'primereact/progressbar'

import { MOCK_CLIENT_REQUESTS } from './mockRequestsData'
import './ClientRequests.css'

export default function ClientRequests({ onShowToast }) {
  const [requests, setRequests] = useState(MOCK_CLIENT_REQUESTS)
  const [selectedReq, setSelectedReq] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [rClient, setRClient] = useState('')
  const [rEvent, setREvent] = useState('')
  const [rType, setRType] = useState('Photo Replacement')
  const [rTitle, setRTitle] = useState('')
  const [rDesc, setRDesc] = useState('')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleCreateRequest = () => {
    if (!rClient || !rTitle) {
      triggerToast('Client name and Title are required', 'error')
      return
    }

    const newR = {
      id: `REQ-${300 + requests.length + 1}`,
      clientName: rClient,
      eventName: rEvent || 'Studio Shoot Event',
      requestType: rType,
      title: rTitle,
      description: rDesc,
      priority: 'Medium',
      assignedTo: 'Studio Team',
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-08-15',
      status: 'Submitted',
      timeline: [
        { stage: 'Submitted', date: 'Just Now', by: rClient }
      ]
    }

    setRequests([newR, ...requests])
    setIsCreateOpen(false)
    triggerToast(`Request ${newR.id} registered successfully!`, 'success')
  }

  const handleStatusUpdate = (reqId, newStage) => {
    const stageEntry = { stage: newStage, date: 'Just Now', by: 'Studio Manager' }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: newStage,
              timeline: [...r.timeline, stageEntry]
            }
          : r
      )
    )

    if (selectedReq && selectedReq.id === reqId) {
      setSelectedReq((prev) => ({
        ...prev,
        status: newStage,
        timeline: [...prev.timeline, stageEntry]
      }))
    }

    triggerToast(`Request ${reqId} moved to ${newStage}!`, 'success')
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Completed': return 'success'
      case 'Processing':
      case 'In Review': return 'warning'
      case 'Client Review': return 'info'
      case 'Submitted': return 'danger'
      default: return 'secondary'
    }
  }

  const requestStages = ['Submitted', 'In Review', 'Assigned', 'Processing', 'Client Review', 'Completed']

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !filterType || filterType === 'All Request Types' || r.requestType === filterType
    const matchesStat = !filterStatus || filterStatus === 'All Statuses' || r.status === filterStatus
    return matchesSearch && matchesType && matchesStat
  })

  return (
    <div className="requests-container">
      {/* ── Page Header ── */}
      <div className="requests-header">
        <div>
          <h1 className="requests-header__title">Client Request & Revision Portal</h1>
          <p className="requests-header__sub">
            Track client photo swaps, album revisions, video audio changes, and delivery requests
          </p>
        </div>

        <div className="requests-header__actions">
          <Button
            label="Register Client Request"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="events-toolbar mb-3">
        <div className="events-toolbar__left">
          <div className="events-search">
            <i className="pi pi-search events-search__icon" />
            <InputText value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search request title or client..." className="events-search__input" />
          </div>

          <Dropdown
            value={filterType}
            options={[
              { label: 'All Request Types', value: 'All Request Types' },
              { label: 'Photo Replacement', value: 'Photo Replacement' },
              { label: 'Album Revision', value: 'Album Revision' },
              { label: 'Video Revision', value: 'Video Revision' },
              { label: 'Delivery Request', value: 'Delivery Request' }
            ]}
            onChange={(e) => setFilterType(e.value)}
            placeholder="Request Type"
            showClear
            className="events-filter__dropdown"
          />

          <Dropdown
            value={filterStatus}
            options={[
              { label: 'All Statuses', value: 'All Statuses' },
              ...requestStages.map((s) => ({ label: s, value: s }))
            ]}
            onChange={(e) => setFilterStatus(e.value)}
            placeholder="Workflow Stage"
            showClear
            className="events-filter__dropdown"
          />
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="events-table-card">
        <DataTable value={filteredRequests} paginator rows={5} responsiveLayout="scroll" stripedRows className="events-datatable">
          <Column field="id" header="Request ID" sortable style={{ minWidth: '110px' }} />
          <Column field="title" header="Request Summary" sortable style={{ minWidth: '240px' }} />
          <Column field="clientName" header="Client" sortable style={{ minWidth: '180px' }} />
          <Column field="requestType" header="Type" body={(r) => <Tag value={r.requestType} severity="info" />} style={{ minWidth: '140px' }} />
          <Column field="assignedTo" header="Assigned To" style={{ minWidth: '140px' }} />
          <Column field="status" header="Workflow Stage" body={(r) => <Tag value={r.status} severity={statusSeverity(r.status)} />} sortable style={{ minWidth: '140px' }} />
          <Column
            header="Actions"
            body={(r) => (
              <Button
                label="View Timeline"
                icon="pi pi-clock"
                className="p-button-outlined p-button-sm text-xs"
                onClick={() => setSelectedReq(r)}
              />
            )}
            style={{ minWidth: '140px' }}
          />
        </DataTable>
      </div>

      {/* ── REQUEST TIMELINE DIALOG ── */}
      {selectedReq && (
        <Dialog
          header={`Client Request ${selectedReq.id}: ${selectedReq.title}`}
          visible={!!selectedReq}
          style={{ width: '560px' }}
          onHide={() => setSelectedReq(null)}
        >
          <div className="flex flex-column gap-3 text-xs">
            <div className="flex justify-content-between align-items-center">
              <span className="font-bold text-700">Client: {selectedReq.clientName}</span>
              <Tag value={selectedReq.status} severity={statusSeverity(selectedReq.status)} />
            </div>

            <div className="bg-surface-ground p-3 border-round">
              <strong>Request Details:</strong>
              <p className="mt-1 text-700">{selectedReq.description}</p>
            </div>

            <div className="border-top-1 surface-border pt-2">
              <h3 className="font-bold text-xs uppercase text-primary mb-3">Workflow Stage Timeline</h3>

              <div className="flex flex-column gap-2 mb-4">
                {selectedReq.timeline.map((item, i) => (
                  <div key={i} className="flex align-items-center gap-3 bg-surface-card p-2 border-round border-1 surface-border">
                    <i className="pi pi-check-circle text-green-600 text-base" />
                    <div className="flex-1">
                      <div className="font-bold text-900">{item.stage}</div>
                      <div className="text-500">By {item.by} • {item.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex align-items-center gap-2">
                <span className="font-bold text-600">Advance Stage:</span>
                <Dropdown
                  value={selectedReq.status}
                  options={requestStages}
                  onChange={(e) => handleStatusUpdate(selectedReq.id, e.value)}
                  showClear
                  className="flex-1 p-inputtext-sm"
                />
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* ── CREATE REQUEST DIALOG ── */}
      <Dialog
        header="Register Client Request / Revision"
        visible={isCreateOpen}
        style={{ width: '480px' }}
        onHide={() => setIsCreateOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsCreateOpen(false)} />
            <Button label="Register Request" icon="pi pi-check" className="p-button-primary" onClick={handleCreateRequest} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Client Name *</label>
            <InputText value={rClient} onChange={(e) => setRClient(e.target.value)} placeholder="Client Name" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Event Name</label>
            <InputText value={rEvent} onChange={(e) => setREvent(e.target.value)} placeholder="Event Name" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Request Type</label>
            <Dropdown value={rType} options={['Photo Replacement', 'Album Revision', 'Video Revision', 'Delivery Request']} onChange={(e) => setRType(e.value)} showClear className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Request Title *</label>
            <InputText value={rTitle} onChange={(e) => setRTitle(e.target.value)} placeholder="Summary of request" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Description</label>
            <InputTextarea value={rDesc} onChange={(e) => setRDesc(e.target.value)} rows={3} placeholder="Specific instructions" className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
