import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { getClients } from '../../services/clientService'
import { getEvents } from '../../services/eventService'
import { getPackages } from '../../services/packageService'
import { createQuotation, updateQuotation } from '../../services/quotationService'
import './CreateQuotation.css'

export default function CreateQuotation({ onShowToast, onNavigateBack, onNavigateDetail, initialPackage, quotationToEdit }) {
  const [clients, setClients] = useState([])
  const [events, setEvents] = useState([])
  const [packages, setPackages] = useState([])

  // Form State
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(null)
  const [venue, setVenue] = useState('')

  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d
  })

  // Service Line Items
  const [services, setServices] = useState([
    { id: 1, name: 'Wedding Photography', description: 'Full day coverage with lead photographer & candid specialist', qty: 1, unitPrice: 50000 },
    { id: 2, name: 'Cinematic Videography', description: '4K Cinematic film, teaser, and traditional video edit', qty: 1, unitPrice: 40000 },
    { id: 3, name: 'Premium Hardbound Album', description: '2 Luxe acrylic glass hardbound albums (50 sheets each)', qty: 2, unitPrice: 15000 },
    { id: 4, name: 'Pre-wedding Outdoor Shoot', description: '1-day outdoor pre-wedding session with drone coverage', qty: 1, unitPrice: 20000 }
  ])

  const [discount, setDiscount] = useState(10000)
  const [taxPercent, setTaxPercent] = useState(18)
  const [notes, setNotes] = useState('Thank you for choosing PhotoStudio PRO! We look forward to capturing your special moments.')

  useEffect(() => {
    async function loadData() {
      const [cData, eData, pData] = await Promise.all([getClients(), getEvents(), getPackages()])
      if (cData && cData.length > 0) setClients(cData)
      if (eData && eData.length > 0) setEvents(eData)
      if (pData && pData.length > 0) setPackages(pData)
    }
    loadData()
  }, [])

  // Quick fill if initial package passed from Packages page
  useEffect(() => {
    if (initialPackage) {
      if (initialPackage.deliverables && initialPackage.deliverables.length > 0) {
        const pkgServices = initialPackage.deliverables.map((item, idx) => ({
          id: idx + 1,
          name: typeof item === 'string' ? item : item.name || 'Studio Service',
          description: `Included in ${initialPackage.name || 'Selected Package'}`,
          qty: 1,
          unitPrice: idx === 0 ? (initialPackage.price || initialPackage.amount || 50000) : 0
        }))
        setServices(pkgServices)
      } else if (initialPackage.price || initialPackage.amount) {
        setServices([
          { id: 1, name: initialPackage.name || 'Studio Package', description: initialPackage.description || 'Full coverage photography & video package', qty: 1, unitPrice: initialPackage.price || initialPackage.amount || 125000 }
        ])
      }
    }
  }, [initialPackage])

  // Populate fields if editing an existing quotation (negotiating price)
  useEffect(() => {
    if (quotationToEdit) {
      setClientName(quotationToEdit.clientName || '')
      setClientPhone(quotationToEdit.clientPhone || '')
      setClientEmail(quotationToEdit.clientEmail || '')
      setEventName(quotationToEdit.eventName || '')
      if (quotationToEdit.eventDate) setEventDate(new Date(quotationToEdit.eventDate))
      setVenue(quotationToEdit.venue || '')
      if (quotationToEdit.validUntil) setValidUntil(new Date(quotationToEdit.validUntil))
      if (quotationToEdit.services && quotationToEdit.services.length > 0) {
        setServices(quotationToEdit.services.map((s, idx) => ({ ...s, id: idx + 1 })))
      }
      setDiscount(quotationToEdit.discount || 0)
      setTaxPercent(quotationToEdit.taxPercent !== undefined ? quotationToEdit.taxPercent : 18)
      if (quotationToEdit.notes) setNotes(quotationToEdit.notes)
    }
  }, [quotationToEdit])

  // Client dropdown change handler
  const handleClientSelect = (client) => {
    setSelectedClient(client)
    if (client) {
      const name = `${client.firstName || ''} ${client.lastName || ''}`.trim() || client.name || ''
      setClientName(name)
      setClientPhone(client.phone || '')
      setClientEmail(client.email || '')
    }
  }

  // Event dropdown change handler
  const handleEventSelect = (evt) => {
    setSelectedEvent(evt)
    if (evt) {
      setEventName(evt.eventName || '')
      if (evt.eventDate) setEventDate(new Date(evt.eventDate))
      setVenue(evt.venue || '')
    }
  }

  // Package dropdown quick-fill handler
  const handlePackageSelect = (pkg) => {
    if (!pkg) return
    let pkgServices = []
    if (pkg.deliverables && Array.isArray(pkg.deliverables)) {
      pkgServices = pkg.deliverables.map((item, idx) => ({
        id: idx + 1,
        name: typeof item === 'string' ? item : item.name || 'Service',
        description: `Included in ${pkg.name}`,
        qty: 1,
        unitPrice: idx === 0 ? (pkg.price || 100000) : 0
      }))
    } else {
      pkgServices = [
        { id: 1, name: pkg.name || 'Package Service', description: 'Full service package', qty: 1, unitPrice: pkg.price || 100000 }
      ]
    }
    setServices(pkgServices)
    if (onShowToast) onShowToast(`Loaded services from "${pkg.name}" package!`, 'info')
  }

  // Service item updates
  const updateServiceField = (id, field, value) => {
    setServices(services.map(s => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const addServiceRow = () => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1
    setServices([...services, { id: newId, name: '', description: '', qty: 1, unitPrice: 0 }])
  }

  const removeServiceRow = (id) => {
    if (services.length <= 1) {
      if (onShowToast) onShowToast('Quotation must have at least 1 service item', 'warn')
      return
    }
    setServices(services.filter(s => s.id !== id))
  }

  // Financial Calculations
  const subtotal = services.reduce((sum, s) => sum + ((s.qty || 0) * (s.unitPrice || 0)), 0)
  const taxableTotal = Math.max(0, subtotal - (discount || 0))
  const taxAmount = Math.round((taxableTotal * (taxPercent || 0)) / 100)
  const grandTotal = taxableTotal + taxAmount

  const handleSubmit = async (status = 'Draft') => {
    if (!clientName.trim()) {
      if (onShowToast) onShowToast('Please enter or select a client name', 'error')
      return
    }
    if (!eventName.trim()) {
      if (onShowToast) onShowToast('Please enter or select an event name', 'error')
      return
    }
    if (services.some(s => !s.name.trim())) {
      if (onShowToast) onShowToast('Please ensure all service items have a name', 'error')
      return
    }

    const payload = {
      clientId: selectedClient ? (selectedClient._id || selectedClient.id) : null,
      eventId: selectedEvent ? (selectedEvent._id || selectedEvent.id) : null,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      eventName: eventName.trim(),
      eventDate: eventDate ? eventDate.toISOString().split('T')[0] : '',
      venue: venue.trim(),
      validUntil: validUntil ? validUntil.toISOString().split('T')[0] : '',
      services: services.map(s => ({
        name: s.name,
        description: s.description,
        qty: Number(s.qty) || 1,
        unitPrice: Number(s.unitPrice) || 0,
        total: (Number(s.qty) || 1) * (Number(s.unitPrice) || 0)
      })),
      subtotal,
      discount: Number(discount) || 0,
      taxPercent: Number(taxPercent) || 0,
      taxAmount,
      grandTotal,
      status,
      notes
    }

    if (quotationToEdit) {
      const updated = await updateQuotation(quotationToEdit._id || quotationToEdit.id, payload)
      const resObj = updated || { ...quotationToEdit, ...payload }
      if (onShowToast) onShowToast(`Quotation ${quotationToEdit.quotationNumber || 'QT'} updated successfully (Negotiated price saved)!`, 'success')
      if (onNavigateDetail) {
        onNavigateDetail(resObj)
      } else if (onNavigateBack) {
        onNavigateBack()
      }
    } else {
      const created = await createQuotation(payload)
      if (created) {
        if (onShowToast) onShowToast(`Quotation ${created.quotationNumber || 'QT-2026-001'} ${status === 'Sent' ? 'created and sent to customer!' : 'saved as draft!'}`, 'success')
        if (onNavigateDetail) {
          onNavigateDetail(created)
        } else if (onNavigateBack) {
          onNavigateBack()
        }
      }
    }
  }

  return (
    <div className="create-quote-container">
      {/* Top Action Header */}
      <div className="create-quote-header">
        <div>
          <button className="create-quote__back-btn" onClick={onNavigateBack}>
            <i className="pi pi-arrow-left" /> Back
          </button>
          <h1 className="create-quote-header__title">
            {quotationToEdit ? `Edit Quotation ${quotationToEdit.quotationNumber || ''} (Negotiate Price)` : 'Create New Quotation Proposal'}
          </h1>
          <p className="create-quote-header__sub">
            {quotationToEdit ? 'Modify unit prices, services, or special discounts for client negotiation' : 'Draft a customized photography quotation for your client or event'}
          </p>
        </div>

        <div className="create-quote-header__actions">
          <Button label="Save Draft" icon="pi pi-save" className="p-button-outlined p-button-secondary" onClick={() => handleSubmit('Draft')} />
          <Button label="Save & Send to Customer" icon="pi pi-send" className="p-button-primary" onClick={() => handleSubmit('Sent')} />
        </div>
      </div>

      {/* Main Form Body Grid */}
      <div className="create-quote-grid">
        {/* Section 1: Client & Event Header Information */}
        <div className="create-quote-card">
          <div className="create-quote-card__header">
            <i className="pi pi-user text-primary" /> Client & Event Details
          </div>
          <div className="grid p-fluid">
            {/* Existing Client Pick */}
            <div className="col-12 md:col-6">
              <label className="quote-form-label">Select Existing Client (Optional)</label>
              <Dropdown
                value={selectedClient}
                options={clients}
                optionLabel={(c) => `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.name}
                onChange={(e) => handleClientSelect(e.value)}
                placeholder="Choose from CRM..."
                showClear
                filter
              />
            </div>

            {/* Existing Event Pick */}
            <div className="col-12 md:col-6">
              <label className="quote-form-label">Link Existing Event (Optional)</label>
              <Dropdown
                value={selectedEvent}
                options={events}
                optionLabel="eventName"
                onChange={(e) => handleEventSelect(e.value)}
                placeholder="Choose from Events..."
                showClear
                filter
              />
            </div>

            {/* Client Name */}
            <div className="col-12 md:col-4">
              <label className="quote-form-label">Client Name *</label>
              <InputText value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Sophia Sterling" />
            </div>

            {/* Client Phone */}
            <div className="col-12 md:col-4">
              <label className="quote-form-label">Phone Number</label>
              <InputText value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>

            {/* Client Email */}
            <div className="col-12 md:col-4">
              <label className="quote-form-label">Email Address</label>
              <InputText value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@example.com" />
            </div>

            {/* Event Name */}
            <div className="col-12 md:col-4">
              <label className="quote-form-label">Event Name *</label>
              <InputText value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Sterling Wedding & Reception" />
            </div>

            {/* Event Date */}
            <div className="col-12 md:col-4">
              <label className="quote-form-label">Event Date</label>
              <Calendar value={eventDate} onChange={(e) => setEventDate(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Select Date" />
            </div>

            {/* Venue */}
            <div className="col-12 md:col-4">
              <label className="quote-form-label">Venue & Location</label>
              <InputText value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Grand Chateau, Napa Valley" />
            </div>
          </div>
        </div>

        {/* Section 2: Package Quick-Fill & Services Table */}
        <div className="create-quote-card">
          <div className="flex justify-content-between align-items-center mb-3">
            <div className="create-quote-card__header mb-0">
              <i className="pi pi-list text-primary" /> Service Line Items
            </div>

            {/* Package Quick-Fill Dropdown */}
            <div className="flex align-items-center gap-2">
              <span className="text-xs font-semibold text-600">Preset Package:</span>
              <Dropdown
                options={packages}
                optionLabel="name"
                onChange={(e) => handlePackageSelect(e.value)}
                placeholder="Auto-fill from Package..."
                style={{ width: '220px' }}
                showClear
              />
            </div>
          </div>

          {/* Services Table */}
          <div className="quote-services-table-wrap">
            <table className="quote-services-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Service Name</th>
                  <th style={{ width: '35%' }}>Description / Details</th>
                  <th style={{ width: '10%' }} className="text-center">Qty</th>
                  <th style={{ width: '15%' }} className="text-right">Unit Price (₹)</th>
                  <th style={{ width: '15%' }} className="text-right">Total (₹)</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {services.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <InputText
                        value={item.name}
                        onChange={(e) => updateServiceField(item.id, 'name', e.target.value)}
                        placeholder="Service name..."
                        className="w-full p-inputtext-sm"
                      />
                    </td>
                    <td>
                      <InputText
                        value={item.description}
                        onChange={(e) => updateServiceField(item.id, 'description', e.target.value)}
                        placeholder="Details or deliverables included..."
                        className="w-full p-inputtext-sm"
                      />
                    </td>
                    <td className="text-center">
                      <InputNumber
                        value={item.qty}
                        onValueChange={(e) => updateServiceField(item.id, 'qty', e.value || 1)}
                        min={1}
                        className="w-full p-inputtext-sm"
                        inputStyle={{ textAlign: 'center' }}
                      />
                    </td>
                    <td className="text-right">
                      <InputNumber
                        value={item.unitPrice}
                        onValueChange={(e) => updateServiceField(item.id, 'unitPrice', e.value || 0)}
                        min={0}
                        className="w-full p-inputtext-sm"
                        inputStyle={{ textAlign: 'right' }}
                      />
                    </td>
                    <td className="text-right font-semibold">
                      ₹{((item.qty || 0) * (item.unitPrice || 0)).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <button className="quote-row-del-btn" onClick={() => removeServiceRow(item.id)} title="Remove row">
                        <i className="pi pi-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            label="Add Another Service"
            icon="pi pi-plus"
            className="p-button-outlined p-button-sm mt-3"
            onClick={addServiceRow}
          />
        </div>

        {/* Section 3: Summary Totals & Validity */}
        <div className="grid">
          {/* Notes & Validity Column */}
          <div className="col-12 md:col-7">
            <div className="create-quote-card h-full">
              <div className="create-quote-card__header">
                <i className="pi pi-file-edit text-primary" /> Terms & Proposal Notes
              </div>

              <div className="flex flex-column gap-3 p-fluid">
                <div>
                  <label className="quote-form-label">Proposal Valid Until</label>
                  <Calendar value={validUntil} onChange={(e) => setValidUntil(e.value)} dateFormat="dd/mm/yy" showIcon />
                </div>

                <div>
                  <label className="quote-form-label">Client Notes & Payment Terms</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="p-inputtext p-inputtext-sm w-full"
                    placeholder="Enter terms, advance requirement, payment methods..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Totals Breakdown Box */}
          <div className="col-12 md:col-5">
            <div className="create-quote-card quote-summary-card h-full">
              <div className="create-quote-card__header mb-3">
                <i className="pi pi-calculator text-primary" /> Pricing Summary
              </div>

              <div className="quote-summary-rows">
                <div className="quote-summary-row">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="quote-summary-row align-items-center">
                  <span>Discount (₹)</span>
                  <InputNumber
                    value={discount}
                    onValueChange={(e) => setDiscount(e.value || 0)}
                    min={0}
                    style={{ width: '130px' }}
                    className="p-inputtext-sm"
                    inputStyle={{ textAlign: 'right' }}
                  />
                </div>

                <div className="quote-summary-row align-items-center">
                  <span>Tax Rate</span>
                  <div className="flex align-items-center gap-2">
                    <Dropdown
                      value={taxPercent}
                      options={[
                        { label: 'No Tax (0%)', value: 0 },
                        { label: '5% GST', value: 5 },
                        { label: '12% GST', value: 12 },
                        { label: '18% GST', value: 18 }
                      ]}
                      onChange={(e) => setTaxPercent(e.value)}
                      style={{ width: '130px' }}
                      className="p-inputtext-sm"
                    />
                  </div>
                </div>

                <div className="quote-summary-row">
                  <span>Tax Amount</span>
                  <span>+ ₹{taxAmount.toLocaleString()}</span>
                </div>

                <div className="quote-summary-row quote-summary-row--grand">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-column gap-2">
                <Button label="Save & Send to Customer" icon="pi pi-send" className="p-button-primary w-full" onClick={() => handleSubmit('Sent')} />
                <Button label="Save Draft" icon="pi pi-save" className="p-button-outlined p-button-secondary w-full" onClick={() => handleSubmit('Draft')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
