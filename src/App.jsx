import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import AddEventPage from './pages/AddEventPage'
import Sidebar from './components/Sidebar'
import DashboardHeader from './components/DashboardHeader'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  if (activeTab === 'add-event') {
    return (
      <div className="portal-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="portal-main">
          <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="portal-body">
            <AddEventPage
              onNavigateEvents={() => setActiveTab('events')}
              onNavigateDashboard={() => setActiveTab('home')}
            />
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'events' || activeTab === 'calendar') {
    return <Events activeTab={activeTab} setActiveTab={setActiveTab} />
  }

  return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
}

export default App
