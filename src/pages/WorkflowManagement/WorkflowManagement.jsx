import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { ProgressBar } from 'primereact/progressbar'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

import { ALL_STAGES } from './mockWorkflowData'
import { fetchWorkflowSummaries, updateWorkflowByEvent } from '../../services/workflowService'
import PageLoader from '../../components/PageLoader/PageLoader'
import './WorkflowManagement.css'

export default function WorkflowManagement() {
  // Master Workflows State
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [eventTypeFilter, setEventTypeFilter] = useState(null)

  // Mobile Filter Dialog State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [draftSearch, setDraftSearch] = useState('')
  const [draftStatus, setDraftStatus] = useState(null)
  const [draftEventType, setDraftEventType] = useState(null)

  // Selected Workflow for Status Modal
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Modal Editing Form State
  const [editingStageIndex, setEditingStageIndex] = useState(0)
  const [editingStatus, setEditingStatus] = useState('Editing')
  const [editingEditor, setEditingEditor] = useState('')
  const [paymentInput, setPaymentInput] = useState('')
  const [toastMsg, setToastMsg] = useState(null)

  // Load workflows from API on mount
  const loadWorkflows = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchWorkflowSummaries()
      if (data && data.length > 0) {
        // Map API data to match component's expected shape
        const mapped = data.map((wf) => ({
          ...wf,
          id: wf._id || wf.workflowId || wf.id,
          currentStageIndex: wf.currentStageIndex || 0,
          overallStatus: wf.overallStatus || 'Booking',
          assignedEditor: wf.assignedEditor || 'Unassigned',
          paymentSummary: wf.paymentSummary || {
            totalAmount: 0,
            advancePaid: 0,
            balanceDue: 0,
            paymentStatus: 'Pending',
          },
          // Keep empty arrays for fields the API doesn't return
          activityLog: wf.activityLog || [],
          tasks: wf.tasks || [],
          deliverables: wf.deliverables || [],
        }))
        mapped.sort((a, b) => String(b.id || b._id).localeCompare(String(a.id || a._id)))
        setWorkflows(mapped)
      } else {
        setWorkflows([])
      }
    } catch (err) {
      console.warn('Failed to load workflows from API:', err)
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorkflows()
  }, [loadWorkflows])

  // Filter Options
  const statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Booking', value: 'Booking' },
    { label: 'Editing', value: 'Editing' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Completed', value: 'Completed' }
  ]

  const eventTypeOptions = [
    { label: 'All Event Types', value: null },
    { label: 'Wedding', value: 'Wedding' },
    { label: 'Birthday', value: 'Birthday' },
    { label: 'Reception', value: 'Reception' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Sangeet', value: 'Sangeet' }
  ]

  const stageOptions = useMemo(() => {
    return ALL_STAGES.map((stage, idx) => ({
      label: `Stage ${idx + 1} of 20: ${stage}`,
      value: idx
    }))
  }, [])

  // Filtered Workflows List
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      const matchesSearch =
        !searchQuery ||
        (w.id && w.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.clientName && w.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.eventName && w.eventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.clientPhone && w.clientPhone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.photographer && w.photographer.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = !statusFilter || w.overallStatus === statusFilter
      const matchesType = !eventTypeFilter || w.eventType === eventTypeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [workflows, searchQuery, statusFilter, eventTypeFilter])

  // Workflow KPI Metrics Calculation
  const workflowMetrics = useMemo(() => {
    const totalWorkflows = workflows.length
    const inProgressCount = workflows.filter((w) => w.overallStatus === 'Editing' || w.overallStatus === 'Booking').length
    const completedCount = workflows.filter((w) => w.overallStatus === 'Completed' || w.overallStatus === 'Delivered').length
    const avgProgress = totalWorkflows > 0
      ? Math.round(workflows.reduce((acc, w) => acc + Math.round(((w.currentStageIndex + 1) / ALL_STAGES.length) * 100), 0) / totalWorkflows)
      : 0
    return { totalWorkflows, inProgressCount, completedCount, avgProgress }
  }, [workflows])

  // Mobile Filter Handlers
  const handleOpenMobileFilter = () => {
    setDraftSearch(searchQuery)
    setDraftStatus(statusFilter)
    setDraftEventType(eventTypeFilter)
    setIsMobileFilterOpen(true)
  }

  const handleApplyMobileFilter = () => {
    setSearchQuery(draftSearch)
    setStatusFilter(draftStatus)
    setEventTypeFilter(draftEventType)
    setIsMobileFilterOpen(false)
  }

  const handleResetMobileFilter = () => {
    setDraftSearch('')
    setDraftStatus(null)
    setDraftEventType(null)
    setSearchQuery('')
    setStatusFilter(null)
    setEventTypeFilter(null)
    setIsMobileFilterOpen(false)
  }

  const activeFilterCount = (searchQuery ? 1 : 0) + (statusFilter ? 1 : 0) + (eventTypeFilter ? 1 : 0)

  // Toast Helper
  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }


  // Open Status Dialog for a Workflow Row
  const handleOpenStatusModal = (workflow) => {
    setSelectedWorkflow(workflow)
    setEditingStageIndex(workflow.currentStageIndex)
    setEditingStatus(workflow.overallStatus)
    setEditingEditor(workflow.assignedEditor)
    setIsStatusDialogOpen(true)
  }

  // Save Status & Stage Changes — NOW PERSISTS TO DATABASE
  const handleSaveWorkflowChanges = async () => {
    if (!selectedWorkflow) return

    setSaving(true)
    try {
      // Determine the eventId for the API call
      const eventId = selectedWorkflow.eventId || selectedWorkflow.id

      // Call the backend API to persist the changes
      const result = await updateWorkflowByEvent(eventId, {
        overallStatus: editingStatus,
        currentStageIndex: editingStageIndex,
        assignedEditor: editingEditor || selectedWorkflow.assignedEditor,
      })

      if (result) {
        // API call succeeded — update local state to reflect changes
        setWorkflows((prev) =>
          prev.map((w) => {
            if ((w.eventId || w.id) !== eventId) return w
            return {
              ...w,
              currentStageIndex: editingStageIndex,
              overallStatus: editingStatus,
              assignedEditor: editingEditor || w.assignedEditor,
            }
          })
        )
        setIsStatusDialogOpen(false)
        showToast(`Workflow updated & saved to database successfully!`)
      } else {
        // API call failed — still update local state but warn user
        setWorkflows((prev) =>
          prev.map((w) => {
            if ((w.eventId || w.id) !== eventId) return w
            return {
              ...w,
              currentStageIndex: editingStageIndex,
              overallStatus: editingStatus,
              assignedEditor: editingEditor || w.assignedEditor,
            }
          })
        )
        setIsStatusDialogOpen(false)
        showToast(`⚠️ Changes saved locally but may not have persisted to database.`)
      }
    } catch (err) {
      console.error('Failed to save workflow changes:', err)
      showToast(`❌ Error saving workflow changes. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  // Quick Payment submit inside modal
  const handleRecordPayment = () => {
    const amt = parseFloat(paymentInput)
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount')
      return
    }
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id !== selectedWorkflow.id) return w
        const newPaid = w.paymentSummary.advancePaid + amt
        const newDue = Math.max(0, w.paymentSummary.totalAmount - newPaid)
        return {
          ...w,
          paymentSummary: {
            ...w.paymentSummary,
            advancePaid: newPaid,
            balanceDue: newDue,
            paymentStatus: newDue === 0 ? 'Fully Paid' : 'Partially Paid'
          }
        }
      })
    )
    setSelectedWorkflow((prev) => ({
      ...prev,
      paymentSummary: {
        ...prev.paymentSummary,
        advancePaid: prev.paymentSummary.advancePaid + amt,
        balanceDue: Math.max(0, prev.paymentSummary.totalAmount - (prev.paymentSummary.advancePaid + amt)),
        paymentStatus: Math.max(0, prev.paymentSummary.totalAmount - (prev.paymentSummary.advancePaid + amt)) === 0 ? 'Fully Paid' : 'Partially Paid'
      }
    }))
    setPaymentInput('')
    showToast(`Payment of ₹${amt.toLocaleString()} recorded!`)
  }

  // Column Templates
  const coupleBodyTemplate = (rowData) => (
    <div className="wf-table__client">
      <span className="wf-table__id-badge">{rowData.id}</span>
      <span className="wf-table__name" style={{ marginTop: '3px' }}>{rowData.clientName}</span>
      <span className="wf-table__phone">
        <i className="pi pi-phone" /> {rowData.clientPhone}
      </span>
    </div>
  )

  const eventBodyTemplate = (rowData) => (
    <div className="wf-table__event-box">
      <span className="wf-table__event-title">{rowData.eventName}</span>
      <div className="wf-table__event-meta">
        <Tag value={rowData.eventType} severity="info" rounded style={{ fontSize: '0.7rem' }} />
        <span>{rowData.eventDate ? new Date(rowData.eventDate).toLocaleDateString() : ''}</span>
      </div>
    </div>
  )

  const staffBodyTemplate = (rowData) => (
    <div className="wf-table__staff-box">
      <span>
        <strong>Photographer:</strong> {rowData.photographer}
      </span>
      <span className="text-600">
        <strong>Editor:</strong> {rowData.assignedEditor}
      </span>
    </div>
  )

  const progressBodyTemplate = (rowData) => {
    const percent = Math.round(((rowData.currentStageIndex + 1) / ALL_STAGES.length) * 100)
    const stageName = ALL_STAGES[rowData.currentStageIndex]
    return (
      <div className="wf-table__progress-box">
        <div className="wf-table__progress-info">
          <span className="text-700">{stageName}</span>
          <span className="text-primary font-bold">{percent}%</span>
        </div>
        <ProgressBar value={percent} showValue={false} style={{ height: '6px' }} />
      </div>
    )
  }

  const paymentBodyTemplate = (rowData) => {
    const { totalAmount, advancePaid, balanceDue, paymentStatus } = rowData.paymentSummary
    return (
      <div className="flex flex-column text-xs">
        <span className="font-bold text-800">Total: ₹{totalAmount.toLocaleString()}</span>
        <span className="text-green-600">Paid: ₹{advancePaid.toLocaleString()}</span>
        <span className={balanceDue > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
          Due: ₹{balanceDue.toLocaleString()}
        </span>
        <Tag
          value={paymentStatus}
          severity={balanceDue === 0 ? 'success' : 'warning'}
          style={{ fontSize: '0.65rem', marginTop: '0.2rem', width: 'fit-content' }}
        />
      </div>
    )
  }

  const statusBodyTemplate = (rowData) => {
    let severity = 'info'
    if (rowData.overallStatus === 'Completed') severity = 'success'
    if (rowData.overallStatus === 'Editing') severity = 'warning'
    if (rowData.overallStatus === 'Delivered') severity = 'success'
    return <Tag value={rowData.overallStatus} severity={severity} />
  }

  const actionBodyTemplate = (rowData) => (
    <div className="wf-table__actions" onClick={(e) => e.stopPropagation()}>
      <Button
        icon="pi pi-eye"
        rounded
        text
        severity="secondary"
        aria-label="View Status"
        tooltip="Manage Status"
        onClick={() => handleOpenStatusModal(rowData)}
      />
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Stage"
        onClick={() => handleOpenStatusModal(rowData)}
      />
      <Button
        icon="pi pi-wallet"
        rounded
        text
        severity="success"
        aria-label="Payment"
        tooltip="Record Payment"
        onClick={() => handleOpenStatusModal(rowData)}
      />
    </div>
  )

  const paginatorLeftTemplate = (
    <span className="events-paginator__count">
      Showing <strong>{filteredWorkflows.length}</strong> of {workflows.length} Workflows
    </span>
  )

  return (
    <div className="wf-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            background: '#0284c7',
            color: '#ffffff',
            padding: '12px 20px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          <i className="pi pi-check-circle" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="wf-header">
        <div>
          <h1 className="wf-header__title">Workflow Management Directory</h1>
          <p className="wf-header__sub">
            Track post-production stages, editing milestones, deliverable progress & staff assignments
          </p>
        </div>
      </div>

      {/* ─── Dashboard Metrics KPI Grid ─── */}
      <div className="wf-metrics-grid">
        <div className="wf-metric-box">
          <div>
            <div className="wf-metric-label">Total Workflows</div>
            <div className="wf-metric-num">{workflowMetrics.totalWorkflows}</div>
          </div>
          <div className="wf-metric-icon">
            <i className="pi pi-sitemap" />
          </div>
        </div>

        <div className="wf-metric-box">
          <div>
            <div className="wf-metric-label">In Progress</div>
            <div className="wf-metric-num">{workflowMetrics.inProgressCount}</div>
          </div>
          <div className="wf-metric-icon" style={{ background: '#fffbe6', color: '#d97706' }}>
            <i className="pi pi-spinner" />
          </div>
        </div>

        <div className="wf-metric-box">
          <div>
            <div className="wf-metric-label">Completed</div>
            <div className="wf-metric-num">{workflowMetrics.completedCount}</div>
          </div>
          <div className="wf-metric-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <i className="pi pi-check-circle" />
          </div>
        </div>

        <div className="wf-metric-box">
          <div>
            <div className="wf-metric-label">Avg Progress</div>
            <div className="wf-metric-num">{workflowMetrics.avgProgress}%</div>
          </div>
          <div className="wf-metric-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <i className="pi pi-chart-line" />
          </div>
        </div>
      </div>

      {/* ─── Desktop Search & Filter Toolbar ─── */}
      <div className="events-toolbar events-toolbar--desktop">
        <div className="events-toolbar__left">
          {/* Global Search */}
          <div className="events-search">
            <i className="pi pi-search events-search__icon" />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, ID, event title, staff name..."
              className="events-search__input"
            />
            {searchQuery && (
              <i
                className="pi pi-times events-search__clear"
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>

          {/* Status Dropdown Filter */}
          <Dropdown
            value={statusFilter}
            options={statusOptions}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder="Filter by Status"
            className="events-filter__dropdown"
          />

          {/* Event Type Dropdown Filter */}
          <Dropdown
            value={eventTypeFilter}
            options={eventTypeOptions}
            onChange={(e) => setEventTypeFilter(e.value)}
            placeholder="Filter by Event Type"
            className="events-filter__dropdown"
          />

          {(searchQuery || statusFilter || eventTypeFilter) && (
            <Button
              icon="pi pi-filter-slash"
              label="Reset"
              className="wf-btn-reset p-button-outlined p-button-secondary"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter(null)
                setEventTypeFilter(null)
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
            placeholder="Search workflows..."
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
        header="🔍 Filter Workflows"
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
              placeholder="Search client, ID, staff..."
            />
          </div>

          <div className="mobile-filter-field">
            <label className="mobile-filter-label">Status</label>
            <Dropdown
              value={draftStatus}
              options={statusOptions}
              onChange={(e) => setDraftStatus(e.value)}
              placeholder="Filter by Status"
              showClear
            />
          </div>

          <div className="mobile-filter-field">
            <label className="mobile-filter-label">Event Type</label>
            <Dropdown
              value={draftEventType}
              options={eventTypeOptions}
              onChange={(e) => setDraftEventType(e.value)}
              placeholder="Filter by Event Type"
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

      {/* ─── PrimeReact DataTable with Sticky Bottom Paginator (Exact Events Page System) ─── */}
      <div className="events-table-card">
        <DataTable
          value={filteredWorkflows}
          loading={loading}
          sortField="id"
          sortOrder={-1}
          paginator
          paginatorLeft={paginatorLeftTemplate}
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          responsiveLayout="scroll"
          stripedRows
          className="events-datatable"
          emptyMessage={'No matching client workflows found.'}
          onRowClick={(e) => handleOpenStatusModal(e.data)}
          selectionMode="single"
        >
          <Column field="clientName" header="Client & ID" body={coupleBodyTemplate} sortable style={{ minWidth: '180px' }} />
          <Column field="eventName" header="Event Title & Type" body={eventBodyTemplate} sortable style={{ minWidth: '220px' }} />
          <Column field="photographer" header="Assigned Staff" body={staffBodyTemplate} style={{ minWidth: '170px' }} />
          <Column header="Stage & Progress" body={progressBodyTemplate} style={{ minWidth: '180px' }} />
          <Column header="Payment Summary" body={paymentBodyTemplate} style={{ minWidth: '150px' }} />
          <Column field="overallStatus" header="Overall Status" body={statusBodyTemplate} sortable style={{ minWidth: '130px' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '120px', textAlign: 'center' }} />
        </DataTable>
      </div>

      {/* ─── Wide Spacious Workflow Status Update Dialog (Width: 950px, Polished Footer) ─── */}
      {selectedWorkflow && (
        <Dialog
          header={`Manage Workflow Status: ${selectedWorkflow.clientName} (${selectedWorkflow.id})`}
          visible={isStatusDialogOpen}
          style={{ width: '950px', maxWidth: '95vw' }}
          onHide={() => setIsStatusDialogOpen(false)}
          footer={
            <div className="flex justify-content-end gap-3">
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="wf-dialog-btn-cancel"
                onClick={() => setIsStatusDialogOpen(false)}
                disabled={saving}
              />
              <Button
                label={saving ? 'Saving...' : 'Save & Apply Changes'}
                icon={saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                className="wf-dialog-btn-save"
                onClick={handleSaveWorkflowChanges}
                disabled={saving}
              />
            </div>
          }
        >
          <div className="flex flex-column gap-3 py-1">
            {/* Compact Header Summary Card */}
            <div className="bg-surface-ground p-3 border-round-xl border-1 surface-border">
              <div className="flex align-items-center justify-content-between mb-2">
                <div className="flex align-items-center gap-2">
                  <span className="font-bold text-900 text-lg">{selectedWorkflow.eventName}</span>
                  <Tag value={selectedWorkflow.eventType} severity="info" rounded />
                </div>
                <Tag
                  value={selectedWorkflow.overallStatus}
                  severity={
                    selectedWorkflow.overallStatus === 'Completed'
                      ? 'success'
                      : selectedWorkflow.overallStatus === 'Editing'
                      ? 'warning'
                      : 'info'
                  }
                />
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-700">
                <span><strong>Phone:</strong> {selectedWorkflow.clientPhone}</span>
                <span><strong>Email:</strong> {selectedWorkflow.clientEmail}</span>
                <span><strong>Venue:</strong> {selectedWorkflow.venue}</span>
                <span><strong>Photographer:</strong> {selectedWorkflow.photographer}</span>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid">
              {/* Left Column: Stage & Progress Control */}
              <div className="col-12 md:col-6 flex flex-column gap-3">
                <div className="bg-surface-card p-3 border-round-xl border-1 surface-border">
                  <label className="block text-xs font-bold text-700 uppercase mb-2">
                    Change Workflow Stage
                  </label>
                  <Dropdown
                    value={editingStageIndex}
                    options={stageOptions}
                    onChange={(e) => setEditingStageIndex(e.value)}
                    className="w-full mb-2"
                    appendTo="self"
                  />
                  <span className="text-xs text-600 block">
                    Current Stage: <strong className="text-primary">Stage {editingStageIndex + 1} of 20 ({ALL_STAGES[editingStageIndex]})</strong>
                  </span>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="bg-surface-card p-3 border-round-xl border-1 surface-border">
                  <div className="flex justify-content-between text-xs font-semibold mb-2">
                    <span className="text-700">Overall Workflow Completion</span>
                    <span className="text-primary font-bold text-sm">
                      {Math.round(((editingStageIndex + 1) / ALL_STAGES.length) * 100)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.round(((editingStageIndex + 1) / ALL_STAGES.length) * 100)}
                    showValue={false}
                    style={{ height: '8px' }}
                  />
                  <div className="flex justify-content-between text-xs text-500 mt-2">
                    <span>Est. Delivery: {selectedWorkflow.estimatedDeliveryDate}</span>
                    <span>Target: Completed</span>
                  </div>
                </div>

                {/* Status & Staff Control */}
                <div className="bg-surface-card p-3 border-round-xl border-1 surface-border">
                  <div className="grid">
                    <div className="col-6">
                      <label className="block text-xs font-bold text-700 uppercase mb-1">Overall Status</label>
                      <Dropdown
                        value={editingStatus}
                        options={['Booking', 'Editing', 'Delivered', 'Completed']}
                        onChange={(e) => setEditingStatus(e.value)}
                        className="w-full"
                        appendTo="self"
                      />
                    </div>
                    <div className="col-6">
                      <label className="block text-xs font-bold text-700 uppercase mb-1">Assigned Editor</label>
                      <InputText
                        value={editingEditor}
                        onChange={(e) => setEditingEditor(e.target.value)}
                        placeholder="Editor Name"
                        className="w-full p-inputtext"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Financials & Fast Actions */}
              <div className="col-12 md:col-6 flex flex-column gap-3">
                {/* Financial Summary & Payment Entry */}
                <div className="bg-surface-card p-3 border-round-xl border-1 surface-border">
                  <label className="block text-xs font-bold text-700 uppercase mb-2">
                    Payment & Financial Summary
                  </label>

                  <div className="grid text-sm mb-3">
                    <div className="col-4">
                      <span className="block text-xs text-500 font-semibold">Total Cost</span>
                      <span className="font-bold text-800 text-base">₹{selectedWorkflow.paymentSummary.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="col-4">
                      <span className="block text-xs text-500 font-semibold">Advance Paid</span>
                      <span className="font-bold text-green-600 text-base">₹{selectedWorkflow.paymentSummary.advancePaid.toLocaleString()}</span>
                    </div>
                    <div className="col-4">
                      <span className="block text-xs text-500 font-semibold">Balance Due</span>
                      <span className={`font-bold text-base ${selectedWorkflow.paymentSummary.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{selectedWorkflow.paymentSummary.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {selectedWorkflow.paymentSummary.balanceDue > 0 ? (
                    <div className="flex gap-2 align-items-center pt-2 border-top-1 surface-border">
                      <InputText
                        value={paymentInput}
                        onChange={(e) => setPaymentInput(e.target.value)}
                        placeholder={`Enter payment (max ₹${selectedWorkflow.paymentSummary.balanceDue})`}
                        className="p-inputtext-sm flex-1 p-inputtext"
                      />
                      <Button
                        label="Record Payment"
                        icon="pi pi-check"
                        className="p-button-success p-button-sm"
                        onClick={handleRecordPayment}
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-green-700 font-bold bg-green-50 p-2 border-round text-center">
                      <i className="pi pi-check-circle mr-1" /> Payment Completed in Full
                    </div>
                  )}
                </div>

                {/* Quick Workflow Stage Actions */}
                <div className="bg-surface-card p-3 border-round-xl border-1 surface-border">
                  <label className="block text-xs font-bold text-700 uppercase mb-2">
                    Quick Stage Actions
                  </label>
                  <div className="flex flex-column gap-2">
                    <button
                      className="wf-btn-advance w-full"
                      onClick={() => {
                        if (editingStageIndex < ALL_STAGES.length - 1) {
                          setEditingStageIndex((prev) => prev + 1)
                          showToast('Advanced to next workflow stage!')
                        }
                      }}
                    >
                      <i className="pi pi-step-forward" /> Advance to Next Stage
                    </button>
                    <button
                      className="wf-btn-complete w-full"
                      onClick={() => {
                        setEditingStageIndex(19)
                        setEditingStatus('Completed')
                        showToast('Workflow set to Completed & Delivered!')
                      }}
                    >
                      <i className="pi pi-check-circle" /> Mark Delivered & Completed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}
