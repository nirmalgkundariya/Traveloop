import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const TripContext = createContext(null)

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/trips')
      setTrips(res.data.trips)
    } catch (err) {
      toast.error('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrip = useCallback(async (id) => {
    setLoading(true)
    try {
      const res = await api.get(`/trips/${id}`)
      setCurrentTrip(res.data.trip)
      return res.data.trip
    } catch {
      toast.error('Trip not found')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTrip = useCallback(async (data) => {
    const res = await api.post('/trips', data)
    setTrips(prev => [res.data.trip, ...prev])
    toast.success('Trip created!')
    return res.data.trip
  }, [])

  const updateTrip = useCallback(async (id, data) => {
    const res = await api.put(`/trips/${id}`, data)
    setTrips(prev => prev.map(t => t.id === id ? res.data.trip : t))
    if (currentTrip?.id === id) setCurrentTrip(res.data.trip)
    toast.success('Trip updated!')
    return res.data.trip
  }, [currentTrip])

  const deleteTrip = useCallback(async (id) => {
    await api.delete(`/trips/${id}`)
    setTrips(prev => prev.filter(t => t.id !== id))
    toast.success('Trip deleted')
  }, [])

  return (
    <TripContext.Provider value={{ trips, currentTrip, loading, fetchTrips, fetchTrip, createTrip, updateTrip, deleteTrip, setCurrentTrip }}>
      {children}
    </TripContext.Provider>
  )
}

export const useTrips = () => {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrips must be inside TripProvider')
  return ctx
}
