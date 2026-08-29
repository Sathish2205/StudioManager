import React from 'react'

/**
 * Enterprise empty/error/no-results state component.
 * @param {'empty'|'error'|'no-results'} type
 */
export default function EmptyState({ type = 'empty', title, message, icon, action }) {
  const defaults = {
    empty: {
      icon: 'pi pi-inbox',
      title: 'No data found',
      message: 'There are no records to display.',
    },
    error: {
      icon: 'pi pi-exclamation-circle',
      title: 'Unable to load data',
      message: 'Please check your connection and try again.',
    },
    'no-results': {
      icon: 'pi pi-search',
      title: 'No results found',
      message: 'Try adjusting your search or filters.',
    }
  }

  const cfg = defaults[type] || defaults.empty

  return (
    <div className="ent-empty-state">
      <i className={`${icon || cfg.icon} ent-empty-state__icon`} />
      <h3 className="ent-empty-state__title">{title || cfg.title}</h3>
      <p className="ent-empty-state__message">{message || cfg.message}</p>
      {action && (
        <button
          className="ent-empty-state__action"
          onClick={action.onClick}
        >
          {action.icon && <i className={action.icon} />}
          {action.label}
        </button>
      )}
    </div>
  )
}
