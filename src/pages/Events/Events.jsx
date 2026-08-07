import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import './Events.css'

export default function Events({ activeTab, setActiveTab }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  // Comprehensive PhotoStudio Shoots & Events Dataset
  const initialEvents = [
    {
      id: 'EVT-2026-001',
      couple: 'Sophia & James Sterling',
      eventType: 'Wedding & Reception',
      date: '2026-08-12',
      time: '08:00 AM - 11:00 PM',
      venue: 'The Grand Chateau, Napa Valley',
      package: 'Royal Cinematic 4K',
      amount: '₹8,50,000',
      crew: ['Alex V. (Lead)', 'Marco K. (Drone)', 'Maya S. (2nd)'],
      payment: 'Paid in Full',
      paymentSeverity: 'success',
      status: 'Shooting Today',
      statusSeverity: 'danger',
      progress: 10
    },
    {
      id: 'EVT-2026-002',
      couple: 'Priya & Rohan Sharma',
      eventType: 'Sangeet & Mehendi',
      date: '2026-08-15',
      time: '04:00 PM - 01:00 AM',
      venue: 'The Ritz Carlton Ballroom, Mumbai',
      package: 'Heritage Multi-Day Gold',
      amount: '₹6,20,000',
      crew: ['Elena R. (Lead)', 'David P. (Video)'],
      payment: 'Deposit Paid (50%)',
      paymentSeverity: 'info',
      status: 'Confirmed',
      statusSeverity: 'info',
      progress: 20
    },
    {
      id: 'EVT-2026-003',
      couple: 'Olivia & Liam Vance',
      eventType: 'Destination Wedding',
      date: '2026-08-04',
      time: '10:00 AM - 10:00 PM',
      venue: 'Sunset Cove Resort, Miami',
      package: 'Destination Luxe Film',
      amount: '₹12,00,000',
      crew: ['Alex V. (Lead)', 'Sarah L. (Colorist)'],
      payment: 'Paid in Full',
      paymentSeverity: 'success',
      status: 'In Post-Production',
      statusSeverity: 'warning',
      progress: 75
    },
    {
      id: 'EVT-2026-004',
      couple: 'Emma & Benjamin Hayes',
      eventType: 'Pre-Wedding Shoot',
      date: '2026-07-28',
      time: '06:00 AM - 02:00 PM',
      venue: 'Royal Botanical Gardens',
      package: 'Classic Memories',
      amount: '₹3,50,000',
      crew: ['Maya S. (Lead)'],
      payment: 'Paid in Full',
      paymentSeverity: 'success',
      status: 'Delivered',
      statusSeverity: 'success',
      progress: 100
    },
    {
      id: 'EVT-2026-005',
      couple: 'Chloe & Nathaniel Dupont',
      eventType: 'Gala Dinner & Cocktail',
      date: '2026-08-22',
      time: '06:00 PM - 12:00 AM',
      venue: 'Belmond Villa San Michele',
      package: 'Signature Cinema + Album',
      amount: '₹5,80,000',
      crew: ['Elena R. (Lead)', 'Marco K. (Drone)'],
      payment: 'Deposit Due',
      paymentSeverity: 'danger',
      status: 'Pending Deposit',
      statusSeverity: 'danger',
      progress: 0
    },
    {
      id: 'EVT-2026-006',
      couple: 'Aarav & Ananya Mehta',
      eventType: 'Haldi & Wedding Ceremony',
      date: '2026-08-28',
      time: '07:00 AM - 09:00 PM',
      venue: 'Umaid Bhawan Palace, Jodhpur',
      package: 'Royal Cinematic 4K',
      amount: '₹14,50,000',
      crew: ['Alex V. (Lead)', 'David P. (Video)', 'Marco K. (Drone)'],
      payment: 'Deposit Paid (60%)',
      paymentSeverity: 'info',
      status: 'Confirmed',
      statusSeverity: 'info',
      progress: 30
    },
    {
      id: 'EVT-2026-007',
      couple: 'Isabella & Lucas Rossi',
      eventType: 'Engagement & Couple Portraits',
      date: '2026-09-02',
      time: '03:00 PM - 08:00 PM',
      venue: 'Lake Como Villa D\'Este',
      package: 'Classic Memories',
      amount: '₹4,00,000',
      crew: ['Maya S. (Lead)'],
      payment: 'Paid in Full',
      paymentSeverity: 'success',
      status: 'Confirmed',
      statusSeverity: 'info',
      progress: 15
    }
  ]

  // Status Filter Options
  const statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Shooting Today', value: 'Shooting Today' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'In Post-Production', value: 'In Post-Production' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Pending Deposit', value: 'Pending Deposit' }
  ]

  // Event Type Filter Options
  const typeOptions = [
    { label: 'All Event Types', value: null },
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

    const matchesStatus = !selectedStatus || item.status === selectedStatus
    const matchesType = !selectedType || item.eventType === selectedType

    return matchesGlobal && matchesStatus && matchesType
  })

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

  const actionBodyTemplate = () => (
    <div className="events-table__actions">
      <Button icon="pi pi-eye" rounded text severity="secondary" aria-label="View" />
      <Button icon="pi pi-pencil" rounded text severity="info" aria-label="Edit" />
      <Button icon="pi pi-download" rounded text severity="success" aria-label="Invoice" />
    </div>
  )

  const paginatorLeftTemplate = (
    <span className="events-paginator__count">
      Showing <strong>{filteredEvents.length}</strong> of {initialEvents.length} Shoots
    </span>
  )

  return (
    <div className="portal-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="portal-main">
        <DashboardHeader />

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
            />
          </div>

          {/* ─── Search & Filter Toolbar ─── */}
          <div className="events-toolbar">
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
                className="events-filter__dropdown"
              />

              {/* Event Type Dropdown Filter */}
              <Dropdown
                value={selectedType}
                options={typeOptions}
                onChange={(e) => setSelectedType(e.value)}
                placeholder="Filter by Event Type"
                className="events-filter__dropdown"
              />
            </div>
          </div>

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
    </div>
  )
}
