import React, { useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { recordPayment } from '../../services/financeService'
import { downloadPdfFromElement } from '../../utils/generatePdf'
import { useAuth } from '../../context/AuthContext'
import './InvoicePage.css'

export default function InvoicePage({ event, onNavigateEvents, onNavigateWorkflow, onShowToast }) {
  // Extract Raw Event Data (passed dynamically from AddEventPage / Events List / Props)
  const raw = event?.rawEvent || event?.data || event || {}

  // Parse Numerical Amounts
  const parseAmt = (val) => {
    if (!val && val !== 0) return 0
    if (typeof val === 'number') return val
    return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0
  }

  // Auth Context / Dynamic Studio Branding
  const { tenant, user } = useAuth ? useAuth() : {}
  const studioName = tenant?.companyName || user?.studioName || raw.studioName || raw.studio || 'STUDIO SALFORD & CO.'

  // Dynamic Header Fields
  const rawId = String(raw._id || raw.id || raw.eventId || '01234')
  const invoiceNumStr = rawId.includes('EVT') 
    ? rawId.replace('EVT', '012') 
    : (rawId === '01234' ? '01234' : `INV-${rawId.replace(/[^a-zA-Z0-9]/g, '').slice(-5).toUpperCase()}`)

  const clientName = raw.clientName || raw.couple || (raw.clientId ? `${raw.clientId.firstName || ''} ${raw.clientId.lastName || ''}`.trim() : '') || 'ARON LOEB'
  const clientPhone = raw.clientPhone || raw.clientId?.phone || '+123-456-7890'
  const clientEmail = raw.clientEmail || raw.clientId?.email || 'hello@reallygreatsite.com'
  const clientAddress = raw.venue || raw.city ? `${raw.venue || '123 Anywhere St.'}${raw.city ? `, ${raw.city}` : ''}` : '123 Anywhere St., Any City, ST 12345'

  let formattedDate = '12/07/2025'
  if (raw.eventDate || raw.date) {
    const d = new Date(raw.eventDate || raw.date)
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-GB') // DD/MM/YYYY
    } else {
      formattedDate = String(raw.eventDate || raw.date)
    }
  }

  // Dynamic Base Line Items Resolution Engine
  const resolveInitialLineItems = () => {
    const items = []

    if (Array.isArray(raw.customServices) && raw.customServices.length > 0) {
      raw.customServices.forEach((cs, idx) => {
        const name = cs.name || cs.serviceName || 'Custom Service'
        const price = parseAmt(cs.price || cs.unitPrice || 0)
        const qty = cs.qty || 1
        items.push({
          id: cs._id || cs.id || `cs-${idx}`,
          name,
          description: cs.description || '',
          qty,
          unitPrice: price,
          total: qty * price
        })
      })
    } else if (raw.candidPhotography || raw.droneRequired || raw.liveStreaming || raw.albumRequired || raw.traditionalPhotography || raw.traditionalVideo) {
      if (raw.candidPhotography) items.push({ id: 'srv-1', name: 'Candid Cinematic Photography Coverage', description: '4K Cinematic Coverage with Color Grading', qty: 1, unitPrice: 5000, total: 5000 })
      if (raw.traditionalPhotography) items.push({ id: 'srv-2', name: 'Traditional Stage Photography & Portraits', description: 'Full Stage & Family Portraiture Coverage', qty: 1, unitPrice: 3000, total: 3000 })
      if (raw.traditionalVideo) items.push({ id: 'srv-3', name: 'Traditional HD Video Recording & Editing', description: 'Multi-cam Full Event Documentation', qty: 1, unitPrice: 4000, total: 4000 })
      if (raw.droneRequired) items.push({ id: 'srv-4', name: '4K Aerial Drone Coverage', description: 'Licensed Drone Pilot & Aerial Shots', qty: 1, unitPrice: 3000, total: 3000 })
      if (raw.liveStreaming) items.push({ id: 'srv-5', name: 'Live YouTube HD Webcast Stream', description: '4G Bonding & Multi-cam Stream', qty: 1, unitPrice: 2500, total: 2500 })
      if (raw.albumRequired) items.push({ id: 'srv-6', name: 'Canvera Premium Hardbound Photo Album', description: '40-Page Flush Mount Leatherette Album', qty: 1, unitPrice: 3500, total: 3500 })
    } else {
      // Actual Photography Service Items breakdown
      items.push({ id: 'srv-1', name: 'Candid Cinematic Photography Coverage', description: 'Full Day Coverage, 4K Cinema Camera, Pro Color Grade', qty: 1, unitPrice: 120, total: 120 })
      items.push({ id: 'srv-2', name: 'Traditional Stage Photography & Portraits', description: 'High-res Deliverables, Complete Studio Lighting Setup', qty: 4, unitPrice: 100, total: 400 })
      items.push({ id: 'srv-3', name: 'High-Definition Video Recording & Editing', description: 'Full Feature Edited Film + Highlights Teaser', qty: 2, unitPrice: 220, total: 440 })
      items.push({ id: 'srv-4', name: '4K Drone Aerial Shoot Coverage', description: 'Aerial Coverage of Venue & Outdoor Sequence', qty: 5, unitPrice: 55, total: 275 })
      items.push({ id: 'srv-5', name: 'Canvera Flush Mount Premium Album', description: 'Custom Leatherette Printed Book with Silk Box', qty: 2, unitPrice: 250, total: 500 })
    }

    return items
  }

  // Line items state (allows adding custom services dynamically!)
  const [lineItems, setLineItems] = useState(resolveInitialLineItems)

  // Add Custom Service Modal State
  const [isAddSvcOpen, setIsAddSvcOpen] = useState(false)
  const [svcName, setSvcName] = useState('')
  const [svcDesc, setSvcDesc] = useState('')
  const [svcQty, setSvcQty] = useState(1)
  const [svcPrice, setSvcPrice] = useState(100)

  // Financial Calculations
  const servicesSubtotal = lineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0)
  const totalDiscount = parseAmt(raw.discount || 0)
  const taxableAmount = Math.max(0, servicesSubtotal - totalDiscount)
  const totalGstTax = Math.round(taxableAmount * 0.05) // Tax or GST
  const grandTotal = taxableAmount + totalGstTax

  // Payment Tracking State
  const initialAdvance = parseAmt(raw.advanceAmount || raw.advancePaid || raw.totalPaid || raw.paidAmount || 0)
  const [advancePaid, setAdvancePaid] = useState(initialAdvance)
  const balanceDue = Math.max(0, grandTotal - advancePaid)

  // Payment History State
  const [paymentsList, setPaymentsList] = useState([])

  // Record Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState(balanceDue || 500)
  const [payMethod, setPayMethod] = useState('UPI / Bank')
  const [payType, setPayType] = useState('Part Payment')
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0])
  const [payRef, setPayRef] = useState('')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  const handleAddServiceItem = () => {
    if (!svcName.trim()) {
      triggerToast('Please enter a service name', 'error')
      return
    }

    const newItem = {
      id: `custom-svc-${Date.now()}`,
      name: svcName.trim(),
      description: svcDesc.trim(),
      qty: Number(svcQty) || 1,
      unitPrice: Number(svcPrice) || 0,
      total: (Number(svcQty) || 1) * (Number(svcPrice) || 0)
    }

    setLineItems([...lineItems, newItem])
    setIsAddSvcOpen(false)
    setSvcName('')
    setSvcDesc('')
    setSvcQty(1)
    setSvcPrice(100)
    triggerToast(`Added service "${newItem.name}" to invoice!`, 'success')
  }

  const handleRemoveServiceItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id))
    triggerToast('Removed service item', 'info')
  }

  const handleRecordPayment = async () => {
    if (!payAmount || payAmount <= 0) {
      triggerToast('Please enter a valid payment amount', 'error')
      return
    }

    const newPayment = {
      id: `PAY-${1000 + paymentsList.length + 1}`,
      date: payDate,
      type: payType,
      method: payMethod,
      ref: payRef || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      amount: Number(payAmount)
    }

    const newTotalPaid = advancePaid + Number(payAmount)
    setAdvancePaid(newTotalPaid)
    setPaymentsList([newPayment, ...paymentsList])

    try {
      await recordPayment({
        eventId: raw._id || raw.id || null,
        clientId: raw.clientId?._id || raw.clientId || null,
        amount: Number(payAmount),
        paymentDate: payDate,
        paymentMethod: payMethod,
        transactionId: payRef,
        paymentType: payType
      })
    } catch {
      // Local fallback
    }

    setIsPayModalOpen(false)
    triggerToast(`Recorded payment of $${payAmount.toLocaleString()}!`, 'success')
  }

  const handleDownloadPdf = () => {
    downloadPdfFromElement('printable-invoice-card', `Invoice-${invoiceNumStr}.pdf`)
    triggerToast('Downloading official Invoice PDF...', 'info')
  }

  const handlePrint = () => {
    window.print()
  }

  // Status Badge Logic
  let statusLabel = 'UNPAID'
  let statusSeverity = 'danger'
  if (balanceDue === 0 && grandTotal > 0) {
    statusLabel = 'PAID IN FULL'
    statusSeverity = 'success'
  } else if (advancePaid > 0) {
    statusLabel = 'PARTIALLY PAID'
    statusSeverity = 'info'
  }

  return (
    <div className="ent-invoice-container">
      {/* ── Actions Header Bar (Hidden in Print) ── */}
      <div className="ref-actions-bar no-print">
        <div>
          <div className="flex align-items-center gap-2">
            <h2 className="ref-actions-bar__title">Invoice #{invoiceNumStr}</h2>
            <Tag value={statusLabel} severity={statusSeverity} className="ent-status-badge" outlined />
          </div>
          <p className="ref-actions-bar__subtitle">
            Off-white paper layout formatted with extra wide service column space.
          </p>
        </div>

        <div className="ref-actions-bar__btn-group">
          {onNavigateEvents && (
            <Button
              label="Back to Events"
              icon="pi pi-arrow-left"
              className="p-button-outlined p-button-secondary p-button-sm"
              onClick={onNavigateEvents}
            />
          )}
          {onNavigateWorkflow && (
            <Button
              label="Workflow"
              icon="pi pi-sitemap"
              className="p-button-outlined p-button-secondary p-button-sm"
              onClick={onNavigateWorkflow}
            />
          )}
          <Button
            label="Add Service Line"
            icon="pi pi-plus"
            className="p-button-outlined p-button-primary p-button-sm"
            onClick={() => setIsAddSvcOpen(true)}
          />
          {balanceDue > 0 && (
            <Button
              label="Record Payment"
              icon="pi pi-dollar"
              className="p-button-outlined p-button-success p-button-sm"
              onClick={() => {
                setPayAmount(balanceDue)
                setIsPayModalOpen(true)
              }}
            />
          )}
          <Button
            label="Download PDF"
            icon="pi pi-download"
            className="p-button-outlined p-button-secondary p-button-sm"
            onClick={handleDownloadPdf}
          />
          <Button
            label="Print Invoice"
            icon="pi pi-print"
            className="p-button-primary p-button-sm"
            onClick={handlePrint}
          />
        </div>
      </div>

      {/* ── Off-White Paper Card (Matches Reference Image Layout) ── */}
      <div className="ref-invoice-paper" id="printable-invoice-card">
        
        {/* 1. Header Row */}
        <div className="ref-header">
          <div className="ref-header-left">
            <h1 className="ref-studio-name">{studioName.toUpperCase()}</h1>
          </div>
          <div className="ref-header-right">
            <h2 className="ref-invoice-title">INVOICE</h2>
            <div className="ref-invoice-no">Invoice No: {invoiceNumStr}</div>
          </div>
        </div>

        <div className="ref-divider-heavy" />

        {/* 2. Invoice To & Date / Total Due Grid */}
        <div className="ref-info-grid">
          <div className="ref-info-left">
            <div className="ref-label">INVOICE TO :</div>
            <div className="ref-client-name">{clientName}</div>
            <div className="ref-client-details">
              {clientPhone && <div>{clientPhone}</div>}
              {clientEmail && <div>{clientEmail}</div>}
              {clientAddress && <div>{clientAddress}</div>}
            </div>
          </div>

          <div className="ref-vertical-divider" />

          <div className="ref-info-right">
            <div className="ref-date-row">
              Date: {formattedDate}
            </div>
            <div className="ref-date-bar" />
            <div className="ref-total-due-label">TOTAL DUE</div>
            <div className="ref-total-due-amount">${balanceDue.toLocaleString('en-US')}</div>
          </div>
        </div>

        {/* 3. Services Table with Generous 62% Width for SERVICE column */}
        <div className="ref-table-container">
          <table className="ref-services-table">
            <thead>
              <tr>
                <th className="ref-col-service">SERVICE</th>
                <th className="ref-col-qty">QTY</th>
                <th className="ref-col-price">PRICE</th>
                <th className="ref-col-total">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="ref-cell-service">
                    <div className="flex align-items-center justify-content-between">
                      <div>
                        <div className="ref-service-title">{item.name}</div>
                        {item.description && <div className="ref-service-desc">{item.description}</div>}
                      </div>
                      <button
                        type="button"
                        className="ref-cell-action-btn no-print"
                        title="Remove Service"
                        onClick={() => handleRemoveServiceItem(item.id)}
                      >
                        <i className="pi pi-trash" />
                      </button>
                    </div>
                  </td>
                  <td className="ref-cell-qty">{item.qty}</td>
                  <td className="ref-cell-price">${item.unitPrice.toLocaleString('en-US')}</td>
                  <td className="ref-cell-total">${(item.qty * item.unitPrice).toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Interactive Quick Add Service Link (No Print) */}
          <div className="no-print mt-2 text-right">
            <button
              type="button"
              className="p-button p-button-link p-button-sm text-xs"
              onClick={() => setIsAddSvcOpen(true)}
            >
              + Add another service line
            </button>
          </div>
        </div>

        {/* 4. Payment Method & Pricing Summary Grid */}
        <div className="ref-bottom-grid">
          <div className="ref-bottom-left">
            <div className="ref-payment-label">Payment Method :</div>
            <div className="ref-bank-details">
              <div className="ref-bank-name">{tenant?.bankName || user?.bankName || studioName}</div>
              <div>Bank Code / IFSC : {tenant?.ifscCode || tenant?.bankCode || user?.bankCode || '1234'}</div>
              <div>Account No : {tenant?.accountNumber || user?.accountNumber || '0123 4567 8901'}</div>
            </div>
          </div>

          <div className="ref-vertical-divider" />

          <div className="ref-bottom-right">
            <div className="ref-summary-row">
              <span>Sub-total :</span>
              <span>${servicesSubtotal.toLocaleString('en-US')}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="ref-summary-row">
                <span>Discount :</span>
                <span>- ${totalDiscount.toLocaleString('en-US')}</span>
              </div>
            )}
            <div className="ref-summary-row">
              <span>Tax :</span>
              <span>${totalGstTax.toLocaleString('en-US')}</span>
            </div>
            <div className="ref-summary-line" />
            <div className="ref-summary-row ref-summary-total">
              <span>Total :</span>
              <span>${grandTotal.toLocaleString('en-US')}</span>
            </div>
            {advancePaid > 0 && (
              <div className="ref-summary-row ref-summary-paid mt-1">
                <span>Paid Deposit :</span>
                <span>- ${advancePaid.toLocaleString('en-US')}</span>
              </div>
            )}
            {advancePaid > 0 && (
              <div className="ref-summary-row ref-summary-balance mt-1">
                <span>Balance Due :</span>
                <span>${balanceDue.toLocaleString('en-US')}</span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Footer Signoff */}
        <div className="ref-footer">
          <div className="ref-footer-thankyou">
            Thank you for trusting {studioName}!
          </div>

          <div className="ref-footer-signature">
            <div className="ref-sig-name">{user?.name || user?.username || 'Matt Zhang'}</div>
            <div className="ref-sig-role">Administrator</div>
          </div>
        </div>

      </div>

      {/* ── Dialog: Add New Custom Service ── */}
      <Dialog
        header="Add New Service Line"
        visible={isAddSvcOpen}
        style={{ width: '500px' }}
        onHide={() => setIsAddSvcOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text p-button-sm" onClick={() => setIsAddSvcOpen(false)} />
            <Button label="Add Service" icon="pi pi-check" className="p-button-primary p-button-sm" onClick={handleAddServiceItem} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Service Name / Title *</label>
            <InputText
              value={svcName}
              onChange={(e) => setSvcName(e.target.value)}
              placeholder="e.g. Drone Aerial Coverage & 4K Teaser Edit"
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Detailed Service Description (Optional)</label>
            <InputText
              value={svcDesc}
              onChange={(e) => setSvcDesc(e.target.value)}
              placeholder="e.g. Includes licensed pilot, 2 hours flight time, color graded video deliverable"
              className="w-full"
            />
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Quantity *</label>
              <InputNumber
                value={svcQty}
                onValueChange={(e) => setSvcQty(e.value)}
                className="w-full"
                min={1}
              />
            </div>

            <div className="col-6">
              <label className="block font-bold mb-1">Price per Unit ($) *</label>
              <InputNumber
                value={svcPrice}
                onValueChange={(e) => setSvcPrice(e.value)}
                className="w-full"
                min={0}
              />
            </div>
          </div>
        </div>
      </Dialog>

      {/* ── Dialog: Record Invoice Payment ── */}
      <Dialog
        header="Record Payment"
        visible={isPayModalOpen}
        style={{ width: '450px' }}
        onHide={() => setIsPayModalOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text p-button-sm" onClick={() => setIsPayModalOpen(false)} />
            <Button label="Save Payment" icon="pi pi-check" className="p-button-success p-button-sm" onClick={handleRecordPayment} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Payment Amount ($) *</label>
            <InputNumber value={payAmount} onValueChange={(e) => setPayAmount(e.value)} className="w-full" min={1} max={balanceDue || 1000000} />
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Payment Method *</label>
              <Dropdown
                value={payMethod}
                options={['UPI / Bank', 'Cash', 'Credit Card', 'Cheque']}
                onChange={(e) => setPayMethod(e.value)}
                className="w-full"
              />
            </div>

            <div className="col-6">
              <label className="block font-bold mb-1">Payment Type</label>
              <Dropdown
                value={payType}
                options={['Advance Deposit', 'Part Payment', 'Final Balance']}
                onChange={(e) => setPayType(e.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid">
            <div className="col-6">
              <label className="block font-bold mb-1">Payment Date</label>
              <InputText type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className="w-full" />
            </div>

            <div className="col-6">
              <label className="block font-bold mb-1">Transaction Ref No</label>
              <InputText value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. TXN981247" className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
