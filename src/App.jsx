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

import Sidebar from './components/Sidebar'
import DashboardHeader from './components/DashboardHeader'
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

function App() {
  const [activeTab, setActiveTabState] = useState(() => getTabFromUrl())
  const [selectedInvoiceEvent, setSelectedInvoiceEvent] = useState(null)
  const [selectedEditEvent, setSelectedEditEvent] = useState(null)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [selectedPackageForQuote, setSelectedPackageForQuote] = useState(null)
  const [globalToastMsg, setGlobalToastMsg] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const setActiveTab = (tabKey) => {
    setActiveTabState(tabKey)
    setSidebarOpen(false) // auto-close sidebar on mobile
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
    setActiveTab('add-event')
  }

  return (
    <>
      {/* Global Toast Banner */}
      {globalToastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            background: '#2563eb',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
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
        <Events
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigateInvoice={handleNavigateInvoice}
          onNavigateEditEvent={handleNavigateEditEvent}
        />
      )}

      {/* ── WORKFLOW MANAGEMENT ── */}
      {activeTab === 'workflow' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <WorkflowManagement />
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMER CRM ── */}
      {activeTab === 'crm' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <CustomerCRM onNavigateAddEvent={() => handleNavigateEditEvent(null)} />
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT EVENT PAGE ── */}
      {activeTab === 'add-event' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <AddEventPage
                eventToEdit={selectedEditEvent}
                onNavigateEvents={() => {
                  setSelectedEditEvent(null)
                  setActiveTab('events')
                }}
                onNavigateDashboard={() => {
                  setSelectedEditEvent(null)
                  setActiveTab('home')
                }}
                onNavigateInvoice={(createdEvent) => {
                  setSelectedEditEvent(null)
                  handleNavigateInvoice(createdEvent)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── INVOICE PAGE ── */}
      {activeTab === 'invoice' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <InvoicePage
                event={selectedInvoiceEvent}
                onNavigateEvents={() => setActiveTab('events')}
                onNavigateWorkflow={() => setActiveTab('workflow')}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 1: SHOOT CALENDAR ── */}
      {activeTab === 'calendar' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <ShootCalendar
                onShowToast={showGlobalToast}
                onNavigateAddEvent={() => setActiveTab('add-event')}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 2: EDITING & DELIVERABLES ── */}
      {activeTab === 'tasks' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <EditingDeliverables onShowToast={showGlobalToast} />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 3: FINANCE & INVOICES ── */}
      {activeTab === 'finance' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
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
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 4: PACKAGES & QUOTES ── */}
      {activeTab === 'packages' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <PackagesQuotes
                onShowToast={showGlobalToast}
                onNavigateAddEvent={() => setActiveTab('add-event')}
                onNavigateCreateQuotation={(pkg) => {
                  setSelectedPackageForQuote(pkg || null)
                  setActiveTab('create-quotation')
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE QUOTATION ── */}
      {activeTab === 'create-quotation' && (
        <div className="portal-layout">
          <Sidebar activeTab="finance" setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab="finance" setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
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
            </div>
          </div>
        </div>
      )}

      {/* ── QUOTATION DETAIL ── */}
      {activeTab === 'quotation-detail' && (
        <div className="portal-layout">
          <Sidebar activeTab="finance" setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab="finance" setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
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
            </div>
          </div>
        </div>
      )}

      {/* ── INVOICE DETAIL ── */}
      {activeTab === 'invoice-detail' && (
        <div className="portal-layout">
          <Sidebar activeTab="finance" setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab="finance" setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <InvoiceDetail
                invoice={selectedInvoice}
                onShowToast={showGlobalToast}
                onNavigateBack={() => setActiveTab('finance')}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 5: CONTRACTS & DOCS ── */}
      {activeTab === 'contracts' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <ContractsDocs onShowToast={showGlobalToast} />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 6: CREW & PHOTOGRAPHERS ── */}
      {activeTab === 'crew' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <CrewManagement onShowToast={showGlobalToast} />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 7: EQUIPMENT TRACKER ── */}
      {activeTab === 'equipment' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <EquipmentTracker onShowToast={showGlobalToast} />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 8: STUDIO HELPDESK ── */}
      {activeTab === 'helpdesk' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <StudioHelpdesk onShowToast={showGlobalToast} />
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 9: CLIENT REQUESTS ── */}
      {activeTab === 'requests' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="portal-body">
              <ClientRequests onShowToast={showGlobalToast} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
