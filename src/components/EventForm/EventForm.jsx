import React, { useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { eventSchema } from '../../validation/eventSchema'
import { getClients } from '../../services/clientService'
import { getPackages, createPackage } from '../../services/packageService'
import { getStaff } from '../../services/staffService'
import { createEvent, updateEvent } from '../../services/eventService'
import { createClient } from '../../services/clientService'
import './EventForm.css'

export default function EventForm({ eventToEdit, prefillDate, onSuccess, onCancel }) {
  const toastRef = useRef(null)

  // API Data States
  const [clients, setClients] = useState([])
  const [packages, setPackages] = useState([])
  const [staff, setStaff] = useState({ photographers: [], videographers: [] })
  const [loadingData, setLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Custom Services State
  const [customServices, setCustomServices] = useState([])

  const handleAddCustomService = () => {
    setCustomServices((prev) => [
      ...prev,
      { id: `cs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', price: 0 }
    ])
  }

  const handleRemoveCustomService = (id) => {
    setCustomServices((prev) => prev.filter((s) => s.id !== id))
  }

  const handleCustomServiceChange = (id, field, value) => {
    setCustomServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const customServicesTotal = customServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0)

  // Coverage add-on to custom service mapping
  const coverageServiceMap = {
    droneRequired: 'Drone Aerial Shoot',
    liveStreaming: 'Live Youtube Stream',
    albumRequired: 'Printed Canvera Album',
    candidPhotography: 'Candid Photography',
    traditionalPhotography: 'Traditional Photography',
    traditionalVideo: 'Traditional Video'
  }

  // When a coverage checkbox is toggled, auto-add/remove from custom services list
  const handleCoverageToggle = (fieldName, checked, fieldOnChange) => {
    fieldOnChange(checked)
    if (!isCustomMode) return

    const serviceName = coverageServiceMap[fieldName]
    if (!serviceName) return

    if (checked) {
      // Add only if not already in the list
      const alreadyExists = customServices.some((s) => s.name === serviceName)
      if (!alreadyExists) {
        setCustomServices((prev) => [
          ...prev,
          { id: `cs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: serviceName, price: 0 }
        ])
      }
    } else {
      // Remove from list
      setCustomServices((prev) => prev.filter((s) => s.name !== serviceName))
    }
  }

  // Add Package Modal State
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false)
  const [newPkgName, setNewPkgName] = useState('')
  const [newPkgPrice, setNewPkgPrice] = useState(100000)
  const [newPkgCategory, setNewPkgCategory] = useState('Wedding')
  const [newPkgDesc, setNewPkgDesc] = useState('')
  const [newPkgDeliverables, setNewPkgDeliverables] = useState('')
  const [savingPackage, setSavingPackage] = useState(false)

  const handleSaveNewPackage = async () => {
    const pkgNameClean = (newPkgName || '').trim()
    const pkgPriceNum = Number(newPkgPrice) || 0

    if (!pkgNameClean) {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Package Name is required' })
      return
    }
    if (pkgPriceNum <= 0) {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid Package Price (greater than 0)' })
      return
    }

    setSavingPackage(true)
    try {
      const deliverablesArr = newPkgDeliverables
        ? newPkgDeliverables.split(',').map((s) => s.trim()).filter(Boolean)
        : []

      const createdPkg = await createPackage({
        name: pkgNameClean,
        price: pkgPriceNum,
        category: newPkgCategory,
        description: (newPkgDesc || '').trim(),
        deliverables: deliverablesArr,
      })

      if (createdPkg && (createdPkg.id || createdPkg._id)) {
        const pkgObj = {
          id: createdPkg.id || createdPkg._id,
          name: createdPkg.name || pkgNameClean,
          price: createdPkg.price || pkgPriceNum,
          category: createdPkg.category || newPkgCategory,
          description: createdPkg.description || '',
          deliverables: createdPkg.deliverables || deliverablesArr,
        }

        setPackages((prev) => [pkgObj, ...prev])
        setValue('packageId', pkgObj.id, { shouldValidate: true })
        setValue('packagePrice', pkgObj.price, { shouldValidate: true })

        toastRef.current?.show({
          severity: 'success',
          summary: 'Package Created',
          detail: `Package "${pkgObj.name}" created and selected!`,
        })

        setIsAddPackageOpen(false)
        setNewPkgName('')
        setNewPkgPrice(100000)
        setNewPkgCategory('Wedding')
        setNewPkgDesc('')
        setNewPkgDeliverables('')
      } else {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save package' })
      }
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to create package' })
    } finally {
      setSavingPackage(false)
    }
  }

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
    formState: { errors, isDirty, isValid }
  } = useForm({
    resolver: yupResolver(eventSchema),
    mode: 'onChange',
    defaultValues: {
      clientName: '',
      clientId: null,
      eventName: '',
      eventType: null,
      eventDate: null,
      eventTime: null,
      venueName: '',
      venueAddress: '',
      city: '',
      state: '',
      pincode: '',
      photographerId: null,
      videographerId: null,
      droneRequired: false,
      liveStreaming: false,
      albumRequired: false,
      candidPhotography: false,
      traditionalPhotography: false,
      traditionalVideo: false,
      packageId: null,
      packagePrice: 0,
      advancePaid: 0,
      eventStatus: 'Booked',
      specialInstructions: ''
    }
  })

  // Watch Form Values for Live Booking Summary Panel
  const watchClientName = watch('clientName') || 'Client'
  const watchEventName = watch('eventName') || 'New Event'
  const watchEventType = watch('eventType') || 'Shoot'
  const watchEventDate = watch('eventDate')
  const watchPackageId = watch('packageId')
  const watchPackagePrice = watch('packagePrice')
  const watchAdvancePaid = watch('advancePaid')
  const watchPhotographerId = watch('photographerId')
  const watchVideographerId = watch('videographerId')
  const watchDroneRequired = watch('droneRequired')
  const watchLiveStreaming = watch('liveStreaming')
  const watchAlbumRequired = watch('albumRequired')
  const watchCandidPhotography = watch('candidPhotography')
  const watchTraditionalPhotography = watch('traditionalPhotography')
  const watchTraditionalVideo = watch('traditionalVideo')

  // Derived Safe Numeric Calculations (Prevents NaN crashes)
  const safePkgPrice = typeof watchPackagePrice === 'number' ? watchPackagePrice : (parseFloat(watchPackagePrice) || 0)
  const safeAdvPaid = typeof watchAdvancePaid === 'number' ? watchAdvancePaid : (parseFloat(watchAdvancePaid) || 0)
  const combinedPrice = safePkgPrice + customServicesTotal
  const balanceAmount = Math.max(0, combinedPrice - safeAdvPaid)
  const gstAmount = Math.round(combinedPrice * 0.18)
  const totalValueWithGst = combinedPrice + gstAmount

  // Pre-fill form when eventToEdit is passed
  useEffect(() => {
    if (eventToEdit) {
      const raw = eventToEdit.rawEvent || eventToEdit
      const dateVal = raw.eventDate || eventToEdit.date
      let parsedDate = null
      if (dateVal) {
        parsedDate = new Date(dateVal)
        if (isNaN(parsedDate.getTime())) parsedDate = null
      }

      const parsePrice = (val) => {
        if (typeof val === 'number') return val
        if (!val) return 0
        return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0
      }

      const pkgPrice = raw.packageAmount || parsePrice(eventToEdit.totalAmount) || 150000
      const advPaid = raw.totalPaid || raw.advanceAmount || parsePrice(eventToEdit.paidAmount) || 0

      reset({
        clientName: eventToEdit.couple || raw.eventName || (raw.clientId ? `${raw.clientId.firstName || ''} ${raw.clientId.lastName || ''}`.trim() : ''),
        clientId: raw.clientId?._id || raw.clientId || null,
        eventName: raw.eventName || eventToEdit.couple || '',
        eventType: raw.eventType || eventToEdit.eventType || 'Wedding',
        eventDate: parsedDate,
        eventTime: null,
        venueName: raw.venue || eventToEdit.venue || '',
        venueAddress: raw.venueAddress || '',
        city: raw.city || '',
        state: raw.state || '',
        pincode: raw.pincode || '',
        photographerId: raw.assignedPhotographers?.[0]?._id || raw.photographerId || null,
        videographerId: raw.assignedVideographers?.[0]?._id || raw.videographerId || null,
        droneRequired: !!raw.droneRequired,
        liveStreaming: !!raw.liveStreaming,
        albumRequired: !!raw.albumRequired,
        candidPhotography: !!raw.candidPhotography,
        traditionalPhotography: !!raw.traditionalPhotography,
        traditionalVideo: !!raw.traditionalVideo,
        packageId: raw.packageId || null,
        packagePrice: pkgPrice,
        advancePaid: advPaid,
        eventStatus: raw.status || eventToEdit.status || 'Confirmed',
        specialInstructions: raw.notes || ''
      })
    }
  }, [eventToEdit, reset])

  // Pre-fill date when navigating from calendar date click (new event only)
  useEffect(() => {
    if (!eventToEdit && prefillDate) {
      const parsed = new Date(prefillDate)
      if (!isNaN(parsed.getTime())) {
        setValue('eventDate', parsed, { shouldDirty: false, shouldValidate: true })
      }
    }
  }, [prefillDate, eventToEdit, setValue])

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

  // Whether "Custom Services" is selected in the dropdown
  const isCustomMode = watchPackageId === 'CUSTOM_SERVICES'

  // Build dropdown options: real packages + "Custom Services" separator
  const packageDropdownOptions = [
    ...packages,
    { id: 'CUSTOM_SERVICES', name: '✦ Add Custom Services' }
  ]

  // Auto-fill Package Price when Package is selected
  const handlePackageChange = (selectedPkgId, onChange) => {
    onChange(selectedPkgId)
    if (selectedPkgId === 'CUSTOM_SERVICES') {
      setValue('packagePrice', 0, { shouldValidate: true })
      // Auto-add one blank service row if none exist
      if (customServices.length === 0) {
        handleAddCustomService()
      }
    } else {
      const selectedPkg = packages.find((p) => p.id === selectedPkgId)
      if (selectedPkg) {
        setValue('packagePrice', selectedPkg.price, { shouldValidate: true })
      }
      // Clear custom services when switching to a predefined package
      setCustomServices([])
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
          const lastName = nameParts.slice(1).join(' ') || ''
          const newClient = await createClient({
            firstName,
            lastName,
            phone: '+91 98765 43210',
            email: 'client@example.com',
            city: data.city || 'Bengaluru',
            status: 'active'
          })
          if (newClient && (newClient._id || newClient.id)) {
            clientId = newClient._id || newClient.id
          }
        }
      }

      const selectedPkg = packages.find((p) => (p.id === data.packageId || p._id === data.packageId))
      const backendPayload = {
        clientId: clientId || '6a773edbf7cc32adc5f12f7f',
        clientName: data.clientName || 'Valued Client',
        clientPhone: '+91 98765 43210',
        clientEmail: 'client@example.com',
        eventName: data.eventName || `${data.clientName || 'Special'} Event`,
        eventType: data.eventType || 'Wedding',
        eventDate: data.eventDate ? new Date(data.eventDate).toISOString() : new Date().toISOString(),
        startTime: data.eventTime ? new Date(data.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
        endTime: '10:00 PM',
        venue: data.venueName || 'Studio Ballroom',
        venueAddress: data.venueAddress || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        package: selectedPkg ? selectedPkg.name : (customServices.length > 0 ? 'Custom Services' : 'Custom Photography Package'),
        packageAmount: Number(data.packagePrice || 0) + customServicesTotal,
        advanceAmount: Number(data.advancePaid || 0),
        balanceAmount: Math.max(0, (Number(data.packagePrice || 0) + customServicesTotal) - Number(data.advancePaid || 0)),
        customServices: customServices.filter((s) => s.name.trim()).map((s) => ({ name: s.name.trim(), price: Number(s.price) || 0 })),
        photographer: selectedPhotographerObj ? selectedPhotographerObj.name : 'Lead Photographer',
        videographer: selectedVideographerObj ? selectedVideographerObj.name : 'Lead Videographer',
        droneRequired: !!data.droneRequired,
        liveStreaming: !!data.liveStreaming,
        albumRequired: !!data.albumRequired,
        candidPhotography: !!data.candidPhotography,
        traditionalPhotography: !!data.traditionalPhotography,
        traditionalVideo: !!data.traditionalVideo,
        status: data.eventStatus || 'Confirmed',
        notes: data.specialInstructions || ''
      }

      const isEditing = !!(eventToEdit && (eventToEdit._id || eventToEdit.id || eventToEdit.rawEvent?._id))
      const targetId = eventToEdit?.rawEvent?._id || eventToEdit?._id || eventToEdit?.id

      let res
      if (isEditing && targetId && !String(targetId).startsWith('EVT-')) {
        res = await updateEvent(targetId, backendPayload)
      } else {
        res = await createEvent(backendPayload)
      }

      if (!res || res.success === false) {
        throw new Error(res?.message || 'Failed to save event to database.')
      }

      const createdEventData = res?.data || res
      const eventId = createdEventData?._id || createdEventData?.id || targetId || `EVT-${Date.now()}`
      const fullEventData = {
        _id: eventId,
        id: eventId,
        ...backendPayload,
        ...(createdEventData || {})
      }

      toastRef.current?.show({
        severity: 'success',
        summary: isEditing ? 'Event Booking Updated' : 'Event Booking Confirmed',
        detail: isEditing ? `Booking #${eventId} details updated successfully!` : `Booking #${eventId} saved to studio database!`,
        life: 3000
      })

      reset()
      if (onSuccess) {
        setTimeout(() => onSuccess(fullEventData), 1000)
      }
    } catch (error) {
      console.error('Error submitting event to backend:', error)
      toastRef.current?.show({
        severity: 'error',
        summary: 'Submission Error',
        detail: error.message || 'Failed to save event to backend.',
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
        message: 'You have unsaved changes in this event booking. Are you sure you want to discard them?',
        header: 'Discard Unsaved Booking',
        icon: 'pi pi-exclamation-triangle',
        acceptClassName: 'p-button-danger',
        accept: () => onCancel && onCancel()
      })
    } else {
      if (onCancel) onCancel()
    }
  }

  const selectedPackageObj = Array.isArray(packages) ? packages.find((p) => p && (p.id === watchPackageId || p._id === watchPackageId)) : null
  const selectedPhotographerObj = staff?.photographers && Array.isArray(staff.photographers) ? staff.photographers.find((p) => p && (p.id === watchPhotographerId || p._id === watchPhotographerId)) : null
  const selectedVideographerObj = staff?.videographers && Array.isArray(staff.videographers) ? staff.videographers.find((v) => v && (v.id === watchVideographerId || v._id === watchVideographerId)) : null

  return (
    <div className="enterprise-event-wrapper">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <form onSubmit={handleSubmit(onSubmit)} className="enterprise-event-layout">
        {/* ── LEFT COLUMN: MAIN FORM CARDS (8 Cols) ── */}
        <div className="enterprise-form-main">

          {/* CARD 1: CLIENT & EVENT BASIC INFORMATION */}
          <div className="ent-card">
            <div className="ent-card-header">
              <div className="ent-card-header__left">
                <div className="ent-card-icon ent-card-icon--blue">
                  <i className="pi pi-user" />
                </div>
                <div>
                  <h2 className="ent-card-title">Client & Event Information</h2>
                  <p className="ent-card-sub">Primary contact details, event title, and date schedule</p>
                </div>
              </div>
              <span className="ent-card-badge ent-card-badge--blue">Step 1 of 4</span>
            </div>

            <div className="ent-card-body">
              <div className="form-grid">
                {/* Client Name */}
                <div className="col-12 md:col-6 field-col">
                  <label className="field-label">
                    Client / Couple Name <span className="req-star">*</span>
                  </label>
                  <Controller
                    name="clientName"
                    control={control}
                    render={({ field }) => (
                      <InputText
                        id={field.name}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="e.g. Anand & Priya"
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
                    Event Title / Heading <span className="req-star">*</span>
                  </label>
                  <Controller
                    name="eventName"
                    control={control}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        placeholder='e.g. "Anand & Priya Grand Wedding"'
                        className={`w-full ${errors.eventName ? 'p-invalid' : ''}`}
                      />
                    )}
                  />
                  {errors.eventName && (
                    <small className="p-error">{errors.eventName.message}</small>
                  )}
                </div>

                {/* Event Type */}
                <div className="col-12 md:col-4 field-col">
                  <label className="field-label">
                    Event Category <span className="req-star">*</span>
                  </label>
                  <Controller
                    name="eventType"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={eventTypeOptions}
                        placeholder="Select Category"
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
                <div className="col-12 md:col-4 field-col">
                  <label className="field-label">
                    Shoot Date <span className="req-star">*</span>
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
                <div className="col-12 md:col-4 field-col">
                  <label className="field-label">Reporting Time</label>
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
                        placeholder="e.g. 10:00 AM"
                        className="w-full"
                        inputClassName="p-inputtext w-full"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: VENUE & LOCATION DETAILS */}
          <div className="ent-card">
            <div className="ent-card-header">
              <div className="ent-card-header__left">
                <div className="ent-card-icon ent-card-icon--amber">
                  <i className="pi pi-map-marker" />
                </div>
                <div>
                  <h2 className="ent-card-title">Venue & Location Specifications</h2>
                  <p className="ent-card-sub">Hall name, street address, city, and pincode location</p>
                </div>
              </div>
              <span className="ent-card-badge ent-card-badge--amber">Step 2 of 4</span>
            </div>

            <div className="ent-card-body">
              <div className="form-grid">
                {/* Venue Name */}
                <div className="col-12 md:col-6 field-col">
                  <label className="field-label">
                    Venue / Hall Name <span className="req-star">*</span>
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

                {/* City */}
                <div className="col-12 md:col-6 field-col">
                  <label className="field-label">City</label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <InputText {...field} placeholder="e.g. Chennai / Bengaluru" className="p-inputtext w-full" />
                    )}
                  />
                </div>

                {/* Venue Address */}
                <div className="col-12 field-col">
                  <label className="field-label">Street Address & Landmark</label>
                  <Controller
                    name="venueAddress"
                    control={control}
                    render={({ field }) => (
                      <InputTextarea
                        {...field}
                        rows={2}
                        placeholder="Enter full venue address or driving directions for camera crew..."
                        className="p-inputtext w-full"
                      />
                    )}
                  />
                </div>

                {/* State */}
                <div className="col-12 md:col-6 field-col">
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
                <div className="col-12 md:col-6 field-col">
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
          </div>

          {/* CARD 3: CREW ASSIGNMENTS & PHOTOGRAPHY COVERAGE */}
          <div className="ent-card">
            <div className="ent-card-header">
              <div className="ent-card-header__left">
                <div className="ent-card-icon ent-card-icon--purple">
                  <i className="pi pi-camera" />
                </div>
                <div>
                  <h2 className="ent-card-title">Crew Assignment & Deliverable Options</h2>
                  <p className="ent-card-sub">Assigned lead staff and coverage add-ons</p>
                </div>
              </div>
              <span className="ent-card-badge ent-card-badge--purple">Step 3 of 4</span>
            </div>

            <div className="ent-card-body">
              <div className="form-grid">
                {/* Lead Photographer */}
                <div className="col-12 md:col-6 field-col">
                  <label className="field-label">Lead Photographer</label>
                  <Controller
                    name="photographerId"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={staff.photographers}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Lead Photographer"
                        showClear
                        className="w-full"
                        disabled={loadingData}
                      />
                    )}
                  />
                </div>

                {/* Lead Videographer */}
                <div className="col-12 md:col-6 field-col">
                  <label className="field-label">Lead Videographer</label>
                  <Controller
                    name="videographerId"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={staff.videographers}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Lead Videographer"
                        showClear
                        className="w-full"
                        disabled={loadingData}
                      />
                    )}
                  />
                </div>

                {/* Checkbox Coverage Grid */}
                <div className="col-12">
                  <label className="field-label mb-2 display-block">Coverage Add-ons & Deliverable Requirements</label>
                  <div className="ent-coverage-grid">

                    <div className={`ent-coverage-card ${watchDroneRequired ? 'is-selected' : ''}`}>
                      <Controller
                        name="droneRequired"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            inputId="droneRequired"
                            checked={field.value}
                            onChange={(e) => handleCoverageToggle('droneRequired', e.checked, field.onChange)}
                          />
                        )}
                      />
                      <label htmlFor="droneRequired" className="ent-coverage-label">
                        <i className="pi pi-send text-primary" />
                        <div>
                          <strong>Drone Aerial Shoot</strong>
                          <span>4K aerial video & photos</span>
                        </div>
                      </label>
                    </div>

                    <div className={`ent-coverage-card ${watchLiveStreaming ? 'is-selected' : ''}`}>
                      <Controller
                        name="liveStreaming"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            inputId="liveStreaming"
                            checked={field.value}
                            onChange={(e) => handleCoverageToggle('liveStreaming', e.checked, field.onChange)}
                          />
                        )}
                      />
                      <label htmlFor="liveStreaming" className="ent-coverage-label">
                        <i className="pi pi-video text-purple-600" />
                        <div>
                          <strong>Live Youtube Stream</strong>
                          <span>Multi-cam webcast</span>
                        </div>
                      </label>
                    </div>

                    <div className={`ent-coverage-card ${watchAlbumRequired ? 'is-selected' : ''}`}>
                      <Controller
                        name="albumRequired"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            inputId="albumRequired"
                            checked={field.value}
                            onChange={(e) => handleCoverageToggle('albumRequired', e.checked, field.onChange)}
                          />
                        )}
                      />
                      <label htmlFor="albumRequired" className="ent-coverage-label">
                        <i className="pi pi-book text-amber-600" />
                        <div>
                          <strong>Printed Canvera Album</strong>
                          <span>HD synthetic photobook</span>
                        </div>
                      </label>
                    </div>

                    <div className={`ent-coverage-card ${watchCandidPhotography ? 'is-selected' : ''}`}>
                      <Controller
                        name="candidPhotography"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            inputId="candidPhotography"
                            checked={field.value}
                            onChange={(e) => handleCoverageToggle('candidPhotography', e.checked, field.onChange)}
                          />
                        )}
                      />
                      <label htmlFor="candidPhotography" className="ent-coverage-label">
                        <i className="pi pi-camera text-pink-600" />
                        <div>
                          <strong>Candid Photography</strong>
                          <span>Cinematic portrait shots</span>
                        </div>
                      </label>
                    </div>

                    <div className={`ent-coverage-card ${watchTraditionalPhotography ? 'is-selected' : ''}`}>
                      <Controller
                        name="traditionalPhotography"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            inputId="traditionalPhotography"
                            checked={field.value}
                            onChange={(e) => handleCoverageToggle('traditionalPhotography', e.checked, field.onChange)}
                          />
                        )}
                      />
                      <label htmlFor="traditionalPhotography" className="ent-coverage-label">
                        <i className="pi pi-image text-green-600" />
                        <div>
                          <strong>Traditional Photo</strong>
                          <span>Stage & family coverage</span>
                        </div>
                      </label>
                    </div>

                    <div className={`ent-coverage-card ${watchTraditionalVideo ? 'is-selected' : ''}`}>
                      <Controller
                        name="traditionalVideo"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            inputId="traditionalVideo"
                            checked={field.value}
                            onChange={(e) => handleCoverageToggle('traditionalVideo', e.checked, field.onChange)}
                          />
                        )}
                      />
                      <label htmlFor="traditionalVideo" className="ent-coverage-label">
                        <i className="pi pi-film text-blue-600" />
                        <div>
                          <strong>Traditional Video</strong>
                          <span>Full event documentary</span>
                        </div>
                      </label>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: PACKAGE PRICING & COMMERCIAL TERMS */}
          <div className="ent-card">
            <div className="ent-card-header">
              <div className="ent-card-header__left">
                <div className="ent-card-icon ent-card-icon--green">
                  <i className="pi pi-wallet" />
                </div>
                <div>
                  <h2 className="ent-card-title">Package Pricing & Advance Financial Terms</h2>
                  <p className="ent-card-sub">Selected package, advance collection, and balance calculation</p>
                </div>
              </div>
              <span className="ent-card-badge ent-card-badge--green">Step 4 of 4</span>
            </div>

            <div className="ent-card-body">
              <div className="form-grid">
                {/* Package Dropdown */}
                <div className={`${isCustomMode ? 'col-12' : 'col-12 md:col-6'} field-col`}>
                  <div className="flex align-items-center justify-content-between mb-1">
                    <label className="field-label mb-0">
                      Photography Package <span className="req-star">*</span>
                    </label>
                    <Button
                      type="button"
                      label="+ Add Package"
                      icon="pi pi-plus"
                      className="p-button-text p-button-sm p-button-primary py-0 px-2 text-xs font-bold"
                      onClick={() => setIsAddPackageOpen(true)}
                    />
                  </div>
                  <Controller
                    name="packageId"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        value={field.value}
                        options={packageDropdownOptions}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => handlePackageChange(e.value, field.onChange)}
                        placeholder={loadingData ? 'Loading Packages...' : 'Select Package or Custom Services'}
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

                {/* Package Price - Only show when NOT in custom mode */}
                {!isCustomMode && (
                  <div className="col-12 md:col-6 field-col">
                    <label className="field-label">
                      Package Base Price (₹) <span className="req-star">*</span>
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
                )}

                {/* Advance Paid */}
                <div className="col-12 md:col-4 field-col">
                  <label className="field-label">
                    Advance Amount Paid (₹) <span className="req-star">*</span>
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
                        placeholder="e.g. ₹2,50,000"
                        className={`w-full ${errors.advancePaid ? 'p-invalid' : ''}`}
                        inputClassName="p-inputtext w-full"
                      />
                    )}
                  />
                  {errors.advancePaid && (
                    <small className="p-error">{errors.advancePaid.message}</small>
                  )}
                </div>

                {/* Balance Amount (Auto Calculate) */}
                <div className="col-12 md:col-4 field-col">
                  <label className="field-label">Balance Due (₹) (Read Only)</label>
                  <InputNumber
                    value={balanceAmount}
                    mode="currency"
                    currency="INR"
                    locale="en-IN"
                    disabled
                    className="w-full balance-input-readonly"
                    inputClassName="p-inputtext w-full"
                  />
                  <small className="field-hint">Auto Calculated (Price - Advance)</small>
                </div>

                {/* Event Booking Status */}
                <div className="col-12 md:col-4 field-col">
                  <label className="field-label">Booking Status</label>
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

                {/* ── Custom Services Section (only shown when Custom Services selected) ── */}
                {isCustomMode && (
                  <div className="col-12 field-col">
                    <div className="ent-custom-services">
                      <div className="ent-custom-services__header">
                        <div className="ent-custom-services__title">
                          <div className="ent-custom-services__icon">
                            <i className="pi pi-list" />
                          </div>
                          <div>
                            <strong>Custom Services & Pricing</strong>
                            <span>Add each service with its own price — total is calculated automatically</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          label="Add Service"
                          icon="pi pi-plus"
                          className="p-button-sm p-button-primary"
                          onClick={handleAddCustomService}
                        />
                      </div>

                      {customServices.length > 0 && (
                        <div className="ent-custom-services__list">
                          <div className="ent-custom-services__list-header">
                            <span className="ent-cs-col-num">#</span>
                            <span className="ent-cs-col-name">Service Name</span>
                            <span className="ent-cs-col-price">Price (₹)</span>
                            <span className="ent-cs-col-action"></span>
                          </div>
                          {customServices.map((svc, idx) => (
                            <div key={svc.id} className="ent-custom-service-row">
                              <span className="ent-custom-service-row__num">{idx + 1}</span>
                              <div className="ent-custom-service-row__name-wrap">
                                <InputText
                                  value={svc.name}
                                  onChange={(e) => handleCustomServiceChange(svc.id, 'name', e.target.value)}
                                  placeholder="e.g. Candid Photography, Drone Shoot, LED Screen"
                                  className="w-full"
                                />
                              </div>
                              <div className="ent-custom-service-row__price-wrap">
                                <InputNumber
                                  value={svc.price}
                                  onValueChange={(e) => handleCustomServiceChange(svc.id, 'price', e.value)}
                                  mode="currency"
                                  currency="INR"
                                  locale="en-IN"
                                  placeholder="₹ 0"
                                  className="w-full"
                                  inputClassName="w-full"
                                />
                              </div>
                              <Button
                                type="button"
                                icon="pi pi-trash"
                                className="p-button-text p-button-plain p-button-sm ent-custom-service-row__del"
                                onClick={() => handleRemoveCustomService(svc.id)}
                                tooltip="Remove service"
                                tooltipOptions={{ position: 'top' }}
                              />
                            </div>
                          ))}

                          <div className="ent-custom-services-total">
                            <div className="ent-custom-services-total__label">
                              <i className="pi pi-calculator" />
                              <span>Total ({customServices.length} service{customServices.length !== 1 ? 's' : ''})</span>
                            </div>
                            <strong>₹{customServicesTotal.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                      )}

                      {customServices.length === 0 && (
                        <div className="ent-custom-services__empty">
                          <i className="pi pi-info-circle" />
                          <span>Click "Add Service" to start adding custom services with individual pricing.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Instructions & Notes */}
                <div className="col-12 field-col">
                  <label className="field-label">Special Instructions & Client Preferences</label>
                  <Controller
                    name="specialInstructions"
                    control={control}
                    render={({ field }) => (
                      <InputTextarea
                        {...field}
                        rows={3}
                        placeholder="Enter custom song selections, camera gear preferences, client requests, or family photo lists..."
                        className="w-full"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: LIVE BOOKING SUMMARY CARD (4 Cols - Sticky) ── */}
        <div className="enterprise-form-sidebar">
          <div className="ent-summary-card">
            <div className="ent-summary-header">
              <div>
                <span className="ent-summary-tag">
                  <i className="pi pi-circle-fill text-green-500" /> LIVE TERMINAL
                </span>
                <h3 className="ent-summary-title">Booking Summary</h3>
              </div>
              <i className="pi pi-file-edit text-primary text-xl" />
            </div>

            <div className="ent-summary-body">
              {/* Client & Event Info */}
              <div className="ent-summary-item">
                <span className="ent-summary-lbl">Client Name</span>
                <strong className="ent-summary-val">{watchClientName || 'Not Specified'}</strong>
              </div>

              <div className="ent-summary-item">
                <span className="ent-summary-lbl">Event Title</span>
                <span className="ent-summary-val text-sm">{watchEventName || 'New Event'}</span>
              </div>

              <div className="ent-summary-item">
                <span className="ent-summary-lbl">Category & Date</span>
                <span className="ent-summary-val text-sm">
                  {watchEventType} {watchEventDate ? `• ${new Date(watchEventDate).toLocaleDateString()}` : ''}
                </span>
              </div>

              <div className="ent-summary-divider" />

              {/* Package & Financial Breakdown */}
              <div className="ent-summary-item">
                <span className="ent-summary-lbl">Selected Package</span>
                <strong className="ent-summary-val text-primary">
                  {isCustomMode ? 'Custom Services' : (selectedPackageObj?.name || 'Not Selected')}
                </strong>
              </div>

              {/* Show package price when NOT in custom mode */}
              {!isCustomMode && (
                <div className="ent-summary-item">
                  <span className="ent-summary-lbl">Package Base Price</span>
                  <span className="ent-summary-val">₹{safePkgPrice.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Show custom services breakdown when in custom mode */}
              {isCustomMode && customServices.length > 0 && (
                <>
                  {customServices.filter((s) => s.name.trim()).map((svc) => (
                    <div className="ent-summary-item text-xs" key={svc.id}>
                      <span className="ent-summary-lbl" style={{ maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <i className="pi pi-check-circle text-xs mr-1" style={{ color: '#16a34a' }} />{svc.name}
                      </span>
                      <span className="ent-summary-val">₹{(Number(svc.price) || 0).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="ent-summary-item" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '4px', marginTop: '2px' }}>
                    <span className="ent-summary-lbl font-semibold">Services Total</span>
                    <strong className="ent-summary-val text-primary">₹{customServicesTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </>
              )}

              <div className="ent-summary-item text-xs text-muted">
                <span className="ent-summary-lbl">Est. GST (18%)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="ent-summary-item">
                <span className="ent-summary-lbl font-semibold">Advance Amount Paid</span>
                <span className="ent-summary-val text-green-600 font-bold">₹{safeAdvPaid.toLocaleString('en-IN')}</span>
              </div>

              {/* Highlighted Balance Box */}
              <div className="ent-summary-balance-box">
                <div className="text-xs font-bold uppercase text-600">Remaining Balance Due</div>
                <div className="text-2xl font-extrabold text-red-600">₹{balanceAmount.toLocaleString()}</div>
                <div className="text-xs text-500">Collect prior to final album/video delivery</div>
              </div>

              <div className="ent-summary-divider" />

              {/* Assigned Staff Summary */}
              <div className="ent-summary-item">
                <span className="ent-summary-lbl">Photographer</span>
                <span className="ent-summary-val text-sm">{selectedPhotographerObj?.name || 'Unassigned'}</span>
              </div>

              <div className="ent-summary-item">
                <span className="ent-summary-lbl">Videographer</span>
                <span className="ent-summary-val text-sm">{selectedVideographerObj?.name || 'Unassigned'}</span>
              </div>

              {/* Coverage Badges */}
              <div className="mt-1">
                <span className="ent-summary-lbl display-block mb-1">Included Services</span>
                <div className="flex flex-wrap gap-1">
                  {watchDroneRequired && <span className="ent-pill ent-pill--blue">Drone</span>}
                  {watchLiveStreaming && <span className="ent-pill ent-pill--purple">Live Stream</span>}
                  {watchAlbumRequired && <span className="ent-pill ent-pill--amber">Album</span>}
                  {watchCandidPhotography && <span className="ent-pill ent-pill--pink">Candid</span>}
                  {watchTraditionalPhotography && <span className="ent-pill ent-pill--green">Trad Photo</span>}
                  {watchTraditionalVideo && <span className="ent-pill ent-pill--teal">Trad Video</span>}
                </div>
              </div>
            </div>

            {/* Sidebar Sticky Actions */}
            <div className="ent-summary-footer">
              <Button
                type="submit"
                label={eventToEdit ? 'Update Booking' : 'Confirm & Save Event'}
                icon="pi pi-check"
                className="p-button-primary w-full"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              />

              <Button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                className="p-button-outlined p-button-secondary w-full p-button-sm mt-1"
                onClick={handleCancelClick}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

      </form>

      {/* ── CREATE NEW PACKAGE DIALOG ── */}
      <Dialog
        header="Create New Photography Package"
        visible={isAddPackageOpen}
        style={{ width: '520px', maxWidth: '95vw' }}
        onHide={() => setIsAddPackageOpen(false)}
        dismissableMask
      >
        <div className="flex flex-column gap-3 py-2">
          <div>
            <label className="font-semibold text-sm mb-1 block">Package Name <span className="text-red-500">*</span></label>
            <InputText
              value={newPkgName}
              onChange={(e) => setNewPkgName(e.target.value)}
              placeholder="e.g. Destination Luxury Package"
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold text-sm mb-1 block">Package Base Price (₹) <span className="text-red-500">*</span></label>
            <InputNumber
              value={newPkgPrice}
              onValueChange={(e) => setNewPkgPrice(e.value)}
              mode="currency"
              currency="INR"
              locale="en-IN"
              className="w-full"
              inputClassName="w-full"
            />
          </div>

          <div>
            <label className="font-semibold text-sm mb-1 block">Category / Event Type</label>
            <Dropdown
              value={newPkgCategory}
              options={[
                { label: 'Wedding', value: 'Wedding' },
                { label: 'Engagement', value: 'Engagement' },
                { label: 'Reception', value: 'Reception' },
                { label: 'Birthday', value: 'Birthday' },
                { label: 'Corporate', value: 'Corporate' },
                { label: 'Portrait', value: 'Portrait' },
                { label: 'Other', value: 'Other' }
              ]}
              onChange={(e) => setNewPkgCategory(e.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold text-sm mb-1 block">Package Description</label>
            <InputTextarea
              value={newPkgDesc}
              onChange={(e) => setNewPkgDesc(e.target.value)}
              placeholder="Full day coverage, 2 lead photographers, candid & drone..."
              rows={2}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold text-sm mb-1 block">Key Deliverables (comma separated)</label>
            <InputText
              value={newPkgDeliverables}
              onChange={(e) => setNewPkgDeliverables(e.target.value)}
              placeholder="e.g. 2 Photographers, 1 Drone, Canvera Album, Reels"
              className="w-full"
            />
          </div>

          <div className="flex justify-content-end gap-2 mt-3 pt-2 surface-border border-top-1">
            <Button
              type="button"
              label="Cancel"
              className="p-button-text p-button-secondary"
              onClick={() => setIsAddPackageOpen(false)}
            />
            <Button
              type="button"
              label="Create & Select Package"
              icon="pi pi-check"
              className="p-button-primary"
              loading={savingPackage}
              onClick={handleSaveNewPackage}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
