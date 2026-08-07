import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import AddEventPage from './pages/AddEventPage'
import WorkflowManagement from './pages/WorkflowManagement'
import InvoicePage from './pages/InvoicePage'
import CustomerCRM from './pages/CustomerCRM'
import Sidebar from './components/Sidebar'
import DashboardHeader from './components/DashboardHeader'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('workflow')
  const [selectedInvoiceEvent, setSelectedInvoiceEvent] = useState(null)

  const handleNavigateInvoice = (eventData) => {
    setSelectedInvoiceEvent(eventData)
    setActiveTab('invoice')
  }

  return (
    <>
      {activeTab === 'crm' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="portal-body">
              <CustomerCRM onNavigateAddEvent={() => setActiveTab('add-event')} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoice' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
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

      {(activeTab === 'workflow' || activeTab === 'tasks') && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="portal-body">
              <WorkflowManagement />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'add-event' && (
        <div className="portal-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="portal-main">
            <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="portal-body">
              <AddEventPage
                onNavigateEvents={() => setActiveTab('events')}
                onNavigateDashboard={() => setActiveTab('home')}
                onNavigateInvoice={handleNavigateInvoice}
              />
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'events' || activeTab === 'calendar') && (
        <Events
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigateInvoice={handleNavigateInvoice}
        />
      )}

      {activeTab === 'home' && (
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* ── Round Floating Action Button (FAB) - Bottom Right Corner ── */}
      {activeTab !== 'add-event' && (
        <button
          className="fab-add-event"
          onClick={() => setActiveTab('add-event')}
          title="Add New Event"
          aria-label="Add New Event"
        >
          <i className="pi pi-plus" />
        </button>
      )}
    </>
  )
}

export default App
