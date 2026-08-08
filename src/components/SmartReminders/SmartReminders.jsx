import React, { useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import './SmartReminders.css'

export const INITIAL_REMINDERS = [
  {
    id: 'REM-101',
    category: 'wedding',
    categoryLabel: 'Upcoming Wedding',
    icon: 'pi pi-calendar-plus',
    badgeClass: 'sr-badge--danger',
    title: '🔔 Wedding of Arun & Priya is in 3 days',
    details: [
      { label: 'Photographer assigned', val: 'Karthik & Team (3 Photographers, 2 Cinematographers)' },
      { label: 'Reporting', val: '5:30 AM' },
      { label: 'Venue', val: 'ABC Convention Hall, Bengaluru' }
    ],
    daysLeft: '3 days left',
    whatsappMsg: 'Hi Karthik, reminder for Arun & Priya wedding on Aug 11. Reporting time: 5:30 AM at ABC Convention Hall.',
    unread: true,
    completed: false
  },
  {
    id: 'REM-102',
    category: 'reporting',
    categoryLabel: 'Reporting Time',
    icon: 'pi pi-clock',
    badgeClass: 'sr-badge--warning',
    title: '⏰ Photographer Reporting Time Alert',
    details: [
      { label: 'Photographer assigned', val: 'Rahul Sharma & Lead Assistant' },
      { label: 'Reporting', val: '6:00 AM (Tomorrow)' },
      { label: 'Venue', val: 'The Leela Palace, Hall B' }
    ],
    daysLeft: 'Tomorrow',
    whatsappMsg: 'Hi Rahul, reporting time for tomorrow at Leela Palace is 6:00 AM sharp.',
    unread: true,
    completed: false
  },
  {
    id: 'REM-103',
    category: 'advance',
    categoryLabel: 'Pending Advance',
    icon: 'pi pi-wallet',
    badgeClass: 'sr-badge--danger',
    title: '💰 Pending Advance Payment Overdue',
    details: [
      { label: 'Client', val: 'Sathish & Priya Kumar' },
      { label: 'Amount Due', val: '₹45,000 (Balance of ₹1.5L Package)' },
      { label: 'Due Date', val: 'Overdue (Target: Aug 05)' }
    ],
    daysLeft: 'Overdue',
    whatsappMsg: 'Dear Sathish, gentle reminder regarding the pending advance payment of ₹45,000 for your upcoming shoot.',
    unread: true,
    completed: false
  },
  {
    id: 'REM-104',
    category: 'editing',
    categoryLabel: 'Editing Deadline',
    icon: 'pi pi-video',
    badgeClass: 'sr-badge--warning',
    title: '🎬 Editing Deadline Approaching',
    details: [
      { label: 'Project', val: 'Teaser Video & 4K Reel - Vikram & Ananya' },
      { label: 'Editor assigned', val: 'Deepa (Lead Video Editor)' },
      { label: 'Deadline', val: 'Aug 09, 2026 (24 hours left)' }
    ],
    daysLeft: '24 hrs left',
    whatsappMsg: 'Hi Deepa, teaser video for Vikram & Ananya is due tomorrow. Please check timeline.',
    unread: false,
    completed: false
  },
  {
    id: 'REM-105',
    category: 'album',
    categoryLabel: 'Album Approval',
    icon: 'pi pi-book',
    badgeClass: 'sr-badge--info',
    title: '📖 Album Approval Awaiting Client Feedback',
    details: [
      { label: 'Client', val: 'Rajesh & Meera' },
      { label: 'Status', val: 'Draft Sent 3 days ago via Online Proofing Gallery' },
      { label: 'Album Specs', val: '40 Pages Premium Flush Mount Album' }
    ],
    daysLeft: '3 days pending',
    whatsappMsg: 'Hi Rajesh & Meera, checking in to see if you had a chance to review the album draft link!',
    unread: false,
    completed: false
  },
  {
    id: 'REM-106',
    category: 'changes',
    categoryLabel: 'Client Changes',
    icon: 'pi pi-file-edit',
    badgeClass: 'sr-badge--purple',
    title: '✏️ Client Revisions Requested',
    details: [
      { label: 'Client', val: 'Sneha & Karan' },
      { label: 'Revisions', val: 'Requested 3 photo swaps on Page 12 & 14 + Warm color grading' },
      { label: 'Submitted', val: 'Aug 07, 2026' }
    ],
    daysLeft: 'New Request',
    whatsappMsg: 'Hi Designer, Sneha & Karan requested minor photo swaps on Page 12 & 14.',
    unread: true,
    completed: false
  },
  {
    id: 'REM-107',
    category: 'delivery',
    categoryLabel: 'Final Delivery',
    icon: 'pi pi-box',
    badgeClass: 'sr-badge--success',
    title: '📦 Final Box Set & USB Delivery Due',
    details: [
      { label: 'Client', val: 'Pooja & Aditya' },
      { label: 'Deliverables', val: '1TB Custom Wooden USB + 2 Leather Canvas Albums' },
      { label: 'Target Date', val: 'Aug 10, 2026 (BlueDart Express)' }
    ],
    daysLeft: 'In 2 days',
    whatsappMsg: 'Hi Pooja & Aditya, your wedding album box set is packed and ready for dispatch!',
    unread: false,
    completed: false
  },
  {
    id: 'REM-108',
    category: 'anniversary',
    categoryLabel: 'Wedding Anniversary',
    icon: 'pi pi-heart-fill',
    badgeClass: 'sr-badge--pink',
    title: '🎉 1st Wedding Anniversary Tomorrow',
    details: [
      { label: 'Couple', val: 'Suresh & Divya' },
      { label: 'Wedding Date', val: 'Aug 09, 2025' },
      { label: 'Offer', val: 'Send 20% Off Anniversary Shoot Voucher' }
    ],
    daysLeft: 'Tomorrow',
    whatsappMsg: 'Happy 1st Anniversary Suresh & Divya! 💖 Wishing you a lifetime of happiness from team PhotoStudio PRO.',
    unread: true,
    completed: false
  }
]

export default function SmartReminders({ onShowToast }) {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS)
  const [filterCategory, setFilterCategory] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('wedding')
  const [newPhotographer, setNewPhotographer] = useState('')
  const [newReporting, setNewReporting] = useState('')
  const [newVenue, setNewVenue] = useState('')

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
      id: `REM-${100 + reminders.length + 1}`,
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
    { label: 'Weddings', value: 'wedding' },
    { label: 'Reporting Time', value: 'reporting' },
    { label: 'Pending Advance', value: 'advance' },
    { label: 'Editing Deadline', value: 'editing' },
    { label: 'Album Approval', value: 'album' },
    { label: 'Client Changes', value: 'changes' },
    { label: 'Final Delivery', value: 'delivery' },
    { label: 'Anniversary', value: 'anniversary' }
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
              Automated triggers for upcoming weddings, reporting times, pending payments & deliveries
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
        {filteredReminders.length === 0 ? (
          <div className="sr-empty-state">
            <i className="pi pi-check-circle text-3xl text-400 mb-2" />
            <p className="text-sm font-semibold text-600">No reminders found in this category.</p>
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
              placeholder="e.g. Wedding of Arun & Priya is in 3 days"
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Photographer / Crew Assigned</label>
            <InputText
              value={newPhotographer}
              onChange={(e) => setNewPhotographer(e.target.value)}
              placeholder="e.g. Karthik & Team"
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
              placeholder="e.g. ABC Convention Hall"
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
