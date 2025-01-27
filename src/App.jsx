import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './landingpage'
import StaffLogin from './StaffLogin'
import AdminLogin from './AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import AuthGuard from './components/AuthGuard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
