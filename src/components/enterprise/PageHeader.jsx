import React from 'react'

/**
 * Enterprise Page Header
 * Renders: Page Title + Description + Primary Action button area
 */
export default function PageHeader({ title, description, actions, children }) {
  return (
    <div className="ent-page-header">
      <div className="ent-page-header__text">
        <h1 className="ent-page-header__title">{title}</h1>
        {description && <p className="ent-page-header__desc">{description}</p>}
      </div>
      {actions && <div className="ent-page-header__actions">{actions}</div>}
      {children}
    </div>
  )
}
