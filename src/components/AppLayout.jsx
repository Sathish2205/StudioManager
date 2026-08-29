import React, { useState } from 'react'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'

/**
 * Standard enterprise application shell layout wrapper.
 * Wraps page content with Sidebar and DashboardHeader.
 */
export default function AppLayout({ activeTab, setActiveTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="portal-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />
      <div className="portal-main">
        <DashboardHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="portal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
