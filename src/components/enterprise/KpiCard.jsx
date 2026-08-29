import React from 'react'

/**
 * Compact enterprise KPI card for dashboard metrics.
 */
export default function KpiCard({ title, value, subtitle, icon, trend, trendDirection = 'up' }) {
  return (
    <div className="ent-kpi-card">
      <div className="ent-kpi-card__content">
        <span className="ent-kpi-card__title">{title}</span>
        <span className="ent-kpi-card__value">{value}</span>
        {(subtitle || trend) && (
          <span className="ent-kpi-card__sub">
            {trend && (
              <span className={`ent-kpi-card__trend ent-kpi-card__trend--${trendDirection}`}>
                <i className={`pi pi-arrow-${trendDirection === 'up' ? 'up-right' : 'down-right'}`} />
                {trend}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </span>
        )}
      </div>
      {icon && (
        <div className="ent-kpi-card__icon">
          <i className={icon} />
        </div>
      )}
    </div>
  )
}
