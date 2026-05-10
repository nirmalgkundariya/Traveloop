import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TripProvider } from './context/TripContext'

// Layouts
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'

// Pages
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
import BudgetPage from './pages/BudgetPage'
import PackingList from './pages/PackingList'
import SharedItinerary from './pages/SharedItinerary'
import ProfileSettings from './pages/ProfileSettings'
import TripNotes from './pages/TripNotes'
import AdminDashboard from './pages/AdminDashboard'

// Loading screen
import LoadingScreen from './components/ui/LoadingScreen'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth */}
        <Route path="/auth" element={
          <PublicRoute>
            <AuthLayout>
              <AuthPage />
            </AuthLayout>
          </PublicRoute>
        } />

        {/* Public shared itinerary */}
        <Route path="/share/:shareId" element={<SharedItinerary />} />

        {/* Protected app routes */}
        <Route element={
          <ProtectedRoute>
            <TripProvider>
              <AppLayout />
            </TripProvider>
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/trips/:id/itinerary" element={<ItineraryBuilder />} />
          <Route path="/trips/:id/view" element={<ItineraryView />} />
          <Route path="/trips/:id/budget" element={<BudgetPage />} />
          <Route path="/trips/:id/packing" element={<PackingList />} />
          <Route path="/trips/:id/notes" element={<TripNotes />} />
          <Route path="/cities" element={<CitySearch />} />
          <Route path="/activities" element={<ActivitySearch />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <TripProvider>
              <AppLayout />
            </TripProvider>
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
