import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import StudentAnalytics from './pages/StudentAnalytics'
import RiskAssessment from './pages/RiskAssessment'
import AlertManagement from './pages/AlertManagement'
import UserManagement from './pages/UserManagement'
import InstitutionAnalytics from './pages/InstitutionAnalytics'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentAnalytics />} />
          <Route path="risk-assessment" element={<RiskAssessment />} />
          <Route path="alerts" element={<AlertManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="institutions" element={<InstitutionAnalytics />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App