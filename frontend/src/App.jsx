import {Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import PatientDashboard from './pages/patient/PatientDashboard'

function App(){
  return(
    <Routes>
      <Route path="/" element={<Navigate to="/login" />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<SignUp />}/>
      <Route path="/patientdashboard" element={<PatientDashboard />}/>
    </Routes>
  )
}

export default App