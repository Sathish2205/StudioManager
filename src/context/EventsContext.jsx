import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getEvents, updateEventWorkflowStage, updateEvent as apiUpdateEvent, createEvent as apiCreateEvent } from '../services/eventService'

export const WORKFLOW_STAGES = [
  'To Do',
  'Culling',
  'Editing',
  'Quality Check',
  'Final Approval',
  'Production',
  'Ready for Delivery',
  'Delivered'
]

export const normalizeWorkflowStage = (stage) => {
  if (!stage) return 'To Do'
  const trimmed = String(stage).trim()
  if (WORKFLOW_STAGES.includes(trimmed)) return trimmed

  const lower = trimmed.toLowerCase()
  if (lower.includes('confirm') || lower.includes('shoot') || lower.includes('deposit') || lower.includes('new') || lower.includes('sched')) {
    return 'To Do'
  }
  if (lower.includes('cull') || lower.includes('selection')) {
    return 'Culling'
  }
  if (lower.includes('edit') || lower.includes('post') || lower.includes('progress')) {
    return 'Editing'
  }
  if (lower.includes('check') || lower.includes('quality') || lower.includes('qa') || lower.includes('hold')) {
    return 'Quality Check'
  }
  if (lower.includes('review') || lower.includes('approval') || lower.includes('draft')) {
    return 'Final Approval'
  }
  if (lower.includes('print') || lower.includes('album') || lower.includes('prod')) {
    return 'Production'
  }
  if (lower.includes('ready') || lower.includes('dispatch')) {
    return 'Ready for Delivery'
  }
  if (lower.includes('deliver') || lower.includes('complet') || lower.includes('done') || lower.includes('paid')) {
    return 'Delivered'
  }

  return 'To Do'
}

const EventsContext = createContext(null)

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      console.error('Failed to fetch events in context:', err)
      setError(err.message || 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Change stage for an event (optimistic update + API patch)
  const updateWorkflowStage = async (eventId, newStage) => {
    const previousEvents = [...events]

    // Optimistic update
    setEvents(prev =>
      prev.map(evt => {
        if (evt._id !== eventId && evt.id !== eventId) return evt
        const updatedWorkflow = evt.workflow
          ? { ...evt.workflow, currentStage: newStage }
          : { currentStage: newStage }
        return {
          ...evt,
          status: newStage,
          workflow: updatedWorkflow
        }
      })
    )

    try {
      const updated = await updateEventWorkflowStage(eventId, newStage)
      // Update with exact server returned object if successful
      if (updated) {
        setEvents(prev =>
          prev.map(evt => (evt._id === eventId || evt.id === eventId ? updated : evt))
        )
      }
      return updated
    } catch (err) {
      // Revert optimistic update on failure
      setEvents(previousEvents)
      throw err
    }
  }

  // General event update wrapper
  const updateEventDetails = async (eventId, eventData) => {
    try {
      const updated = await apiUpdateEvent(eventId, eventData)
      setEvents(prev =>
        prev.map(evt => (evt._id === eventId || evt.id === eventId ? updated : evt))
      )
      return updated
    } catch (err) {
      console.error('Failed to update event details:', err)
      throw err
    }
  }

  // Create new event wrapper
  const addEvent = async (eventData) => {
    try {
      const res = await apiCreateEvent(eventData)
      if (res && res.data) {
        setEvents(prev => [res.data, ...prev])
        return res.data
      }
      await fetchEvents()
      return res
    } catch (err) {
      console.error('Failed to add event:', err)
      throw err
    }
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        error,
        refreshEvents: fetchEvents,
        updateWorkflowStage,
        updateEventDetails,
        addEvent,
        WORKFLOW_STAGES
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
}
