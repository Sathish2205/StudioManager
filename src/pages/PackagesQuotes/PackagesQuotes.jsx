import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'

import {
  MOCK_PACKAGES,
  MOCK_ADDONS,
  MOCK_QUOTES
} from './mockPackagesData'
import './PackagesQuotes.css'

export default function PackagesQuotes({ onShowToast, onNavigateAddEvent }) {
  const [activeTab, setActiveTab] = useState('packages') // 'packages', 'addons', 'quotes'
  const [packages, setPackages] = useState(MOCK_PACKAGES)
  const [addons, setAddons] = useState(MOCK_ADDONS)
  const [quotes, setQuotes] = useState(MOCK_QUOTES)

  // Dialog State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [qClient, setQClient] = useState('')
  const [qEvent, setQEvent] = useState('')
  const [qAmount, setQAmount] = useState(150000)

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleCreateQuote = () => {
    if (!qClient || !qEvent) {
      triggerToast('Client name and Event name are required', 'error')
      return
    }

    const tax = Math.round(qAmount * 0.18)
    const newQ = {
      quoteNo: `QUO-2026-${100 + quotes.length + 1}`,
      clientName: qClient,
      eventName: qEvent,
      packageName: 'Premium Wedding Package',
      addOns: ['4K Drone Aerial Coverage'],
      subtotal: qAmount,
      discount: 0,
      tax: tax,
      total: qAmount + tax,
      validUntil: '2026-09-15',
      status: 'Sent'
    }

    setQuotes([newQ, ...quotes])
    setIsQuoteOpen(false)
    triggerToast(`Quote ${newQ.quoteNo} created and sent to client!`, 'success')
  }

  const handleConvertQuoteToEvent = (quote) => {
    triggerToast(`Quotation ${quote.quoteNo} converted into Event "${quote.eventName}"!`, 'success')
    if (onNavigateAddEvent) onNavigateAddEvent()
  }

  const quoteStatusSeverity = (st) => {
    switch (st) {
      case 'Approved': return 'success'
      case 'Sent': return 'warning'
      case 'Viewed': return 'info'
      case 'Rejected': return 'danger'
      default: return 'secondary'
    }
  }

  return (
    <div className="packages-container">
      {/* ── Page Header ── */}
      <div className="packages-header">
        <div>
          <h1 className="packages-header__title">Packages, Add-ons & Quotations</h1>
          <p className="packages-header__sub">
            Manage photo studio service bundles, equipment add-ons, and client quotation proposals
          </p>
        </div>

        <div className="packages-header__actions">
          <Button
            label="Create Quotation"
            icon="pi pi-file-edit"
            className="p-button-primary"
            onClick={() => setIsQuoteOpen(true)}
          />
        </div>
      </div>

      {/* ── Dedicated Studio Tab Navigation Bar ── */}
      <div className="studio-tab-bar">
        <button
          className={`studio-tab-btn ${activeTab === 'packages' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          <i className="pi pi-box" /> Studio Packages
        </button>
        <button
          className={`studio-tab-btn ${activeTab === 'addons' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('addons')}
        >
          <i className="pi pi-tags" /> Service Add-ons
        </button>
        <button
          className={`studio-tab-btn ${activeTab === 'quotes' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          <i className="pi pi-file-edit" /> Client Quotes <span className="studio-tab-badge">{quotes.length}</span>
        </button>
      </div>

      {/* ── TAB 1: PACKAGES GRID ── */}
      {activeTab === 'packages' && (
        <div className="grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="col-12 md:col-4">
              <div className="package-card">
                <div className="flex justify-content-between align-items-center mb-2">
                  <span className="text-xs font-bold text-600">{pkg.id}</span>
                  <Tag value={pkg.duration} severity="info" />
                </div>

                <h3 className="text-lg font-bold text-900 mb-1">{pkg.name}</h3>
                <div className="text-2xl font-bold text-primary mb-3">₹{pkg.price.toLocaleString()}</div>

                <p className="text-xs text-600 mb-3">{pkg.description}</p>

                <div className="bg-surface-ground p-3 border-round-lg text-xs mb-4">
                  <div className="font-bold text-700 mb-2">Included Deliverables:</div>
                  <ul className="pl-3 m-0 flex flex-column gap-1">
                    {pkg.deliverables.map((item, i) => (
                      <li key={i} className="text-800">
                        <i className="pi pi-check text-green-600 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 text-xs font-semibold text-600 mb-4">
                  <span>📷 {pkg.photographers} Photographers</span>
                  <span>•</span>
                  <span>🎥 {pkg.videographers} Videographers</span>
                </div>

                <Button
                  label="Create Quote With Package"
                  icon="pi pi-plus"
                  className="p-button-outlined p-button-sm w-full"
                  onClick={() => {
                    setQAmount(pkg.price)
                    setIsQuoteOpen(true)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: ADD-ONS TABLE ── */}
      {activeTab === 'addons' && (
        <div className="events-table-card">
          <DataTable
            value={addons}
            paginator
            paginatorLeft={
              <span className="events-paginator__count">
                Showing <strong>{addons.length}</strong> of {MOCK_ADDONS.length} Add-ons
              </span>
            }
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="id" header="Add-on ID" style={{ minWidth: '100px' }} />
            <Column field="name" header="Add-on Service Name" sortable style={{ minWidth: '220px' }} />
            <Column field="description" header="Description" style={{ minWidth: '250px' }} />
            <Column field="price" header="Price (₹)" body={(r) => `₹${r.price.toLocaleString()}`} sortable style={{ minWidth: '130px' }} />
            <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity="success" />} style={{ minWidth: '110px' }} />
          </DataTable>
        </div>
      )}

      {/* ── TAB 3: QUOTATIONS TABLE ── */}
      {activeTab === 'quotes' && (
        <div className="events-table-card">
          <DataTable
            value={quotes}
            paginator
            paginatorLeft={
              <span className="events-paginator__count">
                Showing <strong>{quotes.length}</strong> of {MOCK_QUOTES.length} Client Quotes
              </span>
            }
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            responsiveLayout="scroll"
            stripedRows
            className="events-datatable"
          >
            <Column field="quoteNo" header="Quote #" sortable style={{ minWidth: '130px' }} />
            <Column field="clientName" header="Client" sortable style={{ minWidth: '180px' }} />
            <Column field="eventName" header="Event" style={{ minWidth: '220px' }} />
            <Column field="total" header="Total (₹)" body={(r) => `₹${r.total.toLocaleString()}`} sortable style={{ minWidth: '130px' }} />
            <Column field="validUntil" header="Valid Until" style={{ minWidth: '120px' }} />
            <Column field="status" header="Status" body={(r) => <Tag value={r.status} severity={quoteStatusSeverity(r.status)} />} style={{ minWidth: '120px' }} />
            <Column
              header="Actions"
              body={(r) => (
                <div className="flex gap-1">
                  {r.status === 'Approved' && (
                    <Button
                      label="Convert to Event"
                      icon="pi pi-calendar-plus"
                      className="p-button-xs p-button-success"
                      onClick={() => handleConvertQuoteToEvent(r)}
                    />
                  )}
                  <Button
                    icon="pi pi-send"
                    rounded
                    text
                    tooltip="Send Quote to Client"
                    onClick={() => triggerToast(`Quote ${r.quoteNo} sent to client via WhatsApp/Email!`)}
                  />
                </div>
              )}
              style={{ minWidth: '190px' }}
            />
          </DataTable>
        </div>
      )}

      {/* ── CREATE QUOTATION DIALOG ── */}
      <Dialog
        header="Create Client Quotation Proposal"
        visible={isQuoteOpen}
        style={{ width: '480px' }}
        onHide={() => setIsQuoteOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsQuoteOpen(false)} />
            <Button label="Generate & Send" icon="pi pi-check" className="p-button-primary" onClick={handleCreateQuote} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Client Name *</label>
            <InputText value={qClient} onChange={(e) => setQClient(e.target.value)} placeholder="e.g. Arun & Priya" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Event Name *</label>
            <InputText value={qEvent} onChange={(e) => setQEvent(e.target.value)} placeholder="e.g. Arun & Priya Wedding" className="w-full" />
          </div>
          <div>
            <label className="block font-bold mb-1">Base Package Price (₹)</label>
            <InputNumber value={qAmount} onValueChange={(e) => setQAmount(e.value)} className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
