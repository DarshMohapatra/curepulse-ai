import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import PatientDashboard from './pages/patient/PatientDashboard'
import useAuthStore from './stores/authStore'
import VitalsEntry from './pages/patient/VitalsEntry'
import VitalsHistory from './pages/patient/VitalsHistory'

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  useEffect(() => { loadFromStorage() }, [])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/vitals/entry" element={<VitalsEntry />} />
      <Route path="/patient/vitals/history" element={<VitalsHistory />} />
    </Routes>
  )
}

export default App