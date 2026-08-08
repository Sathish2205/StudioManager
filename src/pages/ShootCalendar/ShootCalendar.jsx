import React, { useState, useMemo } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
import { Tooltip } from 'primereact/tooltip'
import { Tag } from 'primereact/tag'
import EventDetailDrawer from '../../components/EventDetailDrawer/EventDetailDrawer'
import { SHARED_EVENTS } from '../../services/sharedEventsData'
import './ShootCalendar.css'

export default function ShootCalendar({ onNavigateAddEvent, onShowToast }) {
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)) // August 2026
  const [calendarView, setCalendarView] = useState('month') // 'month', 'week', 'day'

  // Events Dataset
  const [eventsList, setEventsList] = useState(SHARED_EVENTS)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedCrew, setSelectedCrew] = useState(null)
  const [selectedVenue, setSelectedVenue] = useState(null)

  // Modals & Drawers
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  // Overflow Popover Modal
  const [overflowDate, setOverflowDate] = useState(null)
  const [overflowEvents, setOverflowEvents] = useState([])
  const [isOverflowOpen, setIsOverflowOpen] = useState(false)

  // Clicked Date Action Modal
  const [clickedDateStr, setClickedDateStr] = useState(null)
  const [isDateClickOpen, setIsDateClickOpen] = useState(false)

  // Navigation Handlers
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 12)) // Aug 12, 2026 (Today reference)
  }

  // Event Status Badge Helper Function
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Shooting Today': return 'cal-status-badge--today'
      case 'Confirmed': return 'cal-status-badge--confirmed'
      case 'In Post-Production': return 'cal-status-badge--editing'
      case 'Delivered': return 'cal-status-badge--delivered'
      case 'Pending Deposit': return 'cal-status-badge--pending'
      default: return 'cal-status-badge--default'
    }
  }

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        evt.eventName?.toLowerCase().includes(q) ||
        evt.couple?.toLowerCase().includes(q) ||
        evt.venue?.toLowerCase().includes(q)

      const matchesType = !selectedType || selectedType === 'All Event Types' || evt.eventType === selectedType
      const matchesStatus = !selectedStatus || selectedStatus === 'All Statuses' || evt.status === selectedStatus
      const matchesCrew = !selectedCrew || selectedCrew === 'All Photographers' || evt.crew?.some((c) => c.includes(selectedCrew))
      const matchesVenue = !selectedVenue || evt.venue?.includes(selectedVenue)

      return matchesSearch && matchesType && matchesStatus && matchesCrew && matchesVenue
    })
  }, [eventsList, searchQuery, selectedType, selectedStatus, selectedCrew, selectedVenue])

  // Calendar Grid Days Calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const grid = []

    // Previous Month Padded Days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i
      const prevDate = new Date(year, month - 1, dayNum)
      const dateStr = prevDate.toISOString().split('T')[0]
      grid.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        isToday: false
      })
    }

    // Current Month Days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const currDate = new Date(year, month, dayNum)
      // Format YYYY-MM-DD
      const yyyy = year
      const mm = String(month + 1).padStart(2, '0')
      const dd = String(dayNum).padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`
      const isToday = dayNum === 12 && month === 7 && year === 2026 // Aug 12, 2026 is Today

      grid.push({
        dayNum,
        dateStr,
        isCurrentMonth: true,
        isToday
      })
    }

    // Next Month Padded Days to complete 35 or 42 grid cells
    const remaining = (7 - (grid.length % 7)) % 7
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextDate = new Date(year, month + 1, dayNum)
      const dateStr = nextDate.toISOString().split('T')[0]
      grid.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        isToday: false
      })
    }

    return grid
  }, [year, month])

  // Get events for a specific date cell (including multi-day events)
  const getEventsForDate = (dateStr) => {
    return filteredEvents.filter((evt) => {
      const start = evt.startDate || evt.date
      const end = evt.endDate || evt.date
      return dateStr >= start && dateStr <= end
    })
  }

  // Handle Event Label Click
  const handleEventClick = (e, evt) => {
    e.stopPropagation()
    setSelectedEventForDetail(evt)
    setDrawerVisible(true)
  }

  // Handle Empty Date Cell Click
  const handleDateCellClick = (cell) => {
    setClickedDateStr(cell.dateStr)
    setIsDateClickOpen(true)
  }

  // Navigate to Add Event Page with Pre-populated Date
  const handleTriggerNewEvent = (prefillDate = null) => {
    setIsDateClickOpen(false)
    if (onNavigateAddEvent) {
      onNavigateAddEvent(prefillDate || clickedDateStr)
    }
  }

  // Event Label Status Class & Colors
  const getEventBadgeClass = (status) => {
    switch (status) {
      case 'Shooting Today':
      case 'In Progress':
        return 'cal-event-chip--danger'
      case 'Confirmed':
        return 'cal-event-chip--info'
      case 'In Post-Production':
        return 'cal-event-chip--warning'
      case 'Delivered':
      case 'Completed':
        return 'cal-event-chip--success'
      case 'Pending Deposit':
        return 'cal-event-chip--pink'
      default:
        return 'cal-event-chip--info'
    }
  }

  return (
    <div className="calendar-portal-container">
      {/* ── TOOLTIP FOR EVENT HOVER ── */}
      <Tooltip target=".cal-event-chip" position="top" />

      {/* ── TOP HEADER ROW: TITLE & + NEW EVENT BUTTON ── */}
      <div className="calendar-top-bar">
        <div>
          <h1 className="calendar-portal-title">Shoot Calendar</h1>
          <p className="calendar-portal-sub">
            Visual month schedule with event status indicators, multi-day tracking, and crew availability
          </p>
        </div>

        <div className="flex align-items-center gap-3">
          {/* Calendar View Switcher */}
          <div className="calendar-view-toggle">
            <button
              className={`calendar-view-btn ${calendarView === 'month' ? 'is-active' : ''}`}
              onClick={() => setCalendarView('month')}
            >
              Month
            </button>
            <button
              className={`calendar-view-btn ${calendarView === 'week' ? 'is-active' : ''}`}
              onClick={() => setCalendarView('week')}
            >
              Week
            </button>
            <button
              className={`calendar-view-btn ${calendarView === 'day' ? 'is-active' : ''}`}
              onClick={() => setCalendarView('day')}
            >
              Day
            </button>
          </div>

          <Button
            label="New Event"
            icon="pi pi-plus"
            className="events-header__btn-add"
            rounded
            onClick={() => handleTriggerNewEvent(null)}
          />
        </div>
      </div>

      {/* ── SEARCH & FILTER TOOLBAR ── */}
      <div className="events-toolbar mb-3">
        <div className="events-toolbar__left">
          <div className="events-search">
            <i className="pi pi-search events-search__icon" />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, clients, or venues..."
              className="events-search__input"
            />
            {searchQuery && (
              <i className="pi pi-times events-search__clear" onClick={() => setSearchQuery('')} />
            )}
          </div>

          <Dropdown
            value={selectedType}
            options={[
              { label: 'All Event Types', value: 'All Event Types' },
              { label: 'Wedding & Reception', value: 'Wedding & Reception' },
              { label: 'Sangeet & Mehendi', value: 'Sangeet & Mehendi' },
              { label: 'Destination Wedding', value: 'Destination Wedding' },
              { label: 'Pre-Wedding Shoot', value: 'Pre-Wedding Shoot' },
              { label: 'Gala Dinner & Cocktail', value: 'Gala Dinner & Cocktail' },
              { label: 'Haldi & Wedding Ceremony', value: 'Haldi & Wedding Ceremony' }
            ]}
            onChange={(e) => setSelectedType(e.value)}
            placeholder="Event Type"
            showClear
            className="events-filter__dropdown"
          />

          <Dropdown
            value={selectedStatus}
            options={[
              { label: 'All Statuses', value: 'All Statuses' },
              { label: 'Shooting Today', value: 'Shooting Today' },
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'In Post-Production', value: 'In Post-Production' },
              { label: 'Delivered', value: 'Delivered' },
              { label: 'Pending Deposit', value: 'Pending Deposit' }
            ]}
            onChange={(e) => setSelectedStatus(e.value)}
            placeholder="Status"
            showClear
            className="events-filter__dropdown"
          />

          <Dropdown
            value={selectedCrew}
            options={[
              { label: 'All Photographers', value: 'All Photographers' },
              { label: 'Alex V.', value: 'Alex V.' },
              { label: 'Elena R.', value: 'Elena R.' },
              { label: 'Maya S.', value: 'Maya S.' },
              { label: 'David P.', value: 'David P.' },
              { label: 'Marco K.', value: 'Marco K.' }
            ]}
            onChange={(e) => setSelectedCrew(e.value)}
            placeholder="Photographer"
            showClear
            className="events-filter__dropdown"
          />

          {(searchQuery || selectedType || selectedStatus || selectedCrew) && (
            <Button
              icon="pi pi-filter-slash"
              label="Reset"
              className="p-button-outlined p-button-secondary p-button-sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedType(null)
                setSelectedStatus(null)
                setSelectedCrew(null)
              }}
            />
          )}
        </div>
      </div>

      {/* ── CALENDAR VIEW CONTAINER WITH ATTACHED NAV BAR ── */}
      <div className="month-calendar-wrapper">
        {/* ── CALENDAR NAVIGATION & MONTH TITLE BAR ATTACHED ── */}
        <div className="calendar-nav-bar">
          <div className="calendar-nav-title">
            <h2>{monthNames[month]} {year} <span className="text-xs text-500 font-normal ml-2">({calendarView.toUpperCase()} VIEW)</span></h2>
          </div>

          <div className="calendar-nav-controls">
            <button
              className="calendar-nav-btn"
              onClick={handlePrevMonth}
              title="Previous Month"
            >
              <i className="pi pi-chevron-left" />
            </button>
            <button
              className="calendar-nav-btn calendar-nav-btn--today"
              onClick={handleToday}
            >
              Today
            </button>
            <button
              className="calendar-nav-btn"
              onClick={handleNextMonth}
              title="Next Month"
            >
              <i className="pi pi-chevron-right" />
            </button>
          </div>
        </div>

        {/* ── MONTH CALENDAR GRID ── */}
        {calendarView === 'month' && (
          <>
            {/* Days of Week Header */}
            <div className="calendar-week-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="calendar-week-day">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Date Grid Cells */}
            <div className="calendar-grid-cells">
              {calendarDays.map((cell, idx) => {
                const dayEvents = getEventsForDate(cell.dateStr)
                const maxDisplay = 2
                const hasOverflow = dayEvents.length > maxDisplay
                const visibleEvents = dayEvents.slice(0, maxDisplay)
                const overflowCount = dayEvents.length - maxDisplay

                return (
                  <div
                    key={idx}
                    className={`calendar-date-cell ${!cell.isCurrentMonth ? 'is-other-month' : ''} ${
                      cell.isToday ? 'is-today' : ''
                    }`}
                    onClick={() => handleDateCellClick(cell)}
                  >
                    {/* Date Number Header */}
                    <div className="date-cell-header">
                      <span className={`date-number ${cell.isToday ? 'today-badge' : ''}`}>
                        {cell.dayNum}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="day-count-indicator">{dayEvents.length} shoots</span>
                      )}
                    </div>

                    {/* Event Labels List */}
                    <div className="date-cell-events">
                      {visibleEvents.map((evt) => (
                        <div
                          key={evt.id}
                          className={`cal-event-chip ${getEventBadgeClass(evt.status)}`}
                          onClick={(e) => handleEventClick(e, evt)}
                          data-pr-tooltip={`${evt.eventName} | Client: ${evt.couple} | Venue: ${evt.venue} | Status: ${evt.status}`}
                        >
                          <div className="cal-event-chip__title">
                            {evt.eventType ? `${evt.eventType.split(' ')[0]} - ` : ''}{evt.couple}
                          </div>
                          <div className="cal-event-chip__time">
                            <i className="pi pi-clock mr-1" />
                            {evt.startTime || evt.time?.split('-')[0] || 'All Day'}
                          </div>
                        </div>
                      ))}

                      {/* Overflow Chip */}
                      {hasOverflow && (
                        <div
                          className="cal-overflow-chip"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOverflowDate(cell.dateStr)
                            setOverflowEvents(dayEvents)
                            setIsOverflowOpen(true)
                          }}
                        >
                          + {overflowCount} more events
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ── WEEK & DAY VIEWS ── */}
        {calendarView !== 'month' && (
          <div className="p-4">
            <div className="flex justify-content-between align-items-center mb-3 pb-2 border-bottom-1 surface-border">
              <span className="text-xs font-bold uppercase text-700">
                {calendarView === 'week' ? 'Weekly Shoot Schedule Roster' : 'Daily Event Timeline'}
              </span>
              <span className="text-xs font-semibold text-primary">{filteredEvents.length} Total Shoots</span>
            </div>

            <div className="grid">
              {filteredEvents.map((s) => (
                <div key={s.id} className="col-12 md:col-6 lg:col-4">
                  <div className="cal-alt-card p-3 border-round-xl border-1 surface-border bg-surface-card shadow-1 flex flex-column justify-content-between h-full">
                    <div>
                      <div className="flex justify-content-between align-items-center mb-2">
                        <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 border-round">
                          <i className="pi pi-calendar mr-1" />{s.date}
                        </span>
                        <span className={`cal-status-badge ${getStatusBadgeClass(s.status)}`}>
                          {s.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-900 mb-1">{s.eventName}</h4>
                      <p className="text-xs text-700 font-semibold mb-2">Couple: {s.couple}</p>
                      
                      <div className="text-xs text-500 mb-3 flex align-items-center gap-1">
                        <i className="pi pi-map-marker text-blue-600" />
                        <span className="text-overflow-ellipsis overflow-hidden white-space-nowrap">{s.venue}</span>
                      </div>
                    </div>

                    <div className="border-top-1 surface-border pt-2 flex justify-content-between align-items-center">
                      <span className="text-xs text-600 font-semibold">
                        <i className="pi pi-clock text-amber-600 mr-1" />
                        {s.startTime || s.time?.split('-')[0] || '09:00 AM'}
                      </span>

                      <button
                        className="cal-card-action-btn"
                        onClick={(e) => handleEventClick(e, s)}
                      >
                        <i className="pi pi-eye" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── EVENT DETAILS DRAWER (REUSED FROM EVENTS MODULE) ── */}
      {selectedEventForDetail && (
        <EventDetailDrawer
          event={selectedEventForDetail}
          visible={drawerVisible}
          onHide={() => setDrawerVisible(false)}
          onEdit={() => {
            setDrawerVisible(false)
            if (onNavigateAddEvent) onNavigateAddEvent(selectedEventForDetail.date)
          }}
        />
      )}

      {/* ── OVERFLOW POPUP MODAL ── */}
      <Dialog
        header={`Shoots & Events on ${overflowDate}`}
        visible={isOverflowOpen}
        style={{ width: '480px' }}
        onHide={() => setIsOverflowOpen(false)}
      >
        <div className="flex flex-column gap-2 text-xs py-2">
          {overflowEvents.map((evt) => (
            <div
              key={evt.id}
              className={`p-3 border-round border-1 surface-border cursor-pointer hover:surface-hover ${getEventBadgeClass(
                evt.status
              )}`}
              onClick={(e) => {
                setIsOverflowOpen(false)
                handleEventClick(e, evt)
              }}
            >
              <div className="font-bold text-sm text-900">{evt.eventName}</div>
              <div className="text-xs text-600 font-semibold mb-1">Client: {evt.couple}</div>
              <div className="flex justify-content-between text-xs text-500">
                <span><i className="pi pi-clock mr-1" />{evt.time}</span>
                <span className="font-bold text-primary">{evt.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Dialog>

      {/* ── CLICKED DATE ACTION DIALOG ── */}
      <Dialog
        header={`Date Selected: ${clickedDateStr}`}
        visible={isDateClickOpen}
        style={{ width: '420px' }}
        onHide={() => setIsDateClickOpen(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setIsDateClickOpen(false)} />
            <Button
              label="+ Schedule Event for this Date"
              icon="pi pi-plus"
              className="p-button-primary"
              onClick={() => handleTriggerNewEvent(clickedDateStr)}
            />
          </div>
        }
      >
        <div className="py-2 text-xs text-600">
          Would you like to schedule a new photo event for <strong>{clickedDateStr}</strong>?
          <br />
          The date will be automatically pre-populated into the event booking form.
        </div>
      </Dialog>
    </div>
  )
}
