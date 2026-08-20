import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Dialog } from 'primereact/dialog'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import EventDetailDrawer from '../../components/EventDetailDrawer'
import './Events.css'

import { getEvents, deleteEvent } from '../../services/eventService'

export default function Events({ activeTab = 'events', setActiveTab, onNavigateInvoice, onNavigateEditEvent }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mobile Filter Dialog State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [draftSearch, setDraftSearch] = useState('')
  const [draftStatus, setDraftStatus] = useState(null)
  const [draftType, setDraftType] = useState(null)

  // PhotoStudio Shoots & Events Dataset
  const [initialEvents, setInitialEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    setLoading(true)
    const data = await getEvents()
    if (data && data.length > 0) {
      const mapped = data.map((evt) => {
        const clientName = evt.clientId
          ? `${evt.clientId.firstName || ''} ${evt.clientId.lastName || ''}`.trim()
          : evt.eventName || 'Client'

        const photographers = (evt.assignedPhotographers || []).map((p) => p.name || 'Photographer')
        const editors = (evt.assignedEditors || []).map((e) => e.name || 'Editor')
        const crew = [...photographers, ...editors]

        const total = evt.packageAmount || 0
        const paid = evt.totalPaid || 0
        const balance = evt.remainingAmount || Math.max(0, total - paid)
        const paymentProgress = total > 0 ? Math.round((paid / total) * 100) : 0

        let paymentStatus = 'Pending Deposit'
        if (balance === 0 && total > 0) paymentStatus = 'Paid in Full'
        else if (paid > 0) paymentStatus = 'Advance Paid'

        return {
          _id: evt._id,
          id: evt._id ? `EVT-${evt._id.slice(-4).toUpperCase()}` : `EVT-${Date.now()}`,
          couple: clientName || evt.eventName || 'Special Event',
          eventType: evt.eventType || 'Wedding Shoot',
          date: evt.eventDate ? new Date(evt.eventDate).toISOString().split('T')[0] : '',
          time: `${evt.startTime || '09:00 AM'} - ${evt.endTime || '10:00 PM'}`,
          venue: evt.venue || '',
          package: evt.package || 'Custom Package',
          totalAmount: `₹${total.toLocaleString()}`,
          paidAmount: `₹${paid.toLocaleString()}`,
          balanceAmount: `₹${balance.toLocaleString()}`,
          paymentProgress,
          paymentStatus,
          crew: crew.length > 0 ? crew : ['Lead Photographer'],
          status: evt.status || 'Confirmed',
          rawEvent: evt
        }
      })
      setInitialEvents(mapped)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  // Status Filter Options
  const statusOptions = [
    { label: 'All Statuses', value: 'All Statuses' },
    { label: 'Shooting Today', value: 'Shooting Today' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'In Post-Production', value: 'In Post-Production' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Pending Deposit', value: 'Pending Deposit' }
  ]

  // Event Type Filter Options
  const typeOptions = [
    { label: 'All Event Types', value: 'All Event Types' },
    { label: 'Wedding & Reception', value: 'Wedding & Reception' },
    { label: 'Sangeet & Mehendi', value: 'Sangeet & Mehendi' },
    { label: 'Destination Wedding', value: 'Destination Wedding' },
    { label: 'Pre-Wedding Shoot', value: 'Pre-Wedding Shoot' },
    { label: 'Gala Dinner & Cocktail', value: 'Gala Dinner & Cocktail' },
    { label: 'Haldi & Wedding Ceremony', value: 'Haldi & Wedding Ceremony' }
  ]

  // Filter Logic
  const filteredEvents = initialEvents.filter((item) => {
    const matchesGlobal =
      globalFilter === '' ||
      item.couple.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.venue.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.package.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.crew.some((c) => c.toLowerCase().includes(globalFilter.toLowerCase()))

    const matchesStatus = !selectedStatus || selectedStatus === 'All Statuses' || item.status === selectedStatus
    const matchesType = !selectedType || selectedType === 'All Event Types' || item.eventType === selectedType

    return matchesGlobal && matchesStatus && matchesType
  })

  // Mobile Filter Dialog Handlers
  const handleOpenMobileFilter = () => {
    setDraftSearch(globalFilter)
    setDraftStatus(selectedStatus)
    setDraftType(selectedType)
    setIsMobileFilterOpen(true)
  }

  const handleApplyMobileFilter = () => {
    setGlobalFilter(draftSearch)
    setSelectedStatus(draftStatus)
    setSelectedType(draftType)
    setIsMobileFilterOpen(false)
  }

  const handleResetMobileFilter = () => {
    setDraftSearch('')
    setDraftStatus(null)
    setDraftType(null)
    setGlobalFilter('')
    setSelectedStatus(null)
    setSelectedType(null)
    setIsMobileFilterOpen(false)
  }

  const activeFilterCount = (globalFilter ? 1 : 0) + (selectedStatus ? 1 : 0) + (selectedType ? 1 : 0)

  const handleRowSelect = (rowData) => {
    setSelectedDetailEvent(rowData)
    setDrawerVisible(true)
  }

  // Column Templates
  const coupleBodyTemplate = (rowData) => (
    <div className="events-table__couple">
      <span className="events-table__id">{rowData.id}</span>
      <span className="events-table__name">{rowData.couple}</span>
    </div>
  )

  const eventVenueTemplate = (rowData) => (
    <div className="events-table__venue-box">
      <span className="events-table__type">{rowData.eventType}</span>
      <span className="events-table__venue">
        <i className="pi pi-map-marker" /> {rowData.venue}
      </span>
    </div>
  )

  const dateBodyTemplate = (rowData) => (
    <div className="events-table__date-box">
      <span className="events-table__date">
        <i className="pi pi-calendar" /> {rowData.date}
      </span>
      <span className="events-table__time">{rowData.time}</span>
    </div>
  )

  const packageBodyTemplate = (rowData) => (
    <div className="events-table__pkg-box">
      <span className="events-table__pkg">{rowData.package}</span>
      <span className="events-table__amount">{rowData.amount}</span>
    </div>
  )

  const crewBodyTemplate = (rowData) => (
    <div className="events-table__crew-tags">
      {rowData.crew.map((member, idx) => (
        <span key={idx} className="events-table__crew-chip">
          {member}
        </span>
      ))}
    </div>
  )

  const paymentBodyTemplate = (rowData) => (
    <Tag value={rowData.payment} severity={rowData.paymentSeverity} rounded />
  )

  const statusBodyTemplate = (rowData) => (
    <div className="events-table__status-box">
      <Tag value={rowData.status} severity={rowData.statusSeverity} />
      <ProgressBar
        value={rowData.progress}
        showValue={false}
        style={{ height: '5px', marginTop: '6px' }}
      />
    </div>
  )

  const actionBodyTemplate = (rowData) => (
    <div className="events-table__actions" onClick={(e) => e.stopPropagation()}>
      <Button icon="pi pi-eye" rounded text severity="secondary" aria-label="View" tooltip="View Details" onClick={() => handleRowSelect(rowData)} />
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Event"
        onClick={(e) => {
          e.stopPropagation()
          if (onNavigateEditEvent) onNavigateEditEvent(rowData)
        }}
      />
      <Button
        icon="pi pi-download"
        rounded
        text
        severity="success"
        aria-label="Invoice"
        tooltip="Print Invoice"
        onClick={() => onNavigateInvoice && onNavigateInvoice(rowData)}
      />
    </div>
  )

  const paginatorLeftTemplate = (
    <span className="events-paginator__count">
      Showing <strong>{filteredEvents.length}</strong> of {initialEvents.length} Shoots
    </span>
  )

  return (
    <div className="portal-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <div className="portal-main">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="portal-body">
          {/* Header Banner */}
          <div className="events-header">
            <div>
              <h1 className="events-header__title">Events & Shoots Directory</h1>
              <p className="events-header__sub">
                Manage upcoming wedding shoots, assigned camera crew, and financial status
              </p>
            </div>

            <Button
              label="Book New Shoot"
              icon="pi pi-plus"
              className="events-header__btn-add"
              rounded
              onClick={() => {
                if (onNavigateEditEvent) onNavigateEditEvent(null)
                setActiveTab('add-event')
              }}
            />
          </div>

          {/* ─── Desktop Search & Filter Toolbar ─── */}
          <div className="events-toolbar events-toolbar--desktop">
            <div className="events-toolbar__left">
              {/* Global Search */}
              <div className="events-search">
                <i className="pi pi-search events-search__icon" />
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search by couple, venue, package, or crew..."
                  className="events-search__input"
                />
                {globalFilter && (
                  <i
                    className="pi pi-times events-search__clear"
                    onClick={() => setGlobalFilter('')}
                  />
                )}
              </div>

              {/* Status Dropdown Filter */}
              <Dropdown
                value={selectedStatus}
                options={statusOptions}
                onChange={(e) => setSelectedStatus(e.value)}
                placeholder="Filter by Status"
                showClear
                className="events-filter__dropdown"
              />

              {/* Event Type Dropdown Filter */}
              <Dropdown
                value={selectedType}
                options={typeOptions}
                onChange={(e) => setSelectedType(e.value)}
                placeholder="Filter by Event Type"
                showClear
                className="events-filter__dropdown"
              />
            </div>
          </div>

          {/* ─── Mobile Search & Filter Toolbar ─── */}
          <div className="events-toolbar events-toolbar--mobile">
            <div className="events-search">
              <i className="pi pi-search events-search__icon" />
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search events..."
                className="events-search__input"
              />
              {globalFilter && (
                <i
                  className="pi pi-times events-search__clear"
                  onClick={() => setGlobalFilter('')}
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
            header="🔍 Filter Events & Shoots"
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
                  placeholder="Search couple, venue, crew..."
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
                  value={draftType}
                  options={typeOptions}
                  onChange={(e) => setDraftType(e.value)}
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

          {/* ─── PrimeReact DataTable with Sticky Bottom Paginator ─── */}
          <div className="events-table-card">
            <DataTable
              value={filteredEvents}
              paginator
              paginatorLeft={paginatorLeftTemplate}
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              responsiveLayout="scroll"
              stripedRows
              className="events-datatable"
              emptyMessage="No matching wedding events or shoots found."
              onRowClick={(e) => handleRowSelect(e.data)}
              selectionMode="single"
            >
              <Column field="couple" header="Couple & Event ID" body={coupleBodyTemplate} sortable style={{ minWidth: '180px' }} />
              <Column field="eventType" header="Event Type & Venue" body={eventVenueTemplate} sortable style={{ minWidth: '220px' }} />
              <Column field="date" header="Date & Time" body={dateBodyTemplate} sortable style={{ minWidth: '150px' }} />
              <Column field="package" header="Package & Quote" body={packageBodyTemplate} sortable style={{ minWidth: '170px' }} />
              <Column field="crew" header="Assigned Crew" body={crewBodyTemplate} style={{ minWidth: '170px' }} />
              <Column field="payment" header="Payment" body={paymentBodyTemplate} sortable style={{ minWidth: '140px' }} />
              <Column field="status" header="Status & Progress" body={statusBodyTemplate} sortable style={{ minWidth: '160px' }} />
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '110px' }} />
            </DataTable>
          </div>
        </div>
      </div>
      <EventDetailDrawer
        event={selectedDetailEvent}
        visible={drawerVisible}
        onHide={() => setDrawerVisible(false)}
        onEdit={(evt) => {
          setDrawerVisible(false)
          if (onNavigateEditEvent) onNavigateEditEvent(evt || selectedDetailEvent)
        }}
      />
    </div>
  )
}
