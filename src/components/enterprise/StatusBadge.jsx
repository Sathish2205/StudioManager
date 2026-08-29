import React from 'react'

const STATUS_MAP = {
  // Event statuses
  'Shooting Today':    { color: 'var(--color-error)', bg: 'var(--color-error-light)', border: 'var(--color-error-border)' },
  'Confirmed':         { color: 'var(--color-info)', bg: 'var(--color-info-light)', border: 'var(--color-info-border)' },
  'In Post-Production':{ color: 'var(--color-warning)', bg: 'var(--color-warning-light)', border: 'var(--color-warning-border)' },
  'Delivered':         { color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },
  'Completed':         { color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },

  // Payment statuses
  'Paid in Full':      { color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },
  'Paid':              { color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },
  'Advance Paid':      { color: 'var(--color-info)', bg: 'var(--color-info-light)', border: 'var(--color-info-border)' },
  'Deposit Paid':      { color: 'var(--color-info)', bg: 'var(--color-info-light)', border: 'var(--color-info-border)' },
  'Pending Deposit':   { color: 'var(--color-error)', bg: 'var(--color-error-light)', border: 'var(--color-error-border)' },
  'Pending':           { color: 'var(--color-warning)', bg: 'var(--color-warning-light)', border: 'var(--color-warning-border)' },
  'Overdue':           { color: 'var(--color-error)', bg: 'var(--color-error-light)', border: 'var(--color-error-border)' },

  // Workflow statuses
  'Draft':             { color: 'var(--color-text-muted)', bg: 'var(--color-bg)', border: 'var(--color-border)' },
  'In Progress':       { color: 'var(--color-info)', bg: 'var(--color-info-light)', border: 'var(--color-info-border)' },
  'Editing':           { color: 'var(--color-info)', bg: 'var(--color-info-light)', border: 'var(--color-info-border)' },
  'Approved':          { color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },
  'Cancelled':         { color: 'var(--color-error)', bg: 'var(--color-error-light)', border: 'var(--color-error-border)' },
  'Failed':            { color: 'var(--color-error)', bg: 'var(--color-error-light)', border: 'var(--color-error-border)' },
  'Rejected':          { color: 'var(--color-error)', bg: 'var(--color-error-light)', border: 'var(--color-error-border)' },

  // General
  'Active':            { color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },
  'Inactive':          { color: 'var(--color-text-muted)', bg: 'var(--color-bg)', border: 'var(--color-border)' },
  'On Leave':          { color: 'var(--color-warning)', bg: 'var(--color-warning-light)', border: 'var(--color-warning-border)' },
  'Sent':              { color: 'var(--color-info)', bg: 'var(--color-info-light)', border: 'var(--color-info-border)' },
  'Accepted':          { color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },
  'Expired':           { color: 'var(--color-text-muted)', bg: 'var(--color-bg)', border: 'var(--color-border)' },
}

const DEFAULT_STYLE = { color: 'var(--color-text-secondary)', bg: 'var(--color-bg)', border: 'var(--color-border)' }

/**
 * Unified status badge component for consistent status rendering across the app.
 */
export default function StatusBadge({ status, size = 'default' }) {
  if (!status) return null
  const style = STATUS_MAP[status] || DEFAULT_STYLE
  const sizeClass = size === 'sm' ? 'ent-status-badge--sm' : ''

  return (
    <span
      className={`ent-status-badge ${sizeClass}`}
      style={{
        color: style.color,
        backgroundColor: style.bg,
        borderColor: style.border,
      }}
    >
      {status}
    </span>
  )
}
