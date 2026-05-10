import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('traveloop_token'))

  useEffect(() => {
    if (token) {
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch {
      localStorage.removeItem('traveloop_token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('traveloop_token', newToken)
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const signup = useCallback(async (data) => {
    const res = await api.post('/auth/signup', data)
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('traveloop_token', newToken)
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('traveloop_token')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, token, login, signup, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
