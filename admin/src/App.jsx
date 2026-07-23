import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { useAuth } from './context/AuthContext'
import LoadingPage from './pages/LoadingPage'
import ProtectedRoute from './middleware/ProtectedRoutes'
import RawmaterialsPage from './pages/RawmaterialsPage'
import MaintenancePage from './pages/MaintenancePage'
import UsersPage from './pages/UsersPage'
import LIstingsPage from './pages/LIstingsPage'

function App() {
  const { isLoading, isMaintenance, maintenancemessage } = useAuth()
  if (isLoading) {
    return <LoadingPage />
  }

  if (isMaintenance) {
    return <MaintenancePage maintenancemessage={maintenancemessage} />;
  }
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials/*"
          element={
            <ProtectedRoute>
              <RawmaterialsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings"
          element={
            <ProtectedRoute>
              <LIstingsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App
