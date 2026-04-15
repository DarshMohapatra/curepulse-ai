import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && !config.url.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
}

export const vitalsAPI = {
  record: (data) => api.post('/api/vitals/', data),
  getAll: (patientId) => api.get(`/api/vitals/${patientId}`),
  getLatest: (patientId) => api.get(`/api/vitals/${patientId}/latest`),
  forecast: (patientId, vital = 'bp_systolic', days = 7) =>
    api.get(`/api/vitals/${patientId}/forecast?vital=${vital}&days=${days}`),
}

export const anomalyAPI = {
  getAll: (patientId) => api.get(`/api/anomalies/${patientId}`),
  acknowledge: (alertId) => api.patch(`/api/anomalies/${alertId}/acknowledge`),
}

export const timelineAPI = {
  getAll: (patientId) => api.get(`/api/timeline/${patientId}`),
  create: (data) => api.post('/api/timeline/', data),
}
export default api