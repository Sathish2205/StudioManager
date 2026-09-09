import React, { useState, useEffect, useCallback } from 'react'
import StatusBadge from '../../components/enterprise/StatusBadge'
import EmptyState from '../../components/enterprise/EmptyState'
import { saGetTenants, saActivateTenant, saDeactivateTenant } from '../../services/superAdminService'

export default function TenantList({ setActiveTab, onViewTenant, onEditTenant, showToast }) {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null)

  const loadTenants = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const result = await saGetTenants(params)
      setTenants(result.data || [])
      setPagination(result.pagination || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    loadTenants()
  }, [loadTenants])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
    setPage(1)
  }

  const handleToggleStatus = (tenant) => {
    const isActive = tenant.status === 'active'
    setConfirmDialog({
      title: isActive ? 'Deactivate Tenant' : 'Activate Tenant',
      message: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} "${tenant.companyName}"? ${isActive ? 'Users will not be able to log in until reactivated.' : 'Users will regain access immediately.'}`,
      confirmLabel: isActive ? 'Deactivate' : 'Activate',
      confirmClass: isActive ? 'sa-action-btn--danger' : 'sa-action-btn--success',
      onConfirm: async () => {
        try {
          if (isActive) {
            await saDeactivateTenant(tenant.tenantId || tenant._id)
          } else {
            await saActivateTenant(tenant.tenantId || tenant._id)
          }
          showToast(`Tenant "${tenant.companyName}" ${isActive ? 'deactivated' : 'activated'} successfully.`, 'success')
          loadTenants()
        } catch (err) {
          showToast(err.message, 'error')
        }
        setConfirmDialog(null)
      },
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const statusLabel = (status) => {
    if (status === 'active') return 'Active'
    if (status === 'inactive') return 'Inactive'
    if (status === 'suspended') return 'Inactive'
    return status
  }

  const totalPages = pagination?.totalPages || 1

  return (
    <>
      {/* Header */}
      <div className="ent-page-header">
        <div className="ent-page-header__text">
          <h1 className="ent-page-header__title">Tenants</h1>
          <p className="ent-page-header__desc">Manage all registered companies</p>
        </div>
        <div className="ent-page-header__actions">
          <button className="sa-action-btn sa-action-btn--primary" onClick={() => setActiveTab('create-tenant')}>
            <i className="pi pi-plus" /> Create New Tenant
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ent-card">
        <div className="ent-card__body">
          <div className="sa-toolbar">
            <div className="sa-toolbar__search">
              <i className="pi pi-search sa-toolbar__search-icon" />
              <input
                type="text"
                className="sa-toolbar__search-input"
                placeholder="Search by company name, code, or email..."
                value={search}
                onChange={handleSearch}
              />
            </div>
            <select className="sa-toolbar__select" value={statusFilter} onChange={handleStatusFilter}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="sa-spinner">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.2rem' }} />
            Loading tenants...
          </div>
        ) : error ? (
          <EmptyState
            type="error"
            title="Failed to load tenants"
            message={error}
            action={{ label: 'Retry', icon: 'pi pi-refresh', onClick: loadTenants }}
          />
        ) : tenants.length === 0 ? (
          <EmptyState
            type={search || statusFilter ? 'no-results' : 'empty'}
            title={search || statusFilter ? 'No tenants match your filters' : 'No tenants yet'}
            message={search || statusFilter ? 'Try adjusting your search or status filter.' : 'Create your first tenant to get started.'}
            action={!search && !statusFilter ? { label: 'Create Tenant', icon: 'pi pi-plus', onClick: () => setActiveTab('create-tenant') } : undefined}
          />
        ) : (
          <>
            <div className="sa-table-wrap">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Tenant Code</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Plan</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((t) => (
                    <tr key={t._id || t.tenantId}>
                      <td>
                        <span className="sa-table__company">{t.companyName}</span>
                      </td>
                      <td>
                        <span className="sa-table__code">{t.tenantCode || t.tenantId}</span>
                      </td>
                      <td>{t.contactEmail || '—'}</td>
                      <td>{t.contactPhone || '—'}</td>
                      <td>
                        <StatusBadge status={statusLabel(t.status)} size="sm" />
                      </td>
                      <td>{formatDate(t.createdAt)}</td>
                      <td style={{ textTransform: 'capitalize' }}>{t.subscriptionPlan || 'basic'}</td>
                      <td>
                        <div className="sa-table__actions">
                          <button
                            className="sa-action-btn"
                            title="View"
                            onClick={() => onViewTenant(t)}
                          >
                            <i className="pi pi-eye" />
                          </button>
                          <button
                            className="sa-action-btn"
                            title="Edit"
                            onClick={() => onEditTenant(t)}
                          >
                            <i className="pi pi-pencil" />
                          </button>
                          {t.status === 'active' ? (
                            <button
                              className="sa-action-btn sa-action-btn--danger"
                              title="Deactivate"
                              onClick={() => handleToggleStatus(t)}
                            >
                              <i className="pi pi-ban" />
                            </button>
                          ) : (
                            <button
                              className="sa-action-btn sa-action-btn--success"
                              title="Activate"
                              onClick={() => handleToggleStatus(t)}
                            >
                              <i className="pi pi-check" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="sa-pagination" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                <span className="sa-pagination__info">
                  Page {pagination?.page || 1} of {totalPages} — {pagination?.total || 0} total
                </span>
                <div className="sa-pagination__btns">
                  <button
                    className="sa-pagination__btn"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        className={`sa-pagination__btn ${page === pageNum ? 'sa-pagination__btn--active' : ''}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    className="sa-pagination__btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="sa-dialog-overlay" onClick={() => setConfirmDialog(null)}>
          <div className="sa-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="sa-dialog__title">{confirmDialog.title}</h3>
            <p className="sa-dialog__message">{confirmDialog.message}</p>
            <div className="sa-dialog__actions">
              <button className="sa-action-btn" onClick={() => setConfirmDialog(null)}>
                Cancel
              </button>
              <button
                className={`sa-action-btn ${confirmDialog.confirmClass || 'sa-action-btn--primary'}`}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
