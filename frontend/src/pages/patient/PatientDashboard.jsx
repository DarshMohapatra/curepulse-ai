import useAuthStore from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

function PatientDashboard(){
    const {user,logout} = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-600">CurePulse AI</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-medium">{user?.full_name}</span>
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800">Patient Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back — here's your health overview</p>

        {/* Placeholder cards */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {['Vitals', 'Lab Reports', 'Appointments'].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-700">{item}</h3>
              <p className="text-sm text-gray-400 mt-1">Coming soon...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard