import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'

import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from '../../services/equipmentService'
import PageLoader from '../../components/PageLoader/PageLoader'
import './EquipmentTracker.css'

export default function EquipmentTracker({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory', 'assignments', 'maintenance'
  const [equipmentList, setEquipmentList] = useState([])
  const [loading, setLoading] = useState(true)

  const loadEquipment = async () => {
    setLoading(true)
    const data = await getEquipment()
    if (data && data.length > 0) {
      const mapped = data.map((eq) => ({
        _id: eq._id,
        id: eq._id ? `EQ-${eq._id.slice(-4).toUpperCase()}` : `EQ-${Date.now()}`,
        name: eq.name || 'Equipment Item',
        category: eq.category || 'Camera',
        brand: eq.brand || 'Sony',
        model: eq.model || 'Standard',
        serialNo: eq.serialNumber || '',
        status: eq.availability || 'Available',
        condition: eq.condition || 'Good',
        assignedTo: eq.assignedTo ? eq.assignedTo.name : 'Unassigned',
        purchasePrice: eq.purchasePrice || 0,
        currentValue: eq.purchasePrice || 0,
        lastMaintenance: eq.lastMaintenanceDate ? new Date(eq.lastMaintenanceDate).toISOString().split('T')[0] : '',
        assignedToEvent: 'None',
        assignedDate: 'N/A'
      }))
      mapped.sort((a, b) => String(b._id || b.id).localeCompare(String(a._id || a.id)))
      setEquipmentList(mapped)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadEquipment()
  }, [])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)

  // Mobile Filter Dialog State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [draftSearch, setDraftSearch] = useState('')
  const [draftCategory, setDraftCategory] = useState(null)
  const [draftStatus, setDraftStatus] = useState(null)

  const handleOpenMobileFilter = () => {
    setDraftSearch(searchQuery)
    setDraftCategory(filterCategory)
    setDraftStatus(filterStatus)
    setIsMobileFilterOpen(true)
  }

  const handleApplyMobileFilter = () => {
    setSearchQuery(draftSearch)
    setFilterCategory(draftCategory)
    setFilterStatus(draftStatus)
    setIsMobileFilterOpen(false)
  }

  const handleResetMobileFilter = () => {
    setDraftSearch('')
    setDraftCategory(null)
    setDraftStatus(null)
    setSearchQuery('')
    setFilterCategory(null)
    setFilterStatus(null)
    setIsMobileFilterOpen(false)
  }

  const activeFilterCount = (searchQuery ? 1 : 0) + (filterCategory ? 1 : 0) + (filterStatus ? 1 : 0)


  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [selectedEq, setSelectedEq] = useState(null)

  // Add Form
  const [eqName, setEqName] = useState('')
  const [eqCategory, setEqCategory] = useState('Camera')
  const [eqBrand, setEqBrand] = useState('Sony')
  const [eqSerial, setEqSerial] = useState('')
  const [eqPrice, setEqPrice] = useState(150000)

  // Assign Form
  const [assignEqId, setAssignEqId] = useState('')
  const [assignEvent, setAssignEvent] = useState('')
  const [assignDate, setAssignDate] = useState('2026-08-12')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleAddEquipment = async () => {
    if (!eqName || !eqSerial) {
      triggerToast('Equipment Name and Serial Number are required', 'error')
      return
    }

    const result = await createEquipment({
      name: eqName,
      category: eqCategory,
      brand: eqBrand,
      model: 'Pro Model',
      serialNumber: eqSerial,
      purchasePrice: eqPrice,
      condition: 'Good',
      availability: 'Available'
    })

    if (result) {
      await loadEquipment()
      setIsAddOpen(false)
      triggerToast(`Equipment "${eqName}" added to inventory & saved!`, 'success')
    } else {
      triggerToast('Failed to save equipment. Please try again.', 'error')
    }
  }

  const handleAssignEquipment = () => {
    if (!assignEqId || !assignEvent) {
      triggerToast('Equipment item and Event name are required', 'error')
      return
    }

    const item = equipmentList.find((e) => e.id === assignEqId)
    if (item) {
      // Conflict Check
      if (item.status === 'Assigned' && item.assignedDate === assignDate) {
        alert(`⚠️ EQUIPMENT CONFLICT DETECTED!\n\n"${item.name}" is already assigned to "${item.assignedToEvent}" on ${item.assignedDate}.`)
        triggerToast(`Equipment conflict detected for ${item.name}!`, 'error')
        return
      }

      setEquipmentList((prev) =>
        prev.map((e) =>
          e.id === assignEqId
            ? {
                ...e,
                status: 'Assigned',
                assignedToEvent: assignEvent,
                assignedDate: assignDate
              }
            : e
        )
      )
      triggerToast(`"${item.name}" assigned to "${assignEvent}"!`, 'success')
      setIsAssignOpen(false)
    }
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Available': return 'success'
      case 'Assigned': return 'info'
      case 'In Use': return 'primary'
      case 'Maintenance': return 'warning'
      case 'Damaged': return 'danger'
      default: return 'secondary'
    }
  }

  const filteredEquipment = equipmentList.filter((e) => {
    const matchesSearch = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.serialNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = !filterCategory || filterCategory === 'All Categories' || e.category === filterCategory
    const matchesStat = !filterStatus || filterStatus === 'All Statuses' || e.status === filterStatus
    return matchesSearch && matchesCat && matchesStat
  })

  return (
    <div className="equipment-container">
      {/* ── Page Header ── */}
      <div className="equipment-header">
        <div>
          <h1 className="equipment-header__title">Studio Equipment Tracker & Asset Vault</h1>
          <p className="equipment-header__sub">
            Track gear inventory, camera/lens serials, event kit assignments, and maintenance schedules
          </p>
        </div>
      </div>

      {/* ── Dedicated Studio Tab Navigation Bar ── */}
      <div className="studio-tab-bar">
        <button
          className={`studio-tab-btn ${activeTab === 'inventory' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <i className="pi pi-desktop" /> Inventory <span className="studio-tab-badge">{equipmentList.length}</span>
        </button>
        <button
          className={`studio-tab-btn ${activeTab === 'assignments' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <i className="pi pi-calendar-plus" /> Event Gear Assignments
        </button>
        <button
          className={`studio-tab-btn ${activeTab === 'maintenance' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <i className="pi pi-exclamation-triangle" /> Maintenance Alerts
        </button>
      </div>

      {/* ── TAB 1: INVENTORY TABLE ── */}
      {activeTab === 'inventory' && (
        <>
          {/* ─── Desktop Search & Filter Toolbar ─── */}
          <div className="events-toolbar events-toolbar--desktop">
            <div className="events-toolbar__left">
              <div className="events-search">
                <i className="pi pi-search events-search__icon" />
                <InputText value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search gear name, serial #..." className="events-search__input" />
              </div>
              <Dropdown
                value={filterCategory}
                options={[
                  { label: 'All Categories', value: 'All Categories' },
                  { label: 'Camera', value: 'Camera' },
                  { label: 'Lens', value: 'Lens' },
                  { label: 'Flash', value: 'Flash' },
                  { label: 'Drone', value: 'Drone' },
                  { label: 'Gimbal', value: 'Gimbal' }
                ]}
                onChange={(e) => setFilterCategory(e.value)}
                placeholder="Category"
                showClear
                className="events-filter__dropdown"
              />
              <Dropdown
                value={filterStatus}
                options={[
                  { label: 'All Statuses', value: 'All Statuses' },
                  { label: 'Available', value: 'Available' },
                  { label: 'Assigned', value: 'Assigned' },
                  { label: 'Maintenance', value: 'Maintenance' }
                ]}
                onChange={(e) => setFilterStatus(e.value)}
                placeholder="Status"
                showClear
                className="events-filter__dropdown"
              />
            </div>

            <div className="events-toolbar__right">
              <Button
                label="Assign Gear"
                icon="pi pi-box"
                className="p-button-secondary"
                onClick={() => setIsAssignOpen(true)}
              />
              <Button
                label="Add Equipment"
                icon="pi pi-plus"
                className="p-button-primary"
                onClick={() => setIsAddOpen(true)}
              />
            </div>
          </div>

          {/* ─── Mobile Search & Filter Toolbar ─── */}
          <div className="events-toolbar events-toolbar--mobile">
            <div className="events-search">
              <i className="pi pi-search events-search__icon" />
              <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
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
            header="🔍 Filter Equipment Inventory"
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
                  placeholder="Search gear name, serial #..."
                />
              </div>

              <div className="mobile-filter-field">
                <label className="mobile-filter-label">Category</label>
                <Dropdown
                  value={draftCategory}
                  options={[
                    { label: 'All Categories', value: 'All Categories' },
                    { label: 'Camera', value: 'Camera' },
                    { label: 'Lens', value: 'Lens' },
                    { label: 'Flash', value: 'Flash' },
                    { label: 'Drone', value: 'Drone' },
                    { label: 'Gimbal', value: 'Gimbal' }
                  ]}
                  onChange={(e) => setDraftCategory(e.value)}
                  placeholder="Category"
                  showClear
                />
              </div>

              <div className="mobile-filter-field">
                <label className="mobile-filter-label">Status</label>
                <Dropdown
                  value={draftStatus}
                  options={[
                    { label: 'All Statuses', value: 'All Statuses' },
                    { label: 'Available', value: 'Available' },
                    { label: 'Assigned', value: 'Assigned' },
                    { label: 'Maintenance', value: 'Maintenance' }
                  ]}
                  onChange={(e) => setDraftStatus(e.value)}
                  placeholder="Status"
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


          <div className="events-table-card">
            <DataTable
              value={filteredEquipment}
              loading={loading}
              sortField="id"
              sortOrder={-1}
              paginator
              paginatorLeft={
                <span className="events-paginator__count">
                  Showing <strong>{filteredEquipment.length}</strong> of {equipmentList.length} Gear Items
                </span>
              }
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              responsiveLayout="scroll"
              stripedRows
              className="events-datatable"
            >
              <Column field="id" header="Tag ID" sortable style={{ minWidth: '100px' }} />
              <Column field="name" header="Equipment Name & Model" sortable style={{ minWidth: '220px' }} />
              <Column field="category" header="Category" body={(r) => <Tag value={r.category} severity="info" />} style={{ minWidth: '120px' }} />
              <Column field="serialNo" header="Serial Number" style={{ minWidth: '150px' }} />
              <Column field="location" header="Location" style={{ minWidth: '160px' }} />
              <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={statusSeverity(r.status)} />} style={{ minWidth: '120px' }} />
              <Column field="assignedToEvent" header="Assigned Event" style={{ minWidth: '200px' }} />
            </DataTable>
          </div>
        </>
      )}

      {/* ── TAB 2: ASSIGNMENTS ── */}
      {activeTab === 'assignments' && (
        <div className="events-table-card">
          <DataTable
            value={equipmentList.filter((e) => e.status === 'Assigned')}
            loading={loading}
            sortField="id"
            sortOrder={-1}
            paginator
            paginatorLeft={
              <span className="events-paginator__count">
                Showing <strong>{equipmentList.filter((e) => e.status === 'Assigned').length}</strong> Assigned Items
              </span>
            }
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="name" header="Equipment Item" style={{ minWidth: '220px' }} />
            <Column field="assignedToEvent" header="Assigned Event" style={{ minWidth: '220px' }} />
            <Column field="assignedDate" header="Shoot Date" style={{ minWidth: '120px' }} />
            <Column field="location" header="Current Location" style={{ minWidth: '180px' }} />
          </DataTable>
        </div>
      )}

      {/* ── TAB 3: MAINTENANCE ALERTS ── */}
      {activeTab === 'maintenance' && (
        <div className="events-table-card">
          <DataTable
            value={equipmentList}
            loading={loading}
            sortField="id"
            sortOrder={-1}
            paginator
            paginatorLeft={
              <span className="events-paginator__count">
                Showing <strong>{equipmentList.length}</strong> Gear Items
              </span>
            }
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="name" header="Equipment Item" style={{ minWidth: '220px' }} />
            <Column field="lastMaintenance" header="Last Service" style={{ minWidth: '130px' }} />
            <Column field="nextMaintenance" header="Next Service Due" body={(r) => <span className="font-bold text-amber-600">{r.nextMaintenance}</span>} style={{ minWidth: '140px' }} />
            <Column field="status" header="Current Status" body={(r) => <Tag value={r.status} severity={statusSeverity(r.status)} />} style={{ minWidth: '130px' }} />
          </DataTable>
        </div>
      )}

      {/* ── ADD EQUIPMENT DIALOG ── */}
      <Dialog
        header="Add Equipment to Studio Inventory"
        visible={isAddOpen}
        style={{ width: '480px' }}
        onHide={() => setIsAddOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsAddOpen(false)} />
            <Button label="Save Equipment" icon="pi pi-check" className="p-button-primary" onClick={handleAddEquipment} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Equipment Name *</label>
            <InputText value={eqName} onChange={(e) => setEqName(e.target.value)} placeholder="e.g. Sony A7 IV Body #2" className="w-full" />
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Category</label>
              <Dropdown value={eqCategory} options={['Camera', 'Lens', 'Flash', 'Drone', 'Gimbal', 'Light', 'Tripod']} onChange={(e) => setEqCategory(e.value)} showClear className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-bold mb-1">Brand</label>
              <InputText value={eqBrand} onChange={(e) => setEqBrand(e.target.value)} placeholder="Sony / Canon / Godox" className="w-full" />
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">Serial Number *</label>
            <InputText value={eqSerial} onChange={(e) => setEqSerial(e.target.value)} placeholder="SN-981247" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Purchase Price (₹)</label>
            <InputNumber value={eqPrice} onValueChange={(e) => setEqPrice(e.value)} className="w-full" />
          </div>
        </div>
      </Dialog>

      {/* ── ASSIGN EQUIPMENT DIALOG WITH CONFLICT CHECK ── */}
      <Dialog
        header="Assign Equipment Kit to Event"
        visible={isAssignOpen}
        style={{ width: '480px' }}
        onHide={() => setIsAssignOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsAssignOpen(false)} />
            <Button label="Assign Gear" icon="pi pi-check" className="p-button-secondary" onClick={handleAssignEquipment} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Select Equipment Item (Conflict Check Enabled)</label>
            <Dropdown value={assignEqId} options={equipmentList.map((e) => ({ label: `${e.name} (${e.serialNo}) [${e.status}]`, value: e.id }))} onChange={(e) => setAssignEqId(e.value)} placeholder="Choose Gear Item" showClear className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Event Name *</label>
            <InputText value={assignEvent} onChange={(e) => setAssignEvent(e.target.value)} placeholder="e.g. Sophia & James Wedding" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Shoot Date</label>
            <InputText value={assignDate} onChange={(e) => setAssignDate(e.target.value)} placeholder="2026-08-12" className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
