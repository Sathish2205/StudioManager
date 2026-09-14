import React, { useState, useEffect } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { getDashboardData } from '../../services/dashboardService'
import './SmartReminders.css'

// Auto-generate reminders from real backend data
const buildRemindersFromData = (dashData) => {
  if (!dashData) return []
  const reminders = []
  const today = new Date()
  let idCounter = 100

  // Generate reminders from recent events
  if (dashData.recentEvents && dashData.recentEvents.length > 0) {
    dashData.recentEvents.forEach((evt) => {
      const clientName = evt.clientId
        ? `${evt.clientId.firstName || ''} ${evt.clientId.lastName || ''}`.trim()
        : evt.clientName || 'Client'
      const eventDate = evt.eventDate ? new Date(evt.eventDate) : null
      const eventName = evt.eventName || evt.eventType || 'Event'
      const venue = evt.venueName || evt.venue || 'Venue TBD'
      const status = evt.eventStatus || evt.status || 'Booked'

      // Upcoming event reminder (within next 7 days)
      if (eventDate && eventDate >= today) {
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
        if (diffDays <= 7) {
          idCounter++
          reminders.push({
            id: `REM-${idCounter}`,
            category: 'wedding',
            categoryLabel: `Upcoming ${evt.eventType || 'Event'}`,
            icon: 'pi pi-calendar-plus',
            badgeClass: diffDays <= 1 ? 'sr-badge--danger' : 'sr-badge--warning',
            title: `🔔 ${eventName} for ${clientName} ${diffDays <= 1 ? 'is tomorrow' : `is in ${diffDays} days`}`,
            details: [
              { label: 'Client', val: clientName },
              { label: 'Venue', val: `${venue}${evt.city ? `, ${evt.city}` : ''}` },
              { label: 'Event Date', val: eventDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
            ],
            daysLeft: diffDays <= 1 ? 'Tomorrow' : `${diffDays} days left`,
            whatsappMsg: `Reminder: ${eventName} for ${clientName} on ${eventDate.toLocaleDateString('en-IN')} at ${venue}.`,
            unread: true,
            completed: false
          })
        }
      }

      // Pending payment reminder
      const packageAmt = Number(evt.packageAmount) || 0
      const totalPaid = Number(evt.totalPaid) || 0
      const remaining = packageAmt - totalPaid
      if (remaining > 0 && status !== 'Cancelled') {
        idCounter++
        reminders.push({
          id: `REM-${idCounter}`,
          category: 'advance',
          categoryLabel: 'Pending Payment',
          icon: 'pi pi-wallet',
          badgeClass: 'sr-badge--danger',
          title: `💰 Pending payment of ₹${remaining.toLocaleString('en-IN')} from ${clientName}`,
          details: [
            { label: 'Client', val: clientName },
            { label: 'Amount Due', val: `₹${remaining.toLocaleString('en-IN')} (of ₹${packageAmt.toLocaleString('en-IN')} Package)` },
            { label: 'Event', val: eventName }
          ],
          daysLeft: 'Pending',
          whatsappMsg: `Dear ${clientName}, gentle reminder regarding the pending payment of ₹${remaining.toLocaleString('en-IN')} for your ${eventName}.`,
          unread: true,
          completed: false
        })
      }
    })
  }

  // Pending tasks reminder
  if (dashData.pendingTasks > 0) {
    idCounter++
    reminders.push({
      id: `REM-${idCounter}`,
      category: 'editing',
      categoryLabel: 'Pending Tasks',
      icon: 'pi pi-video',
      badgeClass: 'sr-badge--warning',
      title: `🎬 ${dashData.pendingTasks} editing/delivery task${dashData.pendingTasks > 1 ? 's' : ''} pending`,
      details: [
        { label: 'Pending Tasks', val: `${dashData.pendingTasks} task${dashData.pendingTasks > 1 ? 's' : ''} awaiting completion` },
        { label: 'Action', val: 'Review and assign editors for pending deliverables' }
      ],
      daysLeft: 'Active',
      whatsappMsg: `Reminder: ${dashData.pendingTasks} editing tasks are pending. Please review the Editing & Deliverables module.`,
      unread: false,
      completed: false
    })
  }

  return reminders
}

export default function SmartReminders({ onShowToast }) {
  const [reminders, setReminders] = useState([])
  const [filterCategory, setFilterCategory] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('wedding')
  const [newPhotographer, setNewPhotographer] = useState('')
  const [newReporting, setNewReporting] = useState('')
  const [newVenue, setNewVenue] = useState('')

  // Fetch real data and auto-generate reminders
  useEffect(() => {
    async function loadReminders() {
      setLoading(true)
      const data = await getDashboardData()
      const autoReminders = buildRemindersFromData(data)
      setReminders(autoReminders)
      setLoading(false)
    }
    loadReminders()
  }, [])

  const handleActionClick = (rem) => {
    if (onShowToast) {
      onShowToast(`📲 WhatsApp notification sent for "${rem.title}"!`)
    }
  }

  const handleToggleComplete = (id) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.completed
          if (onShowToast) {
            onShowToast(nextState ? `✅ Reminder marked completed` : `Reminder restored`)
          }
          return { ...r, completed: nextState, unread: false }
        }
        return r
      })
    )
  }

  const handleMarkAllRead = () => {
    setReminders((prev) => prev.map((r) => ({ ...r, unread: false })))
    if (onShowToast) onShowToast('All smart reminders marked as read')
  }

  const handleCreateReminder = () => {
    if (!newTitle.trim()) return

    const newRem = {
      id: `REM-${200 + reminders.length + 1}`,
      category: newCategory,
      categoryLabel: newCategory.toUpperCase(),
      icon: 'pi pi-bell',
      badgeClass: 'sr-badge--warning',
      title: `🔔 ${newTitle}`,
      details: [
        { label: 'Photographer assigned', val: newPhotographer || 'Assigned Crew' },
        { label: 'Reporting', val: newReporting || '8:00 AM' },
        { label: 'Venue', val: newVenue || 'Studio / On Location' }
      ],
      daysLeft: 'Upcoming',
      whatsappMsg: `Reminder: ${newTitle} at ${newVenue}`,
      unread: true,
      completed: false
    }

    setReminders([newRem, ...reminders])
    setIsAddOpen(false)
    setNewTitle('')
    setNewPhotographer('')
    setNewReporting('')
    setNewVenue('')
    if (onShowToast) onShowToast(`New Smart Reminder created successfully!`)
  }

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Upcoming Events', value: 'wedding' },
    { label: 'Pending Payment', value: 'advance' },
    { label: 'Editing / Tasks', value: 'editing' },
    { label: 'Album Approval', value: 'album' },
    { label: 'Final Delivery', value: 'delivery' },
  ]

  const filteredReminders = reminders.filter((r) => {
    if (filterCategory === 'all') return true
    return r.category === filterCategory
  })

  const unreadCount = reminders.filter((r) => r.unread && !r.completed).length

  return (
    <div className="smart-reminders-card">
      {/* Card Header */}
      <div className="sr-card-header">
        <div className="sr-card-title-group">
          <div className="sr-icon-badge">
            <i className="pi pi-bell" />
          </div>
          <div>
            <h2 className="sr-card-title">
              Smart Studio Reminders
              {unreadCount > 0 && <span className="sr-unread-pill">{unreadCount} New</span>}
            </h2>
            <p className="sr-card-sub">
              Automated triggers for upcoming events, pending payments & deliveries
            </p>
          </div>
        </div>

        <div className="sr-header-actions">
          {unreadCount > 0 && (
            <button
              className="cal-card-action-btn"
              onClick={handleMarkAllRead}
            >
              <i className="pi pi-check" /> Mark Read
            </button>
          )}
          <button
            className="p-button p-button-primary text-xs"
            onClick={() => setIsAddOpen(true)}
          >
            <i className="pi pi-plus" /> Create Reminder
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="sr-filter-bar">
        {categoryOptions.map((opt) => (
          <button
            key={opt.value}
            className={`sr-filter-chip ${filterCategory === opt.value ? 'is-active' : ''}`}
            onClick={() => setFilterCategory(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="sr-list">
        {loading ? (
          <div className="sr-empty-state">
            <i className="pi pi-spin pi-spinner text-3xl text-400 mb-2" />
            <p className="text-sm font-semibold text-600">Loading reminders...</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="sr-empty-state">
            <i className="pi pi-check-circle text-3xl text-400 mb-2" />
            <p className="text-sm font-semibold text-600">
              {filterCategory === 'all'
                ? 'No reminders yet. Reminders will appear automatically based on your events and tasks.'
                : 'No reminders found in this category.'}
            </p>
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className={`sr-item ${rem.unread ? 'sr-item--unread' : ''} ${rem.completed ? 'sr-item--completed' : ''}`}
            >
              {/* Category & Status Row */}
              <div className="sr-item__top">
                <span className={`sr-badge ${rem.badgeClass}`}>
                  <i className={rem.icon} />
                  {rem.categoryLabel}
                </span>

                <div className="flex align-items-center gap-2">
                  <span className="sr-days-pill">{rem.daysLeft}</span>
                  <button
                    className={`sr-check-btn ${rem.completed ? 'is-done' : ''}`}
                    onClick={() => handleToggleComplete(rem.id)}
                    title={rem.completed ? 'Mark incomplete' : 'Mark done'}
                  >
                    <i className="pi pi-check" />
                  </button>
                </div>
              </div>

              {/* Main Title */}
              <h3 className="sr-item__title">{rem.title}</h3>

              {/* Structured Key-Value Details */}
              <div className="sr-item__details">
                {rem.details.map((d, idx) => (
                  <div key={idx} className="sr-detail-row">
                    <span className="sr-detail-label">{d.label}:</span>
                    <span className="sr-detail-val">{d.val}</span>
                  </div>
                ))}
              </div>

              {/* Quick Actions Footer */}
              <div className="sr-item__footer">
                <button className="sr-action-btn sr-action-btn--wa" onClick={() => handleActionClick(rem)}>
                  <i className="pi pi-whatsapp" />
                  <span>Send WhatsApp Alert</span>
                </button>
                <button
                  className="sr-action-btn sr-action-btn--copy"
                  onClick={() => {
                    navigator.clipboard?.writeText(rem.whatsappMsg)
                    if (onShowToast) onShowToast('Reminder copied to clipboard!')
                  }}
                >
                  <i className="pi pi-copy" />
                  <span>Copy Text</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Custom Reminder Modal */}
      <Dialog
        header="Create Smart Reminder"
        visible={isAddOpen}
        style={{ width: '480px' }}
        onHide={() => setIsAddOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsAddOpen(false)} />
            <Button label="Save Reminder" icon="pi pi-check" className="p-button-primary" onClick={handleCreateReminder} />
          </div>
        }
      >
        <div className="flex flex-column gap-3 py-2 text-xs">
          <div>
            <label className="block font-bold mb-1">Reminder Category</label>
            <Dropdown
              value={newCategory}
              options={categoryOptions.filter((c) => c.value !== 'all')}
              onChange={(e) => setNewCategory(e.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Reminder Title *</label>
            <InputText
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Wedding shoot for client in 3 days"
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Photographer / Crew Assigned</label>
            <InputText
              value={newPhotographer}
              onChange={(e) => setNewPhotographer(e.target.value)}
              placeholder="e.g. Lead Photographer & Team"
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Reporting Time</label>
            <InputText
              value={newReporting}
              onChange={(e) => setNewReporting(e.target.value)}
              placeholder="e.g. 5:30 AM"
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Venue / Location</label>
            <InputText
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              placeholder="e.g. Convention Hall, Bengaluru"
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
