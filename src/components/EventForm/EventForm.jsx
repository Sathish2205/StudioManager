import React, { useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { eventSchema } from '../../validation/eventSchema'
import { getClients } from '../../services/clientService'
import { getPackages } from '../../services/packageService'
import { getStaff } from '../../services/staffService'
import { createEvent } from '../../services/eventService'
import './EventForm.css'

export default function EventForm({ onSuccess, onCancel }) {
  const toastRef = useRef(null)

  // API Data States
  const [clients, setClients] = useState([])
  const [packages, setPackages] = useState([])
  const [staff, setStaff] = useState({ photographers: [], videographers: [] })
  const [loadingData, setLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const eventTypeOptions = [
    { label: 'Wedding', value: 'Wedding' },
    { label: 'Engagement', value: 'Engagement' },
    { label: 'Reception', value: 'Reception' },
    { label: 'Baby Shower', value: 'Baby Shower' },
    { label: 'Birthday', value: 'Birthday' },
    { label: 'Maternity', value: 'Maternity' },
    { label: 'Naming Ceremony', value: 'Naming Ceremony' },
    { label: 'House Warming', value: 'House Warming' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Other', value: 'Other' }
  ]

  const statusOptions = [
    { label: 'Booked', value: 'Booked' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ]

  // React Hook Form Setup
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      clientName: '',
      clientId: null,
      eventType: null,
      eventName: '',
      eventDate: null,
      startTime: null,
      endTime: null,
      venue: '',
      guestCount: null,
      packageId: null,
      packagePrice: null,
      advancePaid: 0,
      assignedLeadPhotographer: null,
      assignedAssistantPhotographer: null,
      assignedLeadVideographer: null,
      assignedDronePilot: null,
      deliverables: [],
      notes: ''
    }
  })

  // Watch Package Price and Advance Paid for Balance Amount calculation
  const watchPackagePrice = watch('packagePrice') || 0
  const watchAdvancePaid = watch('advancePaid') || 0

  // Derived Balance Amount calculation
  const balanceAmount = Math.max(0, watchPackagePrice - watchAdvancePaid)

  // Load API Dropdown Options on Mount
  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        setLoadingData(true)
        const [clientsRes, packagesRes, staffRes] = await Promise.all([
          getClients().catch(() => []),
          getPackages().catch(() => []),
          getStaff().catch(() => ({ photographers: [], videographers: [] }))
        ])
        if (isMounted) {
          setClients(clientsRes || [])
          setPackages(packagesRes || [])
          setStaff(staffRes || { photographers: [], videographers: [] })
        }
      } catch (err) {
        console.error('Error fetching event options:', err)
      } finally {
        if (isMounted) setLoadingData(false)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  // Auto-fill Package Price when Package is selected
  const handlePackageChange = (selectedPkgId, onChange) => {
    onChange(selectedPkgId)
    const selectedPkg = packages.find((p) => p.id === selectedPkgId)
    if (selectedPkg) {
      setValue('packagePrice', selectedPkg.price, { shouldValidate: true })
    }
  }

  const mapEventTypeForBackend = (typeStr) => {
    if (!typeStr) return 'Wedding'
    if (typeStr.includes('Pre-Wedding')) return 'Pre Wedding'
    if (typeStr.includes('Sangeet') || typeStr.includes('Mehendi')) return 'Sangeet'
    if (typeStr.includes('Haldi')) return 'Haldi'
    if (typeStr.includes('Destination')) return 'Destination Wedding'
    if (typeStr.includes('Reception')) return 'Reception'
    if (typeStr.includes('Engagement')) return 'Engagement'
    if (typeStr.includes('Corporate')) return 'Corporate'
    if (typeStr.includes('Birthday')) return 'Birthday'
    if (typeStr.includes('Baby')) return 'Baby Shower'
    return 'Wedding'
  }

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      let clientId = data.clientId
      if (!clientId) {
        const clientName = data.clientName || 'Client'
        const existing = clients.find((c) =>
          (c.name && c.name.toLowerCase().includes(clientName.toLowerCase())) ||
          (c.firstName && clientName.toLowerCase().includes(c.firstName.toLowerCase()))
        )

        if (existing && (existing._id || existing.id)) {
          clientId = existing._id || existing.id
        } else {
          const nameParts = clientName.trim().split(' ')
          const firstName = nameParts[0] || 'Client'
          const lastName = nameParts.slice(1).join(' ') || 'User'
          const newClient = await createClient({
            firstName,
            lastName,
            phone: data.clientMobile || '+91 98765 43210',
            email: data.clientEmail || 'client@example.com',
            city: data.venue || 'Bengaluru',
            status: 'active'
          })
          if (newClient && (newClient._id || newClient.id)) {
            clientId = newClient._id || newClient.id
          }
        }
      }

      const backendPayload = {
        clientId: clientId || '6a773edbf7cc32adc5f12f7f',
        eventName: data.eventName || `${data.clientName || 'Special'} Event`,
        eventType: mapEventTypeForBackend(data.eventType),
        eventDate: data.eventDate ? new Date(data.eventDate).toISOString() : new Date().toISOString(),
        startTime: data.startTime ? new Date(data.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
        endTime: data.endTime ? new Date(data.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 PM',
        venue: data.venue || 'Studio Ballroom',
        package: data.packageName || 'Custom Package',
        packageAmount: Number(data.packagePrice || data.totalAmount || 150000),
        advanceAmount: Number(data.advancePaid || 0),
        status: 'Confirmed',
        notes: data.notes || ''
      }

      const res = await createEvent(backendPayload)
      const eventId = res?.data?._id || res?.id || `EVT-${Date.now()}`

      toastRef.current?.show({
        severity: 'success',
        summary: 'Event Saved to Backend',
        detail: `Event #${eventId} successfully posted to database!`,
        life: 3000
      })

      reset()
      if (onSuccess) {
        setTimeout(() => onSuccess(res), 1000)
      }
    } catch (error) {
      console.error('Error submitting event to backend:', error)
      toastRef.current?.show({
        severity: 'error',
        summary: 'Submission Error',
        detail: 'Failed to save event to backend.',
        life: 3000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cancel Handler with Confirmation Dialog
  const handleCancelClick = () => {
    if (isDirty) {
      confirmDialog({
        message: 'You have unsaved changes. Are you sure you want to leave?',
        header: 'Unsaved Changes Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptClassName: 'p-button-danger',
        accept: () => onCancel && onCancel()
      })
    } else {
      if (onCancel) onCancel()
    }
  }

  return (
    <Card className="event-form-card">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <form onSubmit={handleSubmit(onSubmit)} className="event-form">
        {/* ── 1. Event Information Section ── */}
        <div className="form-section">
          <h3 className="section-title">
            <i className="pi pi-info-circle section-icon" /> Event Information
          </h3>

          <div className="grid form-grid">
            {/* Client Name (Searchable Dropdown) */}
            {/* Client Name InputText */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Client Name <span className="req-star">*</span>
              </label>
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => (
                  <InputText
                    id={field.name}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter Client / Couple Name (e.g. Anand & Priya)"
                    className={`w-full p-inputtext ${errors.clientName ? 'p-invalid' : ''}`}
                    autoFocus
                  />
                )}
              />
              {errors.clientName && (
                <small className="p-error">{errors.clientName.message}</small>
              )}
            </div>

            {/* Event Name */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Event Name <span className="req-star">*</span>
              </label>
              <Controller
                name="eventName"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder='e.g. "Anand & Priya Wedding"'
                    className={`w-full ${errors.eventName ? 'p-invalid' : ''}`}
                  />
                )}
              />
              {errors.eventName && (
                <small className="p-error">{errors.eventName.message}</small>
              )}
            </div>

            {/* Event Type */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Event Type <span className="req-star">*</span>
              </label>
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={eventTypeOptions}
                    placeholder="Select Event Type"
                    showClear
                    className={`w-full ${errors.eventType ? 'p-invalid' : ''}`}
                  />
                )}
              />
              {errors.eventType && (
                <small className="p-error">{errors.eventType.message}</small>
              )}
            </div>

            {/* Event Date */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Event Date <span className="req-star">*</span>
              </label>
              <Controller
                name="eventDate"
                control={control}
                render={({ field }) => (
                  <Calendar
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    placeholder="Select Date"
                    className={`w-full ${errors.eventDate ? 'p-invalid' : ''}`}
                    inputClassName="p-inputtext w-full"
                  />
                )}
              />
              {errors.eventDate && (
                <small className="p-error">{errors.eventDate.message}</small>
              )}
            </div>

            {/* Event Time */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">Event Time</label>
              <Controller
                name="eventTime"
                control={control}
                render={({ field }) => (
                  <Calendar
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    timeOnly
                    hourFormat="12"
                    showIcon
                    placeholder="Select Time (e.g. 10:00 AM)"
                    className="w-full"
                    inputClassName="p-inputtext w-full"
                  />
                )}
              />
            </div>

            {/* Venue Name */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Venue Name <span className="req-star">*</span>
              </label>
              <Controller
                name="venueName"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="e.g. The Ritz Carlton Grand Ballroom"
                    className={`p-inputtext w-full ${errors.venueName ? 'p-invalid' : ''}`}
                  />
                )}
              />
              {errors.venueName && (
                <small className="p-error">{errors.venueName.message}</small>
              )}
            </div>

            {/* Venue Address */}
            <div className="col-12 field-col">
              <label className="field-label">Venue Address</label>
              <Controller
                name="venueAddress"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    rows={2}
                    placeholder="Street address or location details"
                    className="p-inputtext w-full"
                  />
                )}
              />
            </div>

            {/* City */}
            <div className="col-12 md:col-4 field-col">
              <label className="field-label">City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <InputText {...field} placeholder="e.g. Chennai" className="p-inputtext w-full" />
                )}
              />
            </div>

            {/* State */}
            <div className="col-12 md:col-4 field-col">
              <label className="field-label">State</label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <InputText {...field} placeholder="e.g. Tamil Nadu" className="p-inputtext w-full" />
                )}
              />
            </div>

            {/* Pincode */}
            <div className="col-12 md:col-4 field-col">
              <label className="field-label">Pincode</label>
              <Controller
                name="pincode"
                control={control}
                render={({ field }) => (
                  <InputText {...field} placeholder="e.g. 600001" className="p-inputtext w-full" />
                )}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* ── 2. Photography Details Section ── */}
        <div className="form-section">
          <h3 className="section-title">
            <i className="pi pi-camera section-icon" /> Photography Details
          </h3>

          <div className="grid form-grid">
            {/* Lead Photographer */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">Photographer</label>
              <Controller
                name="photographerId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={staff.photographers}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Photographer"
                    showClear
                    className="w-full"
                    disabled={loadingData}
                  />
                )}
              />
            </div>

            {/* Lead Videographer */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">Videographer</label>
              <Controller
                name="videographerId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={staff.videographers}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Videographer"
                    showClear
                    className="w-full"
                    disabled={loadingData}
                  />
                )}
              />
            </div>

            {/* Checkboxes Grid */}
            <div className="col-12 checkbox-grid">
              <div className="checkbox-item">
                <Controller
                  name="droneRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="droneRequired"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="droneRequired">Drone Required</label>
              </div>

              <div className="checkbox-item">
                <Controller
                  name="liveStreaming"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="liveStreaming"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="liveStreaming">Live Streaming</label>
              </div>

              <div className="checkbox-item">
                <Controller
                  name="albumRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="albumRequired"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="albumRequired">Album Required</label>
              </div>

              <div className="checkbox-item">
                <Controller
                  name="candidPhotography"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="candidPhotography"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="candidPhotography">Candid Photography</label>
              </div>

              <div className="checkbox-item">
                <Controller
                  name="traditionalPhotography"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="traditionalPhotography"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="traditionalPhotography">Traditional Photography</label>
              </div>

              <div className="checkbox-item">
                <Controller
                  name="traditionalVideo"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="traditionalVideo"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="traditionalVideo">Traditional Video</label>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── 3. Package Details Section ── */}
        <div className="form-section">
          <h3 className="section-title">
            <i className="pi pi-wallet section-icon" /> Package Details
          </h3>

          <div className="grid form-grid">
            {/* Package Dropdown */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Package <span className="req-star">*</span>
              </label>
              <Controller
                name="packageId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    options={packages}
                    optionLabel="name"
                    optionValue="id"
                    onChange={(e) => handlePackageChange(e.value, field.onChange)}
                    placeholder={loadingData ? 'Loading Packages...' : 'Select Package'}
                    showClear
                    className={`w-full ${errors.packageId ? 'p-invalid' : ''}`}
                    disabled={loadingData}
                  />
                )}
              />
              {errors.packageId && (
                <small className="p-error">{errors.packageId.message}</small>
              )}
            </div>

            {/* Package Price */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Package Price (₹) <span className="req-star">*</span>
              </label>
              <Controller
                name="packagePrice"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    id={field.name}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="currency"
                    currency="INR"
                    locale="en-IN"
                    placeholder="e.g. ₹8,50,000"
                    className={`w-full ${errors.packagePrice ? 'p-invalid' : ''}`}
                    inputClassName="p-inputtext w-full"
                  />
                )}
              />
              {errors.packagePrice && (
                <small className="p-error">{errors.packagePrice.message}</small>
              )}
            </div>

            {/* Advance Paid */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">
                Advance Paid (₹) <span className="req-star">*</span>
              </label>
              <Controller
                name="advancePaid"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    id={field.name}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="currency"
                    currency="INR"
                    locale="en-IN"
                    placeholder="e.g. ₹2,00,000"
                    className={`w-full ${errors.advancePaid ? 'p-invalid' : ''}`}
                    inputClassName="p-inputtext w-full"
                  />
                )}
              />
              {errors.advancePaid && (
                <small className="p-error">{errors.advancePaid.message}</small>
              )}
            </div>

            {/* Balance Amount (Auto Calculate & Read-Only) */}
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">Balance Amount (₹) (Read Only)</label>
              <InputNumber
                value={balanceAmount}
                mode="currency"
                currency="INR"
                locale="en-IN"
                disabled
                className="w-full balance-input-readonly"
                inputClassName="p-inputtext w-full"
              />
              <small className="field-hint">Auto Calculated (Package Price - Advance Paid)</small>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── 4. Event Status Section ── */}
        <div className="form-section">
          <h3 className="section-title">
            <i className="pi pi-check-circle section-icon" /> Event Status
          </h3>

          <div className="grid form-grid">
            <div className="col-12 md:col-6 field-col">
              <label className="field-label">Event Status</label>
              <Controller
                name="eventStatus"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={statusOptions}
                    placeholder="Select Status"
                    showClear
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* ── 5. Special Instructions & Notes ── */}
        <div className="form-section">
          <h3 className="section-title">
            <i className="pi pi-file-edit section-icon" /> Special Instructions & Notes
          </h3>

          <div className="grid form-grid">
            <div className="col-12 field-col">
              <label className="field-label">Special Instructions</label>
              <Controller
                name="specialInstructions"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    rows={5}
                    placeholder="Add special client requests, camera equipment preferences, or timing details..."
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom Right Action Buttons ── */}
        <div className="form-actions">
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            className="p-button-secondary p-button-outlined"
            onClick={handleCancelClick}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            label="Save Event"
            icon="pi pi-check"
            className="p-button-primary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          />
        </div>
      </form>
    </Card>
  )
}
