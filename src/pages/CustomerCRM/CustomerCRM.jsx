import React, { useState, useMemo } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Dialog } from 'primereact/dialog'
import { ProgressBar } from 'primereact/progressbar'

import {
  MOCK_CRM_SUMMARY,
  MOCK_CUSTOMERS,
  MOCK_NOTIFICATIONS,
  MOCK_ANALYTICS_DATA
} from './mockCRMData'

import './CustomerCRM.css'

export default function CustomerCRM({ onNavigateAddEvent }) {
  // Master Customers State
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState(null)
  const [loyaltyFilter, setLoyaltyFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)

  // Tab View Mode: 'list' or 'analytics'
  const [viewMode, setViewMode] = useState('list')

  // Selected Customer for Profile View Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeProfileTab, setActiveProfileTab] = useState('overview')

  // Add Customer Modal State
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [newCustName, setNewCustName] = useState('')
  const [newCustMobile, setNewCustMobile] = useState('')
  const [newCustEmail, setNewCustEmail] = useState('')
  const [newCustCity, setNewCustCity] = useState('Bengaluru')

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Filter Options
  const cityOptions = [
    { label: 'All Cities', value: null },
    { label: 'Bengaluru', value: 'Bengaluru' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Delhi', value: 'Delhi' }
  ]

  const loyaltyOptions = [
    { label: 'All Loyalty Levels', value: null },
    { label: 'Platinum', value: 'Platinum' },
    { label: 'Gold', value: 'Gold' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Bronze', value: 'Bronze' }
  ]

  const statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ]

  // Filtered Customers List
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobile.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCity = !cityFilter || c.city === cityFilter
      const matchesLoyalty = !loyaltyFilter || c.loyaltyLevel === loyaltyFilter
      const matchesStatus = !statusFilter || c.status === statusFilter

      return matchesSearch && matchesCity && matchesLoyalty && matchesStatus
    })
  }, [customers, searchQuery, cityFilter, loyaltyFilter, statusFilter])

  // Open Profile Drawer Modal
  const handleOpenProfile = (customer) => {
    setSelectedCustomer(customer)
    setActiveProfileTab('overview')
    setIsProfileOpen(true)
  }

  // Save New Customer Form
  const handleCreateCustomer = () => {
    if (!newCustName.trim() || !newCustMobile.trim()) {
      showToast('Please enter customer name and mobile number')
      return
    }

    const newRecord = {
      id: `CRM-${1000 + customers.length + 1}`,
      name: newCustName,
      gender: 'Individual',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      mobile: newCustMobile,
      whatsapp: newCustMobile,
      email: newCustEmail || 'client@example.com',
      dob: '1995-01-01',
      anniversaryDate: '',
      address: 'Bengaluru Studio District',
      city: newCustCity,
      state: 'Karnataka',
      country: 'India',
      customerSince: new Date().toISOString().split('T')[0],
      customerType: 'New',
      loyaltyLevel: 'Bronze',
      rewardPoints: 100,
      status: 'Active',
      totalBookings: 0,
      lifetimeSpend: 0,
      lastEvent: 'None',
      upcomingEvent: 'None',
      familyInfo: { spouse: '', children: [], importantDates: [] },
      preferences: {
        traditionalPhotography: true,
        candidPhotography: true,
        cinematicVideo: true,
        droneCoverage: false,
        outdoorShoot: true,
        indoorShoot: false,
        bwEditing: false,
        brightStyle: true,
        warmTone: true,
        matteStyle: false,
        notes: 'Newly created customer account.'
      },
      eventsHistory: [],
      reminders: [],
      referrals: [],
      staffNotes: [],
      communications: [],
      documents: []
    }

    setCustomers([newRecord, ...customers])
    setIsAddCustomerOpen(false)
    setNewCustName('')
    setNewCustMobile('')
    setNewCustEmail('')
    showToast(`Customer ${newRecord.name} added successfully!`)
  }

  // Column Render Templates
  const userBodyTemplate = (rowData) => (
    <div className="crm-user-cell">
      <Avatar image={rowData.avatar} shape="circle" size="medium" />
      <div>
        <span className="crm-user__name">{rowData.name}</span>
        <span className="crm-user__id">{rowData.id}</span>
      </div>
    </div>
  )

  const contactBodyTemplate = (rowData) => (
    <div className="flex flex-column text-xs">
      <span className="font-bold text-800">
        <i className="pi pi-phone text-blue-600 mr-1" /> {rowData.mobile}
      </span>
      <span className="text-600">
        <i className="pi pi-envelope text-400 mr-1" /> {rowData.email}
      </span>
    </div>
  )

  const cityBodyTemplate = (rowData) => (
    <div className="flex flex-column text-xs">
      <span className="font-semibold text-800">{rowData.city}</span>
      <span className="text-500">Since {rowData.customerSince}</span>
    </div>
  )

  const spendBodyTemplate = (rowData) => (
    <div className="flex flex-column text-xs">
      <span className="font-bold text-900">₹{rowData.lifetimeSpend.toLocaleString()}</span>
      <span className="text-primary font-semibold">{rowData.totalBookings} Bookings</span>
    </div>
  )

  const loyaltyBodyTemplate = (rowData) => {
    const lvl = rowData.loyaltyLevel.toLowerCase()
    return (
      <span className={`loyalty-badge loyalty-badge--${lvl}`}>
        <i className="pi pi-star-fill" /> {rowData.loyaltyLevel}
      </span>
    )
  }

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={rowData.status}
      severity={rowData.status === 'Active' ? 'success' : 'secondary'}
      rounded
    />
  )

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      <Button
        icon="pi pi-user"
        rounded
        text
        severity="info"
        tooltip="View Full CRM Profile"
        onClick={() => handleOpenProfile(rowData)}
      />
      <Button
        icon="pi pi-calendar-plus"
        rounded
        text
        severity="success"
        tooltip="Book New Event"
        onClick={() => onNavigateAddEvent && onNavigateAddEvent()}
      />
    </div>
  )

  const paginatorLeftTemplate = (
    <span className="events-paginator__count">
      Showing <strong>{filteredCustomers.length}</strong> of {customers.length} Customers
    </span>
  )

  return (
    <div className="crm-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '90px',
            zIndex: 99999,
            background: '#2563eb',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          <i className="pi pi-check-circle" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Page Header Banner & View Toggle ── */}
      <div className="crm-header">
        <div>
          <h1 className="crm-header__title">Customer CRM & Relationship Management</h1>
          <p className="crm-header__sub">
            Track client profiles, lifetime bookings, birthdays, loyalty reward points, and automated reminders
          </p>
        </div>

        <div className="crm-header__actions">
          <Button
            label={viewMode === 'list' ? 'CRM Analytics' : 'Customer List'}
            icon={viewMode === 'list' ? 'pi pi-chart-bar' : 'pi pi-list'}
            className="p-button-outlined p-button-secondary"
            onClick={() => setViewMode(viewMode === 'list' ? 'analytics' : 'list')}
          />
          <Button
            label="Add Customer"
            icon="pi pi-user-plus"
            className="p-button-primary"
            onClick={() => setIsAddCustomerOpen(true)}
          />
        </div>
      </div>

      {/* ── Notifications & Birthday Alert Bar ── */}
      <div className="crm-alerts-bar">
        <span className="text-xs font-bold uppercase text-blue-900">CRM Alerts:</span>
        {MOCK_NOTIFICATIONS.map((n) => (
          <div key={n.id} className="crm-alert-item">
            <i className={n.icon} style={{ color: n.color }} />
            <span>{n.text}</span>
          </div>
        ))}
      </div>

      {/* ── Executive Dashboard Summary Cards (8 Key Metrics) ── */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Total Customers</div>
            <div className="crm-metric__val">{MOCK_CRM_SUMMARY.totalCustomers}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--blue">
            <i className="pi pi-users" />
          </div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Active Customers</div>
            <div className="crm-metric__val">{MOCK_CRM_SUMMARY.activeCustomers}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--green">
            <i className="pi pi-check-circle" />
          </div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Repeat Clients</div>
            <div className="crm-metric__val">{MOCK_CRM_SUMMARY.repeatCustomers}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--amber">
            <i className="pi pi-refresh" />
          </div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Upcoming Birthdays</div>
            <div className="crm-metric__val">{MOCK_CRM_SUMMARY.upcomingBirthdays}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--pink">
            <i className="pi pi-gift" />
          </div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Anniversaries</div>
            <div className="crm-metric__val">{MOCK_CRM_SUMMARY.upcomingAnniversaries}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--purple">
            <i className="pi pi-heart-fill" />
          </div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Pending Follow-ups</div>
            <div className="crm-metric__val">{MOCK_CRM_SUMMARY.upcomingFollowups}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--blue">
            <i className="pi pi-phone" />
          </div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Total Referrals</div>
            <div className="crm-metric__val">{MOCK_CRM_SUMMARY.totalReferrals}</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--green">
            <i className="pi pi-share-alt" />
          </div>
        </div>

        <div className="crm-metric-card">
          <div>
            <div className="crm-metric__label">Lifetime Revenue</div>
            <div className="crm-metric__val">₹{(MOCK_CRM_SUMMARY.lifetimeRevenue / 100000).toFixed(1)}L</div>
          </div>
          <div className="crm-metric__icon crm-metric__icon--amber">
            <i className="pi pi-wallet" />
          </div>
        </div>
      </div>

      {/* ── VIEW MODE 1: CUSTOMER LIST TABLE ── */}
      {viewMode === 'list' && (
        <>
          {/* Toolbar Search & Filter Controls */}
          <div className="events-toolbar">
            <div className="events-toolbar__left">
              <div className="events-search">
                <i className="pi pi-search events-search__icon" />
                <InputText
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by customer name, ID, phone, email, or city..."
                  className="events-search__input"
                />
                {searchQuery && (
                  <i
                    className="pi pi-times events-search__clear"
                    onClick={() => setSearchQuery('')}
                  />
                )}
              </div>

              <Dropdown
                value={cityFilter}
                options={cityOptions}
                onChange={(e) => setCityFilter(e.value)}
                placeholder="Filter by City"
                className="events-filter__dropdown"
              />

              <Dropdown
                value={loyaltyFilter}
                options={loyaltyOptions}
                onChange={(e) => setLoyaltyFilter(e.value)}
                placeholder="Filter by Loyalty"
                className="events-filter__dropdown"
              />

              <Dropdown
                value={statusFilter}
                options={statusOptions}
                onChange={(e) => setStatusFilter(e.value)}
                placeholder="Filter by Status"
                className="events-filter__dropdown"
              />

              {(searchQuery || cityFilter || loyaltyFilter || statusFilter) && (
                <Button
                  icon="pi pi-filter-slash"
                  label="Reset Filters"
                  className="p-button-outlined p-button-secondary p-button-sm"
                  onClick={() => {
                    setSearchQuery('')
                    setCityFilter(null)
                    setLoyaltyFilter(null)
                    setStatusFilter(null)
                  }}
                />
              )}
            </div>
          </div>

          {/* PrimeReact DataTable with Sticky Bottom Paginator */}
          <div className="crm-table-card">
            <DataTable
              value={filteredCustomers}
              paginator
              paginatorLeft={paginatorLeftTemplate}
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              responsiveLayout="scroll"
              stripedRows
              className="crm-datatable events-datatable"
              emptyMessage="No matching customer records found."
              onRowClick={(e) => handleOpenProfile(e.data)}
              selectionMode="single"
            >
              <Column field="name" header="Customer Name & ID" body={userBodyTemplate} sortable style={{ minWidth: '220px' }} />
              <Column header="Contact Info" body={contactBodyTemplate} style={{ minWidth: '200px' }} />
              <Column field="city" header="City & Joined" body={cityBodyTemplate} sortable style={{ minWidth: '150px' }} />
              <Column field="lastEvent" header="Last Booking" style={{ minWidth: '180px' }} />
              <Column field="lifetimeSpend" header="Bookings & Spend" body={spendBodyTemplate} sortable style={{ minWidth: '160px' }} />
              <Column field="loyaltyLevel" header="Loyalty Level" body={loyaltyBodyTemplate} sortable style={{ minWidth: '140px' }} />
              <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '110px' }} />
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '110px', textAlign: 'center' }} />
            </DataTable>
          </div>
        </>
      )}

      {/* ── VIEW MODE 2: CRM ANALYTICS TAB ── */}
      {viewMode === 'analytics' && (
        <div className="grid">
          {/* Monthly Customer Acquisition Chart Preview */}
          <div className="col-12 md:col-6">
            <div className="bg-surface-card p-4 border-round-xl border-1 surface-border">
              <h3 className="text-base font-bold text-900 mb-3">
                <i className="pi pi-chart-line text-blue-600 mr-2" /> New Customers Per Month (2026)
              </h3>
              <div className="flex flex-column gap-2">
                {MOCK_ANALYTICS_DATA.monthlyAcquisition.map((m) => (
                  <div key={m.month} className="flex align-items-center gap-3 text-xs">
                    <span className="w-2rem font-semibold text-700">{m.month}</span>
                    <ProgressBar value={(m.count / 30) * 100} showValue={false} style={{ height: '8px' }} className="flex-1" />
                    <span className="font-bold text-900">{m.count} Clients</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Acquisition Source */}
          <div className="col-12 md:col-6">
            <div className="bg-surface-card p-4 border-round-xl border-1 surface-border">
              <h3 className="text-base font-bold text-900 mb-3">
                <i className="pi pi-compass text-green-600 mr-2" /> Acquisition Sources
              </h3>
              <div className="flex flex-column gap-3">
                {MOCK_ANALYTICS_DATA.sources.map((s) => (
                  <div key={s.label} className="bg-surface-ground p-3 border-round-lg">
                    <div className="flex justify-content-between text-xs font-bold mb-1">
                      <span>{s.label}</span>
                      <span className="text-primary">{s.percent}%</span>
                    </div>
                    <ProgressBar value={s.percent} showValue={false} style={{ height: '6px' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FULL CUSTOMER PROFILE DETAIL MODAL (HUBSPOT STYLE) ── */}
      {selectedCustomer && (
        <Dialog
          visible={isProfileOpen}
          onHide={() => setIsProfileOpen(false)}
          style={{ width: '950px', maxWidth: '95vw' }}
          className="crm-profile-dialog"
          dismissableMask
        >
          {/* Header Card */}
          <div className="crm-profile-header">
            <div className="crm-profile-avatar-box">
              <Avatar image={selectedCustomer.avatar} size="xlarge" shape="circle" style={{ border: '3px solid #ffffff' }} />
              <div>
                <h2 className="crm-profile-name">{selectedCustomer.name}</h2>
                <p className="crm-profile-sub">
                  {selectedCustomer.id} | {selectedCustomer.city}, {selectedCustomer.state} | Client Since {selectedCustomer.customerSince}
                </p>
                <div className="flex align-items-center gap-2 mt-2">
                  <span className={`loyalty-badge loyalty-badge--${selectedCustomer.loyaltyLevel.toLowerCase()}`}>
                    <i className="pi pi-star-fill" /> {selectedCustomer.loyaltyLevel} Member
                  </span>
                  <Tag value={`${selectedCustomer.rewardPoints} Reward Points`} severity="warning" />
                  <Tag value={selectedCustomer.status} severity="success" />
                </div>
              </div>
            </div>

            <div className="flex flex-column gap-2">
              <Button
                label="Book Event"
                icon="pi pi-plus"
                className="p-button-light p-button-sm font-bold"
                onClick={() => {
                  setIsProfileOpen(false)
                  if (onNavigateAddEvent) onNavigateAddEvent()
                }}
              />
              <Button
                label="WhatsApp Message"
                icon="pi pi-whatsapp"
                className="p-button-success p-button-sm"
                onClick={() => showToast(`WhatsApp opened for ${selectedCustomer.mobile}`)}
              />
            </div>
          </div>

          {/* Profile Inner Navigation Tabs */}
          <div className="flex border-bottom-1 surface-border bg-white px-4">
            {[
              { id: 'overview', label: 'Overview & Family', icon: 'pi pi-user' },
              { id: 'events', label: `Event History (${selectedCustomer.eventsHistory.length})`, icon: 'pi pi-calendar' },
              { id: 'preferences', label: 'Photography Style', icon: 'pi pi-camera' },
              { id: 'reminders', label: 'Reminders & Referrals', icon: 'pi pi-bell' },
              { id: 'timeline', label: 'Notes & Timeline', icon: 'pi pi-clock' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`p-3 font-semibold text-xs border-none bg-transparent cursor-pointer flex align-items-center gap-2 ${
                  activeProfileTab === tab.id
                    ? 'border-bottom-2 border-primary text-primary font-bold'
                    : 'text-600 hover:text-900'
                }`}
                onClick={() => setActiveProfileTab(tab.id)}
              >
                <i className={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Overview & Family Info */}
          {activeProfileTab === 'overview' && (
            <div className="crm-tab-panel">
              <div className="grid">
                {/* Personal Info Box */}
                <div className="col-12 md:col-6">
                  <div className="bg-surface-card p-3 border-round-xl border-1 surface-border h-full">
                    <h3 className="text-xs font-bold text-700 uppercase mb-3 text-primary">
                      Personal Information
                    </h3>
                    <div className="flex flex-column gap-2 text-xs text-800">
                      <div><strong>Mobile:</strong> {selectedCustomer.mobile}</div>
                      <div><strong>WhatsApp:</strong> {selectedCustomer.whatsapp}</div>
                      <div><strong>Email:</strong> {selectedCustomer.email}</div>
                      <div><strong>Date of Birth:</strong> {selectedCustomer.dob}</div>
                      <div><strong>Anniversary Date:</strong> {selectedCustomer.anniversaryDate || 'N/A'}</div>
                      <div><strong>Address:</strong> {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}</div>
                    </div>
                  </div>
                </div>

                {/* Family Information Box */}
                <div className="col-12 md:col-6">
                  <div className="bg-surface-card p-3 border-round-xl border-1 surface-border h-full">
                    <h3 className="text-xs font-bold text-700 uppercase mb-3 text-primary">
                      Family Information & Dates
                    </h3>
                    <div className="flex flex-column gap-2 text-xs text-800">
                      <div><strong>Spouse Name:</strong> {selectedCustomer.familyInfo.spouse || 'N/A'}</div>
                      <div><strong>Children:</strong> {selectedCustomer.familyInfo.children.join(', ') || 'None'}</div>
                      <div className="mt-2 font-bold text-700">Important Family Dates:</div>
                      {selectedCustomer.familyInfo.importantDates.map((d, i) => (
                        <div key={i} className="bg-surface-ground p-2 border-round flex justify-content-between">
                          <span>{d.label}</span>
                          <span className="font-bold text-primary">{d.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Event History */}
          {activeProfileTab === 'events' && (
            <div className="crm-tab-panel">
              <DataTable value={selectedCustomer.eventsHistory} responsiveLayout="scroll" className="p-datatable-sm">
                <Column field="id" header="Event ID" />
                <Column field="type" header="Event Type" />
                <Column field="date" header="Date" />
                <Column field="package" header="Package" />
                <Column field="photographer" header="Photographer" />
                <Column field="amount" header="Amount (₹)" body={(r) => `₹${r.amount.toLocaleString()}`} />
                <Column field="paymentStatus" header="Payment" body={(r) => <Tag value={r.paymentStatus} severity="success" />} />
                <Column field="rating" header="Rating" body={(r) => '⭐'.repeat(r.rating)} />
              </DataTable>
            </div>
          )}

          {/* Tab 3: Photography Style Preferences */}
          {activeProfileTab === 'preferences' && (
            <div className="crm-tab-panel">
              <h3 className="text-xs font-bold text-700 uppercase mb-3">Customer Editing & Shooting Preferences</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`pref-chip ${selectedCustomer.preferences.traditionalPhotography ? '' : 'pref-chip--inactive'}`}>Traditional Photography</span>
                <span className={`pref-chip ${selectedCustomer.preferences.candidPhotography ? '' : 'pref-chip--inactive'}`}>Candid Photography</span>
                <span className={`pref-chip ${selectedCustomer.preferences.cinematicVideo ? '' : 'pref-chip--inactive'}`}>Cinematic 4K Video</span>
                <span className={`pref-chip ${selectedCustomer.preferences.droneCoverage ? '' : 'pref-chip--inactive'}`}>Drone Aerial Coverage</span>
                <span className={`pref-chip ${selectedCustomer.preferences.outdoorShoot ? '' : 'pref-chip--inactive'}`}>Outdoor Sunset Shoot</span>
                <span className={`pref-chip ${selectedCustomer.preferences.warmTone ? '' : 'pref-chip--inactive'}`}>Warm Tone Color Grading</span>
                <span className={`pref-chip ${selectedCustomer.preferences.brightStyle ? '' : 'pref-chip--inactive'}`}>Bright Natural Style</span>
              </div>
              <div className="bg-amber-50 p-3 border-round border-1 border-amber-200 text-xs text-amber-900">
                <strong>Studio Manager Note:</strong> "{selectedCustomer.preferences.notes}"
              </div>
            </div>
          )}

          {/* Tab 4: Reminders & Referrals */}
          {activeProfileTab === 'reminders' && (
            <div className="crm-tab-panel">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <h3 className="text-xs font-bold text-700 uppercase mb-2">Automated Reminders</h3>
                  {selectedCustomer.reminders.map((r) => (
                    <div key={r.id} className="bg-surface-card p-3 border-round-lg border-1 surface-border mb-2 text-xs">
                      <div className="flex justify-content-between font-bold mb-1">
                        <span>{r.type}</span>
                        <Tag value={r.status} severity="warning" />
                      </div>
                      <div className="text-600 mb-2">{r.note}</div>
                      <Button label="Send Wish" icon="pi pi-send" className="p-button-xs p-button-outlined" onClick={() => showToast('Notification sent!')} />
                    </div>
                  ))}
                </div>

                <div className="col-12 md:col-6">
                  <h3 className="text-xs font-bold text-700 uppercase mb-2">Referrals Tracked</h3>
                  {selectedCustomer.referrals.map((ref) => (
                    <div key={ref.id} className="bg-surface-card p-3 border-round-lg border-1 surface-border mb-2 text-xs">
                      <div className="font-bold text-900">{ref.name}</div>
                      <div className="text-500">{ref.mobile}</div>
                      <div className="mt-1 flex justify-content-between align-items-center">
                        <Tag value={ref.status} severity="info" />
                        <span className="font-bold text-green-600">{ref.bonus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Notes & Timeline */}
          {activeProfileTab === 'timeline' && (
            <div className="crm-tab-panel">
              <h3 className="text-xs font-bold text-700 uppercase mb-3">Communication Timeline</h3>
              <div className="flex flex-column gap-3">
                {selectedCustomer.communications.map((c) => (
                  <div key={c.id} className="bg-surface-card p-3 border-round-lg border-1 surface-border text-xs">
                    <div className="flex justify-content-between font-bold text-primary mb-1">
                      <span><i className="pi pi-comments mr-1" /> {c.type}</span>
                      <span className="text-500 font-normal">{c.date}</span>
                    </div>
                    <div className="text-700">{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Dialog>
      )}

      {/* ── ADD NEW CUSTOMER DIALOG ── */}
      <Dialog
        header="Add New CRM Customer Record"
        visible={isAddCustomerOpen}
        style={{ width: '500px' }}
        onHide={() => setIsAddCustomerOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsAddCustomerOpen(false)} />
            <Button label="Save Customer" icon="pi pi-check" className="p-button-primary" onClick={handleCreateCustomer} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Customer / Couple Name *</label>
            <InputText
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              placeholder="e.g. Sathish & Priya Kumar"
              className="w-full p-inputtext"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Mobile Number *</label>
            <InputText
              value={newCustMobile}
              onChange={(e) => setNewCustMobile(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full p-inputtext"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Email Address</label>
            <InputText
              value={newCustEmail}
              onChange={(e) => setNewCustEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full p-inputtext"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">City</label>
            <InputText
              value={newCustCity}
              onChange={(e) => setNewCustCity(e.target.value)}
              className="w-full p-inputtext"
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
