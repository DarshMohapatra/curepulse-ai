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
}

export const vitalsAPI = {
  record: (data) => api.post('/api/vitals/', data),
  getAll: (patientId) => api.get(`/api/vitals/${patientId}`),
  getLatest: (patientId) => api.get(`/api/vitals/${patientId}/latest`),
}

export const timelineAPI = {
  getAll: (patientId) => api.get(`/api/timeline/${patientId}`),
  create: (data) => api.post('/api/timeline/', data),
}
export default api