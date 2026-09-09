import React, { useState, useEffect } from 'react'
import { SuperAdminAuthProvider, useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import SuperAdminLogin from './SuperAdminLogin'
import SuperAdminLayout from './SuperAdminLayout'
import SuperAdminDashboard from './SuperAdminDashboard'
import TenantList from './TenantList'
import CreateTenant from './CreateTenant'
import EditTenant from './EditTenant'
import TenantDetail from './TenantDetail'
import ChangePassword from './ChangePassword'
import SuperAdminSettings from './SuperAdminSettings'
import './superadmin.css'

const SA_ROUTE_MAP = {
  '/super-admin': 'dashboard',
  '/super-admin/': 'dashboard',
  '/super-admin/login': 'login',
  '/super-admin/tenants': 'tenants',
  '/super-admin/tenants/create': 'create-tenant',
  '/super-admin/settings': 'settings',
  '/super-admin/change-password': 'change-password',
}

const SA_TAB_TO_PATH = {
  'dashboard': '/super-admin',
  'tenants': '/super-admin/tenants',
  'create-tenant': '/super-admin/tenants/create',
  'edit-tenant': '/super-admin/tenants',
  'tenant-detail': '/super-admin/tenants',
  'settings': '/super-admin/settings',
  'change-password': '/super-admin/change-password',
}

function getTabFromUrl() {
  const path = window.location.pathname.toLowerCase()
  const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return SA_ROUTE_MAP[cleanPath] || 'dashboard'
}

function SuperAdminContent() {
  const { isAuthenticated, loading } = useSuperAdminAuth()
  const [activeTab, setActiveTabState] = useState(() => getTabFromUrl())
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  const setActiveTab = (tabKey) => {
    setActiveTabState(tabKey)
    const targetPath = SA_TAB_TO_PATH[tabKey] || '/super-admin'
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromUrl()
      setActiveTabState(tab)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 4000)
  }

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant)
    setActiveTab('tenant-detail')
  }

  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant)
    setActiveTab('edit-tenant')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
        <i className="pi pi-spin pi-spinner text-3xl mr-3" /> Loading Super Admin Portal...
      </div>
    )
  }

  // If on login path or not authenticated → show login
  if (!isAuthenticated) {
    return <SuperAdminLogin />
  }

  // Handle login route when already authenticated → redirect to dashboard
  if (activeTab === 'login') {
    setActiveTab('dashboard')
    return null
  }

  return (
    <>
      {/* Toast */}
      {toastMsg && (
        <div className={`sa-toast sa-toast--${toastMsg.type}`}>
          <i className={`pi ${toastMsg.type === 'success' ? 'pi-check-circle' : 'pi-exclamation-circle'}`} />
          <span>{toastMsg.msg}</span>
        </div>
      )}

      <SuperAdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && (
          <SuperAdminDashboard setActiveTab={setActiveTab} />
        )}

        {activeTab === 'tenants' && (
          <TenantList
            setActiveTab={setActiveTab}
            onViewTenant={handleViewTenant}
            onEditTenant={handleEditTenant}
            showToast={showToast}
          />
        )}

        {activeTab === 'create-tenant' && (
          <CreateTenant setActiveTab={setActiveTab} showToast={showToast} />
        )}

        {activeTab === 'edit-tenant' && (
          <EditTenant
            tenantData={selectedTenant}
            setActiveTab={setActiveTab}
            showToast={showToast}
          />
        )}

        {activeTab === 'tenant-detail' && (
          <TenantDetail
            tenantData={selectedTenant}
            setActiveTab={setActiveTab}
            onEditTenant={handleEditTenant}
          />
        )}

        {activeTab === 'settings' && (
          <SuperAdminSettings setActiveTab={setActiveTab} />
        )}

        {activeTab === 'change-password' && (
          <ChangePassword showToast={showToast} />
        )}
      </SuperAdminLayout>
    </>
  )
}

export default function SuperAdminApp() {
  return (
    <SuperAdminAuthProvider>
      <SuperAdminContent />
    </SuperAdminAuthProvider>
  )
}
