import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  if (activeTab === 'events' || activeTab === 'calendar') {
    return <Events activeTab={activeTab} setActiveTab={setActiveTab} />
  }

  return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
}

export default App
