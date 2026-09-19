import React, { useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { recordPayment } from '../../services/financeService'
import { updateInvoice } from '../../services/invoiceService'
import { downloadPdfFromElement } from '../../utils/generatePdf'
import { useAuth } from '../../context/AuthContext'
import '../InvoicePage/InvoicePage.css'
import './InvoiceDetail.css'

export default function InvoiceDetail({ invoice, onNavigateBack, onShowToast }) {
  const { tenant, user } = useAuth ? useAuth() : {}
  const studioName = tenant?.companyName || user?.studioName || invoice?.studioName || 'STUDIO SALFORD & CO.'

  const [currentInvoice, setCurrentInvoice] = useState(invoice || {
    invoiceNumber: '01234',
    clientName: 'ARON LOEB',
    clientPhone: '+123-456-7890',
    clientEmail: 'hello@reallygreatsite.com',
    venue: '123 Anywhere St., Any City, ST 12345',
    date: '12/07/2025',
    services: [
      { name: 'Candid Cinematic Photography Coverage', description: 'Full Day Coverage, 4K Cinema Camera', qty: 1, unitPrice: 120, total: 120 },
      { name: 'Traditional Stage Photography & Portraits', description: 'High-res Deliverables, Studio Lighting', qty: 4, unitPrice: 100, total: 400 },
      { name: 'High-Definition Video Recording & Editing', description: 'Full Feature Edited Film + Teaser', qty: 2, unitPrice: 220, total: 440 },
      { name: '4K Drone Aerial Shoot Coverage', description: 'Aerial Coverage of Venue', qty: 5, unitPrice: 55, total: 275 },
      { name: 'Canvera Flush Mount Premium Album', description: 'Custom Leatherette Printed Book', qty: 2, unitPrice: 250, total: 500 }
    ],
    subtotal: 1735,
    taxAmount: 55,
    grandTotal: 1680,
    totalPaid: 0,
    balance: 1680,
    status: 'Unpaid'
  })

  // Add Custom Service Modal State
  const [isAddSvcOpen, setIsAddSvcOpen] = useState(false)
  const [svcName, setSvcName] = useState('')
  const [svcDesc, setSvcDesc] = useState('')
  const [svcQty, setSvcQty] = useState(1)
  const [svcPrice, setSvcPrice] = useState(100)

  // Record Payment Dialog State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState(currentInvoice.balance || 500)
  const [payMethod, setPayMethod] = useState('UPI / Bank')
  const [payType, setPayType] = useState('Part Payment')
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0])
  const [payRef, setPayRef] = useState('')

  const triggerToast = (msg, sev = 'info') => {
    if (onShowToast) onShowToast(msg, sev)
  }

  // Recalculate invoice totals when services change
  const recalculateInvoice = (updatedServices) => {
    const subtotal = updatedServices.reduce((sum, s) => sum + (s.qty * s.unitPrice), 0)
    const taxAmount = currentInvoice.taxAmount || 55
    const grandTotal = Math.max(0, subtotal + taxAmount - (currentInvoice.discount || 0))
    const balance = Math.max(0, grandTotal - (currentInvoice.totalPaid || 0))

    const updated = {
      ...currentInvoice,
      services: updatedServices,
      subtotal,
      grandTotal,
      balance
    }
    setCurrentInvoice(updated)
    updateInvoice(currentInvoice._id || currentInvoice.id, updated).catch(() => {})
  }

  const handleAddServiceItem = () => {
    if (!svcName.trim()) {
      triggerToast('Please enter a service name', 'error')
      return
    }

    const newItem = {
      id: `svc-${Date.now()}`,
      name: svcName.trim(),
      description: svcDesc.trim(),
      qty: Number(svcQty) || 1,
      unitPrice: Number(svcPrice) || 0,
      total: (Number(svcQty) || 1) * (Number(svcPrice) || 0)
    }

    const updatedServices = [...(currentInvoice.services || []), newItem]
    recalculateInvoice(updatedServices)
    setIsAddSvcOpen(false)
    setSvcName('')
    setSvcDesc('')
    setSvcQty(1)
    setSvcPrice(100)
    triggerToast(`Added service "${newItem.name}"`, 'success')
  }

  const handleRemoveServiceItem = (index) => {
    const updatedServices = (currentInvoice.services || []).filter((_, i) => i !== index)
    recalculateInvoice(updatedServices)
    triggerToast('Removed service line item', 'info')
  }

  const handleRecordPayment = async () => {
    if (!payAmount || payAmount <= 0) {
      triggerToast('Please enter a valid payment amount', 'error')
      return
    }

    const newPayment = {
      id: `PAY-${1000 + (currentInvoice.payments || []).length + 1}`,
      date: payDate,
      type: payType,
      method: payMethod,
      ref: payRef || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      amount: Number(payAmount)
    }

    const updatedPayments = [...(currentInvoice.payments || []), newPayment]
    const newTotalPaid = (currentInvoice.totalPaid || 0) + Number(payAmount)
    const newBalance = Math.max(0, (currentInvoice.grandTotal || 0) - newTotalPaid)
    let newStatus = currentInvoice.status
    if (newBalance === 0) {
      newStatus = 'Paid'
    } else if (newTotalPaid > 0) {
      newStatus = 'Partially Paid'
    }

    const updatedInvoiceObj = {
      ...currentInvoice,
      totalPaid: newTotalPaid,
      balance: newBalance,
      status: newStatus,
      payments: updatedPayments
    }

    try {
      await recordPayment({
        eventId: currentInvoice.eventId?._id || currentInvoice.eventId || null,
        clientId: currentInvoice.clientId?._id || currentInvoice.clientId || null,
        amount: Number(payAmount),
        paymentDate: payDate,
        paymentMethod: payMethod,
        transactionId: payRef,
        paymentType: payType
      })
    } catch {
      // Local fallback
    }

    await updateInvoice(currentInvoice._id || currentInvoice.id, updatedInvoiceObj)
    setCurrentInvoice(updatedInvoiceObj)
    setIsPayModalOpen(false)
    triggerToast(`Recorded payment of $${payAmount.toLocaleString()}!`, 'success')
  }

  const handleDownloadPdf = () => {
    downloadPdfFromElement('printable-invoice-detail-card', `${currentInvoice.invoiceNumber || 'Invoice'}.pdf`)
    triggerToast('Downloading PDF...', 'info')
  }

  const handlePrint = () => {
    window.print()
  }

  const statusSeverity = (st) => {
    switch (st) {
      case 'Paid':
      case 'PAID IN FULL': return 'success'
      case 'Partially Paid':
      case 'DEPOSIT PAID': return 'info'
      case 'Issued':
      case 'Pending': return 'warning'
      default: return 'danger'
    }
  }

  const servicesList = currentInvoice.services || []

  return (
    <div className="ent-invoice-container">
      {/* Actions Bar */}
      <div className="ref-actions-bar no-print">
        <div className="flex align-items-center gap-3">
          {onNavigateBack && (
            <Button
              icon="pi pi-arrow-left"
              className="p-button-outlined p-button-secondary p-button-sm"
              onClick={onNavigateBack}
            />
          )}
          <div>
            <div className="flex align-items-center gap-2">
              <h2 className="ref-actions-bar__title">
                Invoice #{currentInvoice.invoiceNumber}
              </h2>
              <Tag value={currentInvoice.status || 'UNPAID'} severity={statusSeverity(currentInvoice.status)} outlined />
            </div>
            <p className="ref-actions-bar__subtitle">Client: {currentInvoice.clientName}</p>
          </div>
        </div>

        <div className="ref-actions-bar__btn-group">
          <Button
            label="Add Service Line"
            icon="pi pi-plus"
            className="p-button-outlined p-button-primary p-button-sm"
            onClick={() => setIsAddSvcOpen(true)}
          />
          {(currentInvoice.balance || 0) > 0 && (
            <Button
              label="Record Payment"
              icon="pi pi-dollar"
              className="p-button-outlined p-button-success p-button-sm"
              onClick={() => {
                setPayAmount(currentInvoice.balance)
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

      {/* Off-White Paper Printable Card */}
      <div className="ref-invoice-paper" id="printable-invoice-detail-card">
        
        {/* 1. Header Row */}
        <div className="ref-header">
          <div className="ref-header-left">
            <h1 className="ref-studio-name">{studioName.toUpperCase()}</h1>
          </div>
          <div className="ref-header-right">
            <h2 className="ref-invoice-title">INVOICE</h2>
            <div className="ref-invoice-no">Invoice No: {currentInvoice.invoiceNumber}</div>
          </div>
        </div>

        <div className="ref-divider-heavy" />

        {/* 2. Invoice To & Date / Total Due Grid */}
        <div className="ref-info-grid">
          <div className="ref-info-left">
            <div className="ref-label">INVOICE TO :</div>
            <div className="ref-client-name">{currentInvoice.clientName || 'ARON LOEB'}</div>
            <div className="ref-client-details">
              {currentInvoice.clientPhone && <div>{currentInvoice.clientPhone}</div>}
              {currentInvoice.clientEmail && <div>{currentInvoice.clientEmail}</div>}
              {currentInvoice.venue && <div>{currentInvoice.venue}</div>}
            </div>
          </div>

          <div className="ref-vertical-divider" />

          <div className="ref-info-right">
            <div className="ref-date-row">
              Date: {currentInvoice.date || '12/07/2025'}
            </div>
            <div className="ref-date-bar" />
            <div className="ref-total-due-label">TOTAL DUE</div>
            <div className="ref-total-due-amount">${(currentInvoice.balance ?? currentInvoice.grandTotal ?? 1680).toLocaleString('en-US')}</div>
          </div>
        </div>

        {/* 3. Services Table with Wide 62% Service Column */}
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
              {servicesList.map((item, index) => (
                <tr key={index}>
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
                        onClick={() => handleRemoveServiceItem(index)}
                      >
                        <i className="pi pi-trash" />
                      </button>
                    </div>
                  </td>
                  <td className="ref-cell-qty">{item.qty || 1}</td>
                  <td className="ref-cell-price">${(item.unitPrice || item.price || 0).toLocaleString('en-US')}</td>
                  <td className="ref-cell-total">${((item.qty || 1) * (item.unitPrice || item.price || 0)).toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Quick Add Button */}
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
              <span>${(currentInvoice.subtotal || 0).toLocaleString('en-US')}</span>
            </div>
            {currentInvoice.discount > 0 && (
              <div className="ref-summary-row">
                <span>Discount :</span>
                <span>- ${(currentInvoice.discount || 0).toLocaleString('en-US')}</span>
              </div>
            )}
            <div className="ref-summary-row">
              <span>Tax :</span>
              <span>${(currentInvoice.taxAmount || 55).toLocaleString('en-US')}</span>
            </div>
            <div className="ref-summary-line" />
            <div className="ref-summary-row ref-summary-total">
              <span>Total :</span>
              <span>${(currentInvoice.grandTotal || 1680).toLocaleString('en-US')}</span>
            </div>
            {(currentInvoice.totalPaid || 0) > 0 && (
              <div className="ref-summary-row ref-summary-paid mt-1">
                <span>Paid Deposit :</span>
                <span>- ${(currentInvoice.totalPaid || 0).toLocaleString('en-US')}</span>
              </div>
            )}
            {(currentInvoice.totalPaid || 0) > 0 && (
              <div className="ref-summary-row ref-summary-balance mt-1">
                <span>Balance Due :</span>
                <span>${(currentInvoice.balance || 0).toLocaleString('en-US')}</span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Footer */}
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

      {/* Dialog: Add New Custom Service */}
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
              placeholder="e.g. Drone Aerial Coverage"
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Detailed Service Description (Optional)</label>
            <InputText
              value={svcDesc}
              onChange={(e) => setSvcDesc(e.target.value)}
              placeholder="e.g. Includes licensed pilot & 4K footage deliverable"
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

      {/* Record Payment Dialog */}
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
            <InputNumber value={payAmount} onValueChange={(e) => setPayAmount(e.value)} className="w-full" min={1} max={currentInvoice.balance || 1000000} />
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
              <InputText value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. TXN123456" className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
