import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'

import { MOCK_EQUIPMENT_LIST } from './mockEquipmentData'
import './EquipmentTracker.css'

export default function EquipmentTracker({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory', 'assignments', 'maintenance'
  const [equipmentList, setEquipmentList] = useState(MOCK_EQUIPMENT_LIST)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)

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

  const handleAddEquipment = () => {
    if (!eqName || !eqSerial) {
      triggerToast('Equipment Name and Serial Number are required', 'error')
      return
    }

    const newEq = {
      id: `EQ-${100 + equipmentList.length + 1}`,
      name: eqName,
      category: eqCategory,
      brand: eqBrand,
      model: 'Pro Model',
      serialNo: eqSerial,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: eqPrice,
      currentValue: eqPrice,
      location: 'Studio Main Locker',
      status: 'Available',
      assignedToEvent: 'None',
      assignedDate: 'N/A',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: '2026-12-31'
    }

    setEquipmentList([newEq, ...equipmentList])
    setIsAddOpen(false)
    triggerToast(`Equipment "${newEq.name}" added to inventory!`, 'success')
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

        <div className="equipment-header__actions">
          <div className="editing-tab-toggle">
            <button
              className={`editing-tab-btn ${activeTab === 'inventory' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory ({equipmentList.length})
            </button>
            <button
              className={`editing-tab-btn ${activeTab === 'assignments' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              Event Gear Assignments
            </button>
            <button
              className={`editing-tab-btn ${activeTab === 'maintenance' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              Maintenance Alerts
            </button>
          </div>

          <Button
            label="Assign Gear to Event"
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

      {/* ── TAB 1: INVENTORY TABLE ── */}
      {activeTab === 'inventory' && (
        <>
          <div className="events-toolbar mb-3">
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
          </div>

          <div className="events-table-card">
            <DataTable value={filteredEquipment} paginator rows={5} responsiveLayout="scroll" stripedRows className="events-datatable">
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
          <DataTable value={equipmentList.filter((e) => e.status === 'Assigned')} responsiveLayout="scroll" stripedRows className="events-datatable">
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
          <DataTable value={equipmentList} responsiveLayout="scroll" stripedRows className="events-datatable">
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
