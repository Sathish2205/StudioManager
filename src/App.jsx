import React, { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import AddEventPage from './pages/AddEventPage'
import WorkflowManagement from './pages/WorkflowManagement'
import InvoicePage from './pages/InvoicePage'
import CustomerCRM from './pages/CustomerCRM'

// New 9 Modules
import ShootCalendar from './pages/ShootCalendar/ShootCalendar'
import EditingDeliverables from './pages/EditingDeliverables/EditingDeliverables'
import FinanceInvoices from './pages/FinanceInvoices/FinanceInvoices'
import PackagesQuotes from './pages/PackagesQuotes/PackagesQuotes'
import ContractsDocs from './pages/ContractsDocs/ContractsDocs'
import CrewManagement from './pages/CrewManagement/CrewManagement'
import EquipmentTracker from './pages/EquipmentTracker/EquipmentTracker'
import StudioHelpdesk from './pages/StudioHelpdesk/StudioHelpdesk'
import ClientRequests from './pages/ClientRequests/ClientRequests'

import CreateQuotation from './pages/CreateQuotation/CreateQuotation'
import QuotationDetail from './pages/QuotationDetail/QuotationDetail'
import InvoiceDetail from './pages/InvoiceDetail/InvoiceDetail'
import EmployeeManagement from './pages/EmployeeManagement/EmployeeManagement'

import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login/Login'
import AppLayout from './components/AppLayout'
import AccessDenied from './components/AccessDenied/AccessDenied'
import ErrorBoundary from './components/ErrorBoundary'
import { ROUTE_PERMISSIONS } from './constants/roles'
import './App.css'

const ROUTE_MAP = {
  '/': 'home',
  '/home': 'home',
  '/overview': 'home',
  '/events': 'events',
  '/workflow': 'workflow',
  '/crm': 'crm',
  '/add-event': 'add-event',
  '/invoice': 'invoice',
  '/calendar': 'calendar',
  '/tasks': 'tasks',
  '/editing': 'tasks',
  '/finance': 'finance',
  '/packages': 'packages',
  '/contracts': 'contracts',
  '/crew': 'crew',
  '/employees': 'employees',
  '/attendance': 'employees',
  '/equipment': 'equipment',
  '/helpdesk': 'helpdesk',
  '/requests': 'requests',
  '/create-quotation': 'create-quotation',
  '/quotation-detail': 'quotation-detail',
  '/invoice-detail': 'invoice-detail'
}

const TAB_TO_PATH = {
  'home': '/',
  'events': '/events',
  'workflow': '/workflow',
  'crm': '/crm',
  'add-event': '/add-event',
  'invoice': '/invoice',
  'calendar': '/calendar',
  'tasks': '/editing',
  'finance': '/finance',
  'packages': '/packages',
  'contracts': '/contracts',
  'crew': '/crew',
  'employees': '/employees',
  'equipment': '/equipment',
  'helpdesk': '/helpdesk',
  'requests': '/requests',
  'create-quotation': '/create-quotation',
  'quotation-detail': '/quotation-detail',
  'invoice-detail': '/invoice-detail'
}

function getTabFromUrl() {
  const path = window.location.pathname.toLowerCase()
  const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return ROUTE_MAP[cleanPath] || 'home'
}

/**
 * Route permission guard wrapper.
 * Renders children if user has permission, otherwise shows AccessDenied.
 */
function ProtectedRoute({ tabKey, setActiveTab, children }) {
  const { hasPermission } = useAuth()
  const requiredPerm = ROUTE_PERMISSIONS[tabKey]

  if (!hasPermission(requiredPerm)) {
    return (
      <AppLayout activeTab={tabKey} setActiveTab={setActiveTab}>
        <AccessDenied onNavigateHome={() => setActiveTab('home')} />
      </AppLayout>
    )
  }

  return <ErrorBoundary>{children}</ErrorBoundary>
}

function AppContent() {
  const [activeTab, setActiveTabState] = useState(() => getTabFromUrl())
  const [selectedInvoiceEvent, setSelectedInvoiceEvent] = useState(null)
  const [selectedEditEvent, setSelectedEditEvent] = useState(null)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [selectedPackageForQuote, setSelectedPackageForQuote] = useState(null)
  const [globalToastMsg, setGlobalToastMsg] = useState(null)
  const [prefillEventDate, setPrefillEventDate] = useState(null)

  const setActiveTab = (tabKey) => {
    setActiveTabState(tabKey)
    const targetPath = TAB_TO_PATH[tabKey] || '/'
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      const tabFromUrl = getTabFromUrl()
      setActiveTabState(tabFromUrl)
    }

    const currentTab = getTabFromUrl()
    const targetPath = TAB_TO_PATH[currentTab] || '/'
    if (window.location.pathname !== targetPath) {
      window.history.replaceState({}, '', targetPath)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const showGlobalToast = (msg) => {
    setGlobalToastMsg(msg)
    setTimeout(() => setGlobalToastMsg(null), 3000)
  }

  const handleNavigateInvoice = (eventData) => {
    setSelectedInvoiceEvent(eventData)
    setActiveTab('invoice')
  }

  const handleNavigateEditEvent = (eventData) => {
    setSelectedEditEvent(eventData)
    setPrefillEventDate(null)
    setActiveTab('add-event')
  }

  return (
    <>
      {/* Global Toast Banner */}
      {globalToastMsg && (
        <div className="enterprise-toast">
          <i className="pi pi-check-circle" />
          <span>{globalToastMsg}</span>
        </div>
      )}

      {/* ── HOME DASHBOARD ── */}
      {activeTab === 'home' && (
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* ── EVENTS & SHOOTS ── */}
      {activeTab === 'events' && (
        <ProtectedRoute tabKey="events" setActiveTab={setActiveTab}>
          <Events
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNavigateInvoice={handleNavigateInvoice}
            onNavigateEditEvent={handleNavigateEditEvent}
          />
        </ProtectedRoute>
      )}

      {/* ── WORKFLOW MANAGEMENT ── */}
      {activeTab === 'workflow' && (
        <ProtectedRoute tabKey="workflow" setActiveTab={setActiveTab}>
          <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <WorkflowManagement />
          </AppLayout>
        </ProtectedRoute>
      )}

      {/* ── CUSTOMER CRM ── */}
      {activeTab === 'crm' && (
        <ProtectedRoute tabKey="crm" setActiveTab={setActiveTab}>
          <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <CustomerCRM onNavigateAddEvent={() => handleNavigateEditEvent(null)} />
          </AppLayout>
        </ProtectedRoute>
      )}

      {/* ── ADD / EDIT EVENT PAGE ── */}
      {activeTab === 'add-event' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <AddEventPage
            eventToEdit={selectedEditEvent}
            prefillDate={prefillEventDate}
            onNavigateEvents={() => {
              setSelectedEditEvent(null)
              setPrefillEventDate(null)
              setActiveTab('events')
            }}
            onNavigateDashboard={() => {
              setSelectedEditEvent(null)
              setPrefillEventDate(null)
              setActiveTab('home')
            }}
            onNavigateInvoice={(createdEvent) => {
              setSelectedEditEvent(null)
              setPrefillEventDate(null)
              handleNavigateInvoice(createdEvent)
            }}
          />
        </AppLayout>
      )}

      {/* ── INVOICE PAGE ── */}
      {activeTab === 'invoice' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <InvoicePage
            event={selectedInvoiceEvent}
            onNavigateEvents={() => setActiveTab('events')}
            onNavigateWorkflow={() => setActiveTab('workflow')}
          />
        </AppLayout>
      )}

      {/* ── MODULE 1: SHOOT CALENDAR ── */}
      {activeTab === 'calendar' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <ShootCalendar
            onShowToast={showGlobalToast}
            onNavigateAddEvent={(dateStr) => {
              setPrefillEventDate(dateStr || null)
              setActiveTab('add-event')
            }}
          />
        </AppLayout>
      )}

      {/* ── MODULE 2: EDITING & DELIVERABLES ── */}
      {activeTab === 'tasks' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <EditingDeliverables onShowToast={showGlobalToast} />
        </AppLayout>
      )}

      {/* ── MODULE 3: FINANCE & INVOICES ── */}
      {activeTab === 'finance' && (
        <ProtectedRoute tabKey="finance" setActiveTab={setActiveTab}>
          <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <FinanceInvoices
              onShowToast={showGlobalToast}
              onNavigateCreateQuotation={(pkg) => {
                setSelectedQuotation(null)
                setSelectedPackageForQuote(pkg || null)
                setActiveTab('create-quotation')
              }}
              onNavigateEditQuotation={(quote) => {
                setSelectedQuotation(quote)
                setSelectedPackageForQuote(null)
                setActiveTab('create-quotation')
              }}
              onNavigateQuotationDetail={(quote) => {
                setSelectedQuotation(quote)
                setActiveTab('quotation-detail')
              }}
              onNavigateInvoiceDetail={(inv) => {
                setSelectedInvoice(inv)
                setActiveTab('invoice-detail')
              }}
            />
          </AppLayout>
        </ProtectedRoute>
      )}

      {/* ── MODULE 4: PACKAGES & QUOTES ── */}
      {activeTab === 'packages' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <PackagesQuotes
            onShowToast={showGlobalToast}
            onNavigateAddEvent={() => setActiveTab('add-event')}
            onNavigateCreateQuotation={(pkg) => {
              setSelectedPackageForQuote(pkg || null)
              setActiveTab('create-quotation')
            }}
          />
        </AppLayout>
      )}

      {/* ── CREATE QUOTATION ── */}
      {activeTab === 'create-quotation' && (
        <AppLayout activeTab="finance" setActiveTab={setActiveTab}>
          <CreateQuotation
            initialPackage={selectedPackageForQuote}
            quotationToEdit={selectedQuotation}
            onShowToast={showGlobalToast}
            onNavigateBack={() => setActiveTab('finance')}
            onNavigateDetail={(createdQuote) => {
              setSelectedQuotation(createdQuote)
              setActiveTab('quotation-detail')
            }}
          />
        </AppLayout>
      )}

      {/* ── QUOTATION DETAIL ── */}
      {activeTab === 'quotation-detail' && (
        <AppLayout activeTab="finance" setActiveTab={setActiveTab}>
          <QuotationDetail
            quotation={selectedQuotation}
            onShowToast={showGlobalToast}
            onNavigateBack={() => setActiveTab('finance')}
            onNavigateEdit={(quote) => {
              setSelectedQuotation(quote)
              setActiveTab('create-quotation')
            }}
            onNavigateInvoiceDetail={(createdInv) => {
              setSelectedInvoice(createdInv)
              setActiveTab('invoice-detail')
            }}
          />
        </AppLayout>
      )}

      {/* ── INVOICE DETAIL ── */}
      {activeTab === 'invoice-detail' && (
        <AppLayout activeTab="finance" setActiveTab={setActiveTab}>
          <InvoiceDetail
            invoice={selectedInvoice}
            onShowToast={showGlobalToast}
            onNavigateBack={() => setActiveTab('finance')}
          />
        </AppLayout>
      )}

      {/* ── MODULE 5: CONTRACTS & DOCS ── */}
      {activeTab === 'contracts' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <ContractsDocs onShowToast={showGlobalToast} />
        </AppLayout>
      )}

      {/* ── MODULE 6: CREW & PHOTOGRAPHERS ── */}
      {activeTab === 'crew' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <CrewManagement onShowToast={showGlobalToast} />
        </AppLayout>
      )}

      {/* ── EMPLOYEE MANAGEMENT & ATTENDANCE MODULE ── */}
      {activeTab === 'employees' && (
        <ProtectedRoute tabKey="employees" setActiveTab={setActiveTab}>
          <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <EmployeeManagement activeTab={activeTab} setActiveTab={setActiveTab} />
          </AppLayout>
        </ProtectedRoute>
      )}

      {/* ── MODULE 7: EQUIPMENT TRACKER ── */}
      {activeTab === 'equipment' && (
        <ProtectedRoute tabKey="equipment" setActiveTab={setActiveTab}>
          <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <EquipmentTracker onShowToast={showGlobalToast} />
          </AppLayout>
        </ProtectedRoute>
      )}

      {/* ── MODULE 8: STUDIO HELPDESK ── */}
      {activeTab === 'helpdesk' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <StudioHelpdesk onShowToast={showGlobalToast} />
        </AppLayout>
      )}

      {/* ── MODULE 9: CLIENT REQUESTS ── */}
      {activeTab === 'requests' && (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <ClientRequests onShowToast={showGlobalToast} />
        </AppLayout>
      )}
    </>
  )
}

function MainApp() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
        <i className="pi pi-spin pi-spinner text-3xl mr-3" /> Loading PhotoStudio Pro...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return <AppContent />
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
