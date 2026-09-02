import React from 'react'
import './AccessDenied.css'

export default function AccessDenied({ onNavigateHome }) {
  return (
    <div className="access-denied">
      <div className="access-denied__card">
        <div className="access-denied__icon-wrap">
          <i className="pi pi-lock access-denied__icon" />
        </div>
        <h1 className="access-denied__title">403</h1>
        <h2 className="access-denied__subtitle">Access Denied</h2>
        <p className="access-denied__message">
          You do not have permission to access this page.<br />
          Please contact your company administrator for access.
        </p>
        {onNavigateHome && (
          <button className="access-denied__btn" onClick={onNavigateHome}>
            <i className="pi pi-arrow-left mr-2" />
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  )
}
