import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import './ContractsDocs.css'

export default function ContractsDocs({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('contracts') // 'contracts', 'docs'
  const [contracts, setContracts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studio_contracts') || '[]') } catch { return [] }
  })
  const [documents, setDocuments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studio_documents') || '[]') } catch { return [] }
  })

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDocType, setFilterDocType] = useState(null)

  // Dialog State
  const [isContractOpen, setIsContractOpen] = useState(false)
  const [isDocOpen, setIsDocOpen] = useState(false)

  // Form
  const [cClient, setCClient] = useState('')
  const [cEvent, setCEvent] = useState('')
  const [cType, setCType] = useState('Master Wedding Agreement')
  const [cAmount, setCAmount] = useState(150000)

  const [dName, setDName] = useState('')
  const [dType, setDType] = useState('Agreement')
  const [dClient, setDClient] = useState('')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleCreateContract = () => {
    if (!cClient || !cEvent) {
      triggerToast('Client and Event names are required', 'error')
      return
    }

    const newC = {
      contractNo: `CTR-2026-${800 + contracts.length + 1}`,
      clientName: cClient,
      eventName: cEvent,
      contractType: cType,
      createdDate: new Date().toISOString().split('T')[0],
      startDate: '2026-08-20',
      endDate: '2026-08-21',
      amount: cAmount,
      status: 'Pending Signature',
      notes: 'Generated and sent to client for digital e-sign.'
    }

    setContracts([newC, ...contracts])
    setIsContractOpen(false)
    triggerToast(`Contract ${newC.contractNo} created!`, 'success')
  }

  const handleUploadDoc = () => {
    if (!dName || !dClient) {
      triggerToast('Document name and Client name are required', 'error')
      return
    }

    const newD = {
      id: `DOC-${500 + documents.length + 1}`,
      name: dName,
      type: dType,
      clientName: dClient,
      eventName: 'Studio Photography Event',
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Studio Staff',
      status: 'Verified'
    }

    setDocuments([newD, ...documents])
    setIsDocOpen(false)
    triggerToast(`Document "${newD.name}" uploaded successfully!`, 'success')
  }

  const contractStatusSeverity = (st) => {
    switch (st) {
      case 'Signed':
      case 'Active': return 'success'
      case 'Pending Signature': return 'warning'
      case 'Draft': return 'secondary'
      default: return 'info'
    }
  }

  const filteredDocs = documents.filter((d) => {
    const matchesSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !filterDocType || filterDocType === 'All Document Types' || d.type === filterDocType
    return matchesSearch && matchesType
  })

  return (
    <div className="contracts-container">
      {/* ── Page Header ── */}
      <div className="contracts-header">
        <div>
          <h1 className="contracts-header__title">Contracts, Agreements & Document Vault</h1>
          <p className="contracts-header__sub">
            Manage legal photography contracts, digital e-signatures, ID proofs, and event agreements
          </p>
        </div>

        <div className="contracts-header__actions">
          <Button
            label="New Contract"
            icon="pi pi-file-edit"
            className="p-button-primary"
            onClick={() => setIsContractOpen(true)}
          />
          <Button
            label="Upload Document"
            icon="pi pi-upload"
            className="p-button-secondary"
            onClick={() => setIsDocOpen(true)}
          />
        </div>
      </div>

      {/* ── Dedicated Studio Tab Navigation Bar ── */}
      <div className="studio-tab-bar">
        <button
          className={`studio-tab-btn ${activeTab === 'contracts' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('contracts')}
        >
          <i className="pi pi-file-edit" /> Contracts & Agreements <span className="studio-tab-badge">{contracts.length}</span>
        </button>
        <button
          className={`studio-tab-btn ${activeTab === 'docs' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <i className="pi pi-folder" /> Document Vault <span className="studio-tab-badge">{documents.length}</span>
        </button>
      </div>

      {/* ── TAB 1: CONTRACTS ── */}
      {activeTab === 'contracts' && (
        <div className="events-table-card">
          <DataTable
            value={contracts}
            paginator
            paginatorLeft={
              <span className="events-paginator__count">
                Showing <strong>{contracts.length}</strong> Contracts
              </span>
            }
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="contractNo" header="Contract #" sortable style={{ minWidth: '130px' }} />
            <Column field="clientName" header="Client" sortable style={{ minWidth: '180px' }} />
            <Column field="eventName" header="Event" style={{ minWidth: '200px' }} />
            <Column field="contractType" header="Type" style={{ minWidth: '180px' }} />
            <Column field="amount" header="Amount (₹)" body={(r) => `₹${r.amount.toLocaleString()}`} sortable style={{ minWidth: '130px' }} />
            <Column field="status" header="Signature Status" body={(r) => <Tag value={r.status} severity={contractStatusSeverity(r.status)} />} style={{ minWidth: '150px' }} />
            <Column
              header="Actions"
              body={(r) => (
                <div className="flex gap-1">
                  <Button icon="pi pi-download" rounded text tooltip="Download PDF" onClick={() => triggerToast(`Downloading ${r.contractNo}...`)} />
                  <Button icon="pi pi-print" rounded text tooltip="Print Contract" onClick={() => window.print()} />
                </div>
              )}
              style={{ minWidth: '110px' }}
            />
          </DataTable>
        </div>
      )}

      {/* ── TAB 2: DOCUMENT VAULT ── */}
      {activeTab === 'docs' && (
        <>
          <div className="events-toolbar mb-3">
            <div className="events-toolbar__left">
              <div className="events-search">
                <i className="pi pi-search events-search__icon" />
                <InputText value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search document name or client..." className="events-search__input" />
              </div>
              <Dropdown
                value={filterDocType}
                options={[
                  { label: 'All Document Types', value: 'All Document Types' },
                  { label: 'Contract', value: 'Contract' },
                  { label: 'Invoice', value: 'Invoice' },
                  { label: 'Quote', value: 'Quote' },
                  { label: 'ID Proof', value: 'ID Proof' },
                  { label: 'Agreement', value: 'Agreement' }
                ]}
                onChange={(e) => setFilterDocType(e.value)}
                placeholder="Filter Type"
                showClear
                className="events-filter__dropdown"
              />
            </div>
          </div>

          <div className="events-table-card">
            <DataTable
              value={filteredDocs}
              paginator
              paginatorLeft={
                <span className="events-paginator__count">
                  Showing <strong>{filteredDocs.length}</strong> of {documents.length} Documents
                </span>
              }
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              responsiveLayout="scroll"
              stripedRows
              className="events-datatable"
            >
              <Column field="name" header="Document Name" sortable style={{ minWidth: '250px' }} />
              <Column field="type" header="Type" body={(r) => <Tag value={r.type} severity="info" />} style={{ minWidth: '110px' }} />
              <Column field="clientName" header="Client" style={{ minWidth: '180px' }} />
              <Column field="eventName" header="Event" style={{ minWidth: '190px' }} />
              <Column field="uploadedDate" header="Uploaded Date" style={{ minWidth: '130px' }} />
              <Column field="uploadedBy" header="Uploaded By" style={{ minWidth: '140px' }} />
              <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity="success" />} style={{ minWidth: '110px' }} />
              <Column
                header="Actions"
                body={(r) => (
                  <div className="flex gap-1">
                    <Button icon="pi pi-eye" rounded text tooltip="Preview Document" onClick={() => triggerToast(`Previewing ${r.name}...`)} />
                    <Button icon="pi pi-download" rounded text tooltip="Download" onClick={() => triggerToast(`Downloading ${r.name}...`)} />
                  </div>
                )}
                style={{ minWidth: '110px' }}
              />
            </DataTable>
          </div>
        </>
      )}

      {/* ── CREATE CONTRACT DIALOG ── */}
      <Dialog
        header="Create New Legal Contract"
        visible={isContractOpen}
        style={{ width: '480px' }}
        onHide={() => setIsContractOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsContractOpen(false)} />
            <Button label="Create & Send E-Sign" icon="pi pi-check" className="p-button-primary" onClick={handleCreateContract} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Client Name *</label>
            <InputText value={cClient} onChange={(e) => setCClient(e.target.value)} placeholder="Client Name" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Event Name *</label>
            <InputText value={cEvent} onChange={(e) => setCEvent(e.target.value)} placeholder="Event Name" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Contract Type</label>
            <Dropdown value={cType} options={['Master Wedding Agreement', 'Event Photography Agreement', 'Pre-Wedding Shoot Contract']} onChange={(e) => setCType(e.value)} showClear className="w-full" />
          </div>
        </div>
      </Dialog>

      {/* ── UPLOAD DOC DIALOG ── */}
      <Dialog
        header="Upload Document to Vault"
        visible={isDocOpen}
        style={{ width: '480px' }}
        onHide={() => setIsDocOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsDocOpen(false)} />
            <Button label="Upload File" icon="pi pi-upload" className="p-button-secondary" onClick={handleUploadDoc} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Document Name *</label>
            <InputText value={dName} onChange={(e) => setDName(e.target.value)} placeholder="e.g. Client_Aadhaar_ID.pdf" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Client Name *</label>
            <InputText value={dClient} onChange={(e) => setDClient(e.target.value)} placeholder="Client Name" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Document Type</label>
            <Dropdown value={dType} options={['Contract', 'Invoice', 'Quote', 'ID Proof', 'Agreement']} onChange={(e) => setDType(e.value)} showClear className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
